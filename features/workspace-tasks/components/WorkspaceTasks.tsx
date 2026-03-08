"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Columns, LayoutList, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function WorkspaceTasks() {
    const myQuery: any = useQuery;
    const tasks: any[] = myQuery("features/workspace_tasks/api:getWorkspaceTasks") || [];

    // Mutations and Actions
    const myMutation: any = useMutation;
    const createTask = myMutation("features/workspace_tasks/api:createWorkspaceTask");

    const myAction: any = useAction;
    const assignTask = myAction("features/workspace_tasks/api:assignTask");

    // Grouping tasks by status
    const statuses = ["pending", "in_progress", "completed"];
    const groupedTasks = statuses.map((status) => ({
        status,
        items: tasks.filter(t => t.status.toLowerCase() === status)
    }));

    return (
        <div className="flex-1 h-full flex flex-col space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <h2 className="text-3xl font-bold tracking-tight">Team Tasks</h2>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => createTask({
                        title: "New Workspace Task",
                        priority: "High"
                    })}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Task
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search team tasks..."
                            className="pl-8"
                        />
                    </div>
                </div>
                <div className="flex bg-muted p-1 rounded-md">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-muted-foreground">
                        <LayoutList className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm bg-background shadow-sm">
                        <Columns className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-x-auto gap-6 mt-4 pb-4">
                {groupedTasks.map((column) => (
                    <div key={column.status} className="flex-1 min-w-[300px] flex flex-col bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-semibold capitalize">{column.status.replace("_", " ")}</h3>
                                <Badge variant="secondary" className="rounded-full w-5 h-5 p-0 flex items-center justify-center text-xs">
                                    {column.items.length}
                                </Badge>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-col gap-3 overflow-y-auto">
                            {column.items.length === 0 ? (
                                <div className="text-sm text-center p-4 text-muted-foreground border-2 border-dashed rounded-lg">
                                    No tasks here
                                </div>
                            ) : (
                                column.items.map((task) => (
                                    <div key={task._id} className="bg-card border rounded-lg p-3 shadow-sm flex flex-col cursor-pointer hover:border-primary/50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <Badge variant={task.priority?.toLowerCase() === 'high' ? 'destructive' : 'secondary'} className="mb-2 uppercase text-[10px]">
                                                {task.priority || "Normal"}
                                            </Badge>
                                            <GripVertical className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100" />
                                        </div>
                                        <h4 className="font-medium text-sm leading-snug mb-3">
                                            {task.title}
                                        </h4>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex -space-x-2">
                                                <Avatar className="h-6 w-6 border-2 border-background">
                                                    <AvatarFallback className="text-[10px]">JD</AvatarFallback>
                                                </Avatar>
                                                <Avatar className="h-6 w-6 border-2 border-background">
                                                    <AvatarFallback className="text-[10px] bg-primary/20 text-primary">AK</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(task.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
