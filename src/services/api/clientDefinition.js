/**
 * A ~2KB (min+gzip ≈ small) Axios-like wrapper around fetch:
 * - Instances with baseURL & default headers
 * - Bearer token via tokenStore.get()
 * - Auto token refresh on 401 (queued, single-flight)
 * - Auto JSON (request & response) when appropriate
 * - Timeout via AbortController
 * - Simple retries with backoff
 * - Request/Response interceptors (async)
 * - Nice HttpError with parsed body
 */

/////////////////////// utilities ///////////////////////
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

function joinURL(base, path) {
  if (!base) return path || "";
  if (!path) return base;
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function serializeParams(params) {
  if (!params) return "";
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) v.forEach((x) => usp.append(k, String(x)));
    else usp.append(k, String(v));
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}

function mergeHeaders(a = {}, b = {}) {
  const out = new Headers(a);
  new Headers(b).forEach((v, k) => out.set(k, v));
  return out;
}

async function maybeParseBody(resp, desiredType) {
  // Respect explicit responseType first
  if (desiredType) {
    if (desiredType === "json") return await resp.json();
    if (desiredType === "text") return await resp.text();
    if (desiredType === "blob") return await resp.blob();
    if (desiredType === "arrayBuffer") return await resp.arrayBuffer();
    return await resp.text();
  }

  const ct = resp.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    // Guard against empty-body 204/205
    if (resp.status === 204 || resp.status === 205) return null;
    return await resp.json();
  }
  return await resp.text();
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/////////////////////// error ///////////////////////
class HttpError extends Error {
  constructor(message, { status, statusText, url, body, headers }) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.body = body; // parsed body if possible
    this.headers = headers; // Headers
  }
}

/////////////////////// Http client ///////////////////////
class Http {
  /**
   * @param {Object} cfg
   * @param {string} [cfg.baseURL]
   * @param {Object|Headers} [cfg.headers]
   * @param {Object} [cfg.tokenStore]  { get: ()=>string|Promise<string>, set: (newToken)=>void|Promise<void> }
   * @param {Function} [cfg.refreshToken] async ()=>string  // return new access token
   * @param {boolean} [cfg.withCredentials] // pass through to fetch (uses 'credentials': 'include')
   * @param {number}  [cfg.timeout] // ms
   * @param {Object}  [cfg.retry]   { retries=0, retryOn=[429,503], baseDelay=250, maxDelay=2000 }
   */
  constructor(cfg = {}) {
    this.baseURL = cfg.baseURL || "";
    this.defaultHeaders = new Headers(cfg.headers || {});
    this.tokenStore = cfg.tokenStore || null;
    this.refreshToken = cfg.refreshToken || null;
    this.withCredentials = !!cfg.withCredentials;
    this.timeout = cfg.timeout || 0;

    const r = cfg.retry || {};
    this.retry = {
      retries: r.retries ?? 0,
      retryOn: r.retryOn || [429, 502, 503, 504],
      baseDelay: r.baseDelay ?? 250,
      maxDelay: r.maxDelay ?? 2000,
    };

    // Interceptors: arrays of async functions
    this.requestInterceptors = [];
    this.responseInterceptors = [];

    // refresh single-flight
    this._refreshing = null;
  }

  // sugar for instances
  static create(cfg) {
    return new Http(cfg);
  }

  useRequest(fn) {
    this.requestInterceptors.push(fn);
    return this;
  }
  useResponse(fn) {
    this.responseInterceptors.push(fn);
    return this;
  }

  setHeader(k, v) {
    this.defaultHeaders.set(k, v);
  }
  removeHeader(k) {
    this.defaultHeaders.delete(k);
  }

  async _getAuthHeader() {
    if (!this.tokenStore?.get) return {};
    const tok = await this.tokenStore.get();
    return tok ? { Authorization: `${tok}` } : {};
  }

  async _runRequestInterceptors(ctx) {
    for (const fn of this.requestInterceptors) {
      // each fn can modify ctx in place or return a new one
      const res = await fn(ctx);
      if (res) Object.assign(ctx, res);
    }
  }

  async _runResponseInterceptors(ctx) {
    for (const fn of this.responseInterceptors) {
      const res = await fn(ctx);
      if (res) Object.assign(ctx, res);
    }
  }

  _abortSignalWithTimeout(userSignal, timeout) {
    if (!timeout && !this.timeout) return userSignal || undefined;
    const t = timeout || this.timeout;
    const ctrl = new AbortController();
    const timer = setTimeout(
      () => ctrl.abort(new DOMException("TimeoutError", "AbortError")),
      t
    );
    if (userSignal) {
      userSignal.addEventListener("abort", () => {
        clearTimeout(timer);
        ctrl.abort(userSignal.reason);
      });
    }
    return ctrl.signal;
  }

