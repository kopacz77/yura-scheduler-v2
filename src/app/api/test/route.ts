import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$connect();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful'
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error?.message || 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}