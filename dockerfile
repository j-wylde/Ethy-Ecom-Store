# Build stage
FROM node:lts-alpine3.18 AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Copy all project files
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 5320

# Set host to make the server accessible outside the container
ENV HOST=0.0.0.0

# Run preview server
CMD ["npm", "run", "preview"]


