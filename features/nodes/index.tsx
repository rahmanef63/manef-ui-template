// @ts-nocheck
"use client";

import { useState } from "react";
import { PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { ExecApprovals, ExecNodeBinding } from "./components/ExecApprovals";

export default function NodesPage() {
    const [activeChip, setActiveChip] = useState("Defaults");

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Nodes"
                description="Paired devices, capabilities, and command exposure."
            />

            <ExecApprovals activeChip={activeChip} onChipChange={setActiveChip} />

            <ExecNodeBinding />
        </div>
    );
}
