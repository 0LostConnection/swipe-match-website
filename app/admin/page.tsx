import { SubmissionCard } from "@/components/admin/SubmissionCard";
import { isDbConfigured, listSubmissions } from "@/lib/db";

export const metadata = {
  title: "Admin — Respostas",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const dbReady = isDbConfigured();
  let submissions: Awaited<ReturnType<typeof listSubmissions>> = [];
  let loadError = false;

  if (dbReady) {
    try {
      submissions = await listSubmissions();
    } catch (err) {
      console.error("[admin] list submissions failed:", err);
      loadError = true;
    }
  }

  return (
    <main className="mx-auto min-h-full max-w-2xl px-4 py-8 pb-16">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Respostas</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {submissions.length === 1
              ? "1 resposta"
              : `${submissions.length} respostas`}
          </p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="rounded-xl border border-ink/15 bg-white/80 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-cream-deep"
          >
            Sair
          </button>
        </form>
      </header>

      {!dbReady ? (
        <div
          className="rounded-2xl border border-sun/50 bg-sun/20 p-5 text-sm text-ink"
          role="status"
        >
          <p className="font-semibold">Banco não configurado</p>
          <p className="mt-1 text-ink-soft">
            Conecte o Vercel Postgres no dashboard e rode{" "}
            <code className="rounded bg-white/60 px-1">vercel env pull .env.local</code>{" "}
            para desenvolvimento local.
          </p>
        </div>
      ) : null}

      {loadError ? (
        <div
          className="rounded-2xl border border-pink/40 bg-pink/10 p-5 text-sm text-ink"
          role="alert"
        >
          Não foi possível carregar as respostas. Tente recarregar a página.
        </div>
      ) : null}

      {dbReady && !loadError && submissions.length === 0 ? (
        <p className="rounded-2xl border border-ink/10 bg-white/60 p-8 text-center text-ink-soft">
          Nenhuma resposta ainda.
        </p>
      ) : null}

      {submissions.length > 0 ? (
        <ul className="space-y-4">
          {submissions.map((row) => (
            <li key={row.id}>
              <SubmissionCard submission={row.payload} />
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
