import { Client } from "@notionhq/client";
import { ConnectorAuth } from "../../types/auth";

export class NotionAuth {
    private client: Client;

    constructor(auth: ConnectorAuth) {
        this.client = new Client({
            auth: auth.accessToken,
        });
    }

    async validateToken(): Promise<boolean> {
        try {
            await this.client.users.me();
            return true;
        } catch (error) {
            return false;
        }
    }

    async refreshToken(): Promise<ConnectorAuth> {
        // Notion tokens don't expire, so we just return the current auth
        return {
            accessToken: this.client.auth,
        };
    }
} 