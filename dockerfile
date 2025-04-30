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

# Serve stage
FROM node:lts-alpine3.18

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Expose port
EXPOSE 5320

# Set host to make the server accessible outside the container
ENV HOST=0.0.0.0

# Run preview server
CMD ["npm", "run", "preview"]

# FROM node:lts-alpine3.18

# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm install

# COPY . .

# RUN npm run build

# EXPOSE 5320

# RUN npm install

# CMD ["npm", "start"]

