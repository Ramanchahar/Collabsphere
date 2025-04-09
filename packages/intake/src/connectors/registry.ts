import { ConnectorAuth, ConnectorConfig } from "../types/auth";
import { NotionConnector, NotionConnectorConfig } from "./notion/connector";

export type ConnectorType = "notion" | "github" | "slack" | "google_docs";

export interface ConnectorFactory {
    createConnector(auth: ConnectorAuth, config: any): any;
    validateConfig(config: any): boolean;
}

export class ConnectorRegistry {
    private static instance: ConnectorRegistry;
    private connectors: Map<ConnectorType, ConnectorFactory>;

    private constructor() {
        this.connectors = new Map();
        this.registerConnectors();
    }

    public static getInstance(): ConnectorRegistry {
        if (!ConnectorRegistry.instance) {
            ConnectorRegistry.instance = new ConnectorRegistry();
        }
        return ConnectorRegistry.instance;
    }

    private registerConnectors() {
        // Register Notion connector
        this.connectors.set("notion", {
            createConnector: (auth: ConnectorAuth, config: NotionConnectorConfig) => {
                return new NotionConnector(auth, config);
            },
            validateConfig: (config: NotionConnectorConfig) => {
                // Basic validation for Notion connector
                return true;
            },
        });

        // Register other connectors here
    }

    public getConnector(type: ConnectorType, auth: ConnectorAuth, config: any) {
        const factory = this.connectors.get(type);
        if (!factory) {
            throw new Error(`Connector type '${type}' not found`);
        }

        if (!factory.validateConfig(config)) {
            throw new Error(`Invalid configuration for connector type '${type}'`);
        }

        return factory.createConnector(auth, config);
    }

    public getAvailableConnectors(): ConnectorType[] {
        return Array.from(this.connectors.keys());
    }
} 