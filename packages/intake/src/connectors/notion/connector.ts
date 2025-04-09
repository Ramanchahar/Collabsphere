import { ConnectorAuth } from "../../types/auth";
import { NotionAuth } from "./auth";
import { NotionClient } from "./client";
import { NotionContentExtractor, ExtractedContent } from "./content-extractor";
import { NotionChunker, ContentChunk } from "./chunker";

export interface NotionConnectorConfig {
    maxChunkSize?: number;
    overlapSize?: number;
    includeDatabases?: boolean;
    includePages?: boolean;
    databaseIds?: string[];
    pageIds?: string[];
}

export class NotionConnector {
    private auth: NotionAuth;
    private client: NotionClient;
    private contentExtractor: NotionContentExtractor;
    private chunker: NotionChunker;
    private config: NotionConnectorConfig;

    constructor(auth: ConnectorAuth, config: NotionConnectorConfig = {}) {
        this.auth = new NotionAuth(auth);
        this.client = new NotionClient(auth);
        this.contentExtractor = new NotionContentExtractor(auth);
        this.chunker = new NotionChunker(
            config.maxChunkSize,
            config.overlapSize
        );
        this.config = {
            includeDatabases: true,
            includePages: true,
            ...config,
        };
    }

    /**
     * Validate the connector's authentication
     */
    async validate(): Promise<boolean> {
        return this.auth.validateToken();
    }

    /**
     * Fetch content from Notion
     */
    async fetchContent(): Promise<ContentChunk[]> {
        // Validate authentication
        const isValid = await this.validate();
        if (!isValid) {
            throw new Error("Invalid Notion authentication");
        }

        const extractedContents: ExtractedContent[] = [];

        // Fetch content from specified databases
        if (this.config.includeDatabases && this.config.databaseIds?.length) {
            for (const databaseId of this.config.databaseIds) {
                const databaseContents = await this.contentExtractor.extractDatabaseContent(databaseId);
                extractedContents.push(...databaseContents);
            }
        }

        // Fetch content from specified pages
        if (this.config.includePages && this.config.pageIds?.length) {
            for (const pageId of this.config.pageIds) {
                const pageContent = await this.contentExtractor.extractPageContent(pageId);
                extractedContents.push(pageContent);
            }
        }

        // If no specific IDs are provided, search for content
        if (
            (!this.config.databaseIds?.length && !this.config.pageIds?.length) ||
            (this.config.includeDatabases && this.config.includePages)
        ) {
            const searchResults = await this.client.search("");

            // Process search results
            for (const result of searchResults.results) {
                if (result.object === "page" && this.config.includePages) {
                    const pageContent = await this.contentExtractor.extractPageContent(result.id);
                    extractedContents.push(pageContent);
                } else if (result.object === "database" && this.config.includeDatabases) {
                    const databaseContents = await this.contentExtractor.extractDatabaseContent(result.id);
                    extractedContents.push(...databaseContents);
                }
            }
        }

        // Chunk the extracted content
        return this.chunker.chunkMultipleContents(extractedContents);
    }

    /**
     * Get a list of available databases
     */
    async listDatabases(): Promise<any[]> {
        const searchResults = await this.client.search("", {
            property: "object",
            value: "database",
        });

        return searchResults.results;
    }

    /**
     * Get a list of available pages
     */
    async listPages(): Promise<any[]> {
        const searchResults = await this.client.search("", {
            property: "object",
            value: "page",
        });

        return searchResults.results;
    }
} 