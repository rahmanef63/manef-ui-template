import { handleFailure } from "@/shared/errors/handleFailure";
import { useCurrentTeam, useViewerPermissions } from "@/features/teams/hooks/useTeamState";
import { SelectRole } from "@/features/members/components/SelectRole";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import type { Id } from "@/shared/types/convex";
import type { Permission } from "@/shared/types/permissions";
import { listRolesRef } from "@/shared/convex/roles";
import { sendMemberInviteRef } from "@/shared/convex/members";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { zid } from "convex-helpers/server/zod";
import { useAction, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function AddMember() {
  const permissions = useViewerPermissions();
  const availableRoles = useQuery(listRolesRef);
  const defaultRole = availableRoles?.filter((role) => role.isDefault)[0]._id;
  if (permissions == null || availableRoles == null || defaultRole == null) {
    return null;
  }
  return <AddMemberForm defaultRole={defaultRole} permissions={permissions} />;
}

function AddMemberForm({
  defaultRole,
  permissions,
}: {
  defaultRole: Id<"roles">;
  permissions: Set<Permission>;
}) {
  const team = useCurrentTeam();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: defaultRole,
    },
  });
  const sendInvite = useAction(sendMemberInviteRef);
  if (team == null) {
    return null;
  }
  const hasManagePermission = permissions.has("Manage Members");
  return (
    <Card
      aria-disabled={!hasManagePermission}
      className={cn(!hasManagePermission && "opacity-60")}
    >
      <CardHeader>
        <CardTitle>Add member</CardTitle>
        <CardDescription>Add a member to your team.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={handleFailure(
              form.handleSubmit(async ({ email, role }) => {
                await sendInvite({ email, roleId: role, teamId: team._id });
                form.reset();
                toast({ title: "Member invite created." });
              })
            )}
            className="flex flex-col sm:flex-row gap-6 sm:items-end hide-lastpass-icon"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!hasManagePermission}
                      placeholder="jane@doe.com"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <SelectRole
                      disabled={!hasManagePermission}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!hasManagePermission} type="submit">
              <PlusIcon className="mr-2 h-4 w-4" /> Add
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const formSchema = z.object({
  email: z.string().email(),
  role: zid("roles"),
});
