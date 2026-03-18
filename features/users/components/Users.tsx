"use client";

import { useQuery, useMutation } from "convex/react";
import { useMemo, useState } from "react";
import {
    approvePasswordResetRequestRef,
    approveRegistrationRequestRef,
    denyPasswordResetRequestRef,
    denyRegistrationRequestRef,
    getUsersRef,
    issueTemporaryPasswordForUserRef,
    listPasswordResetRequestsRef,
    listRegistrationRequestsRef,
    updateUserStatusRef,
} from "@/shared/convex/admin";
import { listOpenClawScopesRef } from "@/shared/convex/openclawNavigator";
import {
    attachIdentityWorkspaceRef,
    attachWorkspaceChannelRef,
    detachIdentityWorkspaceRef,
    detachWorkspaceChannelRef,
    listChannelBindingPoliciesRef,
    listChannelWorkspaceBindingsRef,
    listChannelsRef,
    listIdentityWorkspaceBindingsRef,
    setChannelBindingPolicyRef,
} from "@/shared/convex/channels";
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
import { Label } from "@/components/ui/label";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Users() {
    const rawUsers = useQuery(getUsersRef) as Array<{
        _id: Id<"authUsers">;
        hasPassword: boolean;
        name: string;
        email: string;
        phone?: string;
        mustChangePassword?: boolean;
        temporaryPasswordIssuedAt?: number;
        roles: string[];
        status: string;
        workspaces: Array<{
            featureKeys: string[];
            name: string;
            slug: string;
            workspaceId: Id<"workspaceTrees">;
        }>;
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
    const passwordResetRequests = (useQuery(listPasswordResetRequestsRef) as Array<{
        _id: Id<"authPasswordResetRequests">;
        authUserId?: Id<"authUsers">;
        context?: string;
        createdAt: number;
        email?: string;
        hasMatchedUser: boolean;
        identifier: string;
        name: string;
        phone?: string;
        status: "pending" | "approved" | "denied";
        temporaryPasswordIssuedAt?: number;
        updatedAt: number;
    }> | undefined) ?? [];
    const updateStatus = useMutation(updateUserStatusRef);
    const approveRegistration = useMutation(approveRegistrationRequestRef);
    const approvePasswordReset = useMutation(approvePasswordResetRequestRef);
    const denyRegistration = useMutation(denyRegistrationRequestRef);
    const denyPasswordReset = useMutation(denyPasswordResetRequestRef);
    const issueTemporaryPassword = useMutation(issueTemporaryPasswordForUserRef);
    const channelBindings = (useQuery(listChannelWorkspaceBindingsRef, {}) as Array<{
        access?: string;
        agentId?: string;
        channelId: string;
        source?: string;
        workspaceId: Id<"workspaceTrees">;
        workspaceName: string;
    }> | undefined) ?? [];
    const identityBindings = (useQuery(listIdentityWorkspaceBindingsRef, {}) as Array<{
        access?: string;
        channel: string;
        externalUserId: string;
        normalizedPhone?: string;
        source?: string;
        userId?: Id<"userProfiles">;
        workspaceId: Id<"workspaceTrees">;
        workspaceName: string;
    }> | undefined) ?? [];
    const channels = (useQuery(listChannelsRef, {}) as Array<{
        channelId: string;
        label?: string;
        type: string;
    }> | undefined) ?? [];
    const openClawScopes = useQuery(listOpenClawScopesRef, {});
    const attachWorkspaceChannel = useMutation(attachWorkspaceChannelRef);
    const detachWorkspaceChannel = useMutation(detachWorkspaceChannelRef);
    const attachIdentityWorkspace = useMutation(attachIdentityWorkspaceRef);
    const detachIdentityWorkspace = useMutation(detachIdentityWorkspaceRef);
    const setChannelBindingPolicy = useMutation(setChannelBindingPolicyRef);
    const channelPolicies = (useQuery(listChannelBindingPoliciesRef, {}) as Array<{
        channelId: string;
        mode: string;
        primaryWorkspaceId?: Id<"workspaceTrees">;
        source?: string;
    }> | undefined) ?? [];
    const [search, setSearch] = useState("");
    const [busyRequestId, setBusyRequestId] = useState<string | null>(null);
    const [revealedPasswords, setRevealedPasswords] = useState<Record<string, string>>({});
    const [busyUserPasswordId, setBusyUserPasswordId] = useState<string | null>(null);
    const [channelWorkspaceId, setChannelWorkspaceId] = useState("");
    const [channelId, setChannelId] = useState("");
    const [channelBusy, setChannelBusy] = useState(false);
    const [policyChannelId, setPolicyChannelId] = useState("");
    const [policyMode, setPolicyMode] = useState("multi-workspace");
    const [policyPrimaryWorkspaceId, setPolicyPrimaryWorkspaceId] = useState("");
    const [policyBusy, setPolicyBusy] = useState(false);
    const [identityWorkspaceId, setIdentityWorkspaceId] = useState("");
    const [identityChannel, setIdentityChannel] = useState("whatsapp");
    const [identityExternalId, setIdentityExternalId] = useState("");
    const [identityBusy, setIdentityBusy] = useState(false);

    const workspaceOptions = useMemo(() => {
        const roots = openClawScopes?.roots ?? [];
        return roots.flatMap((root) => [
            { id: root._id, label: root.name, slug: root.slug },
            ...root.children.map((child) => ({
                id: child._id,
                label: `${root.name} / ${child.name}`,
                slug: child.slug,
            })),
        ]);
    }, [openClawScopes?.roots]);

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

    const handleIssueUserPassword = async (userId: Id<"authUsers">) => {
        setBusyUserPasswordId(userId);
        try {
            const result = await issueTemporaryPassword({ userId });
            setRevealedPasswords((current) => ({
                ...current,
                [userId]: result.temporaryPassword,
            }));
        } finally {
            setBusyUserPasswordId(null);
        }
    };

    const handleApprovePasswordReset = async (
        requestId: Id<"authPasswordResetRequests">,
    ) => {
        setBusyRequestId(requestId);
        try {
            const result = await approvePasswordReset({ requestId });
            setRevealedPasswords((current) => ({
                ...current,
                [requestId]: result.temporaryPassword,
            }));
        } finally {
            setBusyRequestId(null);
        }
    };

    const handleDenyPasswordReset = async (
        requestId: Id<"authPasswordResetRequests">,
    ) => {
        setBusyRequestId(requestId);
        try {
            await denyPasswordReset({ requestId });
            setRevealedPasswords((current) => {
                const next = { ...current };
                delete next[requestId];
                return next;
            });
        } finally {
            setBusyRequestId(null);
        }
    };

    const handleAttachChannelWorkspace = async () => {
        if (!channelId || !channelWorkspaceId) {
            return;
        }
        setChannelBusy(true);
        try {
            await attachWorkspaceChannel({
                access: "manual",
                channelId,
                source: "manual",
                workspaceId: channelWorkspaceId as Id<"workspaceTrees">,
            });
            setChannelId("");
            setChannelWorkspaceId("");
        } finally {
            setChannelBusy(false);
        }
    };

    const handleAttachIdentityWorkspace = async () => {
        const externalUserId = identityExternalId.trim();
        if (!identityChannel || !identityWorkspaceId || !externalUserId) {
            return;
        }
        setIdentityBusy(true);
        try {
            await attachIdentityWorkspace({
                access: "manual",
                channel: identityChannel,
                externalUserId,
                source: "manual",
                workspaceId: identityWorkspaceId as Id<"workspaceTrees">,
            });
            setIdentityExternalId("");
            setIdentityWorkspaceId("");
        } finally {
            setIdentityBusy(false);
        }
    };

    const handleSetChannelPolicy = async () => {
        if (!policyChannelId || !policyMode) {
            return;
        }
        setPolicyBusy(true);
        try {
            await setChannelBindingPolicy({
                channelId: policyChannelId,
                mode: policyMode as "single-primary" | "multi-workspace",
                primaryWorkspaceId:
                    policyMode === "single-primary" && policyPrimaryWorkspaceId
                        ? (policyPrimaryWorkspaceId as Id<"workspaceTrees">)
                        : undefined,
            });
            if (policyMode !== "single-primary") {
                setPolicyPrimaryWorkspaceId("");
            }
        } finally {
            setPolicyBusy(false);
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
                    <CardTitle>Workspace Access Bindings</CardTitle>
                    <CardDescription>
                        Attach channels and identities to specific OpenClaw workspaces. This is the admin write surface for workspace access.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="rounded-md border p-4 space-y-3">
                            <div className="text-sm font-medium">Channel binding policy</div>
                            <div className="space-y-2">
                                <Label>Channel</Label>
                                <Select value={policyChannelId} onValueChange={setPolicyChannelId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select channel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {channels.map((channel) => (
                                            <SelectItem key={channel.channelId} value={channel.channelId}>
                                                {channel.label ?? channel.channelId}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Policy mode</Label>
                                <Select value={policyMode} onValueChange={setPolicyMode}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="multi-workspace">multi-workspace</SelectItem>
                                        <SelectItem value="single-primary">single-primary</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {policyMode === "single-primary" ? (
                                <div className="space-y-2">
                                    <Label>Primary workspace</Label>
                                    <Select value={policyPrimaryWorkspaceId} onValueChange={setPolicyPrimaryWorkspaceId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select primary workspace" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {workspaceOptions.map((workspace) => (
                                                <SelectItem key={workspace.id} value={workspace.id}>
                                                    {workspace.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : null}
                            <Button
                                onClick={handleSetChannelPolicy}
                                disabled={
                                    policyBusy ||
                                    !policyChannelId ||
                                    !policyMode ||
                                    (policyMode === "single-primary" && !policyPrimaryWorkspaceId)
                                }
                            >
                                {policyBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save Channel Policy
                            </Button>
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Current policies</div>
                                {channelPolicies.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">No explicit policy yet.</div>
                                ) : (
                                    channelPolicies.map((policy) => (
                                        <div key={policy.channelId} className="rounded-md border p-3 text-sm">
                                            <div className="font-medium">{policy.channelId}</div>
                                            <div className="text-muted-foreground">
                                                {policy.mode}
                                                {policy.primaryWorkspaceId ? ` / primary: ${policy.primaryWorkspaceId}` : ""}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Channel</Label>
                            <Select value={channelId} onValueChange={setChannelId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select channel" />
                                </SelectTrigger>
                                <SelectContent>
                                    {channels.map((channel) => (
                                        <SelectItem key={channel.channelId} value={channel.channelId}>
                                            {channel.label ?? channel.channelId}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Workspace</Label>
                            <Select value={channelWorkspaceId} onValueChange={setChannelWorkspaceId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select workspace" />
                                </SelectTrigger>
                                <SelectContent>
                                    {workspaceOptions.map((workspace) => (
                                        <SelectItem key={workspace.id} value={workspace.id}>
                                            {workspace.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleAttachChannelWorkspace} disabled={channelBusy || !channelId || !channelWorkspaceId}>
                            {channelBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Attach Channel to Workspace
                        </Button>

                        <div className="space-y-2">
                            <div className="text-sm font-medium">Current channel bindings</div>
                            <div className="space-y-2">
                                {channelBindings.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">No channel bindings yet.</div>
                                ) : (
                                    channelBindings.map((binding) => (
                                        <div key={`${binding.channelId}-${binding.workspaceId}`} className="flex items-center justify-between rounded-md border p-3">
                                            <div className="text-sm">
                                                <div className="font-medium">{binding.channelId}</div>
                                                <div className="text-muted-foreground">{binding.workspaceName}</div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => detachWorkspaceChannel({
                                                    channelId: binding.channelId,
                                                    workspaceId: binding.workspaceId,
                                                })}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Identity channel</Label>
                            <Select value={identityChannel} onValueChange={setIdentityChannel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select identity channel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="whatsapp">whatsapp</SelectItem>
                                    <SelectItem value="telegram">telegram</SelectItem>
                                    <SelectItem value="webchat">webchat</SelectItem>
                                    <SelectItem value="phone">phone</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>External user id / phone</Label>
                            <Input
                                value={identityExternalId}
                                onChange={(event) => setIdentityExternalId(event.target.value)}
                                placeholder="628119997914@s.whatsapp.net or +628..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Workspace</Label>
                            <Select value={identityWorkspaceId} onValueChange={setIdentityWorkspaceId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select workspace" />
                                </SelectTrigger>
                                <SelectContent>
                                    {workspaceOptions.map((workspace) => (
                                        <SelectItem key={workspace.id} value={workspace.id}>
                                            {workspace.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={handleAttachIdentityWorkspace}
                            disabled={identityBusy || !identityChannel || !identityWorkspaceId || !identityExternalId.trim()}
                        >
                            {identityBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Attach Identity to Workspace
                        </Button>

                        <div className="space-y-2">
                            <div className="text-sm font-medium">Current identity bindings</div>
                            <div className="space-y-2">
                                {identityBindings.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">No identity bindings yet.</div>
                                ) : (
                                    identityBindings.map((binding) => (
                                        <div key={`${binding.workspaceId}-${binding.channel}-${binding.externalUserId}`} className="flex items-center justify-between rounded-md border p-3">
                                            <div className="text-sm">
                                                <div className="font-medium">{binding.normalizedPhone ?? binding.externalUserId}</div>
                                                <div className="text-muted-foreground">
                                                    {binding.channel} {"->"} {binding.workspaceName}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => detachIdentityWorkspace({
                                                    channel: binding.channel,
                                                    externalUserId: binding.externalUserId,
                                                    workspaceId: binding.workspaceId,
                                                })}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                <CardHeader className="bg-muted/30 pb-4 border-b">
                    <CardTitle>Password Reset Requests</CardTitle>
                    <CardDescription>
                        Incoming forgot-password requests from the auth portal. Approve a request to issue a temporary password.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/10">
                                <TableHead>Requester</TableHead>
                                <TableHead>Context</TableHead>
                                <TableHead>Match</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {passwordResetRequests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No password reset requests yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                passwordResetRequests.map((request) => {
                                    const revealedPassword = revealedPasswords[request._id];
                                    const isBusy = busyRequestId === request._id;
                                    return (
                                        <TableRow key={request._id} className="hover:bg-muted/50 transition-colors align-top">
                                            <TableCell className="space-y-1">
                                                <div className="font-medium text-sm">{request.name}</div>
                                                <div className="text-xs text-muted-foreground">{request.phone ?? request.email ?? request.identifier}</div>
                                            </TableCell>
                                            <TableCell className="max-w-sm">
                                                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {request.context || "No note"}
                                                </div>
                                                {revealedPassword ? (
                                                    <div className="mt-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700">
                                                        Password sementara: <span className="font-mono font-semibold">{revealedPassword}</span>
                                                        <div>Berikan sekali ke user. Setelah login, password ini harus diganti.</div>
                                                    </div>
                                                ) : null}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-normal">
                                                    {request.hasMatchedUser ? "Matched user" : "No matched user"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {request.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatTime(request.updatedAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {request.status === "pending" ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={isBusy || !request.hasMatchedUser}
                                                                onClick={() => handleApprovePasswordReset(request._id)}
                                                            >
                                                                {isBusy ? (
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                ) : null}
                                                                Issue Password
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                disabled={isBusy}
                                                                onClick={() => handleDenyPasswordReset(request._id)}
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
                                <TableHead>Workspaces</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Password</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
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
                                        <TableCell className="align-top">
                                            <div className="flex max-w-md flex-wrap gap-1">
                                                {user.workspaces.length === 0 ? (
                                                    <span className="text-xs text-muted-foreground">No workspace</span>
                                                ) : (
                                                    user.workspaces.map((workspace) => (
                                                        <div
                                                            key={workspace.workspaceId}
                                                            className="rounded-md border px-2 py-1 text-xs"
                                                        >
                                                            <div className="font-medium">{workspace.name}</div>
                                                            <div className="text-muted-foreground">{workspace.slug}</div>
                                                            {workspace.featureKeys.length > 0 ? (
                                                                <div className="mt-1 flex flex-wrap gap-1">
                                                                    {workspace.featureKeys.slice(0, 4).map((featureKey) => (
                                                                        <Badge key={featureKey} variant="secondary" className="font-normal text-[10px]">
                                                                            {featureKey}
                                                                        </Badge>
                                                                    ))}
                                                                    {workspace.featureKeys.length > 4 ? (
                                                                        <Badge variant="outline" className="font-normal text-[10px]">
                                                                            +{workspace.featureKeys.length - 4}
                                                                        </Badge>
                                                                    ) : null}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    ))
                                                )}
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
                                        <TableCell className="align-top">
                                            <div className="space-y-2">
                                                <div className="text-xs text-muted-foreground">
                                                    {user.mustChangePassword
                                                        ? "Temporary password active"
                                                        : user.hasPassword
                                                            ? "Password set by user"
                                                            : "No password yet"}
                                                </div>
                                                {revealedPasswords[user._id] ? (
                                                    <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700">
                                                        <div className="font-mono font-semibold">{revealedPasswords[user._id]}</div>
                                                        <div>Berikan sekali ke user. Setelah login, password ini harus diganti.</div>
                                                    </div>
                                                ) : null}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={busyUserPasswordId === user._id}
                                                    onClick={() => handleIssueUserPassword(user._id)}
                                                >
                                                    {busyUserPasswordId === user._id ? (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    ) : null}
                                                    {user.temporaryPasswordIssuedAt ? "Reset Temp Password" : "Issue Temp Password"}
                                                </Button>
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
