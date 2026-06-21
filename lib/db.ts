import { sql } from "@vercel/postgres";
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

let schemaReady: Promise<void> | null = null;

export async function ensureSchema(): Promise<void> {
  if (!isDbConfigured()) return;
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS submissions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          outcome TEXT NOT NULL CHECK (outcome IN ('accepted', 'rejected')),
          payload JSONB NOT NULL,
          submitted_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
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
  await sql`
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
  const { rows } = await sql`
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
