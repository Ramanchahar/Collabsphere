import { NotionClient } from "./client";
import { ConnectorAuth } from "../../types/auth";

export interface ExtractedContent {
    id: string;
    title: string;
    content: string;
    type: "page" | "database";
    url: string;
    lastEditedTime: string;
    properties?: Record<string, any>;
    metadata: {
        source: {
            type: string;
            id: string;
            url: string;
            lastModified: string;
        };
        created: string;
        modified: string;
        properties: Record<string, any>;
    };
}

export class NotionContentExtractor {
    private client: NotionClient;

    constructor(auth: ConnectorAuth) {
        this.client = new NotionClient(auth);
    }

    /**
     * Extract content from a page
     */
    async extractPageContent(pageId: string): Promise<ExtractedContent> {
        const page = await this.client.getPage(pageId);
        const blocks = await this.client.getPageContent(pageId);

        // Extract title from page properties
        const title = this.extractTitleFromPage(page);

        // Convert blocks to plain text
        const content = this.convertBlocksToText(blocks);

        // Create URL from page ID
        const url = `https://notion.so/${pageId.replace(/-/g, "")}`;

        return {
            id: page.id,
            title,
            content,
            type: "page",
            url,
            lastEditedTime: page.last_edited_time,
            metadata: {
                source: {
                    type: "notion",
                    id: page.id,
                    url,
                    lastModified: page.last_edited_time,
                },
                created: page.created_time,
                modified: page.last_edited_time,
                properties: page.properties || {},
            },
        };
    }

    /**
     * Extract content from a database
     */
    async extractDatabaseContent(databaseId: string): Promise<ExtractedContent[]> {
        const database = await this.client.getDatabase(databaseId);
        const pages = await this.client.getAllDatabasePages(databaseId);

        // Create URL from database ID
        const url = `https://notion.so/${databaseId.replace(/-/g, "")}`;

        // Extract title from database properties
        const title = this.extractTitleFromDatabase(database);

        // Process each page in the database
        const results: ExtractedContent[] = [];

        for (const page of pages) {
            const pageContent = await this.extractPageContent(page.id);

            // Add database properties to the page content
            results.push({
                ...pageContent,
                properties: page.properties || {},
            });
        }

        return results;
    }

    /**
     * Extract title from a page
     */
    private extractTitleFromPage(page: any): string {
        // Notion pages have a title property that can be in different formats
        const titleProperty = page.properties?.title || page.properties?.Name;

        if (!titleProperty) {
            return "Untitled";
        }

        if (titleProperty.type === "title") {
            return titleProperty.title.map((t: any) => t.plain_text).join("");
        }

        return "Untitled";
    }

    /**
     * Extract title from a database
     */
    private extractTitleFromDatabase(database: any): string {
        // Similar to pages, but databases have a title property
        const titleProperty = database.title;

        if (!titleProperty) {
            return "Untitled Database";
        }

        return titleProperty.map((t: any) => t.plain_text).join("");
    }

    /**
     * Convert Notion blocks to plain text
     */
    private convertBlocksToText(blocks: any[]): string {
        return blocks
            .map((block) => {
                switch (block.type) {
                    case "paragraph":
                        return block.paragraph.rich_text.map((t: any) => t.plain_text).join("");
                    case "heading_1":
                        return block.heading_1.rich_text.map((t: any) => t.plain_text).join("");
                    case "heading_2":
                        return block.heading_2.rich_text.map((t: any) => t.plain_text).join("");
                    case "heading_3":
                        return block.heading_3.rich_text.map((t: any) => t.plain_text).join("");
                    case "bulleted_list_item":
                        return block.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join("");
                    case "numbered_list_item":
                        return block.numbered_list_item.rich_text.map((t: any) => t.plain_text).join("");
                    case "to_do":
                        return block.to_do.rich_text.map((t: any) => t.plain_text).join("");
                    case "toggle":
                        return block.toggle.rich_text.map((t: any) => t.plain_text).join("");
                    case "code":
                        return block.code.rich_text.map((t: any) => t.plain_text).join("");
                    case "quote":
                        return block.quote.rich_text.map((t: any) => t.plain_text).join("");
                    case "callout":
                        return block.callout.rich_text.map((t: any) => t.plain_text).join("");
                    default:
                        return "";
                }
            })
            .filter(Boolean)
            .join("\n\n");
    }
} 