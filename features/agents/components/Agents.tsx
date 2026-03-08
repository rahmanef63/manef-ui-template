"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bot, Play, Settings, Plus, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Agents() {
    const myQuery: any = useQuery;
    const agents: any[] = myQuery("features/agents/api:getAgents") || [];

    // Mutations and Actions
    const myMutation: any = useMutation;
    const deployAgent = myMutation("features/agents/api:deployAgent");

    const myAction: any = useAction;
    const runAgent = myAction("features/agents/api:runAgentTask");

    return (
        <div className="flex-1 h-full flex flex-col space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <h2 className="text-3xl font-bold tracking-tight">AI Agents</h2>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => deployAgent({
                        name: "New Agent " + Math.floor(Math.random() * 100),
                        role: "assistant",
                        description: "Automatically spawned agent"
                    })}>
                        <Plus className="mr-2 h-4 w-4" />
                        Deploy Agent
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-2 border-b pb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search agents..."
                        className="pl-8"
                    />
                </div>
                <div className="flex bg-muted p-1 rounded-md">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm bg-background shadow-sm">
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-muted-foreground">
                        <List className="h-4 w-4" />
                    </Button>
                </div>
                <Button variant="outline">Filter by Status</Button>
            </div>

            <div className="flex-1 mt-4">
                {agents.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center border border-dashed rounded-lg bg-muted/10 text-muted-foreground p-8 text-center">
                        <Bot className="h-12 w-12 text-primary/30 mb-4" />
                        <h3 className="text-xl font-bold tracking-tight mb-2">No active agents deployed</h3>
                        <p className="text-sm max-w-md">Agents automate your tasks, help analyze data, and keep things moving. Deploy an agent to get started.</p>
                        <Button className="mt-4" onClick={() => deployAgent({ name: "Core Agent", role: "core", description: "Default assistant agent" })}>
                            <Plus className="mr-2 h-4 w-4" /> Deploy First Agent
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {agents.map((agent) => (
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
                                            <p className="text-xs text-muted-foreground">{agent.role}</p>
                                        </div>
                                    </div>
                                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                        {agent.status}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="h-16 pt-2">
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {agent.description || "No description provided."}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-4 border-t bg-muted/20 flex justify-between">
                                    <Button variant="ghost" size="sm" onClick={() => runAgent({ agentId: agent._id })}>
                                        <Play className="h-3.5 w-3.5 mr-2 text-primary" /> Run Action
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Settings className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
