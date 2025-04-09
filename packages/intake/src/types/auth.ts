import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            accessToken?: string;
        } & DefaultSession["user"];
    }
}

export interface ConnectorConfig {
    id: string;
    name: string;
    type: string;
    enabled: boolean;
    config: Record<string, any>;
}

export interface ConnectorAuth {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
} 