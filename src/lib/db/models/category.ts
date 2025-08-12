import { query } from '../index';

export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export class CategoryModel {
  // Create a new category
  static async create(data: CreateCategoryData): Promise<Category> {
    const { name, description, slug, imageUrl, isActive = true } = data;
    
    const result = await query(
      `INSERT INTO categories (name, description, slug, image_url, is_active, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [name, description, slug, imageUrl, isActive]
    );

    if (result.rows.length === 0) {
      throw new Error('Failed to create category');
    }

    return this.mapRowToCategory(result.rows[0]);
  }

  // Find category by ID
  static async findById(id: number): Promise<Category | null> {
    const result = await query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );

    return result.rows.length > 0 ? this.mapRowToCategory(result.rows[0]) : null;
  }

  // Find category by slug
  static async findBySlug(slug: string): Promise<Category | null> {
    const result = await query(
      'SELECT * FROM categories WHERE slug = $1',
      [slug]
    );

    return result.rows.length > 0 ? this.mapRowToCategory(result.rows[0]) : null;
  }

  // Update category
  static async update(id: number, data: UpdateCategoryData): Promise<Category | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex}`);
      values.push(data.name);
      paramIndex++;
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      values.push(data.description);
      paramIndex++;
    }

    if (data.slug !== undefined) {
      fields.push(`slug = $${paramIndex}`);
      values.push(data.slug);
      paramIndex++;
    }

    if (data.imageUrl !== undefined) {
      fields.push(`image_url = $${paramIndex}`);
      values.push(data.imageUrl);
      paramIndex++;
    }

    if (data.isActive !== undefined) {
      fields.push(`is_active = $${paramIndex}`);
      values.push(data.isActive);
      paramIndex++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = $${paramIndex} 
       RETURNING *`,
      values
    );

    return result.rows.length > 0 ? this.mapRowToCategory(result.rows[0]) : null;
  }

  // Delete category
  static async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM categories WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  // Get all categories (with pagination)
  static async findAll(page = 1, limit = 10, activeOnly = false): Promise<{
    categories: Category[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    
    const whereClause = activeOnly ? 'WHERE is_active = true' : '';
    
    // Get total count
    const countResult = await query(`SELECT COUNT(*) FROM categories ${whereClause}`);
    const total = parseInt(countResult.rows[0].count);
    
    // Get paginated results
    const result = await query(
      `SELECT * FROM categories ${whereClause} 
       ORDER BY name ASC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const categories = result.rows.map(row => this.mapRowToCategory(row));
    const totalPages = Math.ceil(total / limit);

    return {
      categories,
      total,
      page,
      totalPages,
    };
  }

  // Check if category exists by slug
  static async existsBySlug(slug: string, excludeId?: number): Promise<boolean> {
    let queryText = 'SELECT 1 FROM categories WHERE slug = $1';
    let params: any[] = [slug];
    
    if (excludeId) {
      queryText += ' AND id != $2';
      params.push(excludeId);
    }
    
    const result = await query(queryText, params);
    return result.rows.length > 0;
  }

  // Get categories for dropdown/select
  static async getForSelect(): Promise<{ id: number; name: string }[]> {
    const result = await query(
      'SELECT id, name FROM categories WHERE is_active = true ORDER BY name ASC'
    );
    
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
    }));
  }

  // Helper method to map database row to Category object
  private static mapRowToCategory(row: any): Category {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      slug: row.slug,
      imageUrl: row.image_url,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
