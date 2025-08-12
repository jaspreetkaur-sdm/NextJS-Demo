import { NextRequest, NextResponse } from 'next/server';
import { CategoryModel } from '../../../../lib/db/models/category';
import { z } from 'zod';

// Schema for category update
const UpdateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long').optional(),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug is too long').optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

// GET /api/categories/[id] - Get a single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid category ID',
        },
        { status: 400 }
      );
    }

    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Get category error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch category',
      },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid category ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = UpdateCategorySchema.safeParse(body);
    
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

    const updateData = validatedData.data;

    // Check if slug already exists (excluding current category)
    if (updateData.slug) {
      const existingCategory = await CategoryModel.existsBySlug(updateData.slug, categoryId);
      if (existingCategory) {
        return NextResponse.json(
          {
            success: false,
            error: 'Slug already exists',
          },
          { status: 409 }
        );
      }
    }

    // Update category
    const category = await CategoryModel.update(categoryId, {
      ...updateData,
      imageUrl: updateData.imageUrl || undefined,
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update category',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid category ID',
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    // Delete category
    const deleted = await CategoryModel.delete(categoryId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete category',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete category',
      },
      { status: 500 }
    );
  }
}
