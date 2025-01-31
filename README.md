# Yura's Ice Dance Scheduler

A comprehensive scheduling and business management system for ice dance coaching, built on [shadcn/ui-template](https://github.com/shadcn/next-template).

## Project Overview

This application helps ice dance coach Yura Min manage lesson scheduling, student progress tracking, and business operations.

### Core Features

#### Implemented
- **Scheduling System**
  - Multi-view calendar (day/week/month)
  - Automated conflict detection
  - Recurring lesson support
  - Resource management
  - Rink availability tracking

- **Payment Processing**
  - Venmo/Zelle integration
  - Payment status tracking
  - Automated receipts
  - Payment history
  - Reminder system

- **Student Portal**
  - Lesson booking interface
  - Progress tracking
  - Payment management
  - Schedule viewing
  - Lesson history

- **Notification System**
  - Automated email notifications
  - Lesson reminders
  - Payment confirmations
  - Schedule updates

#### In Development
- Enhanced progress tracking
- Advanced reporting system
- Group lesson management
- Administrative dashboard
- Mobile optimization

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Email**: Resend
- **State Management**: React Query
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

```bash
Node.js >= 18
PostgreSQL
pnpm (recommended)
```

### Environment Setup

1. Copy .env.example to .env
2. Update environment variables:
```env
DATABASE_URL="your-neon-db-url"
DIRECT_URL="your-neon-direct-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="your-resend-api-key"
ADMIN_EMAIL="admin@example.com"
```

### Installation

```bash
# Install dependencies
pnpm install

# Initialize database
pnpm prisma migrate dev

# Start development server
pnpm dev
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── admin/        # Admin interface components
│   ├── dashboard/    # Dashboard components
│   ├── layout/       # Layout components
│   ├── planner/      # Scheduling components
│   ├── students/     # Student portal components
│   └── ui/           # shadcn/ui components
├── lib/              # Utility functions
│   ├── auth/         # Authentication logic
│   ├── email/        # Email templates and sending
│   ├── scheduling/   # Scheduling logic
│   └── utils/        # Helper functions
├── models/           # Data models
└── types/            # TypeScript types
```

## API Routes

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments` - Update appointment
- `DELETE /api/appointments` - Delete appointment

### Resources
- `GET /api/resources` - List resources
- `POST /api/resources` - Create resource
- `PUT /api/resources` - Update resource
- `DELETE /api/resources` - Delete resource

### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment
- `PUT /api/payments` - Update payment status

### Students
- `GET /api/student/appointments` - Get student appointments
- `GET /api/student/payments` - Get student payments
- `GET /api/student/progress` - Get student progress

## Database Schema

Key models:
- `User` - Authentication and user data
- `Student` - Student profiles and preferences
- `Resource` - Rink areas and facilities
- `Appointment` - Lesson scheduling
- `Payment` - Payment tracking

## Contributing

1. Create feature branch from main
2. Implement changes following project patterns
3. Add tests
4. Submit pull request

### Development Guidelines

- Use TypeScript strict mode
- Follow existing component patterns
- Maintain API response formats
- Add proper error handling
- Include loading states
- Write comprehensive tests

## Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Run with coverage
pnpm test:coverage
```

## Deployment

The application is deployed on Vercel:

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy to production

## License

MIT
