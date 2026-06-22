import { Suspense } from "react";
import AdminLoginForm from "./AdminLoginForm";

export const metadata = {
  title: "Admin — Entrar",
  robots: { index: false, follow: false },
};

function LoginFallback() {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-border bg-bg-card p-8">
        <p className="text-sm text-text-muted">Carregando…</p>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginForm />
    </Suspense>
  );
}
