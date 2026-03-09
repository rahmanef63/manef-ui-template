"use client";

import { SectionCard, KeyValueRow } from "@/shared/block/ui/openclaw-blocks";
import { Button } from "@/components/ui/button";
import type { ChannelConfig } from "../types";

interface ChannelCardProps {
    channel: ChannelConfig;
}

export function TelegramCard({ channel }: ChannelCardProps) {
    const { status } = channel;
    return (
        <SectionCard title={channel.label} description={channel.description}>
            <div className="space-y-0 divide-y">
                <KeyValueRow label="Configured" value={status.configured ? "Yes" : "No"} />
                <KeyValueRow label="Running" value={status.running ? "Yes" : "No"} />
                {status.mode && <KeyValueRow label="Mode" value={status.mode} />}
                {status.lastStart && <KeyValueRow label="Last start" value={status.lastStart} />}
                {status.lastProbe && (
                    <KeyValueRow
                        label="Last probe"
                        value={<span className="text-green-600 dark:text-green-400">{status.lastProbe}</span>}
                    />
                )}
            </div>
            <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2">
                <p className="text-sm">Probe ok ·</p>
            </div>
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-3 py-2">
                <p className="text-sm font-medium">Accounts</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">Unsupported schema node. Use Raw mode.</p>
            </div>
        </SectionCard>
    );
}

export function WhatsAppCard({ channel }: ChannelCardProps) {
    const { status } = channel;
    return (
        <SectionCard title={channel.label} description={channel.description} variant="highlight">
            <div className="space-y-0 divide-y">
                <KeyValueRow label="Configured" value={status.configured ? "Yes" : "No"} />
                {status.linked !== undefined && <KeyValueRow label="Linked" value={status.linked ? "Yes" : "No"} />}
                <KeyValueRow label="Running" value={status.running ? "Yes" : "No"} />
                {status.connected !== undefined && <KeyValueRow label="Connected" value={status.connected ? "Yes" : "No"} />}
                {status.lastConnect && (
                    <KeyValueRow
                        label="Last connect"
                        value={<span className="text-green-600 dark:text-green-400">{status.lastConnect}</span>}
                    />
                )}
                {status.lastMessage && <KeyValueRow label="Last message" value={status.lastMessage} />}
                {status.authAge && <KeyValueRow label="Auth age" value={status.authAge} />}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="default" size="sm" className="bg-primary">Show QR</Button>
                <Button variant="outline" size="sm">Relink</Button>
                <Button variant="outline" size="sm">Wait for scan</Button>
                <Button variant="destructive" size="sm">Logout</Button>
                <Button variant="outline" size="sm">Refresh</Button>
            </div>
        </SectionCard>
    );
}
