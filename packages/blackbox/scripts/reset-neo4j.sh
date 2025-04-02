#!/bin/bash

# Script to reset Neo4j containers and volumes to fix restart issues

# Stop and remove Neo4j containers
echo "Stopping Neo4j containers..."
docker stop blackbox-neo4j-1 blackbox-neo4j-test-1 2>/dev/null || true
docker rm blackbox-neo4j-1 blackbox-neo4j-test-1 2>/dev/null || true

# Remove Neo4j volumes
echo "Removing Neo4j volumes..."
docker volume rm blackbox_neo4j_data blackbox_neo4j_logs blackbox_neo4j_plugins blackbox_neo4j_test_data blackbox_neo4j_test_logs 2>/dev/null || true

echo "Neo4j containers and volumes have been reset."
echo "You can now start the containers again with:"
echo "  - For main containers: docker-compose -f docker-compose.test.yml up -d"
echo "  - For test containers: pnpm start:test-dbs" 