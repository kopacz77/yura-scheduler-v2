#!/bin/bash

# Check if all required environment variables are set
required_vars=(
  "DATABASE_URL"
  "NEXTAUTH_SECRET"
  "NEXTAUTH_URL"
)

missing_vars=0
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: Required environment variable $var is not set"
    missing_vars=$((missing_vars + 1))
  fi
done

if [ $missing_vars -gt 0 ]; then
  echo "Error: $missing_vars required environment variables are missing"
  exit 1
fi
