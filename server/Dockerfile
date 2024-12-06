# server/Dockerfile

# Use a Node.js base image
FROM node:22.9.0-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Use a smaller base image for running the app
FROM node:22.9.0-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the port your app runs on
EXPOSE 3001

# Command to run the server
CMD ["node", "dist/main"]

