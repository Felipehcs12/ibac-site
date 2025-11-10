const API = import.meta.env.VITE_API_URL || "";

export function getToken() {
  return localStorage.getItem("ibac_token") || "";
}

export async function api(input, init = {}) {
  const headers = new Headers(init.headers || {});
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input.startsWith("http") ? input : `${API}${input}`, {
    ...init,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem("ibac_token");
    localStorage.removeItem("ibac_user");
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore json error
  }

  if (!res.ok) {
    const msg = data?.error || `Erro ${res.status}`;
    throw new Error(msg);
  }
  return data;
}
