// @ts-nocheck
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { TelegramCard, WhatsAppCard } from "./components/ChannelCards";
import { CHANNEL_CONFIGS } from "./constants";
import { ChannelConfig } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export default function ChannelsPage() {
    // Attempt to load channels from Convex
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

    // Merge DB channels with fallback configs
    const getChannelData = (type: string): ChannelConfig => {
        const dbChannel = channels.find(c => c.type === type);
        const fallback = CHANNEL_CONFIGS.find(c => c.type === type)!;

        if (!dbChannel) return fallback;

        return {
            ...fallback,
            label: dbChannel.label || fallback.label,
            status: {
                configured: dbChannel.configured,
                running: dbChannel.running,
                linked: dbChannel.linked ?? fallback.status.linked,
                connected: dbChannel.connected ?? fallback.status.connected,
                mode: dbChannel.mode || fallback.status.mode,
                lastStart: dbChannel.lastStartAt
                    ? formatDistanceToNow(dbChannel.lastStartAt, { addSuffix: true })
                    : fallback.status.lastStart,
                lastConnect: dbChannel.lastConnectAt
                    ? formatDistanceToNow(dbChannel.lastConnectAt, { addSuffix: true })
                    : fallback.status.lastConnect,
            }
        };
    };

    const telegram = getChannelData("telegram");
    const whatsapp = getChannelData("whatsapp");

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Channels"
                description="Manage channels and settings."
            />
            <div className="grid gap-4 lg:grid-cols-2">
                <TelegramCard channel={telegram} />
                <WhatsAppCard channel={whatsapp} />
            </div>
        </div>
    );
}
