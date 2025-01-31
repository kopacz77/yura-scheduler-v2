# Yura Scheduler v2

A comprehensive scheduling and business management system for ice dance coaching, built on top of [shadcn/ui-template](https://github.com/shadcn/ui-template).

## Overview

This application helps ice dance coach Yura Min manage lessons, track payments, and scale her business through automated scheduling, payment processing, and student management.

### Core Features

✅ = Implemented | 🚧 = In Progress | ⏳ = Planned

#### Scheduling System
- ✅ Calendar interface (day/week/month views)
- ✅ Appointment booking with conflict detection
- ✅ Recurring lesson support
- ✅ Resource management (rinks/areas)
- ✅ Maintenance scheduling
- 🚧 Group lesson management
- ⏳ Wait list system
- ⏳ Schedule templates

#### Payment Processing
- ✅ Venmo/Zelle payment tracking
- ✅ Payment status management
- ✅ Automated receipts
- ✅ Payment history
- ✅ Payment reminders

#### Student Portal
- ✅ Lesson booking interface
- ✅ Payment management
- ✅ Lesson history
- 🚧 Progress tracking
- ⏳ Goal setting

#### Admin Features
- ✅ Resource management
- ✅ Student management
- 🚧 Business analytics
- 🚧 Custom reporting
- ⏳ Batch operations

#### Notifications
- ✅ Email confirmations
- ✅ Payment reminders
- ✅ Lesson reminders
- ✅ Automated scheduling

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Email**: Resend
- **State Management**: React Query
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
DATABASE_URL="your-neon-db-url"
DIRECT_URL="your-neon-direct-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="your-resend-api-key"
ADMIN_EMAIL="yura@example.com"
```

### Installation

```bash
# Clone the repository
git clone https://github.com/kopacz77/yura-scheduler-v2.git

# Install dependencies
npm install

# Set up the database
npm run db:push

# Start the development server
npm run dev
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions and services
│   ├── types/           # TypeScript types
│   └── models/          # Data models
├── prisma/              # Database schema and migrations
└── public/             # Static assets
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
- `PUT /api/payments` - Update payment status
- `POST /api/payments/remind` - Send payment reminder

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Use TypeScript strictly
- Follow the established component patterns
- Add proper error handling
- Include loading states
- Write comprehensive tests
- Document new features

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

## Deployment

The application is configured for deployment on Vercel:

1. Fork the repository
2. Connect to Vercel
3. Configure environment variables
4. Deploy

## License

This project is MIT licensed.
