"use client";

import { useQuery } from "convex/react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Clock, CheckCircle2, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
export default function MyTasks() {
    const myQuery: any = useQuery;
    const tasks: any[] = myQuery("features/tasks/api:getMyTasks") || [];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case "in_progress":
                return <Clock className="h-4 w-4 text-amber-500" />;
            default:
                return <Circle className="h-4 w-4 text-muted-foreground" />;
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
                <div className="flex items-center space-x-2">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Task
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search tasks..."
                        className="pl-8"
                    />
                </div>
                <Button variant="outline">Filter</Button>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle>All Tasks</CardTitle>
                    <CardDescription>
                        You have {tasks?.filter(t => t.status !== "completed").length ?? 0} active tasks pending.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        {tasks === undefined ? (
                            <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">
                                Loading tasks...
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                No tasks found. Create a new one to get started!
                            </div>
                        ) : (
                            <div className="divide-y">
                                {tasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            {getStatusIcon(task.status)}
                                            <div>
                                                <p className="font-medium text-sm leading-none">
                                                    {task.title}
                                                </p>
                                                {task.priority && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Priority: {task.priority}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant={task.status === "completed" ? "secondary" : "default"}>
                                                {task.status.replace("_", " ")}
                                            </Badge>
                                            <Button variant="ghost" size="sm">
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
