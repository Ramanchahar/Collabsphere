#!/bin/bash

# Script to fix PostgreSQL authentication for test_user

# Apply the proper authentication configuration
echo "Fixing PostgreSQL authentication..."
docker exec blackbox-postgres-1 sh -c "echo 'host all all all scram-sha-256' >> /var/lib/postgresql/data/pg_hba.conf"

# Reload PostgreSQL configuration
echo "Reloading PostgreSQL configuration..."
docker exec blackbox-postgres-1 sh -c "pg_ctl reload -D /var/lib/postgresql/data"

echo "PostgreSQL authentication fixed!" 