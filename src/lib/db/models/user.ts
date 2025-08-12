import { query } from '../index';
import { User } from '../../../types';

export interface CreateUserData {
  email: string;
  name: string;
  password?: string;
  role?: 'USER' | 'ADMIN';
}

export interface UpdateUserData {
  name?: string;
  password?: string;
  role?: 'USER' | 'ADMIN';
}

export class UserModel {
  // Create a new user
  static async create(data: CreateUserData): Promise<User> {
    const { email, name, password, role = 'USER' } = data;
    
    const result = await query(
      `INSERT INTO users (email, name, password, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING id, email, name, role, created_at, updated_at`,
      [email, name, password, role]
    );

    if (result.rows.length === 0) {
      throw new Error('Failed to create user');
    }

    return this.mapRowToUser(result.rows[0]);
  }

  // Find user by ID
  static async findById(id: string | number): Promise<User | null> {
    const result = await query(
      'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT id, email, name, password, role, created_at, updated_at FROM users WHERE email = $1',
      [email]
    );

    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0], true) : null;
  }

  // Update user
  static async update(id: string | number, data: UpdateUserData): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex}`);
      values.push(data.name);
      paramIndex++;
    }

    if (data.password !== undefined) {
      fields.push(`password = $${paramIndex}`);
      values.push(data.password);
      paramIndex++;
    }

    if (data.role !== undefined) {
      fields.push(`role = $${paramIndex}`);
      values.push(data.role);
      paramIndex++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} 
       RETURNING id, email, name, role, created_at, updated_at`,
      values
    );

    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  // Delete user
  static async delete(id: string | number): Promise<boolean> {
    const result = await query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  // Get all users (with pagination)
  static async findAll(page = 1, limit = 10): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);
    
    // Get paginated results
    const result = await query(
      `SELECT id, email, name, role, created_at, updated_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const users = result.rows.map(row => this.mapRowToUser(row));
    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      totalPages,
    };
  }

  // Check if user exists by email
  static async existsByEmail(email: string): Promise<boolean> {
    const result = await query('SELECT 1 FROM users WHERE email = $1', [email]);
    return result.rows.length > 0;
  }

  // Get user count by role
  static async countByRole(): Promise<{ [key: string]: number }> {
    const result = await query(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role'
    );
    
    const counts: { [key: string]: number } = {};
    result.rows.forEach(row => {
      counts[row.role] = parseInt(row.count);
    });
    
    return counts;
  }

  // Helper method to map database row to User object
  private static mapRowToUser(row: any, includePassword = false): User {
    return {
      id: row.id.toString(),
      email: row.email,
      name: row.name,
      ...(includePassword && row.password && { password: row.password }),
      role: row.role as 'USER' | 'ADMIN',
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
