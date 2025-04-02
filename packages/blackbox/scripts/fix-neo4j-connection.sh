#!/bin/bash

# Script to fix Neo4j connectivity issues

# Set additional Neo4j configuration
echo "Fixing Neo4j connection configuration..."
docker exec blackbox-neo4j-1 sh -c "echo 'dbms.connector.bolt.listen_address=0.0.0.0:7687' >> /var/lib/neo4j/conf/neo4j.conf"
docker exec blackbox-neo4j-1 sh -c "echo 'dbms.connector.bolt.advertised_address=localhost:7687' >> /var/lib/neo4j/conf/neo4j.conf"
docker exec blackbox-neo4j-1 sh -c "echo 'dbms.default_listen_address=0.0.0.0' >> /var/lib/neo4j/conf/neo4j.conf"

# Restart Neo4j to apply changes
echo "Restarting Neo4j..."
docker restart blackbox-neo4j-1

# Wait for Neo4j to become healthy again
echo "Waiting for Neo4j to become healthy..."
while ! docker exec blackbox-neo4j-1 wget --no-verbose --tries=1 --spider http://localhost:7474 > /dev/null 2>&1; do
  echo "Waiting for Neo4j..."
  sleep 5
done

echo "Neo4j connection fixed!" 