"use client";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import {
    getUsersRef,
    updateUserStatusRef,
} from "@/shared/convex/admin";
import type { Id } from "@/shared/types/convex";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Users() {
    const users = (useQuery(getUsersRef) as Array<{
        _id: Id<"authUsers">;
        name: string;
        email: string;
        roles: string[];
        status: string;
        createdAt: number;
        updatedAt: number;
    }> | undefined) ?? [];
    const updateStatus = useMutation(updateUserStatusRef);
    const [search, setSearch] = useState("");

    const filteredUsers = users.filter((user) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            user.name.toLowerCase().includes(q) ||
            user.email.toLowerCase().includes(q)
        );
    });

    const formatTime = (ts: number) => {
        return new Date(ts).toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleToggleStatus = async (userId: typeof users[number]["_id"], currentStatus: string) => {
        await updateStatus({
            userId,
            status: currentStatus === "active" ? "blocked" : "active",
        });
    };

    if (users === undefined) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex-1 h-full flex flex-col space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
            </div>

            <div className="flex items-center justify-between mt-4 border-b pb-4">
                <div className="flex items-center space-x-2">
                    <div className="relative max-w-sm w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search users by name, email..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            </div>

            <Card className="shadow-sm flex-1 mt-4 overflow-hidden border">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle>Auth Users</CardTitle>
                    <CardDescription>
                        Manage authenticated users, their status, and roles.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 border-t">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/10">
                                <TableHead className="w-[300px]">User</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user._id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-9 w-9 border">
                                                    <AvatarFallback className="bg-primary/10 text-primary uppercase">
                                                        {user.name.substring(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm leading-none">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground mt-1">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {user.roles.map((role) => (
                                                    <Badge key={role} variant="outline" className="font-normal capitalize">
                                                        {role}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className={`w-2 h-2 rounded-full mr-2 ${user.status === "active" ? "bg-emerald-500" : "bg-red-500"}`} />
                                                <span className="text-sm capitalize">{user.status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatTime(user.createdAt)}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatTime(user.updatedAt)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => handleToggleStatus(user._id, user.status)}
                                                    >
                                                        {user.status === "active" ? (
                                                            <>
                                                                <UserX className="mr-2 h-4 w-4" />
                                                                Block User
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck className="mr-2 h-4 w-4" />
                                                                Unblock User
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
