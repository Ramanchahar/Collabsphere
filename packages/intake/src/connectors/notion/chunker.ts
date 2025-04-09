import { ExtractedContent } from "./content-extractor";

export interface ContentChunk {
    id: string;
    content: string;
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
        chunkIndex: number;
        totalChunks: number;
        title: string;
    };
}

export class NotionChunker {
    private maxChunkSize: number;
    private overlapSize: number;

    constructor(maxChunkSize: number = 1000, overlapSize: number = 100) {
        this.maxChunkSize = maxChunkSize;
        this.overlapSize = overlapSize;
    }

    /**
     * Chunk content from a Notion page or database
     */
    chunkContent(content: ExtractedContent): ContentChunk[] {
        // If content is short enough, return it as a single chunk
        if (content.content.length <= this.maxChunkSize) {
            return [
                {
                    id: `${content.id}-0`,
                    content: content.content,
                    metadata: {
                        ...content.metadata,
                        chunkIndex: 0,
                        totalChunks: 1,
                        title: content.title,
                    },
                },
            ];
        }

        // Split content into chunks
        const chunks: ContentChunk[] = [];
        let startIndex = 0;
        let chunkIndex = 0;

        while (startIndex < content.content.length) {
            // Calculate end index for this chunk
            let endIndex = startIndex + this.maxChunkSize;

            // If we're not at the end, try to find a good breaking point
            if (endIndex < content.content.length) {
                // Try to find a paragraph break
                const nextParagraph = content.content.indexOf("\n\n", endIndex - 100);
                if (nextParagraph !== -1 && nextParagraph < endIndex + 100) {
                    endIndex = nextParagraph + 2; // Include the paragraph break
                } else {
                    // Try to find a sentence break
                    const nextSentence = content.content.indexOf(". ", endIndex - 50);
                    if (nextSentence !== -1 && nextSentence < endIndex + 50) {
                        endIndex = nextSentence + 2; // Include the sentence break
                    }
                }
            }

            // Extract the chunk
            const chunkContent = content.content.substring(startIndex, endIndex);

            // Create the chunk
            chunks.push({
                id: `${content.id}-${chunkIndex}`,
                content: chunkContent,
                metadata: {
                    ...content.metadata,
                    chunkIndex,
                    totalChunks: Math.ceil(content.content.length / this.maxChunkSize),
                    title: content.title,
                },
            });

            // Move to the next chunk, with overlap
            startIndex = endIndex - this.overlapSize;
            chunkIndex++;
        }

        return chunks;
    }

    /**
     * Chunk content from multiple Notion pages or databases
     */
    chunkMultipleContents(contents: ExtractedContent[]): ContentChunk[] {
        return contents.flatMap((content) => this.chunkContent(content));
    }
} 