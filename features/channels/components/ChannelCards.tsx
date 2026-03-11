import { SectionCard, KeyValueRow } from "@/shared/block/ui/openclaw-blocks";
import type { ChannelConfig } from "../types";

interface ChannelCardProps {
    channel: ChannelConfig;
}

function renderDescription(channel: ChannelConfig) {
    return channel.description || `${channel.type} runtime channel`;
}

function runtimeSummary(channel: ChannelConfig) {
    if (channel.status.lastError) {
        return channel.status.lastError;
    }
    if (channel.status.connected) {
        return "Connection healthy";
    }
    if (channel.status.running) {
        return "Running";
    }
    return "Idle";
}

export function ChannelCard({ channel }: ChannelCardProps) {
    const { status } = channel;

    return (
        <SectionCard
            title={channel.label}
            description={renderDescription(channel)}
            variant={channel.variant ?? (channel.type === "whatsapp" ? "highlight" : "default")}
        >
            <div className="space-y-0 divide-y">
                <KeyValueRow label="Type" value={channel.type} />
                <KeyValueRow label="Channel ID" value={channel.channelId} />
                <KeyValueRow label="Configured" value={status.configured ? "Yes" : "No"} />
                <KeyValueRow label="Running" value={status.running ? "Yes" : "No"} />
                {status.linked !== undefined && (
                    <KeyValueRow label="Linked" value={status.linked ? "Yes" : "No"} />
                )}
                {status.connected !== undefined && (
                    <KeyValueRow label="Connected" value={status.connected ? "Yes" : "No"} />
                )}
                {status.mode && <KeyValueRow label="Mode" value={status.mode} />}
                {status.bindingCount !== undefined && (
                    <KeyValueRow label="Bindings" value={String(status.bindingCount)} />
                )}
                {status.allowListCount !== undefined && (
                    <KeyValueRow label="Allowlist" value={String(status.allowListCount)} />
                )}
                {status.lastStart && <KeyValueRow label="Last start" value={status.lastStart} />}
                {status.lastProbe && <KeyValueRow label="Last probe" value={status.lastProbe} />}
                {status.lastConnect && <KeyValueRow label="Last connect" value={status.lastConnect} />}
                {status.lastMessage && <KeyValueRow label="Last message" value={status.lastMessage} />}
                {status.authAge && <KeyValueRow label="Auth age" value={status.authAge} />}
                {status.lastError && (
                    <KeyValueRow
                        label="Last error"
                        value={<span className="text-red-600 dark:text-red-400">{status.lastError}</span>}
                    />
                )}
            </div>

            <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2">
                <p className="text-sm">{runtimeSummary(channel)}</p>
            </div>
        </SectionCard>
    );
}
