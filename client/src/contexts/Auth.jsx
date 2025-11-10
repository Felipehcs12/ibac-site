import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * Auth context – guarda token e usuário (decodificado do JWT).
 * Espera que o backend retorne { token } em /api/auth/login.
 * O payload do JWT deve conter ao menos: { id, name, email, role }.
 */

const AuthCtx = createContext(null);

function decodeJwt(token) {
  try {
    const [, payloadB64] = token.split(".");
    const json = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("ibac_token") || "");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ibac_user");
    return saved ? JSON.parse(saved) : null;
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // Persistência
  useEffect(() => {
    if (token) localStorage.setItem("ibac_token", token);
    else localStorage.removeItem("ibac_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("ibac_user", JSON.stringify(user));
    else localStorage.removeItem("ibac_user");
  }, [user]);

  const login = async (email, password) => {
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // padroniza mensagem de erro
      const msg = data?.error || "Falha no login";
      return { ok: false, error: msg };
    }

    // espera { token }
    const tok = data?.token;
    if (!tok) return { ok: false, error: "Token ausente na resposta do servidor" };

    const payload = decodeJwt(tok);
    if (!payload) return { ok: false, error: "Token inválido" };

    // Monte o objeto de usuário a partir do payload
    const usr = {
      id: payload.id || payload._id || payload.sub || "",
      name: payload.name || "",
      email: payload.email || "",
      role: payload.role || "member",
    };

    setToken(tok);
    setUser(usr);

    return { ok: true, user: usr, token: tok };
  };

  const register = async (payload) => {
    const res = await fetch(`${apiUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data?.error || "Falha no registro" };
    }
    // se a API também retorna { token } no registro:
    if (data?.token) {
      const decoded = decodeJwt(data.token);
      const usr = {
        id: decoded?.id || decoded?._id || decoded?.sub || "",
        name: decoded?.name || payload?.name || "",
        email: decoded?.email || payload?.email || "",
        role: decoded?.role || "member",
      };
      setToken(data.token);
      setUser(usr);
    }
    return { ok: true, ...data };
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  /**
   * Wrapper de fetch autenticado
   */
  const authFetch = async (input, init = {}) => {
    const headers = new Headers(init.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const res = await fetch(input, { ...init, headers });
    if (res.status === 401) {
      logout();
      throw new Error("Sessão expirada. Faça login novamente.");
    }
    return res;
  };

  const value = useMemo(
    () => ({ apiUrl, token, user, login, register, logout, authFetch }),
    [apiUrl, token, user]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
