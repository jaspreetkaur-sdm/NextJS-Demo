import { NextRequest, NextResponse } from 'next/server';
import { CategoryModel } from '../../../lib/db/models/category';
import { z } from 'zod';

// Schema for category creation/update
const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug is too long'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

// GET /api/categories - Get all categories with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const result = await CategoryModel.findAll(page, limit, activeOnly);

    return NextResponse.json({
      success: true,
      data: result.categories,
      pagination: {
        page: result.page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = CategorySchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input data',
          details: validatedData.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, description, slug, imageUrl, isActive } = validatedData.data;

    // Check if slug already exists
    const existingCategory = await CategoryModel.existsBySlug(slug);
    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug already exists',
        },
        { status: 409 }
      );
    }

    // Create category
    const category = await CategoryModel.create({
      name,
      description,
      slug,
      imageUrl: imageUrl || undefined,
      isActive,
    });

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: 'Category created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create category',
      },
      { status: 500 }
    );
  }
}
