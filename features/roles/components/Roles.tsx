"use client";

import { useQuery } from "convex/react";
import { listRolesRef } from "@/shared/convex/admin";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, ShieldCheck } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function Roles() {
    const roles = useQuery(listRolesRef);

    if (roles === undefined) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex-1 h-full flex flex-col space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <h2 className="text-3xl font-bold tracking-tight">Roles Management</h2>
            </div>

            <Card className="shadow-sm flex-1 mt-4 overflow-hidden border">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle>Workspace Roles</CardTitle>
                    <CardDescription>
                        View and manage roles available in the workspace.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 border-t">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/10">
                                <TableHead className="w-[80px]"></TableHead>
                                <TableHead>Role Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No roles configured yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roles.map((role) => (
                                    <TableRow key={role._id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                {role.name === "Admin" ? (
                                                    <ShieldCheck className="h-5 w-5 text-amber-500" />
                                                ) : (
                                                    <Shield className="h-5 w-5 text-blue-500" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">{role.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            {role.isDefault ? (
                                                <Badge variant="secondary">Default</Badge>
                                            ) : (
                                                <Badge variant="outline">Custom</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground font-mono">
                                            {role._id}
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