  async _doFetch(method, url, opt = {}) {
    // Build context (similar to Axios config)
    const ctx = {
      method,
      url: joinURL(this.baseURL, url),
      params: opt.params,
      headers: mergeHeaders(this.defaultHeaders, opt.headers),
      body: opt.body ?? opt.data, // allow axios-style 'data'
      responseType: opt.responseType, // 'json' | 'text' | 'blob' | 'arrayBuffer'
      parseJson: opt.parseJson !== false, // auto JSON encode request bodies by default
      timeout: opt.timeout,
      credentials: this.withCredentials
        ? "include"
        : opt.credentials || "same-origin",
      signal: this._abortSignalWithTimeout(opt.signal, opt.timeout),
      // for interceptors
      meta: opt.meta || {},
      _retried: opt._retried || false,
      _attempt: opt._attempt || 0,
    };

    // Attach query params
    if (ctx.params) ctx.url += serializeParams(ctx.params);

    // Attach auth if present
    const auth = await this._getAuthHeader();
    ctx.headers = mergeHeaders(ctx.headers, auth);

    // Auto-encode body as JSON
    if (
      ctx.body != null &&
      ctx.parseJson &&
      (isObj(ctx.body) || Array.isArray(ctx.body))
    ) {
      if (!ctx.headers.has("Content-Type")) {
        ctx.headers.set("Content-Type", "application/json");
      }
      if (ctx.headers.get("Content-Type")?.includes("application/json")) {
        ctx.body = JSON.stringify(ctx.body);
      }
    }

    // Run request interceptors
    await this._runRequestInterceptors(ctx);

    // Execute
    const resp = await fetch(ctx.url, {
      method: ctx.method,
      headers: ctx.headers,
      body: ctx.body,
      credentials: ctx.credentials,
      signal: ctx.signal,
    });

    // Build response context
    const resCtx = {
      request: ctx,
      response: resp,
      ok: resp.ok,
      status: resp.status,
      statusText: resp.statusText,
      url: resp.url,
      headers: resp.headers,
      data: null, // filled below
    };

    // Parse body
    let parsed = null;
    try {
      parsed = await maybeParseBody(resp, ctx.responseType);
    } catch (e) {
      parsed = null;
    } // stay resilient on invalid JSON
    resCtx.data = parsed;

    // Run response interceptors (can modify resCtx)
    await this._runResponseInterceptors(resCtx);

    // Handle 2xx
    if (resp.ok) return resCtx;

    // Handle 401 -> try refresh once if configured
    if (
      resp.status === 401 &&
      this.refreshToken &&
      this.tokenStore?.set &&
      !ctx._retried
    ) {
      await this._ensureFreshToken();
      // retry once with _retried flag
      return await this._doFetch(method, url, { ...opt, _retried: true });
    }

    // Retry on certain statuses with backoff
    if (
      this.retry.retries > 0 &&
      this.retry.retryOn.includes(resp.status) &&
      ctx._attempt < this.retry.retries
    ) {
      const delay = Math.min(
        this.retry.baseDelay * 2 ** ctx._attempt,
        this.retry.maxDelay
      );
      await sleep(delay);
      return await this._doFetch(method, url, {
        ...opt,
        _attempt: ctx._attempt + 1,
      });
    }

    // Throw HttpError with parsed body
    throw new HttpError(`HTTP ${resp.status} ${resp.statusText}`, {
      status: resp.status,
      statusText: resp.statusText,
      url: resp.url,
      body: parsed,
      headers: resp.headers,
    });
  }

  async _ensureFreshToken() {
    // Single-flight: share one refresh promise
    if (!this._refreshing) {
      this._refreshing = (async () => {
        const newTok = await this.refreshToken();
        if (newTok && this.tokenStore?.set) {
          await this.tokenStore.set(newTok);
        }
      })().finally(() => {
        this._refreshing = null;
      });
    }
    return this._refreshing;
  }

  // public request methods
  request(url, options = {}) {
    return this._doFetch(options.method || "GET", url, options);
  }
  get(url, options = {}) {
    return this._doFetch("GET", url, options);
  }
  delete(url, options = {}) {
    return this._doFetch("DELETE", url, options);
  }
  post(url, data, options = {}) {
    return this._doFetch("POST", url, { ...options, body: data });
  }
  put(url, data, options = {}) {
    return this._doFetch("PUT", url, { ...options, body: data });
  }
  patch(url, data, options = {}) {
    return this._doFetch("PATCH", url, { ...options, body: data });
  }
}

/////////////////////// Export ///////////////////////
export { Http, HttpError };
export default Http;
