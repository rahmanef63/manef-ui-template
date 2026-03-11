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
