// @ts-nocheck
"use client";

import { useState } from "react";
import { PageHeader, MasterDetailLayout } from "@/shared/block/ui/openclaw-blocks";
import { ConfigSidebar } from "./components/ConfigSidebar";
import { ConfigPanel } from "./components/ConfigPanel";

export default function ConfigPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [viewMode, setViewMode] = useState("form");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Config"
                description="Edit ~/.openclaw/openclaw.json safely."
            />

            <MasterDetailLayout
                sidebar={
                    <ConfigSidebar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                    />
                }
            >
                <ConfigPanel />
            </MasterDetailLayout>
        </div>
    );
}
