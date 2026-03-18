"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function SecurityError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SecurityPage]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 rounded-2xl border bg-card p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Gagal memuat halaman security</h2>
        <p className="text-sm text-muted-foreground">
          {error.message || "Terjadi error tak terduga. Coba muat ulang."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Coba lagi
        </button>
      </div>
    </main>
  );
}
