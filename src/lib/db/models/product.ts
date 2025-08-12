import { query } from '../index';

export interface Product {
  id: number;
  name: string;
  description?: string;
  slug: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  barcode?: string;
  trackQuantity: boolean;
  quantity: number;
  categoryId?: number;
  imageUrl?: string;
  images?: string[];
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  categoryName?: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  slug: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  barcode?: string;
  trackQuantity?: boolean;
  quantity?: number;
  categoryId?: number;
  imageUrl?: string;
  images?: string[];
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  isActive?: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export class ProductModel {
  // Create a new product
  static async create(data: CreateProductData): Promise<Product> {
    const {
      name,
      description,
      slug,
      price,
      comparePrice,
      sku,
      barcode,
      trackQuantity = true,
      quantity = 0,
      categoryId,
      imageUrl,
      images,
      weight,
      dimensions,
      isActive = true,
      isFeatured = false,
      seoTitle,
      seoDescription,
      tags
    } = data;
    
    const result = await query(
      `INSERT INTO products (
        name, description, slug, price, compare_price, sku, barcode,
        track_quantity, quantity, category_id, image_url, images, weight,
        dimensions, is_active, is_featured, seo_title, seo_description,
        tags, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING *`,
      [
        name,
        description,
        slug,
        price,
        comparePrice,
        sku,
        barcode,
        trackQuantity,
        quantity,
        categoryId,
        imageUrl,
        images,
        weight,
        dimensions ? JSON.stringify(dimensions) : null,
        isActive,
        isFeatured,
        seoTitle,
        seoDescription,
        tags
      ]
    );

    if (result.rows.length === 0) {
      throw new Error('Failed to create product');
    }

    return this.mapRowToProduct(result.rows[0]);
  }

  // Find product by ID
  static async findById(id: number): Promise<Product | null> {
    const result = await query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = $1`,
      [id]
    );

    return result.rows.length > 0 ? this.mapRowToProduct(result.rows[0]) : null;
  }

  // Find product by slug
  static async findBySlug(slug: string): Promise<Product | null> {
    const result = await query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.slug = $1`,
      [slug]
    );

    return result.rows.length > 0 ? this.mapRowToProduct(result.rows[0]) : null;
  }

  // Update product
  static async update(id: number, data: UpdateProductData): Promise<Product | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const updateableFields = [
      'name', 'description', 'slug', 'price', 'compare_price', 'sku', 'barcode',
      'track_quantity', 'quantity', 'category_id', 'image_url', 'images', 'weight',
      'dimensions', 'is_active', 'is_featured', 'seo_title', 'seo_description', 'tags'
    ];

    const fieldMap: Record<string, string> = {
      comparePrice: 'compare_price',
      trackQuantity: 'track_quantity',
      categoryId: 'category_id',
      imageUrl: 'image_url',
      isActive: 'is_active',
      isFeatured: 'is_featured',
      seoTitle: 'seo_title',
      seoDescription: 'seo_description'
    };

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbField = fieldMap[key] || key.replace(/([A-Z])/g, '_$1').toLowerCase();
        if (updateableFields.includes(dbField)) {
          fields.push(`${dbField} = $${paramIndex}`);
          if (key === 'dimensions' && value) {
            values.push(JSON.stringify(value));
          } else {
            values.push(value);
          }
          paramIndex++;
        }
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramIndex} 
       RETURNING *`,
      values
    );

    return result.rows.length > 0 ? this.mapRowToProduct(result.rows[0]) : null;
  }

  // Delete product
  static async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM products WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  // Get all products (with pagination and filters)
  static async findAll(
    page = 1,
    limit = 10,
    filters: {
      categoryId?: number;
      isActive?: boolean;
      isFeatured?: boolean;
      search?: string;
    } = {}
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.categoryId) {
      conditions.push(`p.category_id = $${paramIndex}`);
      params.push(filters.categoryId);
      paramIndex++;
    }

    if (filters.isActive !== undefined) {
      conditions.push(`p.is_active = $${paramIndex}`);
      params.push(filters.isActive);
      paramIndex++;
    }

    if (filters.isFeatured !== undefined) {
      conditions.push(`p.is_featured = $${paramIndex}`);
      params.push(filters.isFeatured);
      paramIndex++;
    }

    if (filters.search) {
      conditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM products p ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);
    
    // Get paginated results
    const result = await query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ${whereClause} 
       ORDER BY p.created_at DESC 
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    const products = result.rows.map(row => this.mapRowToProduct(row));
    const totalPages = Math.ceil(total / limit);

    return {
      products,
      total,
      page,
      totalPages,
    };
  }

  // Check if product exists by slug
  static async existsBySlug(slug: string, excludeId?: number): Promise<boolean> {
    let queryText = 'SELECT 1 FROM products WHERE slug = $1';
    let params: any[] = [slug];
    
    if (excludeId) {
      queryText += ' AND id != $2';
      params.push(excludeId);
    }
    
    const result = await query(queryText, params);
    return result.rows.length > 0;
  }

  // Check if product exists by SKU
  static async existsBySku(sku: string, excludeId?: number): Promise<boolean> {
    let queryText = 'SELECT 1 FROM products WHERE sku = $1';
    let params: any[] = [sku];
    
    if (excludeId) {
      queryText += ' AND id != $2';
      params.push(excludeId);
    }
    
    const result = await query(queryText, params);
    return result.rows.length > 0;
  }

  // Update product quantity
  static async updateQuantity(id: number, quantity: number): Promise<boolean> {
    const result = await query(
      'UPDATE products SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [quantity, id]
    );
    return result.rowCount > 0;
  }

  // Helper method to map database row to Product object
  private static mapRowToProduct(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      slug: row.slug,
      price: parseFloat(row.price),
      comparePrice: row.compare_price ? parseFloat(row.compare_price) : undefined,
      sku: row.sku,
      barcode: row.barcode,
      trackQuantity: row.track_quantity,
      quantity: row.quantity,
      categoryId: row.category_id,
      imageUrl: row.image_url,
      images: row.images,
      weight: row.weight ? parseFloat(row.weight) : undefined,
      dimensions: row.dimensions ? JSON.parse(row.dimensions) : undefined,
      isActive: row.is_active,
      isFeatured: row.is_featured,
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      tags: row.tags,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      categoryName: row.category_name,
    };
  }
}
