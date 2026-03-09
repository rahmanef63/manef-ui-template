import { SectionCard, Chip } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CronJobsListProps {
    jobs: any[];
}

export function CronJobsList({ jobs }: CronJobsListProps) {
    return (
        <SectionCard
            title="Jobs"
            description="All scheduled jobs stored in the gateway."
            action={<span className="text-xs text-muted-foreground">{jobs.length} shown of {jobs.length}</span>}
        >
            <div className="flex flex-wrap gap-3 mb-4">
                <Input placeholder="Name, description, or agent" className="flex-1 min-w-[200px] bg-muted/50 h-8 text-xs" />
                <select className="h-8 rounded border bg-muted/50 px-2 text-xs"><option>All</option></select>
                <select className="h-8 rounded border bg-muted/50 px-2 text-xs"><option>All</option></select>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
                <select className="h-8 rounded border bg-muted/50 px-2 text-xs"><option>All</option></select>
                <select className="h-8 rounded border bg-muted/50 px-2 text-xs"><option>Next run</option></select>
                <select className="h-8 rounded border bg-muted/50 px-2 text-xs"><option>Ascending</option></select>
                <Button variant="ghost" size="sm" className="h-8 text-xs">Reset</Button>
            </div>

            {/* Job Cards */}
            {jobs.length === 0 ? (
                <div className="rounded-lg border p-8 text-center text-muted-foreground text-sm">
                    No jobs found.
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div key={job._id} className="rounded-lg border p-4 space-y-3">
                            <div className="flex items-start justify-between">
                                <p className="font-semibold">{job.name}</p>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-right">
                                    <span className="text-muted-foreground">STATUS</span><span>{job.lastRunStatus || "n/a"}</span>
                                    <span className="text-muted-foreground">NEXT</span><span>{job.nextRunAt ? new Date(job.nextRunAt).toLocaleString() : "n/a"}</span>
                                    <span className="text-muted-foreground">LAST</span><span>{job.lastRunAt ? new Date(job.lastRunAt).toLocaleString() : "n/a"}</span>
                                </div>
                            </div>
                            <div className="text-xs space-y-1">
                                <p><span className="text-muted-foreground">Schedule: {job.schedule}</span></p>
                                {job.prompt && <p><span className="font-medium">PROMPT: </span> {job.prompt}</p>}
                                {job.delivery && <p><span className="font-medium">DELIVERY: </span> {job.delivery}</p>}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                <Chip variant={job.enabled ? "active" : "default"}>{job.enabled ? "enabled" : "disabled"}</Chip>
                                {job.isolated && <Chip>isolated</Chip>}
                                <Button variant="outline" size="sm" className="h-7 text-xs">Edit</Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs">Clone</Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs">{job.enabled ? "Disable" : "Enable"}</Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs">Run</Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs">History</Button>
                                <Button variant="destructive" size="sm" className="h-7 text-xs">Remove</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}
