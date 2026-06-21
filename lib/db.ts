import { neon } from "@neondatabase/serverless";
import type { Submission } from "./types";

export type StoredSubmission = {
  id: string;
  outcome: Submission["outcome"];
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
        CREATE TABLE IF NOT EXISTS submissions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          outcome TEXT NOT NULL CHECK (outcome IN ('accepted', 'rejected')),
          payload JSONB NOT NULL,
          submitted_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await query`
        CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at
        ON submissions (submitted_at DESC)
      `;
    })();
  }
  await schemaReady;
}

export async function insertSubmission(body: Submission): Promise<void> {
  if (!isDbConfigured()) return;
  await ensureSchema();
  const query = getSql();
  await query`
    INSERT INTO submissions (outcome, payload, submitted_at)
    VALUES (
      ${body.outcome},
      ${JSON.stringify(body)}::jsonb,
      ${body.submittedAt}
    )
  `;
}

export async function listSubmissions(): Promise<StoredSubmission[]> {
  if (!isDbConfigured()) return [];
  await ensureSchema();
  const query = getSql();
  const rows = await query`
    SELECT
      id,
      outcome,
      payload,
      submitted_at AS "submittedAt",
      created_at AS "createdAt"
    FROM submissions
    ORDER BY submitted_at DESC
  `;
  return rows as StoredSubmission[];
}
