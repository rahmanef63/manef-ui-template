import { SectionCard, Chip } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AGENT_CHIPS } from "../constants";

interface ExecApprovalsProps {
    activeChip: string;
    onChipChange: (chip: string) => void;
}

export function ExecApprovals({ activeChip, onChipChange }: ExecApprovalsProps) {
    return (
        <SectionCard
            title="Exec approvals"
            description="Allowlist and approval policy for exec host=gateway/node."
            action={<Button variant="outline" size="sm">Save</Button>}
        >
            <div className="flex items-center justify-between mb-3">
                <div>
                    <p className="font-medium text-sm">Target</p>
                    <p className="text-xs text-muted-foreground">Gateway edits local approvals; node edits the selected node.</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground">Host</p>
                    <Input defaultValue="Gateway" className="h-8 w-40 bg-muted/50 text-xs text-right" />
                </div>
            </div>

            <p className="text-sm font-medium mb-2">Scope</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
                {AGENT_CHIPS.map(chip => (
                    <Chip
                        key={chip}
                        variant={activeChip === chip ? "active" : "default"}
                        onClick={() => onChipChange(chip)}
                    >
                        {chip}
                    </Chip>
                ))}
            </div>

            <div className="space-y-0 divide-y">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                    <div>
                        <p className="text-sm font-medium">Security</p>
                        <p className="text-xs text-muted-foreground">Default security mode.</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-xs text-muted-foreground hidden sm:block">Mode</p>
                        <Input defaultValue="Deny" className="h-8 w-32 bg-muted/50 text-xs sm:text-right" />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                    <div>
                        <p className="text-sm font-medium">Ask</p>
                        <p className="text-xs text-muted-foreground">Default prompt policy.</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-xs text-muted-foreground hidden sm:block">Mode</p>
                        <Input defaultValue="On miss" className="h-8 w-32 bg-muted/50 text-xs sm:text-right" />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                    <div>
                        <p className="text-sm font-medium">Ask fallback</p>
                        <p className="text-xs text-muted-foreground">Applied when the UI prompt is unavailable.</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-xs text-muted-foreground hidden sm:block">Fallback</p>
                        <Input defaultValue="Deny" className="h-8 w-32 bg-muted/50 text-xs sm:text-right" />
                    </div>
                </div>

                <div className="flex items-center justify-between py-3 gap-2">
                    <div>
                        <p className="text-sm font-medium">Auto-allow skill CLIs</p>
                        <p className="text-xs text-muted-foreground">Allow skill executables listed by the Gateway.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground hidden sm:block">Enabled</p>
                        <Checkbox />
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

export function ExecNodeBinding() {
    return (
        <SectionCard
            title="Exec node binding"
            description="Pin agents to a specific node when using exec host=node."
            action={<Button variant="outline" size="sm">Save</Button>}
        >
            <p className="text-sm text-muted-foreground">No node bindings configured.</p>
        </SectionCard>
    );
}
