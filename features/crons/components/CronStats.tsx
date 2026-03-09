import { StatCard, RefreshButton } from "@/shared/block/ui/openclaw-blocks";
import { CheckCircle } from "lucide-react";

interface CronStatsProps {
    isRefreshing: boolean;
    onRefresh: () => void;
}

export function CronStats({ isRefreshing, onRefresh }: CronStatsProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Enabled" value="Yes" status="ok" icon={CheckCircle} />
            <StatCard label="Jobs" value={1} />
            <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Next Wake</p>
                    <p className="mt-2 text-sm font-bold">Mon, 3/9/2026, 11:45:36 PM (in 16h)</p>
                </div>
                <RefreshButton onClick={onRefresh} loading={isRefreshing} />
            </div>
        </div>
    );
}
