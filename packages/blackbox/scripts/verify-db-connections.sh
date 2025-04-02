#!/bin/bash

# Script to verify database connections

echo "Verifying PostgreSQL connection..."
docker exec blackbox-postgres-test-1 psql -U test_user -d collabsphere_test -c "SELECT 1 as connection_test;"

echo "Verifying Neo4j connection..."
docker exec blackbox-neo4j-test-1 cypher-shell -u neo4j -p test_password "RETURN 1 as connectionTest;"

echo "Verification complete!" 