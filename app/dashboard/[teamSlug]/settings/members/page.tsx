"use client";

import { useCurrentTeam } from "@/features/teams/hooks/useTeamState";
import { SettingsMenuButton } from "@/features/settings/components/SettingsMenuButton";
import { AddMember } from "@/features/members/components/AddMember";
import { MembersList } from "@/features/members/components/MemberList";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MembersPage() {
  const team = useCurrentTeam();
  const router = useRouter();
  useEffect(() => {
    if (team?.isPersonal === true) {
      router.replace(`/dashboard/${team.slug}/settings`);
    }
  }, [team, router]);
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
