import { SectionCard, RefreshButton, EmptyState, Chip } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface SkillsListProps {
    selectedScopeName?: string;
    filter: string;
    onFilterChange: (val: string) => void;
    sourceType: string;
    onSourceTypeChange: (val: string) => void;
    storeStatus?: any;
    isRefreshing: boolean;
    onRefresh: () => void;
    isToggling: boolean;
    onToggle: (skillId: string, enabled: boolean) => void;
    isGranting: boolean;
    onWorkspaceGrant: (skillId: string, enabled: boolean) => void;
    skills: any[];
}

export function SkillsList({
    selectedScopeName,
    filter,
    onFilterChange,
    sourceType,
    onSourceTypeChange,
    storeStatus,
    isRefreshing,
    onRefresh,
    isToggling,
    onToggle,
    isGranting,
    onWorkspaceGrant,
    skills,
}: SkillsListProps) {
    return (
        <SectionCard
            title="Skills Store"
            description="Bundled OpenClaw skills plus local Rahman skills and future ClawHub sync."
            action={<RefreshButton onClick={onRefresh} loading={isRefreshing} />}
        >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Filter</p>
                <span className="text-xs text-muted-foreground">{skills.length} shown</span>
            </div>
            <div className="mb-4 grid gap-3 lg:grid-cols-[2fr,1fr]">
                <Input
                    value={filter}
                    onChange={(e) => onFilterChange(e.target.value)}
                    placeholder="Search skills..."
                    className="bg-muted/50"
                />
                <select
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                    value={sourceType}
                    onChange={(event) => onSourceTypeChange(event.target.value)}
                >
                    <option value="all">All sources</option>
                    <option value="rahman_local">By Rahman</option>
                    <option value="clawhub">By ClawHub</option>
                    <option value="openclaw_bundled">By OpenClaw</option>
                </select>
            </div>

            {storeStatus ? (
                <div className="mb-4 grid gap-2 rounded-lg border bg-muted/10 p-3 text-xs text-muted-foreground lg:grid-cols-2">
                    <div className="space-y-1">
                        <div className="font-medium text-foreground">Store sources</div>
                        <div className="flex flex-wrap gap-2">
                            {(storeStatus.bySourceType ?? []).map((row: any) => (
                                <span key={row.key} className="rounded-md border px-2 py-1">
                                    {row.key}: {row.count}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="font-medium text-foreground">ClawHub readiness</div>
                        <div>
                            {storeStatus.hasClawHubItems
                                ? "ClawHub-backed skills detected."
                                : "Belum ada skill ClawHub terdeteksi. Pull sync akan aktif saat lockfile/instalasi ClawHub tersedia."}
                        </div>
                    </div>
                    <div className="space-y-1 lg:col-span-2">
                        <div className="font-medium text-foreground">Workspace policy target</div>
                        <div>
                            {selectedScopeName
                                ? `${selectedScopeName} sekarang bisa grant/revoke skill ke semua agent di scope aktif.`
                                : "Pilih workspace untuk memberi policy skill ke scope aktif."}
                        </div>
                    </div>
                </div>
            ) : null}

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
                                {skill.publisherLabel && (
                                    <span className="text-[10px] text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded">
                                        {skill.publisherLabel}
                                    </span>
                                )}
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
                            <div className="grid gap-2 rounded-md border bg-muted/10 p-3 text-[11px] text-muted-foreground">
                                <div>Source type: {skill.sourceType ?? "-"}</div>
                                <div>Trust: {skill.trustLevel ?? "-"}</div>
                                <div>Scope: {skill.skillScope ?? "-"}</div>
                                <div>Install: {skill.installState ?? "-"}</div>
                                <div>
                                    Workspace access: {skill.workspacePolicyEnabled ? "granted" : "not granted"}
                                </div>
                                <div>
                                    Workspace sources: {(skill.workspacePolicySources ?? []).join(", ") || "-"}
                                </div>
                                <div>
                                    Assigned agents: {skill.workspaceAssignedAgentCount ?? 0}
                                </div>
                                {skill.homepage ? (
                                    <div className="break-all">Homepage: {skill.homepage}</div>
                                ) : null}
                            </div>
                            <div className="flex items-center justify-between gap-3 pt-2">
                                <p className="text-[11px] text-muted-foreground">
                                    Runtime: {skill.runtimeEnabled ? "enabled" : "disabled"}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={isGranting}
                                        onClick={() => onWorkspaceGrant(skill._id, !skill.workspacePolicyEnabled)}
                                    >
                                        {skill.workspacePolicyEnabled ? "Revoke from Workspace" : "Grant to Workspace"}
                                    </Button>
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
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}
