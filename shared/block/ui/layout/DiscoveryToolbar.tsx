"use client";

import { Input } from "@/components/ui/input";

type SelectOption = {
    value: string;
    label: string;
};

interface DiscoveryToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filters?: Array<{
        label: string;
        value: string;
        onChange: (value: string) => void;
        options: SelectOption[];
    }>;
    summary?: string;
    className?: string;
}

export function DiscoveryToolbar({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search…",
    filters = [],
    summary,
    className,
}: DiscoveryToolbarProps) {
    return (
        <div className={["rounded-xl border bg-card/70 p-4", className].filter(Boolean).join(" ")}>
            <div className="grid gap-3 lg:grid-cols-[2fr_repeat(var(--filter-count),minmax(0,1fr))]">
                <div className="space-y-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Search
                    </div>
                    <Input
                        value={searchValue}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder={searchPlaceholder}
                        className="bg-muted/40"
                    />
                </div>
                {filters.map((filter) => (
                    <div key={filter.label} className="space-y-1">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {filter.label}
                        </div>
                        <select
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                            value={filter.value}
                            onChange={(event) => filter.onChange(event.target.value)}
                        >
                            {filter.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
            {summary ? (
                <div className="mt-3 text-xs text-muted-foreground">{summary}</div>
            ) : null}
        </div>
    );
}
