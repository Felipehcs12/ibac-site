// src/pages/Login.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth.jsx";

const ICON_SRC = "/ibac-icon.png"; // servido pela pasta public/

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // path para redirecionar após login (se veio de rota protegida)
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); // impede o reload da página
    setError("");
    setSubmitting(true);
    try {
      const res = await login(email.trim(), password);
      if (!res.ok) {
        setError(res.error || "Credenciais inválidas");
        return;
      }
      // sucesso: redireciona
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Erro inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur shadow-md rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col items-center gap-2 mb-6">
              <img src={ICON_SRC} alt="IBAC" className="w-14 h-14" />
              <h1 className="text-xl font-semibold">Intranet — Acesso</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md px-3 py-2 bg-black text-white disabled:opacity-60"
              >
                {submitting ? "Entrando..." : "Entrar"}
              </button>

              <div className="text-center text-sm text-slate-600">
                Não possui conta?{" "}
                <Link to="/cadastro" className="underline">
                  Cadastre-se
                </Link>
              </div>

              <p className="text-xs text-slate-500">
                * Apenas contas com papel <strong>volunteer</strong> ou <strong>admin</strong> acessam o dashboard.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
