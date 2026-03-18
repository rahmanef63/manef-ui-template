"use client";

import { useAppQuery } from "@/lib/convex/client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Activity,
    CreditCard,
    DollarSign,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    CircleDashed,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Overview() {
    const stats: any = useAppQuery("features/dashboard/api:getStats");
    const recentActivity: any[] = useAppQuery("features/dashboard/api:getRecentActivity") || [];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">Download Report</Button>
                    <Button>Create New Project</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalProjects ?? "-"}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                            <span className="text-emerald-500 font-medium">+12%</span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500/5 to-transparent border-blue-500/20 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalTasks ?? "-"}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                            <span className="text-emerald-500 font-medium">+5%</span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/20 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.activeAgents ?? "-"}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                            <span className="text-emerald-500 font-medium">+2</span> since yesterday
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/20 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                        <CircleDashed className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">98.5%</div>
                        <Progress value={98.5} className="mt-2 h-2" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Project Activity</CardTitle>
                        <CardDescription>
                            Overview of project creations and updates over time.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {/* Placeholder for a chart, we use a stylish empty state block */}
                        <div className="h-[300px] w-full flex items-center justify-center rounded-md border border-dashed text-muted-foreground bg-muted/20">
                            Chart visualization will be rendered here
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest actions happening across your workspace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentActivity === undefined ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex items-center">
                                            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                                            <div className="ml-4 space-y-2 flex-1">
                                                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                                                <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : recentActivity.length === 0 ? (
                                <div className="text-center text-sm text-muted-foreground">
                                    No recent activity found.
                                </div>
                            ) : (
                                recentActivity.map((activity, i) => (
                                    <div key={i} className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {activity.userInitials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {activity.action}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.details}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs text-muted-foreground">
                                            {activity.timeAgo}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
