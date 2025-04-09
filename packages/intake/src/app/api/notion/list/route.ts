import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { notionProvider } from "../../../auth/notion-provider";
import { NotionConnector } from "../../../connectors/notion/connector";
import { z } from "zod";

// Schema for request validation
const listRequestSchema = z.object({
    type: z.enum(["databases", "pages", "all"]).default("all"),
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
        const { type } = listRequestSchema.parse(body);

        // Create the Notion connector
        const connector = new NotionConnector(
            { accessToken: session.user.accessToken }
        );

        // List content based on type
        let databases: any[] = [];
        let pages: any[] = [];

        if (type === "databases" || type === "all") {
            databases = await connector.listDatabases();
        }

        if (type === "pages" || type === "all") {
            pages = await connector.listPages();
        }

        return NextResponse.json({ databases, pages });
    } catch (error) {
        console.error("Error listing Notion content:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to list Notion content" },
            { status: 500 }
        );
    }
} 