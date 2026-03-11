"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import { listAuditLogsRef } from "@/shared/convex/admin";
import type { Id } from "@/shared/types/convex";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    Search,
    LogIn,
    LogOut,
    ShieldAlert,
    ShieldCheck,
    ShieldOff,
    Smartphone,
    AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const EVENT_TYPES = [
    { value: "all", label: "All Events" },
    { value: "LOGIN_ATTEMPT", label: "Login Attempt" },
    { value: "LOGIN_SUCCESS", label: "Login Success" },
    { value: "LOGIN_DENIED", label: "Login Denied" },
    { value: "DEVICE_PENDING", label: "Device Pending" },
    { value: "DEVICE_APPROVED", label: "Device Approved" },
    { value: "DEVICE_REVOKED", label: "Device Revoked" },
    { value: "BOOTSTRAP_DEVICE_APPROVED", label: "Bootstrap Approved" },
    { value: "SESSION_REVOKED", label: "Session Revoked" },
    { value: "SESSIONS_REVOKED", label: "Sessions Revoked" },
] as const;

function getEventIcon(event: string) {
    switch (event) {
        case "LOGIN_ATTEMPT":
            return <LogIn className="h-4 w-4 text-blue-500" />;
        case "LOGIN_SUCCESS":
            return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
        case "LOGIN_DENIED":
            return <ShieldOff className="h-4 w-4 text-red-500" />;
        case "DEVICE_PENDING":
            return <Smartphone className="h-4 w-4 text-amber-500" />;
        case "DEVICE_APPROVED":
        case "BOOTSTRAP_DEVICE_APPROVED":
            return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
        case "DEVICE_REVOKED":
            return <ShieldAlert className="h-4 w-4 text-red-500" />;
        case "SESSION_REVOKED":
        case "SESSIONS_REVOKED":
            return <LogOut className="h-4 w-4 text-orange-500" />;
        default:
            return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
}

function getEventBadgeVariant(event: string): "default" | "secondary" | "destructive" | "outline" {
    switch (event) {
        case "LOGIN_SUCCESS":
        case "DEVICE_APPROVED":
        case "BOOTSTRAP_DEVICE_APPROVED":
            return "default";
        case "LOGIN_DENIED":
        case "DEVICE_REVOKED":
            return "destructive";
        case "DEVICE_PENDING":
        case "LOGIN_ATTEMPT":
            return "secondary";
        default:
            return "outline";
    }
}

export default function Audit() {
    const [eventFilter, setEventFilter] = useState<string>("all");
    const [search, setSearch] = useState("");

    const logs = useQuery(listAuditLogsRef, {
        eventFilter: eventFilter === "all" ? undefined : eventFilter,
        limit: 200,
    }) as Array<{
        _id: Id<"authAuditLogs">;
        event: string;
        createdAt: number;
        userId?: Id<"authUsers">;
        userName?: string;
        userEmail?: string;
        meta?: unknown;
    }> | undefined;

    const filteredLogs = (logs ?? []).filter((log) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (log.userName?.toLowerCase().includes(q) ?? false) ||
            (log.userEmail?.toLowerCase().includes(q) ?? false) ||
            log.event.toLowerCase().includes(q)
        );
    });

    const formatTime = (ts: number) => {
        return new Date(ts).toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    if (logs === undefined) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex-1 h-full flex flex-col space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
            </div>

            <div className="flex items-center justify-between mt-4 border-b pb-4">
                <div className="flex items-center space-x-2">
                    <div className="relative max-w-sm w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by user, email..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={eventFilter} onValueChange={setEventFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by event" />
                        </SelectTrigger>
                        <SelectContent>
                            {EVENT_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    Showing {filteredLogs.length} events
                </div>
            </div>

            <Card className="shadow-sm flex-1 mt-4 overflow-hidden border">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle>Security Events</CardTitle>
                    <CardDescription>
                        Authentication and authorization audit trail.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 border-t">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/10">
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No audit logs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredLogs.map((log) => (
                                    <TableRow key={log._id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            {getEventIcon(log.event)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getEventBadgeVariant(log.event)} className="font-mono text-xs">
                                                {log.event.replace(/_/g, " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {log.userName || log.userEmail ? (
                                                <div className="flex flex-col">
                                                    {log.userName && (
                                                        <span className="font-medium text-sm">{log.userName}</span>
                                                    )}
                                                    {log.userEmail && (
                                                        <span className="text-xs text-muted-foreground">{log.userEmail}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {log.meta ? (
                                                <span className="text-xs text-muted-foreground font-mono truncate max-w-[300px] block">
                                                    {typeof log.meta === "object"
                                                        ? Object.entries(log.meta as Record<string, unknown>)
                                                            .filter(([k]) => k !== "password")
                                                            .map(([k, v]) => `${k}: ${String(v)}`)
                                                            .join(", ")
                                                        : String(log.meta)}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                            {formatTime(log.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
