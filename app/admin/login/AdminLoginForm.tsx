"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Senha incorreta.");
        return;
      }

      const next = searchParams.get("next") || "/admin";
      router.replace(next);
      router.refresh();
    } catch {
      setError("Não foi possível entrar. Tente de novo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-ink/10 bg-cream/80 p-8 shadow-sm backdrop-blur-sm">
        <h1 className="font-display text-2xl font-semibold text-ink">Admin</h1>
        <p className="mt-2 text-sm text-ink-soft">Digite a senha para ver as respostas.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink outline-none ring-pink/40 focus:ring-2"
            />
          </label>

          {error ? (
            <p className="text-sm font-semibold text-pink-deep" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-pink px-4 py-3 font-semibold text-white transition hover:bg-pink-deep disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
