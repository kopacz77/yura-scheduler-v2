import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
