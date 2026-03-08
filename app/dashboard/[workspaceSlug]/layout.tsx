import { Suspense } from "react";
import { AppShellBlock } from "@/shared/block/ui/layout/AppShellBlock";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <AppShellBlock>{children}</AppShellBlock>
    </Suspense>
  );
}

