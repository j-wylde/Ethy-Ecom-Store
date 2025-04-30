# Build stage
FROM node:lts-alpine3.18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 5320


CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]


