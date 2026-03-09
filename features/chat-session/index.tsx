// @ts-nocheck
"use client";

import { MessageSquare } from "lucide-react";

export default function ChatSessionPage() {
    return (
        <div className="space-y-6 px-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Chat</h2>
                    <p className="text-sm text-muted-foreground">Start a new conversation with your AI assistant.</p>
                </div>
            </div>
            <div className="rounded-xl border bg-card flex flex-col" style={{ minHeight: 400 }}>
                <div className="flex-1 p-6 flex items-center justify-center text-sm text-muted-foreground">
                    Start typing to begin a conversation…
                </div>
                <div className="border-t p-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Type a message…"
                            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                            disabled
                        />
                        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-50" disabled>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
