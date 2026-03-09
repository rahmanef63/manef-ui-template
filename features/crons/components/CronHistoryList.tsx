import { SectionCard, EmptyState } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";
import { History } from "lucide-react";

export function CronHistoryList() {
    return (
        <SectionCard
            title="Run history"
            description="Latest runs across all jobs."
            action={<span className="text-xs text-muted-foreground">0 shown of 0</span>}
        >
            <div className="flex flex-wrap gap-3 mb-4">
                <select className="h-8 rounded border bg-muted/50 px-2 text-xs"><option>All jobs</option></select>
                <Input placeholder="Summary, error, or job" className="flex-1 min-w-[200px] bg-muted/50 h-8 text-xs" />
                <select className="h-8 rounded border bg-muted/50 px-2 text-xs"><option>Newest first</option></select>
            </div>
            <EmptyState message="No run history yet." icon={History} />
        </SectionCard>
    );
}
