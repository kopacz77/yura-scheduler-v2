#!/bin/bash

# Install Google Calendar integration dependencies
npm install googleapis@128.0.0 google-auth-library@9.6.3 --save

# Install dev dependencies for types
npm install @types/google-auth-library@3.0.0 --save-dev

# Generate Prisma types
npm run prisma:generate
