// @ts-nocheck
import { typedApi } from "@/shared/convex/api";

export const getAuthProfileByEmailRef = typedApi.features.auth.api.getAuthProfileByEmail;
export const getAuthProfileRef = typedApi.features.auth.api.getAuthProfile;
export const authorizePasswordLoginRef = typedApi.features.auth.api.authorizePasswordLogin;
export const submitRegistrationRequestRef = typedApi.features.auth.api.submitRegistrationRequest;
export const submitPasswordResetRequestRef = typedApi.features.auth.api.submitPasswordResetRequest;
export const listRegistrationRequestsRef = typedApi.features.auth.api.listRegistrationRequests;
export const listPasswordResetRequestsRef = typedApi.features.auth.api.listPasswordResetRequests;
export const approveRegistrationRequestRef = typedApi.features.auth.api.approveRegistrationRequest;
export const approvePasswordResetRequestRef = typedApi.features.auth.api.approvePasswordResetRequest;
export const denyRegistrationRequestRef = typedApi.features.auth.api.denyRegistrationRequest;
export const denyPasswordResetRequestRef = typedApi.features.auth.api.denyPasswordResetRequest;
export const changePasswordRef = typedApi.features.auth.api.changePassword;
export const listPendingDevicesRef = typedApi.features.auth.api.listPendingDevices;
export const getDeviceStatusRef = typedApi.features.auth.api.getDeviceStatus;
export const requestDeviceApprovalRef = typedApi.features.auth.api.requestDeviceApproval;
export const approveDeviceRef = typedApi.features.auth.api.approveDevice;
export const revokeDeviceRef = typedApi.features.auth.api.revokeDevice;
export const revokeSessionRef = typedApi.features.auth.api.revokeSession;
export const revokeAllUserSessionsRef = typedApi.features.auth.api.revokeAllUserSessions;
export const consumeOpenClawNonceRef = typedApi.features.auth.api.consumeOpenClawNonce;
