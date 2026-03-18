"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon, RefreshCw } from "lucide-react";

/* ─────────────────────────  PAGE HEADER  ───────────────────────── */
interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
    return (
        <div className={cn("space-y-1", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-sm text-muted-foreground mt-1">{description}</p>
                    )}
                </div>
                {children && <div className="flex items-center gap-2">{children}</div>}
            </div>
        </div>
    );
}

/* ───────────────────────  SECTION CARD  ─────────────────────── */
interface SectionCardProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
    variant?: "default" | "highlight";
}

export function SectionCard({ title, description, children, action, className, variant = "default" }: SectionCardProps) {
    return (
        <div className={cn(
            "rounded-xl border bg-card text-card-foreground shadow-sm",
            variant === "highlight" && "border-primary/20 bg-primary/[0.02]",
            className
        )}>
            {(title || action) && (
                <div className="flex items-center justify-between p-4 pb-0">
                    <div>
                        <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
                        {description && (
                            <p className="text-xs text-muted-foreground mt-1">{description}</p>
                        )}
                    </div>
                    {action}
                </div>
            )}
            <div className="p-4">{children}</div>
        </div>
    );
}

/* ──────────────────────  STAT CARD (Snapshot)  ──────────────────── */
interface StatCardProps {
    label: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    status?: "ok" | "warning" | "error" | "neutral";
    className?: string;
}

export function StatCard({ label, value, description, icon: Icon, status = "neutral", className }: StatCardProps) {
    const statusColors = {
        ok: "text-green-600 dark:text-green-400",
        warning: "text-amber-600 dark:text-amber-400",
        error: "text-red-600 dark:text-red-400",
        neutral: "text-foreground",
    };

    return (
        <div className={cn("rounded-xl border bg-card p-4 shadow-sm", className)}>
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </div>
            <p className={cn("mt-2 text-2xl font-bold", statusColors[status])}>{value}</p>
            {description && (
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
        </div>
    );
}

/* ──────────────────────  REFRESH BUTTON  ──────────────────── */
interface RefreshButtonProps {
    onClick?: () => void;
    loading?: boolean;
    className?: string;
}

export function RefreshButton({ onClick, loading, className }: RefreshButtonProps) {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            disabled={loading}
            className={cn("gap-1.5", className)}
        >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
        </Button>
    );
}

/* ──────────────────────  KEY-VALUE ROW  ──────────────────── */
interface KeyValueRowProps {
    label: string;
    value: React.ReactNode;
    className?: string;
}

export function KeyValueRow({ label, value, className }: KeyValueRowProps) {
    return (
        <div className={cn("flex items-center justify-between py-2.5 border-b last:border-0", className)}>
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-right">{value}</span>
        </div>
    );
}

/* ──────────────────────  STATUS BADGE  ──────────────────── */
interface StatusBadgeProps {
    status: "online" | "offline" | "warning" | "error" | "ok" | "enabled" | "disabled" | "default";
    label?: string;
    className?: string;
}

const statusConfig = {
    online: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
    ok: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
    enabled: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
    offline: { bg: "bg-gray-500/10", text: "text-gray-500", dot: "bg-gray-400" },
    disabled: { bg: "bg-gray-500/10", text: "text-gray-500", dot: "bg-gray-400" },
    warning: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
    error: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
    default: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
    const config = statusConfig[status];
    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
            config.bg, config.text, className
        )}>
            <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
            {label ?? status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

/* ──────────────────────  TAG / CHIP  ──────────────────── */
interface ChipProps {
    children: React.ReactNode;
    variant?: "default" | "active" | "muted";
    onClick?: () => void;
    className?: string;
}

export function Chip({ children, variant = "default", onClick, className }: ChipProps) {
    const variants = {
        default: "border bg-background hover:bg-muted",
        active: "bg-primary text-primary-foreground border-primary",
        muted: "bg-muted text-muted-foreground border-transparent",
    };

    const classes = cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        onClick ? "cursor-pointer" : "cursor-default",
        className
    );

    if (!onClick) {
        return <span className={classes}>{children}</span>;
    }

    return (
        <button type="button" onClick={onClick} className={classes}>
            {children}
        </button>
    );
}

/* ──────────────────────  CODE BLOCK  ──────────────────── */
interface CodeBlockProps {
    children: string;
    title?: string;
    className?: string;
}

export function CodeBlock({ children, title, className }: CodeBlockProps) {
    return (
        <div className={cn("rounded-lg overflow-hidden", className)}>
            {title && (
                <div className="bg-muted px-3 py-1.5 text-xs font-medium">{title}</div>
            )}
            <pre className="bg-black/90 dark:bg-black/50 p-4 overflow-auto max-h-80 text-xs font-mono text-gray-300 leading-relaxed">
                {children}
            </pre>
        </div>
    );
}

/* ──────────────────────  FORM FIELD  ──────────────────── */
interface FormFieldProps {
    label: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    tag?: string;
}

export function FormField({ label, description, children, className, tag }: FormFieldProps) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium">{label}</label>
                {tag && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">{tag}</span>}
            </div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {children}
        </div>
    );
}

/* ──────────────────────  EMPTY STATE  ──────────────────── */
interface EmptyStateProps {
    message?: string;
    icon?: LucideIcon;
    children?: React.ReactNode;
    className?: string;
}

export function EmptyState({ message = "No data found.", icon: Icon, children, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
            {Icon && <Icon className="h-10 w-10 text-muted-foreground/40 mb-3" />}
            <p className="text-sm text-muted-foreground">{message}</p>
            {children}
        </div>
    );
}

/* ──────────────────────  MASTER-DETAIL LAYOUT  ──────────────────── */
interface MasterDetailLayoutProps {
    sidebar: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function MasterDetailLayout({ sidebar, children, className }: MasterDetailLayoutProps) {
    return (
        <div className={cn("grid gap-4 lg:grid-cols-[320px_1fr]", className)}>
            <div className="rounded-xl border bg-card overflow-auto max-h-[calc(100vh-200px)]">
                {sidebar}
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

/* ──────────────────────  LIST ITEM (Master)  ──────────────────── */
interface ListItemProps {
    title: string;
    subtitle?: string;
    avatar?: React.ReactNode;
    badge?: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
}

export function ListItem({ title, subtitle, avatar, badge, isActive, onClick, className }: ListItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/50",
                isActive && "bg-muted border-l-2 border-l-primary",
                className
            )}
        >
            {avatar}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{title}</p>
                {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
            </div>
            {badge}
        </button>
    );
}

/* ──────────────────────  PILL TABS (Agent-style)  ──────────────────── */
interface PillTabsProps {
    tabs: { id: string; label: string }[];
    activeTab: string;
    onTabChange: (id: string) => void;
    className?: string;
}

export function PillTabs({ tabs, activeTab, onTabChange, className }: PillTabsProps) {
    return (
        <div className={cn("flex gap-1 rounded-lg bg-muted/50 p-1", className)}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                        activeTab === tab.id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

/* ──────────────────────  FILTER BAR  ──────────────────── */
interface FilterBarProps {
    children: React.ReactNode;
    className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
    return (
        <div className={cn(
            "flex flex-wrap items-center gap-2 rounded-xl border bg-card p-3",
            className
        )}>
            {children}
        </div>
    );
}
