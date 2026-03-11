"use client";

import { useAppAction, useAppMutation, useAppQuery } from "@/lib/convex/client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CalendarTasks() {
    const events: any[] = useAppQuery("features/calendar/api:getEvents") || [];
    const createEvent = useAppMutation("features/calendar/api:createEvent");
    const syncEvents = useAppAction("features/calendar/api:syncEvents");

    const formatTime = (ts: number) => {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => syncEvents()}>
                        Sync Events
                    </Button>
                    <Button onClick={() => createEvent({
                        title: "New Team Meeting",
                        description: "Weekly sync",
                        startTime: Date.now(),
                        endTime: Date.now() + 3600000,
                        isAllDay: false
                    })}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Event
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search events..."
                        className="pl-8"
                    />
                </div>
                <div className="flex items-center space-x-1 border rounded-md p-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium px-2">March 2026</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <Button variant="secondary">Today</Button>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="pb-3 border-b">
                    <CardTitle className="flex items-center">
                        <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                        Upcoming Events
                    </CardTitle>
                    <CardDescription>
                        {events.length} event(s) scheduled for this period.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {events.length === 0 ? (
                            <div className="p-12 text-center text-sm text-muted-foreground">
                                No events found. Create one or sync your external calendar to gather your schedule.
                            </div>
                        ) : (
                            events.map((event) => (
                                <div
                                    key={event._id}
                                    className="flex items-center justify-between p-4 px-6 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                                            <span className="text-xs font-semibold leading-none">MAR</span>
                                            <span className="text-lg font-bold leading-none mt-1">
                                                {new Date(event.startTime).getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-base leading-none">
                                                {event.title}
                                            </p>
                                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                                <Clock className="mr-1.5 h-3.5 w-3.5" />
                                                {event.isAllDay ? "All Day" : `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" size="sm">
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
