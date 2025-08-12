import { NextRequest, NextResponse } from 'next/server';
import { ProductModel } from '../../../lib/db/models/product';
import { z } from 'zod';

// Schema for product creation/update
const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug is too long'),
  price: z.number().min(0, 'Price must be positive'),
  comparePrice: z.number().min(0, 'Compare price must be positive').optional(),
  sku: z.string().max(100, 'SKU is too long').optional(),
  barcode: z.string().max(100, 'Barcode is too long').optional(),
  trackQuantity: z.boolean().optional(),
  quantity: z.number().min(0, 'Quantity must be positive').optional(),
  categoryId: z.number().positive('Invalid category ID').optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  weight: z.number().min(0, 'Weight must be positive').optional(),
  dimensions: z.object({
    length: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
  }).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  seoTitle: z.string().max(255, 'SEO title is too long').optional(),
  seoDescription: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// GET /api/products - Get all products with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined;
    const isActive = searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined;
    const isFeatured = searchParams.get('isFeatured') ? searchParams.get('isFeatured') === 'true' : undefined;
    const search = searchParams.get('search') || undefined;

    const result = await ProductModel.findAll(page, limit, {
      categoryId,
      isActive,
      isFeatured,
      search,
    });

    return NextResponse.json({
      success: true,
      data: result.products,
      pagination: {
        page: result.page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = ProductSchema.safeParse(body);
    
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

    const data = validatedData.data;

    // Check if slug already exists
    const existingProductBySlug = await ProductModel.existsBySlug(data.slug);
    if (existingProductBySlug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug already exists',
        },
        { status: 409 }
      );
    }

    // Check if SKU already exists (if provided)
    if (data.sku) {
      const existingProductBySku = await ProductModel.existsBySku(data.sku);
      if (existingProductBySku) {
        return NextResponse.json(
          {
            success: false,
            error: 'SKU already exists',
          },
          { status: 409 }
        );
      }
    }

    // Create product
    const product = await ProductModel.create({
      ...data,
      imageUrl: data.imageUrl || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: 'Product created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product',
      },
      { status: 500 }
    );
  }
}
