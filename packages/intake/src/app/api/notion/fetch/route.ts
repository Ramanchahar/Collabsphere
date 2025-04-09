import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { notionProvider } from "../../../auth/notion-provider";
import { NotionConnector, NotionConnectorConfig } from "../../../connectors/notion/connector";
import { z } from "zod";

// Schema for request validation
const fetchRequestSchema = z.object({
    maxChunkSize: z.number().optional(),
    overlapSize: z.number().optional(),
    includeDatabases: z.boolean().optional(),
    includePages: z.boolean().optional(),
    databaseIds: z.array(z.string()).optional(),
    pageIds: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
    try {
        // Get the session
        const session = await getServerSession(notionProvider);

        if (!session || !session.user || !session.user.accessToken) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Parse the request body
        const body = await req.json();
        const config = fetchRequestSchema.parse(body) as NotionConnectorConfig;

        // Create the Notion connector
        const connector = new NotionConnector(
            { accessToken: session.user.accessToken },
            config
        );

        // Fetch content
        const chunks = await connector.fetchContent();

        return NextResponse.json({ chunks });
    } catch (error) {
        console.error("Error fetching Notion content:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch Notion content" },
            { status: 500 }
        );
    }
} 