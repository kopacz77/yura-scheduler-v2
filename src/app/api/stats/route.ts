import { NextResponse } from 'next/server';

// Temporary mock data for development
export async function GET() {
  const mockStats = {
    overview: {
      totalStudents: 42,
      weeklyLessons: 156,
      outstandingAmount: 2450.00,
      averageProgress: 78
    },
    distribution: [
      { name: 'Pre-Preliminary', value: 8, color: '#FF6B6B' },
      { name: 'Preliminary', value: 12, color: '#4ECDC4' },
      { name: 'Pre-Juvenile', value: 10, color: '#45B7D1' },
      { name: 'Juvenile', value: 7, color: '#96CEB4' },
      { name: 'Intermediate', value: 5, color: '#FFD93D' }
    ],
    progress: [
      {
        student: 'Emma Johnson',
        progress: 85,
        lastLesson: '2024-01-25',
        nextLesson: '2024-02-01'
      },
      {
        student: 'Michael Chen',
        progress: 92,
        lastLesson: '2024-01-26',
        nextLesson: '2024-02-02'
      },
      {
        student: 'Sophie Williams',
        progress: 78,
        lastLesson: '2024-01-24',
        nextLesson: '2024-01-31'
      }
    ]
  };

  return NextResponse.json(mockStats);
}