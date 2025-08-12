#!/usr/bin/env tsx

import { UserModel } from '../src/lib/db/models/user';
import { CategoryModel } from '../src/lib/db/models/category';
import { ProductModel } from '../src/lib/db/models/product';
import { hashPassword } from '../src/lib/auth/utils';
import { disconnectDatabase } from '../src/lib/db';

async function main() {
  try {
    console.log('🌱 Seeding database...');

    // Create demo users
    const adminPassword = await hashPassword('AdminPassword123!');
    const admin = await UserModel.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    });

    const userPassword = await hashPassword('UserPassword123!');
    const user = await UserModel.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
    });

    console.log('✅ Created users:', {
      admin: { id: admin.id, email: admin.email },
      user: { id: user.id, email: user.email },
    });

    // Create demo categories
    const categories = await Promise.all([
      CategoryModel.create({
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        slug: 'electronics',
        isActive: true,
      }),
      CategoryModel.create({
        name: 'Clothing',
        description: 'Fashion and apparel',
        slug: 'clothing',
        isActive: true,
      }),
      CategoryModel.create({
        name: 'Books',
        description: 'Books and educational materials',
        slug: 'books',
        isActive: true,
      }),
      CategoryModel.create({
        name: 'Home & Garden',
        description: 'Home improvement and gardening supplies',
        slug: 'home-garden',
        isActive: true,
      }),
    ]);

    console.log('✅ Created categories:', categories.map(c => ({ id: c.id, name: c.name })));

    // Create demo products
    const products = await Promise.all([
      ProductModel.create({
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        slug: 'wireless-headphones',
        price: 199.99,
        comparePrice: 249.99,
        sku: 'WH-001',
        quantity: 50,
        categoryId: categories[0].id, // Electronics
        isActive: true,
        isFeatured: true,
      }),
      ProductModel.create({
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt',
        slug: 'cotton-t-shirt',
        price: 29.99,
        sku: 'TS-001',
        quantity: 100,
        categoryId: categories[1].id, // Clothing
        isActive: true,
      }),
      ProductModel.create({
        name: 'JavaScript: The Definitive Guide',
        description: 'Comprehensive guide to JavaScript programming',
        slug: 'javascript-definitive-guide',
        price: 49.99,
        sku: 'BK-001',
        quantity: 25,
        categoryId: categories[2].id, // Books
        isActive: true,
        isFeatured: true,
      }),
      ProductModel.create({
        name: 'Garden Hose',
        description: 'Durable 50ft garden hose with spray nozzle',
        slug: 'garden-hose-50ft',
        price: 39.99,
        sku: 'GH-001',
        quantity: 30,
        categoryId: categories[3].id, // Home & Garden
        isActive: true,
      }),
      ProductModel.create({
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health tracking',
        slug: 'smart-watch',
        price: 299.99,
        comparePrice: 399.99,
        sku: 'SW-001',
        quantity: 20,
        categoryId: categories[0].id, // Electronics
        isActive: true,
        isFeatured: true,
      }),
    ]);

    console.log('✅ Created products:', products.map(p => ({ id: p.id, name: p.name, price: p.price })));

    console.log('🎉 Database seeded successfully!');
    console.log('📝 Login credentials:');
    console.log('  Admin: admin@example.com / AdminPassword123!');
    console.log('  User:  user@example.com / UserPassword123!');
    console.log('📋 Sample data created:');
    console.log(`  Categories: ${categories.length}`);
    console.log(`  Products: ${products.length}`);
    
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
}

main();
