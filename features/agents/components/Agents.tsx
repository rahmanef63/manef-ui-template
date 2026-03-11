"use client";

import { useQuery } from "convex/react";
import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, FolderTree, MessagesSquare, Radio, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState, PageHeader } from "@/shared/block/ui/openclaw-blocks";

export default function Agents() {
    const { selectedRoot, selectedScope } = useOpenClawNavigator();
    const myQuery: any = useQuery;
    const agents: any[] = myQuery("features/agents/api:getAgents", {
        agentIds: selectedScope?.agentIds,
        ownerId: selectedRoot?.ownerId,
    }) || [];

    return (
        <div className="flex-1 h-full flex flex-col space-y-4 p-4 md:p-8 pt-6">
            <PageHeader
                title="AI Agents"
                description="Live mirror of agent records in Convex for the selected OpenClaw scope."
            />

            <div className="flex-1 mt-4">
                {agents.length === 0 ? (
                    <EmptyState
                        icon={Bot}
                        message="Tidak ada agent pada scope aktif. Sinkronkan runtime OpenClaw agar daftar agent muncul di sini."
                        className="h-64 rounded-lg border border-dashed bg-muted/10"
                    />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {agents.map((agent) => {
                            const boundChannels = Array.isArray(agent?.boundChannels)
                                ? agent.boundChannels
                                : [];
                            const sessionCount =
                                typeof agent?.sessionCount === "number"
                                    ? agent.sessionCount
                                    : 0;
                            const childCount =
                                typeof agent?.childCount === "number"
                                    ? agent.childCount
                                    : 0;

                            return (
                            <Card key={agent._id} className="shadow-sm hover:shadow-md transition-shadow group">
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="h-10 w-10 border shadow-sm">
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                <Bot className="h-5 w-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg leading-none">{agent.name}</CardTitle>
                                            <p className="text-xs text-muted-foreground">{agent.agentId}</p>
                                        </div>
                                    </div>
                                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                        {agent.status}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-3 pt-2">
                                    <p className="min-h-10 text-sm text-muted-foreground line-clamp-2">
                                        {agent.description || "No description provided."}
                                    </p>
                                    <div className="grid gap-2 text-xs text-muted-foreground">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="flex items-center gap-1.5">
                                                <UserRound className="h-3.5 w-3.5" />
                                                Owner
                                            </span>
                                            <span className="truncate text-right text-foreground">
                                                {agent.ownerName || "Unassigned"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="flex items-center gap-1.5">
                                                <FolderTree className="h-3.5 w-3.5" />
                                                Workspace
                                            </span>
                                            <span className="truncate text-right text-foreground">
                                                {agent.workspacePath || "Unknown"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="flex items-center gap-1.5">
                                                <MessagesSquare className="h-3.5 w-3.5" />
                                                Sessions
                                            </span>
                                            <span className="text-foreground">{sessionCount}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="flex items-center gap-1.5">
                                                <Radio className="h-3.5 w-3.5" />
                                                Channels
                                            </span>
                                            <span className="truncate text-right text-foreground">
                                                {boundChannels.length > 0
                                                    ? boundChannels.join(", ")
                                                    : "No bindings"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <Badge variant="outline" className="capitalize">
                                            {agent.role}
                                        </Badge>
                                        {agent.model ? (
                                            <Badge variant="outline">{agent.model}</Badge>
                                        ) : null}
                                        {childCount > 0 ? (
                                            <Badge variant="outline">
                                                {childCount} child
                                            </Badge>
                                        ) : null}
                                    </div>
                                </CardContent>
                            </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
