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
import { Search, Mail, MailOpen, RefreshCw, Trash2, Archive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Inbox() {
    const myQuery: any = useQuery;
    const messages: any[] = myQuery("features/inbox/api:getMessages") || [];

    // Mutation and action hooks
    const myMutation: any = useMutation;
    const markAsRead = myMutation("features/inbox/api:markAsRead");

    const myAction: any = useAction;
    const syncEmails = myAction("features/inbox/api:syncEmails");

    const formatTime = (ts: number) => {
        return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex-1 h-full flex flex-col space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4 border-b">
                <h2 className="text-3xl font-bold tracking-tight">Inbox</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => syncEmails()}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync
                    </Button>
                    <Button>Compose</Button>
                </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search emails..."
                        className="pl-8"
                    />
                </div>
                <Button variant="outline">Filter</Button>
            </div>

            <div className="grid gap-4 flex-1 items-start lg:grid-cols-3">
                <Card className="col-span-1 shadow-sm h-full flex flex-col">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="flex items-center text-lg">
                            <Mail className="mr-2 h-5 w-5 text-primary" />
                            Messages
                        </CardTitle>
                        <CardDescription>
                            {messages.filter(m => !m.isRead).length} unread
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-auto">
                        <div className="divide-y">
                            {messages.length === 0 ? (
                                <div className="p-12 text-center text-sm text-muted-foreground">
                                    Inbox is empty.
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <button
                                        key={msg._id}
                                        onClick={() => {
                                            if (!msg.isRead) markAsRead({ messageId: msg._id });
                                        }}
                                        className={`w-full text-left flex flex-col items-start p-4 hover:bg-muted/50 transition-colors ${msg.isRead ? "opacity-75" : "bg-primary/5"
                                            }`}
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <span className="font-semibold text-sm flex items-center">
                                                {!msg.isRead && (
                                                    <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                                                )}
                                                {msg.sender}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatTime(msg.receivedAt)}
                                            </span>
                                        </div>
                                        <span className={`text-sm mt-1 ${!msg.isRead ? "font-medium" : ""}`}>
                                            {msg.subject}
                                        </span>
                                        <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {msg.content}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Email View Area */}
                <Card className="col-span-2 shadow-sm h-[600px] flex flex-col hidden lg:flex">
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <MailOpen className="h-12 w-12 mb-4 opacity-20" />
                        <p>Select a message to read</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
