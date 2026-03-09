import { SectionCard, RefreshButton, FormField } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { SessionData } from "../types";

interface SessionsListProps {
    sessions: SessionData[];
    isRefreshing: boolean;
    onRefresh: () => void;
}

export function SessionsList({ sessions, isRefreshing, onRefresh }: SessionsListProps) {
    return (
        <SectionCard
            title="Sessions"
            description="Active session keys and per-session overrides."
            action={<RefreshButton onClick={onRefresh} loading={isRefreshing} />}
        >
            <div className="flex flex-wrap gap-4 mb-4">
                <FormField label="Active within (minutes)" className="flex-1 min-w-[140px]">
                    <Input placeholder="" className="bg-muted/50" />
                </FormField>
                <FormField label="Limit" className="w-20">
                    <Input defaultValue="120" className="bg-muted/50" />
                </FormField>
                <div className="flex items-end gap-4 pb-0.5">
                    <label className="flex items-center gap-1.5 text-sm">
                        <Checkbox defaultChecked /> Include global
                    </label>
                    <label className="flex items-center gap-1.5 text-sm">
                        <Checkbox /> Include unknown
                    </label>
                </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3">Store: (multiple)</p>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left text-xs text-muted-foreground">
                            <th className="py-2 pr-2 font-medium">Key</th>
                            <th className="py-2 pr-2 font-medium">Label</th>
                            <th className="py-2 pr-2 font-medium">Kind</th>
                            <th className="py-2 pr-2 font-medium">Updated</th>
                            <th className="py-2 pr-2 font-medium">Tokens</th>
                            <th className="py-2 pr-2 font-medium">Thinking</th>
                            <th className="py-2 pr-2 font-medium">Verbose</th>
                            <th className="py-2 pr-2 font-medium">Reasoning</th>
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
                                <td className="py-2.5 pr-2">
                                    <Input placeholder="(optional)" className="h-7 w-24 text-xs bg-muted/50" />
                                </td>
                                <td className="py-2.5 pr-2 text-xs">{s.kind}</td>
                                <td className="py-2.5 pr-2 text-xs text-muted-foreground">{s.updated}</td>
                                <td className="py-2.5 pr-2 text-xs font-mono">{s.tokens}</td>
                                <td className="py-2.5 pr-2">
                                    <select className="h-7 rounded border bg-muted/50 px-1 text-xs">
                                        <option>inherit</option>
                                    </select>
                                </td>
                                <td className="py-2.5 pr-2">
                                    <select className="h-7 rounded border bg-muted/50 px-1 text-xs">
                                        <option>inherit</option>
                                    </select>
                                </td>
                                <td className="py-2.5 pr-2">
                                    <select className="h-7 rounded border bg-muted/50 px-1 text-xs">
                                        <option>inherit</option>
                                    </select>
                                </td>
                                <td className="py-2.5">
                                    <Button variant="destructive" size="sm" className="h-7 text-xs">
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
