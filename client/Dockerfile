# client/Dockerfile

# Stage 1: Build the application
FROM node:22.9.0-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite application
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Copy the build output to Nginx's HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port Nginx serves on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

