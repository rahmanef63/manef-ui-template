import { SectionCard, RefreshButton, FormField } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { SessionData } from "../types";

interface SessionsListProps {
    sessions: SessionData[];
    isRefreshing: boolean;
    onRefresh: () => void;
    activeWithinMinutes: string;
    onActiveWithinMinutesChange: (value: string) => void;
    limit: string;
    onLimitChange: (value: string) => void;
    includeUnknown: boolean;
    onIncludeUnknownChange: (value: boolean) => void;
    isDeleting: boolean;
    onDelete: (sessionId: string) => void;
}

export function SessionsList({
    sessions,
    isRefreshing,
    onRefresh,
    activeWithinMinutes,
    onActiveWithinMinutesChange,
    limit,
    onLimitChange,
    includeUnknown,
    onIncludeUnknownChange,
    isDeleting,
    onDelete,
}: SessionsListProps) {
    return (
        <SectionCard
            title="Sessions"
            description="Active session keys and per-session overrides."
            action={<RefreshButton onClick={onRefresh} loading={isRefreshing} />}
        >
            <div className="flex flex-wrap gap-4 mb-4">
                <FormField label="Active within (minutes)" className="flex-1 min-w-[140px]">
                    <Input
                        value={activeWithinMinutes}
                        onChange={(event) => onActiveWithinMinutesChange(event.target.value)}
                        className="bg-muted/50"
                    />
                </FormField>
                <FormField label="Limit" className="w-20">
                    <Input
                        value={limit}
                        onChange={(event) => onLimitChange(event.target.value)}
                        className="bg-muted/50"
                    />
                </FormField>
                <div className="flex items-end gap-4 pb-0.5">
                    <label className="flex items-center gap-1.5 text-sm">
                        <Checkbox
                            checked={includeUnknown}
                            onCheckedChange={(checked) => onIncludeUnknownChange(Boolean(checked))}
                        />
                        Include unknown
                    </label>
                </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3">Source: mirrored Convex sessions</p>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left text-xs text-muted-foreground">
                            <th className="py-2 pr-2 font-medium">Key</th>
                            <th className="py-2 pr-2 font-medium">Kind</th>
                            <th className="py-2 pr-2 font-medium">Status</th>
                            <th className="py-2 pr-2 font-medium">Last Active</th>
                            <th className="py-2 pr-2 font-medium">Messages</th>
                            <th className="py-2 pr-2 font-medium">Summary</th>
                            <th className="py-2 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((s) => (
                            <tr key={s.key} className="border-b hover:bg-muted/30">
                                <td className="py-2.5 pr-2">
                                    <p className="font-medium text-primary text-xs">{s.key}</p>
                                    {s.sub && <p className="text-[10px] text-muted-foreground">{s.sub}</p>}
                                </td>
                                <td className="py-2.5 pr-2 text-xs">{s.kind}</td>
                                <td className="py-2.5 pr-2 text-xs capitalize">{s.status}</td>
                                <td className="py-2.5 pr-2 text-xs text-muted-foreground">{s.lastActive}</td>
                                <td className="py-2.5 pr-2 text-xs">{s.msgs}</td>
                                <td className="py-2.5 pr-2 text-xs font-mono">{s.tokens}</td>
                                <td className="py-2.5">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="h-7 text-xs"
                                        disabled={isDeleting}
                                        onClick={() => onDelete(s.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SectionCard>
    );
}
