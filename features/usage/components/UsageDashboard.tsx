import { SectionCard, Chip, RefreshButton } from "@/shared/block/ui/openclaw-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pin, Download, BarChart2 } from "lucide-react";

interface UsageFiltersProps {
    activeRange: string;
    setActiveRange: (r: string) => void;
    activeMetric: string;
    setActiveMetric: (m: string) => void;
    recordCount?: number;
}

export function UsageFilters({ activeRange, setActiveRange, activeMetric, setActiveMetric, recordCount = 0 }: UsageFiltersProps) {
    return (
        <SectionCard
            title="Filters"
            description="Select a date range and click Refresh to load usage."
            action={
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm"><Pin className="h-3.5 w-3.5 mr-1" />Pin</Button>
                    <Button variant="ghost" size="sm"><Download className="h-3.5 w-3.5 mr-1" />Export</Button>
                </div>
            }
        >
            <div className="flex flex-wrap items-center gap-2">
                {["Today", "7d", "30d"].map((r) => (
                    <Chip key={r} variant={activeRange === r ? "active" : "default"} onClick={() => setActiveRange(r)}>
                        {r}
                    </Chip>
                ))}
                <Input type="date" defaultValue="2026-03-09" className="h-8 w-36 text-xs" />
                <span className="text-xs text-muted-foreground">to</span>
                <Input type="date" defaultValue="2026-03-09" className="h-8 w-36 text-xs" />
                <select className="h-8 rounded border bg-background px-2 text-xs">
                    <option>Local</option>
                    <option>UTC</option>
                </select>
                <Chip variant={activeMetric === "Tokens" ? "active" : "default"} onClick={() => setActiveMetric("Tokens")}>Tokens</Chip>
                <Chip variant={activeMetric === "Cost" ? "active" : "default"} onClick={() => setActiveMetric("Cost")}>Cost</Chip>
                <RefreshButton />
            </div>

            <div className="mt-3">
                <Input
                    placeholder="Filter sessions (e.g. key:agent:main:cron* model:gpt-4o has:errors minTokens:2000)"
                    className="bg-muted/50 text-xs"
                />
                <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-muted-foreground">Tip: use filters or click bars to filter days.</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Filter (client-side)</span>
                        <span>{recordCount} sessions in range</span>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

export function ActivityChart() {
    return (
        <SectionCard title="Activity by Time" description="Estimates require session timestamps.">
            <div className="flex items-center justify-between mb-2">
                <div />
                <p className="text-xl font-bold text-primary">0 tokens</p>
            </div>
            <div className="flex items-center justify-center p-8 rounded-lg border border-dashed text-muted-foreground bg-muted/10">
                <div className="text-center">
                    <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">No timeline data yet</p>
                </div>
            </div>
        </SectionCard>
    );
}

export function UsageStats() {
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Daily Usage">
                <div className="flex items-center justify-center p-8 rounded-lg border border-dashed text-muted-foreground bg-muted/10">
                    <div className="text-center">
                        <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium">No data</p>
                    </div>
                </div>
            </SectionCard>

            <SectionCard
                title="Sessions"
                action={<span className="text-xs text-muted-foreground">0 shown</span>}
            >
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-muted-foreground">0 avg  0 errors</span>
                    <Chip variant="active">All</Chip>
                    <Chip variant="default">Recently viewed</Chip>
                    <span className="text-xs text-muted-foreground ml-auto">Sort</span>
                    <select className="h-7 rounded border bg-background px-2 text-xs">
                        <option>Recent</option>
                    </select>
                </div>
                <div className="flex items-center justify-center p-8 rounded-lg border border-dashed text-muted-foreground bg-muted/10">
                    <p className="text-sm font-medium">No sessions in range</p>
                </div>
            </SectionCard>
        </div>
    );
}
