#!/usr/bin/env tsx

import { UserModel } from '../src/lib/db/models/user';
import { hashPassword } from '../src/lib/auth/utils';

async function main() {
  try {
    console.log('🌱 Seeding database...');

    // Create a demo admin user
    const adminPassword = await hashPassword('AdminPassword123!');
    const admin = await UserModel.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    });

    console.log('✅ Created admin user:', {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    // Create a demo regular user
    const userPassword = await hashPassword('UserPassword123!');
    const user = await UserModel.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
    });

    console.log('✅ Created regular user:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    console.log('🎉 Database seeded successfully!');
    console.log('📝 Login credentials:');
    console.log('  Admin: admin@example.com / AdminPassword123!');
    console.log('  User:  user@example.com / UserPassword123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    process.exit(1);
  }
}

main();
