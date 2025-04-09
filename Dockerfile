FROM node:20-alpine AS client-builder

# Build the client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM node:20-alpine AS server-builder

# Build the server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
# Use ARGs during build time for Supabase credentials
ARG SUPABASE_URL
ARG SUPABASE_KEY
ARG JWT_SECRET
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_KEY=$SUPABASE_KEY
ENV JWT_SECRET=$JWT_SECRET
RUN npm run build

# Final image
FROM nginx:alpine

# Set up node environment in nginx image
RUN apk add --update nodejs npm

# Copy client build
COPY --from=client-builder /app/client/dist /usr/share/nginx/html

# Copy nginx config
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Create server directory
WORKDIR /app/server

# Copy server build
COPY --from=server-builder /app/server/dist ./dist
COPY --from=server-builder /app/server/package.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Create a .env file with default values that can be overridden at runtime
RUN echo "SUPABASE_URL=https://kuselopeqgsjoqdtkcyj.supabase.co" > .env && \
    echo "SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1c2Vsb3BlcWdzam9xZHRrY3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDE0MzgwMCwiZXhwIjoyMDU5NzE5ODAwfQ.MLhg0-8zW6qsg6KEPMDo6WmWGPIDS9bc4dzXqXH0XYc" >> .env && \
    echo "JWT_SECRET=your_jwt_secret" >> .env

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose port
EXPOSE 80

# Run both services
CMD ["/app/start.sh"]