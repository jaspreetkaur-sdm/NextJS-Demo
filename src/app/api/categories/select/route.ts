import { NextRequest, NextResponse } from 'next/server';
import { CategoryModel } from '../../../../lib/db/models/category';

// GET /api/categories/select - Get categories for dropdown/select
export async function GET(request: NextRequest) {
  try {
    const categories = await CategoryModel.getForSelect();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get categories for select error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}
