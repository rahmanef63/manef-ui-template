"use client";

import { handleFailure } from "@/shared/errors/handleFailure";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createWorkspaceRef } from "@/shared/convex/workspaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Hook instead of a component because we need to wrap
// the dialog around the popover, see Notes in
// https://ui.shadcn.com/docs/components/dialog.
export function useCreateWorkspaceDialog() {
  const createWorkspace = useMutation(createWorkspaceRef);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = useState(false);
  const handleShowNewWorkspaceDialog = (state: boolean) => {
    form.reset();
    setShowNewWorkspaceDialog(state);
  };

  const router = useRouter();

  const content = (
    <DialogContent>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleFailure(
            form.handleSubmit(async ({ name }) => {
              const workspaceSlug = await createWorkspace({ name });
              handleShowNewWorkspaceDialog(false);
              router.push(`/dashboard/${workspaceSlug}`);
            }),
            {
              feature: "workspaces",
              title: "Workspace baru belum berhasil dibuat",
            },
          )}
        >
          <DialogHeader>
            <DialogTitle>Create workspace</DialogTitle>
            <DialogDescription>
              Add a new workspace to manage products and customers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Inc."
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleShowNewWorkspaceDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
  return [showNewWorkspaceDialog, handleShowNewWorkspaceDialog, content] as const;
}

const FormSchema = z.object({
  name: z.string().min(3, "Workspace name must be at least 3 characters long."),
  // todo: Connect plan to zod schema or remove the selector
  // plan: z.enum(["free", "pro"]),
});
