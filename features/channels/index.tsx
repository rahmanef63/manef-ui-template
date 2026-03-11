// @ts-nocheck
"use client";

import { useQuery } from "convex/react";
import { api } from "@manef/db/api";
import { EmptyState, PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { ChannelCard } from "./components/ChannelCards";
import { ChannelConfig } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Radio } from "lucide-react";

export default function ChannelsPage() {
    const channels = (useQuery as any)((api as any).features.channels.api.listChannels) as any[] | undefined;

    if (channels === undefined) {
        return (
            <div className="space-y-6 px-4 lg:px-6">
                <PageHeader title="Channels" description="Manage channels and settings." />
                <div className="grid gap-4 lg:grid-cols-2">
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>
            </div>
        );
    }

    const displayChannels: ChannelConfig[] = channels.map((channel) => ({
        id: channel._id,
        channelId: channel.channelId,
        type: channel.type,
        label: channel.label || channel.channelId,
        description: `Live mirror for ${channel.type} channel ${channel.channelId}.`,
        variant: channel.type === "whatsapp" ? "highlight" : "default",
        status: {
            configured: channel.configured,
            running: channel.running,
            linked: channel.linked,
            connected: channel.connected,
            mode: channel.mode,
            lastStart: channel.lastStartAt
                ? formatDistanceToNow(channel.lastStartAt, { addSuffix: true })
                : undefined,
            lastConnect: channel.lastConnectAt
                ? formatDistanceToNow(channel.lastConnectAt, { addSuffix: true })
                : undefined,
            lastError: channel.lastError,
        },
    }));

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Channels"
                description="Live channel states mirrored from the backend database."
            />
            {displayChannels.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-muted/10">
                    <EmptyState
                        icon={Radio}
                        message="Belum ada channel yang termirror ke database. Sinkronkan runtime OpenClaw agar channel muncul di sini."
                        className="py-20"
                    />
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {displayChannels.map((channel) => (
                        <ChannelCard key={channel.id} channel={channel} />
                    ))}
                </div>
            )}
        </div>
    );
}
