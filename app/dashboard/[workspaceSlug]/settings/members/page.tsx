"use client";

import { useCurrentWorkspace } from "@/features/workspaces/hooks/useWorkspaceState";
import { SettingsMenuButton } from "@/features/settings/components/SettingsMenuButton";
import { AddMember } from "@/features/members/components/AddMember";
import { MembersList } from "@/features/members/components/MemberList";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MembersPage() {
  const workspace = useCurrentWorkspace();
  const router = useRouter();
  useEffect(() => {
    if (workspace?.isPersonal === true) {
      router.replace(`/dashboard/${workspace.slug}/settings`);
    }
  }, [workspace, router]);
  return (
    <>
      <div className="flex items-center mt-8">
        <SettingsMenuButton />
        <h1 className="text-4xl font-extrabold">Members</h1>
      </div>

      <AddMember />
      <MembersList />
    </>
  );
}
