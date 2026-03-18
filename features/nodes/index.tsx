// @ts-nocheck
"use client";

import { PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { ExecApprovals, ExecNodeBinding } from "./components/ExecApprovals";
import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";

export default function NodesPage() {
    const { selectedScope } = useOpenClawNavigator();
    const scopeAgentIds = selectedScope?.agentIds ?? [];
    const defaultAgentId = scopeAgentIds[0] ?? "*";

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Nodes"
                description="Paired devices, capabilities, and command exposure."
            />

            <ExecApprovals
                agentIds={scopeAgentIds}
                defaultAgentId={defaultAgentId}
            />

            <ExecNodeBinding agentIds={scopeAgentIds} />
        </div>
    );
}
