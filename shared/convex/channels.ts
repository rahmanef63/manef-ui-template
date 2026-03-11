// @ts-nocheck
import { typedApi } from "@/shared/convex/api";

export const listChannelsRef = typedApi.features.channels.api.listChannels;
export const listChannelWorkspaceBindingsRef =
  typedApi.features.channels.api.listChannelWorkspaceBindings;
export const listIdentityWorkspaceBindingsRef =
  typedApi.features.channels.api.listIdentityWorkspaceBindings;
export const listChannelBindingPoliciesRef =
  typedApi.features.channels.api.listChannelBindingPolicies;
export const attachWorkspaceChannelRef =
  typedApi.features.channels.api.attachWorkspaceChannel;
export const detachWorkspaceChannelRef =
  typedApi.features.channels.api.detachWorkspaceChannel;
export const attachIdentityWorkspaceRef =
  typedApi.features.channels.api.attachIdentityWorkspace;
export const detachIdentityWorkspaceRef =
  typedApi.features.channels.api.detachIdentityWorkspace;
export const setChannelBindingPolicyRef =
  typedApi.features.channels.api.setChannelBindingPolicy;
