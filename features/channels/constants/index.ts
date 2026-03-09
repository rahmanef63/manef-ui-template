import type { ChannelConfig } from "../types";

export const CHANNEL_CONFIGS: ChannelConfig[] = [
    {
        id: "telegram",
        type: "telegram",
        label: "Telegram",
        description: "Bot status and channel configuration.",
        status: {
            configured: true,
            running: true,
            mode: "polling",
            lastStart: "18m ago",
            lastProbe: "in <1m",
        },
    },
    {
        id: "whatsapp",
        type: "whatsapp",
        label: "WhatsApp",
        description: "Link WhatsApp Web and monitor connection health.",
        variant: "highlight",
        status: {
            configured: true,
            running: true,
            linked: true,
            connected: true,
            lastConnect: "18m ago",
            lastMessage: "n/a",
            authAge: "8m",
        },
    },
];
