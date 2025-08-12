#!/usr/bin/env tsx

import { initDatabase } from '../src/lib/db';

async function main() {
  try {
    console.log('🔄 Initializing database tables...');
    await initDatabase();
    console.log('✅ Database tables initialized successfully!');
    
    console.log('📋 Created tables:');
    console.log('  - users');
    console.log('  - accounts');
    console.log('  - sessions');
    console.log('  - verification_tokens');
    
    console.log('📊 Created indexes for better performance');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

main();
