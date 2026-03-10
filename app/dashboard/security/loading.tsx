import { Skeleton } from "@/components/ui/skeleton";

export default function SecurityLoading() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-4 w-[420px]" />
        </div>

        <div className="rounded-2xl border bg-card">
          <div className="border-b px-5 py-4">
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="divide-y">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-4 w-60" />
                  <Skeleton className="h-3 w-72" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
