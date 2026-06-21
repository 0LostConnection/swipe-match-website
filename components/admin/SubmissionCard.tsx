import type { Submission } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d);
}

function formatDay(iso: string): string {
  const [y, m, day] = iso.split("-");
  if (!y || !m || !day) return iso;
  return `${day}/${m}/${y}`;
}

function TagList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
      <ul className="mt-1 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full bg-cream-deep px-2.5 py-0.5 text-sm text-ink"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SubmissionCard({ submission }: { submission: Submission }) {
  const accepted = submission.outcome === "accepted";

  return (
    <article className="rounded-2xl border border-ink/10 bg-white/70 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            accepted
              ? "bg-mint/40 text-ink"
              : "bg-cool-bg text-cool-ink"
          }`}
        >
          {accepted ? "Aceito" : "Rejeitado"}
        </span>
        <time className="text-sm text-ink-soft" dateTime={submission.submittedAt}>
          {formatDate(submission.submittedAt)}
        </time>
      </div>

      {accepted && submission.place ? (
        <p className="mt-4 text-ink">
          <span className="font-semibold">Lugar: </span>
          {submission.place.value}
          {submission.place.kind === "custom" ? " (sugerido)" : ""}
        </p>
      ) : null}

      {accepted && submission.availableDates && submission.availableDates.length > 0 ? (
        <div className="mt-3">
          <p className="font-semibold text-ink">Datas disponíveis</p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {submission.availableDates.map((d) => (
              <li
                key={d}
                className="rounded-full bg-sky/25 px-2.5 py-0.5 text-sm text-ink"
              >
                {formatDay(d)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {accepted && submission.interests ? (
        <div className="mt-4 space-y-3">
          <TagList label="Comida" items={submission.interests.food} />
          <TagList label="Assuntos" items={submission.interests.topics} />
          <TagList label="Música" items={submission.interests.music ?? []} />
          <TagList label="Outros" items={submission.interests.custom} />
        </div>
      ) : null}

      <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-ink/10 pt-4 text-sm">
        <div>
          <dt className="text-ink-soft">Visitas</dt>
          <dd className="font-semibold text-ink">{submission.visitCount}</dd>
        </div>
        <div>
          <dt className="text-ink-soft">Já tinha rejeitado</dt>
          <dd className="font-semibold text-ink">
            {submission.rejectedBefore ? "Sim" : "Não"}
          </dd>
        </div>
      </dl>
    </article>
  );
}
