FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Define build-time environment variables
ENV NODE_ENV=production
ENV SUPABASE_URL=https://kuselopeqgsjoqdtkcyj.supabase.co
ENV SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1c2Vsb3BlcWdzam9xZHRrY3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDE0MzgwMCwiZXhwIjoyMDU5NzE5ODAwfQ.MLhg0-8zW6qsg6KEPMDo6WmWGPIDS9bc4dzXqXH0XYc
ENV JWT_SECRET=your_jwt_secret

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]