import { SectionCard, FormField, Chip } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MOCK_SETTINGS } from "../constants";

export function ConfigPanel() {
    return (
        <div className="flex flex-col gap-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border bg-card p-3 gap-3">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Settings</span>
                    <Chip variant="active">valid</Chip>
                    <span className="text-xs text-muted-foreground">No changes</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                    <Button variant="outline" size="sm">Reload</Button>
                    <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">Save</Button>
                    <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Apply</Button>
                    <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Update</Button>
                </div>
            </div>

            {/* Setup Wizard Section */}
            <SectionCard title="🪄 Setup Wizard" description="Setup wizard state and history">
                <div className="space-y-6">
                    {MOCK_SETTINGS.map((setting) => (
                        <div key={setting.key}>
                            <FormField label={setting.key} description={setting.desc} tag={setting.tag}>
                                {setting.type === "toggle" ? (
                                    <div className="flex gap-0 rounded-lg overflow-hidden border mt-1.5 w-fit">
                                        {setting.options?.map(opt => (
                                            <button
                                                key={opt}
                                                type="button"
                                                className={`px-4 py-1.5 text-sm ${setting.value === opt ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground transition-colors hover:bg-muted"}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <Input defaultValue={setting.value} className="bg-muted/50 mt-1.5" />
                                )}
                            </FormField>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    );
}
