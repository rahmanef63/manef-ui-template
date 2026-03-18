export interface ChannelStatus {
    configured: boolean;
    running: boolean;
    linked?: boolean;
    connected?: boolean;
    mode?: string;
    lastStart?: string;
    lastProbe?: string;
    lastConnect?: string;
    lastMessage?: string;
    authAge?: string;
    lastError?: string;
    bindingCount?: number;
    allowListCount?: number;
    workspaceBindings?: Array<{
        workspaceId: string;
        workspaceName: string;
        slug: string;
        access?: string;
        agentId?: string;
        source?: string;
    }>;
    identityBindings?: Array<{
        workspaceId: string;
        workspaceName: string;
        channel: string;
        externalUserId: string;
        normalizedPhone?: string;
        access?: string;
        source?: string;
    }>;
    bindingPolicy?: {
        mode: string;
        source?: string;
    };
}

export interface ChannelConfig {
    id: string;
    channelId: string;
    type: string;
    label: string;
    description: string;
    status: ChannelStatus;
    variant?: "default" | "highlight";
}
