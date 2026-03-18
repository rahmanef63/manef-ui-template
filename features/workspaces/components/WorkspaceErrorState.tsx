import { Button } from "@/components/ui/button";
import { getBackendErrorPresentation } from "@/shared/errors/appErrorPresentation";
import { FileQuestion, RefreshCcw } from "lucide-react";
import Link from "next/link";

type WorkspaceErrorCode = "WORKSPACE_BOOTSTRAP_FAILED" | "WORKSPACE_NOT_FOUND";

export function WorkspaceErrorState({
  backHref = "/dashboard",
  backLabel = "Kembali ke dashboard",
  code,
  recoveryHref,
  recoveryLabel,
}: {
  backHref?: string;
  backLabel?: string;
  code: WorkspaceErrorCode;
  recoveryHref?: string;
  recoveryLabel?: string;
}) {
  const error = getBackendErrorPresentation(code);

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 rounded-2xl border border-dashed bg-card/60 px-6 py-10 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {code === "WORKSPACE_NOT_FOUND" ? (
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        ) : (
          <RefreshCcw className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
      <div className="max-w-xl space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{error.title}</h2>
        <p className="text-sm text-muted-foreground">{error.description}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {recoveryHref && recoveryLabel ? (
          <Button asChild>
            <Link href={recoveryHref}>{recoveryLabel}</Link>
          </Button>
        ) : null}
        <Button asChild variant="outline">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
