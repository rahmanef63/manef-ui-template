// @ts-nocheck
"use client";

import { useState } from "react";
import { PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { Snapshots, ManualRPC } from "./components/DebugPanels";

export default function DebugPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [method, setMethod] = useState("system-presence");
  const [params, setParams] = useState("{}");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCall = () => {
    console.log("Calling", method, "with params", params);
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <PageHeader
        title="Debug"
        description="Gateway snapshots, events, and manual RPC calls."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Snapshots isRefreshing={isRefreshing} onRefresh={handleRefresh} />
        </div>

        <div className="space-y-4">
          <ManualRPC
            method={method}
            onMethodChange={setMethod}
            params={params}
            onParamsChange={setParams}
            onCall={handleCall}
          />
        </div>
      </div>
    </div>
  );
}
