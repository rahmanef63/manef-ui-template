import { SectionCard, RefreshButton, EmptyState, Chip } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface SkillsListProps {
    filter: string;
    onFilterChange: (val: string) => void;
    isRefreshing: boolean;
    onRefresh: () => void;
    isToggling: boolean;
    onToggle: (skillId: string, enabled: boolean) => void;
    skills: any[];
}

export function SkillsList({
    filter,
    onFilterChange,
    isRefreshing,
    onRefresh,
    isToggling,
    onToggle,
    skills,
}: SkillsListProps) {
    return (
        <SectionCard
            title="Skills"
            description="Bundled, managed, and workspace skills."
            action={<RefreshButton onClick={onRefresh} loading={isRefreshing} />}
        >
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">Filter</p>
                <span className="text-xs text-muted-foreground">{skills.length} shown</span>
            </div>
            <Input
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
                placeholder="Search skills..."
                className="bg-muted/50 mb-4"
            />

            {skills.length === 0 ? (
                <EmptyState message="No skills found." icon={Zap} />
            ) : (
                <div className="grid gap-3 lg:grid-cols-2">
                    {skills.map((skill) => (
                        <div key={skill._id} className="rounded-lg border p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-sm">{skill.name}</p>
                                <Chip variant={skill.enabled ? "active" : "default"}>
                                    {skill.enabled ? "Enabled" : "Disabled"}
                                </Chip>
                            </div>
                            {skill.description && (
                                <p className="text-xs text-muted-foreground">{skill.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded">
                                    {skill.source}
                                </span>
                                {skill.hasManualOverride && (
                                    <span className="text-[10px] text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded">
                                        override
                                    </span>
                                )}
                                {skill.version && (
                                    <span className="text-[10px] text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded">
                                        v{skill.version}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-3 pt-2">
                                <p className="text-[11px] text-muted-foreground">
                                    Runtime: {skill.runtimeEnabled ? "enabled" : "disabled"}
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isToggling}
                                    onClick={() => onToggle(skill._id, !skill.enabled)}
                                >
                                    {skill.enabled ? "Disable" : "Enable"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}
