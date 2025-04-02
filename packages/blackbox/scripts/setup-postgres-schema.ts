/**
 * PostgreSQL Schema Setup Script
 * 
 * This script sets up the PostgreSQL schema for the working memory layer.
 * It creates the necessary tables and indexes that match the application's expectations.
 */

import { Pool } from 'pg';
import { 
  WorkingMemoryTables,
  WorkingMemorySchema,
  WorkingMemoryIndexes
} from '../src/database/postgres/config';

async function setupSchema(): Promise<void> {
  const client = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'collabsphere_test',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    console.log('Connected! Setting up schema...');
    
    // Drop tables if they exist
    console.log('Dropping existing tables if they exist...');
    await client.query(`DROP TABLE IF EXISTS 
      ${WorkingMemoryTables.confidence_scores},
      ${WorkingMemoryTables.processing_status},
      ${WorkingMemoryTables.batch_tracking},
      ${WorkingMemoryTables.chunks} CASCADE`);

    // Create tables
    console.log(`Creating table: ${WorkingMemoryTables.chunks}`);
    await client.query(WorkingMemorySchema.chunks);
    
    console.log(`Creating table: ${WorkingMemoryTables.processing_status}`);
    await client.query(WorkingMemorySchema.processing_status);
    
    console.log(`Creating table: ${WorkingMemoryTables.batch_tracking}`);
    await client.query(WorkingMemorySchema.batch_tracking);
    
    console.log(`Creating table: ${WorkingMemoryTables.confidence_scores}`);
    await client.query(WorkingMemorySchema.confidence_scores);

    // Create indexes
    console.log('Creating indexes for chunks');
    for (const index of WorkingMemoryIndexes.chunks) {
      await client.query(index);
    }
    
    console.log('Creating indexes for processing_status');
    for (const index of WorkingMemoryIndexes.processing_status) {
      await client.query(index);
    }
    
    console.log('Creating indexes for batch_tracking');
    for (const index of WorkingMemoryIndexes.batch_tracking) {
      await client.query(index);
    }

    console.log('Schema setup completed successfully!');
    await client.end();
  } catch (error) {
    console.error('Error setting up schema:', error);
  } finally {
    client.end().catch(console.error);
  }
}

// Run the setup function
setupSchema(); 