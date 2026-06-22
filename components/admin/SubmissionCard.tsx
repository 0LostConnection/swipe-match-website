import { getArchetype } from "@/lib/archetypes";
import { getCard } from "@/lib/cards";
import type { Submission } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d);
}

function CardChips({ label, ids }: { label: string; ids: string[] }) {
  if (ids.length === 0) return null;
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
        {label}
      </p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {ids.map((id) => {
          const card = getCard(id);
          return (
            <li
              key={id}
              className="rounded-full bg-bg-elevated px-2.5 py-0.5 text-sm text-text-primary"
            >
              {card ? `${card.emoji} ${card.label}` : id}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SubmissionCard({ session }: { session: Submission }) {
  const archetype = getArchetype(session.archetype);

  return (
    <article className="rounded-2xl border border-border bg-bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="flex items-center gap-2 rounded-full bg-bg-elevated px-3 py-1 text-sm font-semibold text-text-primary">
          <span>{archetype.icon}</span>
          {archetype.title}
        </span>
        <time className="text-sm text-text-muted" dateTime={session.submittedAt}>
          {formatDate(session.submittedAt)}
        </time>
      </div>

      <div className="mt-4 space-y-3">
        <CardChips label="Convergência" ids={session.convergenceIds} />
        <CardChips label="Curtidos" ids={session.likedCardIds} />
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-sm">
        <div>
          <dt className="text-text-muted">Curtidas</dt>
          <dd className="font-semibold text-text-primary">
            {session.likedCardIds.length}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Baralho</dt>
          <dd className="font-semibold text-text-primary">{session.deckSize}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Visitas</dt>
          <dd className="font-semibold text-text-primary">{session.visitCount}</dd>
        </div>
      </dl>
    </article>
  );
}
