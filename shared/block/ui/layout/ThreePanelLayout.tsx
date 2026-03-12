"use client";

import * as React from "react";

interface PanelProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

function Panel({ title, description, children }: PanelProps) {
    return (
        <section className="rounded-2xl border bg-card/80 backdrop-blur-sm">
            <header className="border-b px-5 py-4">
                <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
                {description ? (
                    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                ) : null}
            </header>
            <div className="p-5">{children}</div>
        </section>
    );
}

interface ThreePanelLayoutProps {
    left: PanelProps;
    center: PanelProps;
    right: PanelProps;
}

export function ThreePanelLayout({ left, center, right }: ThreePanelLayoutProps) {
    return (
        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1.2fr)_360px]">
            <Panel {...left} />
            <Panel {...center} />
            <Panel {...right} />
        </div>
    );
}
