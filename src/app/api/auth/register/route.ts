import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '../../../../lib/db/models/user';
import { hashPassword } from '../../../../lib/auth/utils';
import { RegisterSchema, type ApiResponse } from '../../../../types';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = RegisterSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input data',
          message: validatedData.error.errors[0]?.message || 'Validation failed',
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validatedData.data;

    // Check if user already exists
    const existingUser = await UserModel.existsByEmail(email);
    
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User already exists',
          message: 'An account with this email already exists',
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'USER',
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        data: userWithoutPassword,
        message: 'Account created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to create account. Please try again.',
      },
      { status: 500 }
    );
  }
}
