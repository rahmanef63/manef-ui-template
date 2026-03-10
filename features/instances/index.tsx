// @ts-nocheck
"use client";

import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@manef/db/api";
import { PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { InstancesList } from "./components/InstancesList";
import { MOCK_INSTANCES } from "./constants";
import { Skeleton } from "@/components/ui/skeleton";
import type { InstanceData } from "./types";
import { formatDistanceToNow } from "date-fns";

export default function InstancesPage() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Attempt to load instances from Convex
// @ts-ignore`n    // @ts-ignore`n    const dbInstances: any = (useQuery as any)((api as any).features.instances.api.listInstances as any, {});
    const refreshInstances = useAction(api.features.instances.api.refreshInstances);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshInstances();
        } finally {
            setTimeout(() => setIsRefreshing(false), 500);
        }
    };

    if (dbInstances === undefined) {
        return (
            <div className="space-y-6 px-4 lg:px-6">
                <PageHeader title="Instances" description="Presence beacons from connected clients and nodes." />
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    let displayInstances: InstanceData[] = dbInstances.length > 0
        ? dbInstances.map(i => ({
            id: i._id.toString(),
            name: i.name,
            role: i.role === "gateway" || i.role === "node" || i.role === "client" ? i.role : "client",
            arch: i.platform || "unknown",
            os: i.platform || "unknown",
            v: i.version || "unknown",
            lastSeen: i.lastSeenAt ? formatDistanceToNow(i.lastSeenAt, { addSuffix: true }) : "n/a",
            info: i.info || "",
            status: "online",
            tags: i.tags || [],
            lastInput: "n/a",
            reason: ""
        }))
        : MOCK_INSTANCES;

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Instances"
                description="Presence beacons from connected clients and nodes."
            />

            <InstancesList
                instances={displayInstances}
                isRefreshing={isRefreshing}
                onRefresh={handleRefresh}
            />
        </div>
    );
}

