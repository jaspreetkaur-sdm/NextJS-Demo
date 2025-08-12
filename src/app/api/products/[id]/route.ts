import { NextRequest, NextResponse } from 'next/server';
import { ProductModel } from '../../../../lib/db/models/product';
import { z } from 'zod';

// Schema for product update
const UpdateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long').optional(),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug is too long').optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
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

// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid product ID',
        },
        { status: 400 }
      );
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
      },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid product ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = UpdateProductSchema.safeParse(body);
    
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

    // Check if slug already exists (excluding current product)
    if (updateData.slug) {
      const existingProductBySlug = await ProductModel.existsBySlug(updateData.slug, productId);
      if (existingProductBySlug) {
        return NextResponse.json(
          {
            success: false,
            error: 'Slug already exists',
          },
          { status: 409 }
        );
      }
    }

    // Check if SKU already exists (excluding current product)
    if (updateData.sku) {
      const existingProductBySku = await ProductModel.existsBySku(updateData.sku, productId);
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

    // Update product
    const product = await ProductModel.update(productId, {
      ...updateData,
      imageUrl: updateData.imageUrl || undefined,
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update product',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid product ID',
        },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Delete product
    const deleted = await ProductModel.delete(productId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete product',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete product',
      },
      { status: 500 }
    );
  }
}
