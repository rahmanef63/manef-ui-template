"use client";
/* eslint-disable @typescript-eslint/consistent-type-imports */

import { Suspense } from "react";
import { z } from "zod";
import { MessageBoard } from "@/features/messages/components/MessageBoard";
import { useCurrentWorkspace } from "@/features/workspaces/hooks/useWorkspaceState";
import { SectionCards } from "@/components/layout/sections/section-cards";
import { ChartAreaInteractive } from "@/components/layout/chart-area-interactive";
import { PageTabsBlock } from "@/shared/block/ui/layout/PageTabsBlock";
import { DataTable, schema as dataTableSchema } from "@/components/layout/data-table";
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

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
    return (
      <div className="flex flex-col gap-6">
        <PageTabsBlock />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTabsBlock />

      <ErrorBoundary>
        <Suspense fallback={<SectionCardsSkeleton />}>
          <SectionCards />
        </Suspense>
      </ErrorBoundary>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ErrorBoundary>
          <Suspense fallback={<ChartCardSkeleton />}>
            <ChartAreaInteractive />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<MessageCardSkeleton />}>
            <MessageBoard />
          </Suspense>
        </ErrorBoundary>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<TableSkeleton />}>
          <DataTable data={sampleData} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <SectionCardsSkeleton />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ChartCardSkeleton />
        <MessageCardSkeleton />
      </div>
      <TableSkeleton />
    </>
  );
}

function SectionCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="rounded-xl border bg-card p-4 shadow">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-8 w-16" />
          <Skeleton className="mt-4 h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

function ChartCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 flex flex-col gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-8 w-[250px]" />
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  );
}

function MessageCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow h-[300px] p-6">
      <Skeleton className="h-full w-full" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
