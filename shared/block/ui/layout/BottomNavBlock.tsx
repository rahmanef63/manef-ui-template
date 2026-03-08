"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { normalizeBottomNav, resolveIcon } from "@/shared/config";
import type { BottomNavItem } from "@/shared/config";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface BottomNavBlockProps {
    portalId?: string;
    className?: string;
}

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return null;
        }
        return this.props.children;
    }
}

export function BottomNavBlock(props: BottomNavBlockProps) {
    return (
        <ErrorBoundary>
            <BottomNavContent {...props} />
        </ErrorBoundary>
    );
}

function BottomNavContent({
    portalId = "default",
    className,
}: BottomNavBlockProps) {
    const pathname = usePathname();
    const params = useParams();
    const { toggleSidebar } = useSidebar();
    const [mounted, setMounted] = React.useState(false);

    const teamSlug = typeof params?.teamSlug === 'string' ? params.teamSlug : undefined;

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const items = React.useMemo(() => {
        return normalizeBottomNav(portalId, teamSlug);
    }, [portalId, teamSlug]);

    if (!mounted) {
        return <BottomNavSkeleton className={className} />;
    }

    const isActive = (item: BottomNavItem) => {
        if (!item.href) return false;
        return pathname.startsWith(item.href);
    };

    const handleClick = (item: BottomNavItem) => {
        if (item.action === "toggleSidebar") {
            toggleSidebar();
        }
    };

    return (
        <nav
            className={cn(
                "fixed bottom-0 left-0 right-0 z-[50] border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden",
                className
            )}
            role="navigation"
            aria-label="Mobile navigation"
        >
            <div className="flex h-16 items-center justify-around px-2">
                {items.map((item) => {
                    const Icon = resolveIcon(item.icon as any);
                    const active = isActive(item);

                    if (item.action) {
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleClick(item)}
                                className={cn(
                                    "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors",
                                    "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {Icon && <Icon className="h-5 w-5" />}
                                <span>{item.label}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.id}
                            href={item.href || "#"}
                            className={cn(
                                "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors",
                                active
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {Icon && (
                                <Icon
                                    className={cn("h-5 w-5", active && "text-primary")}
                                />
                            )}
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

function BottomNavSkeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-[50] border-t bg-background/95 md:hidden",
                className
            )}
        >
            <div className="flex h-16 items-center justify-around px-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
                    >
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-3 w-12 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
