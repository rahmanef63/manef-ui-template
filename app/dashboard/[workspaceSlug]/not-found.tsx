import { WorkspaceErrorState } from "@/features/workspaces/components/WorkspaceErrorState";

export default function NotFound() {
  return <WorkspaceErrorState code="WORKSPACE_NOT_FOUND" />;
}
