// @ts-nocheck
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@manef/db/api";
import { EmptyState, PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { ChannelCard } from "./components/ChannelCards";
import { ChannelConfig } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { Radio } from "lucide-react";
import { RefreshButton } from "@/shared/block/ui/openclaw-blocks";

export default function ChannelsPage() {
    const router = useRouter();
    const [filter, setFilter] = useState("");
    const [isRefreshing, startRefresh] = useTransition();
    const channels = (useQuery as any)((api as any).features.channels.api.listChannels) as any[] | undefined;

    const handleRefresh = () => {
        startRefresh(() => {
            router.refresh();
        });
    };

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
            lastProbe: channel.lastProbeAt
                ? formatDistanceToNow(channel.lastProbeAt, { addSuffix: true })
                : undefined,
            lastConnect: channel.lastConnectAt
                ? formatDistanceToNow(channel.lastConnectAt, { addSuffix: true })
                : undefined,
            lastMessage: channel.lastMessageAt
                ? formatDistanceToNow(channel.lastMessageAt, { addSuffix: true })
                : undefined,
            authAge: channel.authAgeMs
                ? `${Math.round(channel.authAgeMs / 1000 / 60)}m`
                : undefined,
            lastError: channel.lastError,
            bindingCount: channel.config?.bindingCount,
            allowListCount: channel.config?.allowListCount,
        },
    }));

    const needle = filter.trim().toLowerCase();
    const filteredChannels = !needle
        ? displayChannels
        : displayChannels.filter((channel) =>
            channel.channelId.toLowerCase().includes(needle) ||
            channel.label.toLowerCase().includes(needle) ||
            channel.type.toLowerCase().includes(needle)
        );

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Channels"
                description="Live channel states mirrored from the backend database."
            >
                <RefreshButton onClick={handleRefresh} loading={isRefreshing} />
            </PageHeader>
            <Input
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Filter channel by id, label, or type"
                className="bg-muted/50"
            />
            {filteredChannels.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-muted/10">
                    <EmptyState
                        icon={Radio}
                        message="Belum ada channel yang termirror ke database. Sinkronkan runtime OpenClaw agar channel muncul di sini."
                        className="py-20"
                    />
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {filteredChannels.map((channel) => (
                        <ChannelCard key={channel.id} channel={channel} />
                    ))}
                </div>
            )}
        </div>
    );
}
