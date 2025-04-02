-- Create test user with login permission and password
CREATE USER test_user WITH PASSWORD 'test_password' LOGIN CREATEDB;

-- Create test database
CREATE DATABASE collabsphere_test;

-- Connect to test database
\c collabsphere_test;

-- Install pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create schema and grant privileges
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO test_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO test_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO test_user;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO test_user;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO test_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO test_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO test_user;

-- Grant database privileges
GRANT ALL PRIVILEGES ON DATABASE collabsphere_test TO test_user;
ALTER DATABASE collabsphere_test OWNER TO test_user;

-- Update authentication method for the test user
ALTER USER test_user WITH PASSWORD 'test_password';

-- Grant usage on vector extension
GRANT USAGE ON SCHEMA public TO test_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO test_user;

-- Configure pg_hba.conf to allow connections from host
ALTER SYSTEM SET password_encryption = 'scram-sha-256';
ALTER SYSTEM SET listen_addresses = '*';
CREATE OR REPLACE FUNCTION update_pg_hba()
RETURNS void AS $$
BEGIN
    -- Allow connections from all hosts with password authentication
    ALTER SYSTEM SET hba_file = '/etc/postgresql/pg_hba.conf';
    -- Add entries to pg_hba.conf
    COPY (SELECT 'host all all all scram-sha-256') TO '/etc/postgresql/pg_hba.conf' WITH CSV;
END;
$$ LANGUAGE plpgsql;
SELECT update_pg_hba(); 