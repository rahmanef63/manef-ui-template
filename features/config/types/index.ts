import { LucideIcon } from "lucide-react";

export interface ConfigCategory {
    id: string;
    label: string;
    icon: LucideIcon;
}

export interface ConfigSetting {
    key: string;
    desc: string;
    tag: string;
    value: string;
    type?: "toggle";
    options?: string[];
}
