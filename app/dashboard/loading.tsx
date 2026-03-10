import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardRootLoading() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
    </main>
  );
}
