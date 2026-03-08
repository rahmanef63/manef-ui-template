"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-full min-h-[500px] flex-col items-center justify-center gap-4 text-center p-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
                <p className="text-muted-foreground">
                    {error.message || "An unexpected error occurred while loading the dashboard."}
                </p>
            </div>
            <Button onClick={() => reset()} variant="default">
                Try again
            </Button>
        </div>
    );
}
