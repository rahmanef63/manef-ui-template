"use client";

import { useCurrentWorkspace } from "@/features/workspaces/hooks/useWorkspaceState";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SettingsMenu() {
  const workspace = useCurrentWorkspace();
  return (
    <div className="flex flex-col gap-2 items-stretch">
      <NavLink relativeHref="">General</NavLink>
      {workspace?.isPersonal ? null : (
        <NavLink relativeHref="/members">Members</NavLink>
      )}
    </div>
  );
}

function NavLink({
  relativeHref,
  children,
}: {
  relativeHref: string;
  children: ReactNode;
}) {
  const currentPath = usePathname();
  const { workspaceSlug } = useParams();
  const linkPath = `/dashboard/${workspaceSlug as string}/settings${relativeHref}`;
  const active =
    relativeHref === ""
      ? currentPath === linkPath
      : currentPath.startsWith(linkPath);
  return (
    <Link
      href={linkPath}
      className={cn(
        "text-sm rounded-md bg-background px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground",
        active ? "text-foreground" : "text-foreground/60"
      )}
    >
      {children}
    </Link>
  );
}
