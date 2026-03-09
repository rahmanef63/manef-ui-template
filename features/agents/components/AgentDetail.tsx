"use client";

import { SectionCard, EmptyState } from "@/shared/block/ui/openclaw-blocks";
import { Bot } from "lucide-react";
import type { AgentItem, AgentTab } from "../types";

interface AgentOverviewProps {
    agent: AgentItem;
}

export function AgentOverview({ agent }: AgentOverviewProps) {
    return (
        <SectionCard title="Overview" description="Workspace paths and identity metadata.">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left text-xs text-muted-foreground">
                            <th className="py-2 pr-4 font-medium">Workspace</th>
                            <th className="py-2 pr-4 font-medium">Primary Model</th>
                            <th className="py-2 pr-4 font-medium">Identity Name</th>
                            <th className="py-2 pr-4 font-medium">Default</th>
                            <th className="py-2 font-medium">Identity Emoji</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="py-2 pr-4 text-xs font-mono">/home/rahman/.openclaw/workspace</td>
                            <td className="py-2 pr-4 text-xs">openai-codex/gpt-5.3-codex</td>
                            <td className="py-2 pr-4 text-xs">Manef</td>
                            <td className="py-2 pr-4 text-xs">{agent.isDefault ? "yes" : "no"}</td>
                            <td className="py-2 text-lg">{agent.emoji}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </SectionCard>
    );
}

interface AgentTabContentProps {
    activeTab: string;
    tabs: AgentTab[];
    agent: AgentItem;
}

export function AgentTabContent({ activeTab, tabs, agent }: AgentTabContentProps) {
    if (activeTab === "overview") {
        return <AgentOverview agent={agent} />;
    }
    return (
        <SectionCard title={tabs.find(t => t.id === activeTab)?.label || ""}>
            <EmptyState
                message={`${tabs.find(t => t.id === activeTab)?.label} configuration for ${agent.name}`}
                icon={Bot}
            />
        </SectionCard>
    );
}
