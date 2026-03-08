"use client";
/* eslint-disable @typescript-eslint/consistent-type-imports */

import { MessageBoard } from "@/features/messages/components/MessageBoard";
import { useCurrentWorkspace } from "@/features/workspaces/hooks/useWorkspaceState";
import { SectionCards } from "@/components/layout/sections/section-cards";
import { ChartAreaInteractive } from "@/components/layout/chart-area-interactive";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { DataTable, schema as dataTableSchema } from "@/components/layout/data-table";
import { z } from "zod";

const sampleData: z.infer<typeof dataTableSchema>[] = [
  {
    id: 1,
    header: "Project Alpha",
    type: "Technical Approach",
    status: "In Progress",
    target: "100",
    limit: "200",
    reviewer: "Eddie Lake",
  },
  {
    id: 2,
    header: "Q3 Financials",
    type: "Executive Summary",
    status: "Done",
    target: "50",
    limit: "100",
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: 3,
    header: "New Marketing Strategy",
    type: "Narrative",
    status: "Not Started",
    target: "75",
    limit: "150",
    reviewer: "Assign reviewer",
  },
];

export default function Home() {
  const workspace = useCurrentWorkspace();
  if (workspace == null) {
    return <DashboardSkeleton />;
  }
  return (
    <>
      <SectionCards />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ChartAreaInteractive />
        <MessageBoard />
      </div>
      <DataTable data={sampleData} />
    </>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <SectionCards />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-col gap-4">
            <div className="space-y-2">
              <div className="h-4 w-[150px] animate-pulse rounded bg-muted" />
              <div className="h-8 w-[250px] animate-pulse rounded bg-muted" />
            </div>
            <div className="h-[200px] w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow h-[300px] p-6">
          <div className="h-full w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-[200px] animate-pulse rounded bg-muted" />
            <div className="h-8 w-[100px] animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </>
  );
}
