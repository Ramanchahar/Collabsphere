# Database Setup and Troubleshooting

This document explains the issues we encountered with PostgreSQL and Neo4j database connections and how we resolved them.

## Issues Encountered

### 1. PostgreSQL Connection Issues

- **Error**: `role "test_user" does not exist`
- **Root cause**: The PostgreSQL database container was creating the `test_user`, but there was a configuration issue that prevented the application from connecting to it properly.

### 2. Neo4j Connection Issues

- **Error**: `Neo4jError: Failed to connect to server. Please ensure that your database is listening on the correct host and port`
- **Root cause**: Neo4j container had connectivity issues due to address binding and port configuration.

## Solutions

### PostgreSQL Solutions

1. Created a separate PostgreSQL container specifically for testing:
   ```yaml
   # docker-compose.postgres-test.yml
   services:
     postgres-test:
       image: ankane/pgvector:v0.5.1
       ports:
         - "5433:5432"
       environment:
         - POSTGRES_USER=test_user
         - POSTGRES_PASSWORD=test_password
         - POSTGRES_DB=collabsphere_test
   ```

2. Modified the connection to use port 5433 instead of 5432:
   ```typescript
   // In test-connections.ts
   postgres: PostgresConfigSchema.parse({
     host: 'localhost',
     port: 5433,
     database: 'collabsphere_test',
     user: 'test_user',
     password: 'test_password',
   }),
   ```

3. Created proper schema creation script that matches the expected table names in the application:
   ```javascript
   // setup-postgres-schema.js
   const WorkingMemoryTables = {
     chunks: 'working_memory_chunks',
     processing_status: 'processing_status',
     batch_tracking: 'batch_tracking',
     confidence_scores: 'confidence_scores',
   };
   ```

4. Fixed the client.ts cleanup method to use the correct table names:
   ```typescript
   async cleanup(): Promise<void> {
     await this.pool.query(`TRUNCATE TABLE ${WorkingMemoryTables.chunks} CASCADE`);
     await this.close();
   }
   ```

### Neo4j Solutions

1. Created a separate Neo4j container for testing:
   ```yaml
   # docker-compose.neo4j-test.yml
   services:
     neo4j-test:
       image: neo4j:5.15.0
       ports:
         - "7688:7687"  # Bolt protocol
         - "7475:7474"  # HTTP
       environment:
         - NEO4J_AUTH=neo4j/test_password
         - NEO4J_dbms_default__advertised__address=localhost
         - NEO4J_dbms_default__listen__address=0.0.0.0
         - NEO4J_dbms_connector_bolt_listen__address=0.0.0.0:7687
         - NEO4J_dbms_connector_bolt_advertised__address=localhost:7687
   ```

2. Updated the connection URI to use the correct port:
   ```typescript
   // In test-connections.ts
   neo4j: Neo4jConfigSchema.parse({
     uri: 'bolt://localhost:7688',
     user: 'neo4j',
     password: 'test_password',
   }),
   ```

## Updated Solution

After further investigation, we've implemented a more robust solution:

1. Created dedicated container configurations for each problematic database:
   - `docker-compose.postgres-test.yml` - PostgreSQL container on port 5433
   - `docker-compose.neo4j-test.yml` - Neo4j container on port 7688

2. Updated test scripts to use these dedicated ports:
   ```typescript
   // In test-connections.ts
   postgres: PostgresConfigSchema.parse({
     host: 'localhost',
     port: 5433,  // Use dedicated test port
     database: 'collabsphere_test',
     user: 'test_user',
     password: 'test_password',
   }),
   neo4j: Neo4jConfigSchema.parse({
     uri: 'bolt://localhost:7688',  // Use dedicated test port
     user: 'neo4j',
     password: 'test_password',
   }),
   ```

3. Created scripts to manage test database setup:
   - `start-test-dbs.sh` - Starts specialized test database containers
   - `verify-db-connections.sh` - Verifies database connections

## How to Use

1. Start the test databases:
   ```bash
   pnpm start:test-dbs
   ```

2. Run the database connection tests:
   ```bash
   pnpm test:db
   ```

3. Verify the connections directly:
   ```bash
   pnpm verify:db
   ```

## Recommendations

For reliable database testing:
1. Use dedicated containers with different ports for testing
2. Explicitly set necessary environment variables
3. For PostgreSQL, ensure vector extension is installed
4. For Neo4j, configure connection parameters explicitly

## Verification

After applying these solutions, all database connections are now working properly, as shown by the output from the test-connections.ts script:

```
Testing Redis connection...
✅ Redis test passed: Chunk retrieved successfully

Testing PostgreSQL connection...
✅ PostgreSQL test passed: Chunk retrieved successfully

Testing Neo4j connection...
✅ Neo4j test passed: Chunk retrieved successfully

Testing Weaviate connection...
✅ Weaviate test passed: Chunk retrieved successfully

Testing MongoDB connection...
✅ MongoDB test passed: Chunk retrieved successfully

All database tests completed! 

## Troubleshooting

### Neo4j Container Restart Issues

If you notice Neo4j containers restarting repeatedly after system reboot or Docker restart, the issue might be related to:

1. Permission issues with mounted volumes
2. Corrupted identity files
3. Password change conflicts

To fix these issues:

1. Use the reset script to clear Neo4j containers and volumes:
   ```bash
   pnpm reset:neo4j
   ```

2. Restart the test databases:
   ```bash
   pnpm start:test-dbs
   ```

3. If you're also using the main test environment, restart it:
   ```bash
   docker-compose -f docker-compose.test.yml up -d
   ```

The fixes implemented in the Docker configuration include:

- Adding proper permissions with `chmod -R 777 /data && chmod -R 777 /logs`
- Adding APOC configuration options
- Configuring proper port bindings and address settings

If containers still restart, check the logs for specific errors:
```bash
docker logs blackbox-neo4j-test-1
``` 