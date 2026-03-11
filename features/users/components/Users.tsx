"use client";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import {
    approveRegistrationRequestRef,
    denyRegistrationRequestRef,
    getUsersRef,
    listRegistrationRequestsRef,
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
import {
    Check,
    Loader2,
    MoreHorizontal,
    Search,
    ShieldCheck,
    UserCheck,
    UserX,
    X,
} from "lucide-react";
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
    const rawUsers = useQuery(getUsersRef) as Array<{
        _id: Id<"authUsers">;
        name: string;
        email: string;
        phone?: string;
        mustChangePassword?: boolean;
        roles: string[];
        status: string;
        createdAt: number;
        updatedAt: number;
    }> | undefined;
    const users = rawUsers ?? [];
    const registrationRequests = (useQuery(listRegistrationRequestsRef) as Array<{
        _id: Id<"authRegistrationRequests">;
        approvedAt?: number;
        authUserId?: Id<"authUsers">;
        context: string;
        createdAt: number;
        matchedProfileId?: Id<"userProfiles">;
        matchedWorkspaceCount: number;
        matchedWorkspaceNames: string[];
        name: string;
        phone: string;
        reviewNote?: string;
        status: "pending_workspace" | "ready_for_access" | "approved" | "denied";
        temporaryPasswordIssuedAt?: number;
        updatedAt: number;
    }> | undefined) ?? [];
    const updateStatus = useMutation(updateUserStatusRef);
    const approveRegistration = useMutation(approveRegistrationRequestRef);
    const denyRegistration = useMutation(denyRegistrationRequestRef);
    const [search, setSearch] = useState("");
    const [busyRequestId, setBusyRequestId] = useState<string | null>(null);
    const [revealedPasswords, setRevealedPasswords] = useState<Record<string, string>>({});

    const filteredUsers = users.filter((user) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            user.name.toLowerCase().includes(q) ||
            user.email.toLowerCase().includes(q) ||
            (user.phone ?? "").toLowerCase().includes(q)
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

    const handleApproveRequest = async (
        requestId: Id<"authRegistrationRequests">,
        createWorkspace: boolean,
    ) => {
        setBusyRequestId(requestId);
        try {
            const result = await approveRegistration({
                createWorkspace,
                requestId,
            });
            setRevealedPasswords((current) => ({
                ...current,
                [requestId]: result.temporaryPassword,
            }));
        } finally {
            setBusyRequestId(null);
        }
    };

    const handleDenyRequest = async (requestId: Id<"authRegistrationRequests">) => {
        setBusyRequestId(requestId);
        try {
            await denyRegistration({ requestId });
            setRevealedPasswords((current) => {
                const next = { ...current };
                delete next[requestId];
                return next;
            });
        } finally {
            setBusyRequestId(null);
        }
    };

    if (rawUsers === undefined) {
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
                <CardHeader className="bg-muted/30 pb-4 border-b">
                    <CardTitle>Registration Requests</CardTitle>
                    <CardDescription>
                        Approve or deny incoming phone-based access requests before users can receive a temporary password.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/10">
                                <TableHead>Requester</TableHead>
                                <TableHead>Context</TableHead>
                                <TableHead>Workspace Match</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registrationRequests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No registration requests yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                registrationRequests.map((request) => {
                                    const revealedPassword = revealedPasswords[request._id];
                                    const isBusy = busyRequestId === request._id;
                                    return (
                                        <TableRow key={request._id} className="hover:bg-muted/50 transition-colors align-top">
                                            <TableCell className="space-y-1">
                                                <div className="font-medium text-sm">{request.name}</div>
                                                <div className="text-xs text-muted-foreground">{request.phone}</div>
                                            </TableCell>
                                            <TableCell className="max-w-sm">
                                                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {request.context}
                                                </div>
                                                {request.reviewNote ? (
                                                    <div className="mt-2 text-xs text-destructive">
                                                        Admin note: {request.reviewNote}
                                                    </div>
                                                ) : null}
                                                {revealedPassword ? (
                                                    <div className="mt-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700">
                                                        Password sementara: <span className="font-mono font-semibold">{revealedPassword}</span>
                                                        <div>Berikan sekali ke user. Setelah login, password ini seharusnya diganti.</div>
                                                    </div>
                                                ) : null}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="text-sm">{request.matchedWorkspaceCount} workspace</div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {request.matchedWorkspaceNames.slice(0, 3).map((name) => (
                                                            <Badge key={name} variant="outline" className="font-normal">
                                                                {name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize"
                                                >
                                                    {request.status.replace(/_/g, " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatTime(request.updatedAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {request.status !== "denied" && request.status !== "approved" ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={isBusy}
                                                                onClick={() =>
                                                                    handleApproveRequest(
                                                                        request._id,
                                                                        request.matchedWorkspaceCount === 0,
                                                                    )
                                                                }
                                                            >
                                                                {isBusy ? (
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                                                )}
                                                                {request.matchedWorkspaceCount > 0
                                                                    ? "Issue Password"
                                                                    : "Approve + Workspace"}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                disabled={isBusy}
                                                                onClick={() => handleDenyRequest(request._id)}
                                                            >
                                                                <X className="mr-2 h-4 w-4" />
                                                                Deny
                                                            </Button>
                                                        </>
                                                    ) : request.status === "approved" ? (
                                                        <div className="text-xs text-emerald-700 flex items-center justify-end">
                                                            <Check className="mr-1 h-4 w-4" />
                                                            Approved
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-destructive flex items-center justify-end">
                                                            <X className="mr-1 h-4 w-4" />
                                                            Denied
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

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
                                                    {user.phone ? (
                                                        <span className="text-xs text-muted-foreground mt-1">{user.phone}</span>
                                                    ) : null}
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
                                                {user.mustChangePassword ? (
                                                    <Badge variant="secondary" className="font-normal">
                                                        Temp password
                                                    </Badge>
                                                ) : null}
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
