import { accessStore, refreshStore } from "../tokenStore/localStorage";

export async function refreshAccessToken() {
  const refreshToken = await refreshStore.get();
  console.log("refreshToken", refreshToken);

  if (!refreshToken) throw new Error("No refreshToken available");

  const r = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/user/refresh-token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${refreshToken}`,
      },
    }
  );

  if (!r.ok) throw new Error("Refresh failed");

  // Assume server shape: { accessToken, refreshToken? }
  const { accessToken, refreshToken: rotated } = await r.json();

  await accessStore.set(accessToken);
  if (rotated) await refreshStore.set(rotated); // store rotated refresh tokens when provided

  return accessToken; // the client expects this
}
