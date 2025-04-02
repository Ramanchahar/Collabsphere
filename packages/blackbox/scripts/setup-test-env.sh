#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up test environment...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        echo -e "${RED}Port $port is already in use. Please free up the port and try again.${NC}"
        exit 1
    fi
}

# Check if required ports are available
echo "Checking required ports..."
check_port 6379  # Redis
check_port 5432  # PostgreSQL
check_port 7474  # Neo4j HTTP
check_port 7687  # Neo4j Bolt
check_port 8080  # Weaviate
check_port 27017 # MongoDB

# Create test environment file
echo "Creating test environment file..."
cat > .env.test << EOL
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=test_user
POSTGRES_PASSWORD=test_password
POSTGRES_DB=collabsphere_test

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=test_password

# Weaviate
WEAVIATE_HOST=localhost
WEAVIATE_PORT=8080
WEAVIATE_API_KEY=

# MongoDB
MONGODB_URI=mongodb://test_user:test_password@localhost:27017/collabsphere_test
EOL

# Start Docker containers
echo "Starting Docker containers..."
docker-compose -f docker-compose.test.yml up -d

# Wait for containers to be healthy
echo "Waiting for containers to be healthy..."
for service in redis postgres neo4j weaviate mongodb; do
    echo "Waiting for $service to be healthy..."
    while ! docker-compose -f docker-compose.test.yml ps $service | grep -q "healthy"; do
        sleep 2
    done
done

# Fix PostgreSQL authentication
echo "Fixing PostgreSQL authentication..."
./scripts/fix-postgres-auth.sh

# Fix Neo4j connection
echo "Fixing Neo4j connection..."
./scripts/fix-neo4j-connection.sh

# Initialize databases
echo "Initializing databases..."

# PostgreSQL: Create vector extension
docker-compose -f docker-compose.test.yml exec -T postgres psql -U postgres -d collabsphere_test -c "CREATE EXTENSION IF NOT EXISTS vector;"

# PostgreSQL: Setup schema
echo "Setting up PostgreSQL schema..."
npx tsx scripts/setup-postgres-schema.ts || echo "Schema setup script execution failed, but continuing..."

# Neo4j: Create constraints and indexes
docker-compose -f docker-compose.test.yml exec -T neo4j cypher-shell -u neo4j -p test_password "CREATE CONSTRAINT IF NOT EXISTS FOR (n:KnowledgeNode) ON (n.id) IS UNIQUE;"

# Weaviate: Create schema
docker-compose -f docker-compose.test.yml exec -T weaviate curl -X POST http://localhost:8080/v1/schema -H "Content-Type: application/json" -d @- << EOL
{
  "class": "VectorChunk",
  "description": "A vectorized chunk of content",
  "vectorizer": "text2vec-contextionary",
  "vectorIndexConfig": {
    "distance": "cosine"
  },
  "properties": [
    {
      "name": "content",
      "dataType": ["text"],
      "description": "The content of the chunk"
    },
    {
      "name": "contentType",
      "dataType": ["text"],
      "description": "The type of content"
    },
    {
      "name": "projectId",
      "dataType": ["text"],
      "description": "The project ID"
    },
    {
      "name": "processedAt",
      "dataType": ["date"],
      "description": "When the chunk was processed"
    }
  ]
}
EOL

echo -e "${GREEN}Test environment setup complete!${NC}"
echo "You can now run the tests with: pnpm test" 