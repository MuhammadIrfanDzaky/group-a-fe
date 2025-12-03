import { NextRequest, NextResponse } from 'next/server';
import { reviewSchema, productIdSchema, productResponseSchema, type ReviewInput, type ProductResponse } from '@/app/lib/validation';

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate product ID
    const productIdValidation = productIdSchema.safeParse(id);
    if (!productIdValidation.success) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: response.status }
      );
    }

    const data: unknown = await response.json();
    
    // Validate response data
    const productDataValidation = productResponseSchema.safeParse(data);
    if (!productDataValidation.success) {
      console.error('Invalid product response structure:', productDataValidation.error);
      return NextResponse.json(
        { error: 'Invalid product data received from backend' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(productDataValidation.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate product ID
    const productIdValidation = productIdSchema.safeParse(id);
    if (!productIdValidation.success) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate review data
    const validationResult = reviewSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Use validated data with proper type
    const validatedData: ReviewInput = validationResult.data;
    
    const response = await fetch(`${BACKEND_URL}/api/products/${id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to submit review' }));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

