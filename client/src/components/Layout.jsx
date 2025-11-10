import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth.jsx";

/** Normaliza possíveis campos de cargos/roles vindos do back */
function extractRoles(user) {
  if (!user) return [];
  const raw = user.roles ?? user.cargos ?? user.role ?? user.cargo ?? [];
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr.filter(Boolean).map((r) => String(r).trim().toLowerCase());
}

/** Regras para enxergar o menu Financeiro */
function canSeeFinance(user) {
  const roles = extractRoles(user);
  const allow = new Set([
    "pastor presidente",
    "pastor vice presidente",
    "1º secretário",
    "1o secretário",
    "primeiro secretário",
    "tesoureiro",
  ]);
  return roles.some((r) => allow.has(r));
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  /** Regiões de navegação */
  const isHome = location.pathname === "/" || location.pathname.startsWith("/#");
  const isIntranet =
    location.pathname.startsWith("/membros") ||
    location.pathname.startsWith("/dashboard");

  /** Fecha a sidebar ao trocar de rota */
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  /** ESC fecha a sidebar */
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /** MENU DA HOME */
  const homeMenu = useMemo(
    () => [
      { href: "#topo", label: "Início", icon: "🏠" },
      { href: "#avisos", label: "Avisos", icon: "📰" },
      { href: "#eventos", label: "Próximos Eventos", icon: "📅" },
      { href: "#ministerios", label: "Ministérios", icon: "🧭" },
      { href: "#contato", label: "Contato", icon: "✉️" },
    ],
    []
  );

  /** MENU DA INTRANET */
  const intranetMenu = useMemo(() => {
    const base = [
      { to: "/dashboard", label: "Dashboard", icon: "🏁" },
      { to: "/membros", label: "Membros", icon: "👥" },
      { to: "/relatorios", label: "Relatórios", icon: "📊" },
      { to: "/ministerios", label: "Ministérios", icon: "🧭" },
      { to: "/perfil", label: "Meu Perfil", icon: "👤" },
    ];
    if (canSeeFinance(user)) {
      base.splice(2, 0, {
        to: "/financeiro",
        label: "Financeiro",
        icon: "💳",
        secure: true,
      });
    }
    return base;
  }, [user]);

  /** estilo ativo do menu lateral */
  const isActiveLike = useCallback(
    (path) =>
      location.pathname === path || location.pathname.startsWith(path + "/"),
    [location.pathname]
  );

  /** Botão “Intranet” na Home */
  const intranetButtonHref = user ? "/membros" : "/login";

  /** Ação do botão “Intranet” na Home */
  const handleIntranetClick = () => {
    navigate(intranetButtonHref);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar fixa */}
      <header className="navbar">
        <div className="container-limit flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            {/* Botão que abre a sidebar */}
            <button
              className="menu-btn"
              aria-label="Abrir menu"
              aria-expanded={open}
              aria-controls="ibac-sidebar"
              onClick={() => setOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="6" width="18" height="2" rx="1" />
                <rect x="3" y="11" width="18" height="2" rx="1" />
                <rect x="3" y="16" width="18" height="2" rx="1" />
              </svg>
            </button>

            {/* Marca */}
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/ibac-icon.png" alt="IBAC" className="logo" />
              <span className="font-extrabold tracking-wide text-ibac-primary">
                IBAC
              </span>
            </Link>
          </div>

          {/* Lado direito da navbar */}
          <div className="flex items-center gap-3 text-sm text-slate-600">
            {isHome ? (
              <button onClick={handleIntranetClick} className="btn-gold px-3">
                Intranet
              </button>
            ) : isIntranet ? (
              <>
                {user?.name && (
                  <span className="hidden md:block">
                    Olá, {user.name} {user?.cargo ? `(${user.cargo})` : ""}
                  </span>
                )}
                <button className="btn-outline-gold px-3" onClick={logout}>
                  Sair
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* Backdrop da sidebar */}
      {open && (
        <div
          className="backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar lateral */}
      <aside
        id="ibac-sidebar"
        className={`sidebar ${open ? "open" : ""}`}
        aria-label="Menu lateral"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img src="/ibac-icon.png" alt="IBAC" className="h-7 w-auto" />
            <span className="font-extrabold text-ibac-primary">IBAC</span>
          </div>
          <button
            className="menu-btn"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          >
            ✖
          </button>
        </div>

        {/* MENU DA HOME */}
        {isHome && (
          <>
            <nav className="mt-2 space-y-1">
              {homeMenu.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="nav-link"
                  onClick={() => setOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-4">
              <button
                onClick={handleIntranetClick}
                className="btn-gold w-full justify-center"
              >
                Intranet
              </button>
            </div>

            <div className="mt-6 border-t pt-3 text-xs text-slate-500">
              <div>Versão da Intranet • {new Date().getFullYear()}</div>
            </div>
          </>
        )}

        {/* MENU DA INTRANET */}
        {isIntranet && (
          <>
            <nav className="mt-2 space-y-1">
              {intranetMenu.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={false}
                  className="nav-link"
                  style={
                    isActiveLike(item.to)
                      ? {
                          background: "rgba(227,160,8,0.12)",
                          color: "var(--ibac-gold-700)",
                        }
                      : undefined
                  }
                  onClick={() => setOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                  {item.secure && (
                    <span className="ml-2 pill pill-gold text-[10px] leading-none">
                      Restrito
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 border-t pt-3 text-xs text-slate-500">
              <div>Versão da Intranet • {new Date().getFullYear()}</div>
              {user?.cargo && <div className="mt-1">Cargo: {user.cargo}</div>}
            </div>
          </>
        )}
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
