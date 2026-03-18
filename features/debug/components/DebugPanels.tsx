import { SectionCard, CodeBlock, RefreshButton, FormField } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { STATUS_JSON, HEALTH_JSON } from "../constants";

interface SnapshotsProps {
    isRefreshing: boolean;
    onRefresh: () => void;
}

export function Snapshots({ isRefreshing, onRefresh }: SnapshotsProps) {
    return (
        <SectionCard
            title="Snapshots"
            description="Status, health, and heartbeat data."
            action={<RefreshButton onClick={onRefresh} loading={isRefreshing} />}
        >
            <p className="text-sm font-medium mb-2">Status</p>
            <CodeBlock>{STATUS_JSON}</CodeBlock>

            <p className="text-sm font-medium mt-4 mb-2">Health</p>
            <CodeBlock>{HEALTH_JSON}</CodeBlock>
        </SectionCard>
    );
}

interface ManualRPCProps {
    method: string;
    onMethodChange: (val: string) => void;
    params: string;
    onParamsChange: (val: string) => void;
    onCall: () => void;
}

export function ManualRPC({ method, onMethodChange, params, onParamsChange, onCall }: ManualRPCProps) {
    return (
        <SectionCard title="Manual RPC" description="Send a raw gateway method with JSON params.">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <FormField label="Method">
                        <Input value={method} onChange={(e) => onMethodChange(e.target.value)} className="bg-muted/50" />
                    </FormField>
                    <FormField label="Params (JSON)">
                        <Input value={params} onChange={(e) => onParamsChange(e.target.value)} className="bg-muted/50 font-mono" />
                    </FormField>
                </div>
                <Button className="bg-primary w-full" onClick={onCall}>Call</Button>
            </div>
        </SectionCard>
    );
}
