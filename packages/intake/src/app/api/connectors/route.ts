import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { notionProvider } from "../../auth/notion-provider";
import { ConnectorRegistry, ConnectorType } from "../../connectors/registry";
import { z } from "zod";

// Schema for request validation
const connectorRequestSchema = z.object({
    type: z.string(),
    action: z.enum(["fetch", "list", "validate"]),
    config: z.record(z.any()).optional(),
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
        const { type, action, config } = connectorRequestSchema.parse(body);

        // Get the connector registry
        const registry = ConnectorRegistry.getInstance();

        // Check if the connector type is available
        const availableConnectors = registry.getAvailableConnectors();
        if (!availableConnectors.includes(type as ConnectorType)) {
            return NextResponse.json(
                { error: `Connector type '${type}' not available` },
                { status: 400 }
            );
        }

        // Create the connector
        const connector = registry.getConnector(
            type as ConnectorType,
            { accessToken: session.user.accessToken },
            config || {}
        );

        // Perform the requested action
        let result;
        switch (action) {
            case "fetch":
                result = await connector.fetchContent();
                break;
            case "list":
                result = await connector.listDatabases();
                break;
            case "validate":
                result = await connector.validate();
                break;
            default:
                return NextResponse.json(
                    { error: `Invalid action '${action}'` },
                    { status: 400 }
                );
        }

        return NextResponse.json({ result });
    } catch (error) {
        console.error(`Error with connector:`, error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to process connector request" },
            { status: 500 }
        );
    }
} 