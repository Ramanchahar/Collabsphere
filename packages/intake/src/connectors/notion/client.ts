import { Client } from "@notionhq/client";
import { ConnectorAuth } from "../../types/auth";

export class NotionClient {
    private client: Client;

    constructor(auth: ConnectorAuth) {
        this.client = new Client({
            auth: auth.accessToken,
        });
    }

    /**
     * Fetch a page by ID
     */
    async getPage(pageId: string) {
        return this.client.pages.retrieve({ page_id: pageId });
    }

    /**
     * Fetch a database by ID
     */
    async getDatabase(databaseId: string) {
        return this.client.databases.retrieve({ database_id: databaseId });
    }

    /**
     * Query a database
     */
    async queryDatabase(databaseId: string, filter?: any, sorts?: any[], pageSize: number = 100) {
        return this.client.databases.query({
            database_id: databaseId,
            filter,
            sorts,
            page_size: pageSize,
        });
    }

    /**
     * Get all pages in a database
     */
    async getAllDatabasePages(databaseId: string, filter?: any, sorts?: any[]) {
        let results = [];
        let hasMore = true;
        let startCursor = undefined;

        while (hasMore) {
            const response = await this.client.databases.query({
                database_id: databaseId,
                filter,
                sorts,
                start_cursor: startCursor,
            });

            results = [...results, ...response.results];
            hasMore = response.has_more;
            startCursor = response.next_cursor;
        }

        return results;
    }

    /**
     * Get page content (blocks)
     */
    async getPageContent(pageId: string) {
        let blocks = [];
        let hasMore = true;
        let startCursor = undefined;

        while (hasMore) {
            const response = await this.client.blocks.children.list({
                block_id: pageId,
                start_cursor: startCursor,
            });

            blocks = [...blocks, ...response.results];
            hasMore = response.has_more;
            startCursor = response.next_cursor;
        }

        return blocks;
    }

    /**
     * Search for pages and databases
     */
    async search(query: string, filter?: any, sorts?: any[], pageSize: number = 100) {
        return this.client.search({
            query,
            filter,
            sort: sorts,
            page_size: pageSize,
        });
    }
} 