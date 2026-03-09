import { SectionCard, FormField } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";

export function NewCronJobForm() {
    return (
        <SectionCard title="New Job" description="Create a scheduled wakeup or agent run.">
            <p className="text-xs text-muted-foreground mb-4">* Required</p>
            <SectionCard title="Basics" description="Name it, choose the assistant, and set enabled state.">
                <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Name *">
                        <Input placeholder="Morning brief" className="bg-muted/50" />
                    </FormField>
                    <FormField label="Description">
                        <Input placeholder="Optional context for this job" className="bg-muted/50" />
                    </FormField>
                </div>
                <div className="flex items-center gap-4 mt-3">
                    <FormField label="Agent ID" className="flex-1">
                        <Input placeholder="main or ops" className="bg-muted/50" />
                    </FormField>
                    <label className="flex items-center gap-2 text-sm mt-5">
                        <input type="checkbox" defaultChecked className="accent-primary" /> Enabled
                    </label>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Start typing to pick a known agent, or enter a custom one.</p>
            </SectionCard>

            <SectionCard title="Schedule" description="Control when this job runs." className="mt-4">
                <FormField label="Schedule">
                    <Input defaultValue="Every" className="bg-muted/50" />
                </FormField>
                <div className="grid gap-3 sm:grid-cols-2 mt-3">
                    <FormField label="Every *">
                        <Input defaultValue="30" className="bg-muted/50" />
                    </FormField>
                    <FormField label="Unit">
                        <Input defaultValue="Minutes" className="bg-muted/50" />
                    </FormField>
                </div>
            </SectionCard>
        </SectionCard>
    );
}
