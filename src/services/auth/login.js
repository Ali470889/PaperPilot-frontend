// auth.login.js
import { accessStore, refreshStore } from "../tokenStore/localStorage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function login({ email, password }) {
  const r = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!r.ok) {
    // bubble up a readable error
    const msg = await r.text().catch(() => "Login failed");
    throw new Error(msg || "Login failed");
  }

  // Assume server shape: { access_toktopic/topics/searchen, refreshToken }
  const { accessToken, refreshToken } = await r.json();

  await accessStore.set(accessToken);
  await refreshStore.set(refreshToken);

  return { accessToken, refreshToken };
}
