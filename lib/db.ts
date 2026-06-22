import { neon } from "@neondatabase/serverless";
import type { ArchetypeId, Submission } from "./types";

export type StoredSession = {
  id: string;
  archetype: ArchetypeId;
  payload: Submission;
  submittedAt: string;
  createdAt: string;
};

export function isDbConfigured(): boolean {
  return Boolean(process.env.POSTGRES_URL);
}

let sql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!sql) {
    const url = process.env.POSTGRES_URL;
    if (!url) throw new Error("POSTGRES_URL is not set");
    sql = neon(url);
  }
  return sql;
}

let schemaReady: Promise<void> | null = null;

export async function ensureSchema(): Promise<void> {
  if (!isDbConfigured()) return;
  if (!schemaReady) {
    schemaReady = (async () => {
      const query = getSql();
      await query`
        CREATE TABLE IF NOT EXISTS archetype_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          archetype TEXT NOT NULL,
          payload JSONB NOT NULL,
          submitted_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await query`
        CREATE INDEX IF NOT EXISTS idx_archetype_sessions_submitted_at
        ON archetype_sessions (submitted_at DESC)
      `;
    })();
  }
  await schemaReady;
}

export async function insertSession(body: Submission): Promise<void> {
  if (!isDbConfigured()) return;
  await ensureSchema();
  const query = getSql();
  await query`
    INSERT INTO archetype_sessions (archetype, payload, submitted_at)
    VALUES (
      ${body.archetype},
      ${JSON.stringify(body)}::jsonb,
      ${body.submittedAt}
    )
  `;
}

export async function listSessions(): Promise<StoredSession[]> {
  if (!isDbConfigured()) return [];
  await ensureSchema();
  const query = getSql();
  const rows = await query`
    SELECT
      id,
      archetype,
      payload,
      submitted_at AS "submittedAt",
      created_at AS "createdAt"
    FROM archetype_sessions
    ORDER BY submitted_at DESC
  `;
  return rows as StoredSession[];
}
