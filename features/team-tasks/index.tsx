// @ts-nocheck
"use client";

import { Kanban } from "lucide-react";

export default function TeamTasksPage() {
    return (
        <div className="space-y-6 px-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Kanban className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Team Tasks</h2>
                    <p className="text-sm text-muted-foreground">Collaborative task board for your team.</p>
                </div>
            </div>
            <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
                No team tasks yet. Create your first task to get started.
            </div>
        </div>
    );
}
