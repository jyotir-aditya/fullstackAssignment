#!/bin/sh

# Set default environment variables if not provided
export SUPABASE_URL=${SUPABASE_URL:-$(grep SUPABASE_URL /app/server/.env | cut -d '=' -f2)}
export SUPABASE_KEY=${SUPABASE_KEY:-$(grep SUPABASE_KEY /app/server/.env | cut -d '=' -f2)}
export JWT_SECRET=${JWT_SECRET:-$(grep JWT_SECRET /app/server/.env | cut -d '=' -f2)}

# Start the NestJS server in the background
cd /app/server && node dist/main.js &

# Start nginx in the foreground (this keeps the container running)
nginx -g "daemon off;"