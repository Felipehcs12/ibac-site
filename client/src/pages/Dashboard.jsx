import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/* Helpers */
async function safeFetch(url, fallback) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error();
    return await r.json();
  } catch {
    return fallback;
  }
}
function monthBounds(d = new Date()) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
  return { startISO: start.toISOString(), endISO: end.toISOString() };
}
function formatDate(dtStr) {
  const dt = new Date(dtStr);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(dt)
    .replace(".", "");
}

/* UI */
function StatCard({ icon, label, value }) {
  return (
    <div className="card p-4 sm:p-4">
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(227,160,8,.12)", color: "var(--ibac-gold)" }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="min-w-0">
          <div className="text-xs text-slate-500 font-semibold">{label}</div>
          <div className="text-xl font-extrabold text-slate-900 leading-tight">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}
function DateBadge({ date }) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const mon = d.toLocaleString("pt-BR", { month: "short" }).replace(".", "");
  return (
    <div className="date-badge">
      <div className="day">{day}</div>
      <div className="mon">{mon}</div>
    </div>
  );
}
function Pill({ kind = "gold", children }) {
  const map = { gold: "pill pill-gold", green: "pill pill-green", red: "pill pill-red" };
  return <span className={map[kind]}>{children}</span>;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    members: 0,
    ministries: 0,
    volunteers: 0,
    events: 0,
  });
  const [schedules, setSchedules] = useState([]);
  const [events, setEvents] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [busy, setBusy] = useState(false);
  const { startISO, endISO } = useMemo(() => monthBounds(), []);

  useEffect(() => {
    (async () => {
      const [sum, sch, ev, bd] = await Promise.all([
        safeFetch("/api/dashboard/summary", {
          members: 1,
          ministries: 4,
          volunteers: 1,
          events: 1,
        }),
        // Escalas (inclui função exercida)
        safeFetch(`/api/dashboard/schedules?monthStart=${startISO}&monthEnd=${endISO}`, [
          {
            id: "s1",
            service: "Louvor - Culto de Domingo",
            when: new Date().toISOString(),
            place: "Templo",
            functionName: "Vocal",
            status: "pendente",
          },
        ]),
        safeFetch(`/api/events?from=${startISO}&to=${endISO}`, [
          {
            id: "e1",
            title: "Culto de Celebração",
            when: new Date().toISOString(),
            place: "Templo",
          },
        ]),
        safeFetch(`/api/birthdays?from=${startISO}&to=${endISO}`, [
          { id: "b1", name: "João Silva", date: new Date().toISOString() },
        ]),
      ]);
      setStats(sum);
      setSchedules(sch);
      setEvents(ev);
      setBirthdays(bd);
    })();
  }, [startISO, endISO]);

  async function confirmPresence(id) {
    setBusy(true);
    try {
      // await fetch(`/api/schedules/${id}/confirm`, { method: "POST" });
      setSchedules((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "confirmado" } : i)),
      );
    } finally {
      setBusy(false);
    }
  }
  async function markUnavailable(id) {
    setBusy(true);
    try {
      // await fetch(`/api/schedules/${id}/unavailable`, { method: "POST" });
      setSchedules((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "indisponível" } : i)),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pb-2">
      <div className="container-limit pt-5">
        {/* Cabeçalho + Métricas */}
        <div className="mb-4">
          <div className="text-xs text-slate-500 mb-1">Painel da Intranet IBAC</div>
          <h1 className="text-2xl font-extrabold text-ibac-primary">Bem-vindo!</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon="👥" label="Membros" value={stats.members} />
          <StatCard icon="🧭" label="Ministérios" value={stats.ministries} />
          <StatCard icon="🤝" label="Voluntários" value={stats.volunteers} />
          <StatCard icon="📅" label="Eventos" value={stats.events} />
        </div>

        {/* Conteúdo em duas colunas responsivas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ============== Minhas Escalas ============== */}
          <section className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-ibac-primary">Minhas Escalas</h2>
                <p className="text-xs text-slate-600">
                  Confirme presença ou registre indisponibilidade
                </p>
              </div>
              {schedules.length > 0 && (
                <Link className="link-gold text-xs" to="/escalas">
                  Ver todas →
                </Link>
              )}
            </div>

            {schedules.length === 0 ? (
              <div className="card p-4 text-center text-slate-600 text-sm">
                Nenhuma escala pendente
              </div>
            ) : (
              schedules.map((s) => (
                <div key={s.id} className="card p-4 schedule-card">
                  {/* Data grande */}
                  <DateBadge date={s.when} />

                  {/* Conteúdo */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                        {s.service}
                      </h3>
                      {s.status === "confirmado" && <Pill kind="green">Confirmado</Pill>}
                      {s.status === "indisponível" && <Pill kind="red">Indisponível</Pill>}
                      {s.status === "pendente" && <Pill>Pendente</Pill>}
                    </div>

                    <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-2 gap-y-1">
                      <span>{formatDate(s.when)}</span>
                      <span>• {s.place}</span>
                      {s.functionName && (
                        <span>
                          • <span className="font-semibold text-slate-700">Função:</span>{" "}
                          {s.functionName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="action-group">
                    <button
                      className="btn-gold h-10 px-3"
                      disabled={busy || s.status === "confirmado"}
                      onClick={() => confirmPresence(s.id)}
                      title="Confirmar presença nesta escala"
                    >
                      Confirmar presença
                    </button>
                    <button
                      className="btn-outline-gold h-10 px-3"
                      disabled={busy || s.status === "indisponível"}
                      onClick={() => markUnavailable(s.id)}
                      title="Marcar como ausente nesta escala"
                    >
                      Ausente
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* ============== Próximos Eventos ============== */}
          <section className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-ibac-primary">Próximos Eventos</h2>
                <p className="text-xs text-slate-600">Veja o que acontece neste mês</p>
              </div>
              {events.length > 0 && (
                <Link className="link-gold text-xs" to="/eventos">
                  Calendário completo →
                </Link>
              )}
            </div>

            {events.length === 0 ? (
              <div className="card p-4 text-center text-slate-600 text-sm">
                Nenhum evento cadastrado.
              </div>
            ) : (
              events.map((ev) => (
                <div key={ev.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <DateBadge date={ev.when} />
                    <div className="min-w-0">
                      <div className="font-extrabold text-slate-900">{ev.title}</div>
                      <div className="text-xs text-slate-600">
                        {formatDate(ev.when)} • {ev.place}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        {/* ============== Aniversariantes ============== */}
        <section className="mt-6 space-y-3">
          <h2 className="text-xl font-extrabold text-ibac-primary">Aniversariantes</h2>
          {birthdays.length === 0 ? (
            <div className="card p-4 text-center text-slate-600 text-sm">
              Nenhum aniversariante no mês.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {birthdays.map((b) => (
                <div key={b.id} className="card p-4 flex items-center gap-3">
                  <div className="avatar-initials">
                    {b.name?.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 truncate">{b.name}</div>
                    <div className="text-xs text-slate-600">
                      {new Date(b.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
