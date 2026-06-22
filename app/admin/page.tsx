import { SubmissionCard } from "@/components/admin/SubmissionCard";
import { ARCHETYPES, ARCHETYPE_IDS } from "@/lib/archetypes";
import { isDbConfigured, listSessions } from "@/lib/db";
import type { ArchetypeId } from "@/lib/types";

export const metadata = {
  title: "Admin — Sessões",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const dbReady = isDbConfigured();
  let sessions: Awaited<ReturnType<typeof listSessions>> = [];
  let loadError = false;

  if (dbReady) {
    try {
      sessions = await listSessions();
    } catch (err) {
      console.error("[admin] list sessions failed:", err);
      loadError = true;
    }
  }

  const distribution = ARCHETYPE_IDS.reduce(
    (acc, id) => {
      acc[id] = 0;
      return acc;
    },
    {} as Record<ArchetypeId, number>,
  );
  for (const s of sessions) {
    if (s.archetype in distribution) distribution[s.archetype] += 1;
  }
  const topCount = Math.max(1, ...Object.values(distribution));

  return (
    <main className="mx-auto min-h-full max-w-2xl px-4 py-8 pb-16">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl italic text-text-primary">Sessões</h1>
          <p className="mt-1 text-sm text-text-muted">
            {sessions.length === 1 ? "1 sessão" : `${sessions.length} sessões`}
          </p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-bg-elevated"
          >
            Sair
          </button>
        </form>
      </header>

      {!dbReady ? (
        <div
          className="rounded-2xl border border-accent-primary/40 bg-accent-primary/10 p-5 text-sm text-text-primary"
          role="status"
        >
          <p className="font-semibold">Banco não configurado</p>
          <p className="mt-1 text-text-muted">
            Conecte o Vercel Postgres no dashboard e rode{" "}
            <code className="rounded bg-bg-elevated px-1">
              vercel env pull .env.local
            </code>{" "}
            para desenvolvimento local.
          </p>
        </div>
      ) : null}

      {loadError ? (
        <div
          className="rounded-2xl border border-accent-danger/40 bg-accent-danger/10 p-5 text-sm text-text-primary"
          role="alert"
        >
          Não foi possível carregar as sessões. Tente recarregar a página.
        </div>
      ) : null}

      {dbReady && !loadError && sessions.length > 0 ? (
        <section className="mb-8 rounded-2xl border border-border bg-bg-card p-5">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-text-muted">
            Distribuição de arquétipos
          </h2>
          <ul className="space-y-2.5">
            {ARCHETYPE_IDS.map((id) => {
              const count = distribution[id];
              const pct = (count / topCount) * 100;
              return (
                <li key={id} className="flex items-center gap-3">
                  <span className="w-44 shrink-0 text-sm text-text-primary">
                    {ARCHETYPES[id].icon} {ARCHETYPES[id].title}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-elevated">
                    <div
                      className="h-full rounded-full bg-accent-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-xs text-text-muted">
                    {count}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dbReady && !loadError && sessions.length === 0 ? (
        <p className="rounded-2xl border border-border bg-bg-card p-8 text-center text-text-muted">
          Nenhuma sessão ainda.
        </p>
      ) : null}

      {sessions.length > 0 ? (
        <ul className="space-y-4">
          {sessions.map((row) => (
            <li key={row.id}>
              <SubmissionCard session={row.payload} />
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
