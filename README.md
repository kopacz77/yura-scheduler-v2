# Yura's Ice Dance Scheduling System

Built on [shadcn/ui-template](https://github.com/shadcn/ui-template) - A Next.js 14 template with shadcn/ui pre-configured.

## Project Overview

A comprehensive scheduling and business management system for ice dance coach Yura Min, featuring:

- Lesson scheduling with conflict detection
- Resource management (rink spaces)
- Payment tracking (Venmo/Zelle)
- Student portal
- Automated notifications

## Core Features

### Implemented:

- **Scheduling System**
  - Calendar with day/week/month views
  - Appointment management
  - Recurring lessons
  - Conflict detection
  - Resource allocation

- **Resource Management**
  - Rink/space management
  - Maintenance scheduling
  - Availability tracking
  - Capacity controls

- **Payment System**
  - Venmo/Zelle tracking
  - Payment status management
  - Automated receipts
  - Payment history

- **Student Portal**
  - Dashboard view
  - Lesson history
  - Payment tracking
  - Basic progress monitoring

- **Email System**
  - Lesson confirmations
  - Payment notifications
  - Automated reminders
  - Custom templates

### Pending Implementation:

- **Progress Tracking**
  - Detailed metrics
  - Skill assessments
  - Achievement system
  - Progress reports

- **Advanced Reports**
  - Financial analytics
  - Attendance tracking
  - Revenue forecasting
  - Performance metrics

- **Enhanced Scheduling**
  - Group lessons
  - Wait list
  - Schedule templates
  - Holiday handling

- **Admin Features**
  - Business analytics
  - Batch operations
  - System settings
  - Role management

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **UI**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Email**: Resend
- **State Management**: React Query
- **Date Handling**: date-fns

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/kopacz77/yura-scheduler-v2.git
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
DATABASE_URL="your-neon-db-url"
DIRECT_URL="your-neon-direct-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="your-resend-api-key"
ADMIN_EMAIL="yura@example.com"
```

5. Initialize database:
```bash
npx prisma db push
```

6. Start development server:
```bash
pnpm dev
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── lib/             # Utilities
│   ├── types/           # TypeScript types
│   └── models/          # Data models
├── prisma/              # Database schema
└── public/             # Static assets
```

## Development Guidelines

1. **Component Creation**:
   - Use shadcn/ui components
   - Maintain TypeScript types
   - Implement error boundaries
   - Add loading states

2. **API Routes**:
   - Include authentication
   - Validate inputs
   - Handle errors gracefully
   - Follow REST principles

3. **Database Operations**:
   - Use Prisma Client
   - Include transactions
   - Handle relationships
   - Optimize queries

4. **Testing**:
   - Write unit tests
   - Add integration tests
   - Include E2E testing
   - Test error cases

## Security Considerations

- Role-based access control
- Input validation
- API rate limiting
- Data encryption
- Secure sessions

## Deployment

The application is configured for deployment on Vercel:

1. Connect to GitHub repository
2. Configure environment variables
3. Deploy main branch

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT
