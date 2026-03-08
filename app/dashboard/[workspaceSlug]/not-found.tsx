import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex h-full min-h-[500px] flex-col items-center justify-center gap-4 text-center p-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <FileQuestion className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Workspace Not Found</h2>
                <p className="text-muted-foreground">
                    The workspace dashboard you are looking for does not exist or you do not have access.
                </p>
            </div>
            <Button asChild variant="outline">
                <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
        </div>
    );
}
