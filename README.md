# Yura's Ice Dance Scheduler

A professional scheduling system for ice dance coaching, built with modern web technologies.

## Tech Stack

- **Frontend:**
  - React
  - Tailwind CSS
  - shadcn/ui components
  - Planner Component for scheduling
  - TypeScript

- **Backend:**
  - Netlify Functions (Serverless)
  - Neon PostgreSQL (Serverless)
  - Serverless architecture

- **Infrastructure:**
  - Hosted on Netlify
  - Database by Neon
  - Authentication via Auth.js

## Features

- [x] Professional scheduling interface
- [x] Multiple lesson types support
- [x] Student management
- [x] Ice rink scheduling
- [x] Payment processing
- [x] Email notifications
- [x] Mobile responsive design

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Run the development server:
```bash
npm run dev
```

4. For database development:
```bash
# Connect to Neon PostgreSQL
npm run db:studio
```

## Deployment

The application automatically deploys to Netlify when changes are pushed to the main branch.

## Database Schema

See [DATABASE.md](./docs/DATABASE.md) for the complete database schema and relationships.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Yura Min - Ice Dance Coach

Project Link: [https://github.com/kopacz77/yura-scheduler-v2](https://github.com/kopacz77/yura-scheduler-v2)