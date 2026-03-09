import { SectionCard, RefreshButton, Chip } from "@/shared/block/ui/openclaw-blocks";
import type { InstanceData } from "../types";

interface InstancesListProps {
    instances: InstanceData[];
    isRefreshing: boolean;
    onRefresh: () => void;
}

export function InstancesList({ instances, isRefreshing, onRefresh }: InstancesListProps) {
    return (
        <SectionCard
            title="Connected Instances"
            description="Presence beacons from the gateway and clients."
            action={<RefreshButton onClick={onRefresh} loading={isRefreshing} />}
        >
            <div className="space-y-4">
                {instances.map((inst) => (
                    <div key={inst.id} className="rounded-lg border bg-background p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                            <p className="font-semibold">{inst.name}</p>
                            <p className="text-xs text-muted-foreground">{inst.info}</p>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {inst.tags.map((tag) => (
                                    <Chip key={tag} variant="muted">{tag}</Chip>
                                ))}
                            </div>
                        </div>
                        <div className="text-left sm:text-right text-xs text-muted-foreground shrink-0">
                            <p>{inst.lastSeen}</p>
                            <p>Last input {inst.lastInput}</p>
                            <p>{inst.reason}</p>
                        </div>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}
