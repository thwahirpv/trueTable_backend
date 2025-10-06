#!/bin/bash

# This script deploys the Convex backend to production.

set -e

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Check if Convex CLI is installed
if ! command -v convex &> /dev/null; then
  echo "Convex CLI could not be found. Please install it first."
  exit 1
fi

# Deploy the Convex backend
echo "Deploying Convex backend to production..."
npx convex deploy --prod

echo "Deployment completed successfully!"