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
}

export interface ChannelConfig {
    id: string;
    type: "telegram" | "whatsapp" | "discord" | "signal";
    label: string;
    description: string;
    status: ChannelStatus;
    variant?: "default" | "highlight";
}
