import { Suspense } from "react";
import { AppShellBlock } from "@/shared/block/ui/layout/AppShellBlock";
import Loading from "./loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <AppShellBlock>{children}</AppShellBlock>
    </Suspense>
  );
}

