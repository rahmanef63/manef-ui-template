import { Skeleton } from "@/components/ui/skeleton";
import { SectionCards } from "@/components/layout/sections/section-cards";

export default function Loading() {
    return (
        <>
            <SectionCards />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-col gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-8 w-[250px]" />
                        </div>
                        <Skeleton className="h-[200px] w-full" />
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow h-[300px] p-6">
                    <Skeleton className="h-full w-full" />
                </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-[200px]" />
                        <Skeleton className="h-8 w-[100px]" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </>
    );
}
