import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get basic counts
    const [
      productsResult,
      categoriesResult,
      activeProductsResult,
      featuredProductsResult,
      lowStockResult,
    ] = await Promise.all([
      query('SELECT COUNT(*) as count FROM products'),
      query('SELECT COUNT(*) as count FROM categories'),
      query('SELECT COUNT(*) as count FROM products WHERE is_active = true'),
      query('SELECT COUNT(*) as count FROM products WHERE is_featured = true'),
      query('SELECT COUNT(*) as count FROM products WHERE quantity < 10 AND track_quantity = true'),
    ]);

    // Get total inventory value
    const inventoryResult = await query(`
      SELECT 
        SUM(price * quantity) as total_value,
        AVG(price) as avg_price,
        SUM(quantity) as total_quantity
      FROM products 
      WHERE is_active = true
    `);

    // Get category distribution
    const categoryDistribution = await query(`
      SELECT 
        c.name,
        COUNT(p.id) as product_count,
        SUM(p.quantity) as total_quantity,
        SUM(p.price * p.quantity) as category_value
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id, c.name
      ORDER BY product_count DESC
    `);

    // Get recent products (last 30 days)
    const recentProducts = await query(`
      SELECT COUNT(*) as count
      FROM products 
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);

    // Get price range distribution
    const priceRanges = await query(`
      SELECT 
        CASE 
          WHEN price < 25 THEN 'Under $25'
          WHEN price < 50 THEN '$25 - $50'
          WHEN price < 100 THEN '$50 - $100'
          WHEN price < 200 THEN '$100 - $200'
          ELSE 'Over $200'
        END as price_range,
        COUNT(*) as count,
        SUM(quantity) as total_quantity
      FROM products 
      WHERE is_active = true
      GROUP BY price_range
      ORDER BY MIN(price)
    `);

    // Get top products by value
    const topProducts = await query(`
      SELECT 
        p.name,
        p.price,
        p.quantity,
        (p.price * p.quantity) as total_value,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true AND p.quantity > 0
      ORDER BY total_value DESC
      LIMIT 10
    `);

    // Get low stock products
    const lowStockProducts = await query(`
      SELECT 
        p.name,
        p.quantity,
        p.sku,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.track_quantity = true AND p.quantity < 10 AND p.is_active = true
      ORDER BY p.quantity ASC
      LIMIT 10
    `);

    // Monthly product creation trend (last 12 months)
    const monthlyTrend = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as products_created
      FROM products 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 12
    `);

    const analytics = {
      overview: {
        totalProducts: parseInt(productsResult.rows[0].count),
        totalCategories: parseInt(categoriesResult.rows[0].count),
        activeProducts: parseInt(activeProductsResult.rows[0].count),
        featuredProducts: parseInt(featuredProductsResult.rows[0].count),
        lowStockProducts: parseInt(lowStockResult.rows[0].count),
        recentProducts: parseInt(recentProducts.rows[0].count),
      },
      inventory: {
        totalValue: parseFloat(inventoryResult.rows[0].total_value || 0),
        averagePrice: parseFloat(inventoryResult.rows[0].avg_price || 0),
        totalQuantity: parseInt(inventoryResult.rows[0].total_quantity || 0),
      },
      categoryDistribution: categoryDistribution.rows.map(row => ({
        name: row.name,
        productCount: parseInt(row.product_count),
        totalQuantity: parseInt(row.total_quantity || 0),
        categoryValue: parseFloat(row.category_value || 0),
      })),
      priceRanges: priceRanges.rows.map(row => ({
        range: row.price_range,
        count: parseInt(row.count),
        totalQuantity: parseInt(row.total_quantity || 0),
      })),
      topProducts: topProducts.rows.map(row => ({
        name: row.name,
        price: parseFloat(row.price),
        quantity: parseInt(row.quantity),
        totalValue: parseFloat(row.total_value),
        categoryName: row.category_name,
      })),
      lowStockProducts: lowStockProducts.rows.map(row => ({
        name: row.name,
        quantity: parseInt(row.quantity),
        sku: row.sku,
        categoryName: row.category_name,
      })),
      monthlyTrend: monthlyTrend.rows.map(row => ({
        month: row.month,
        productsCreated: parseInt(row.products_created),
      })),
    };

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard analytics',
      },
      { status: 500 }
    );
  }
}
