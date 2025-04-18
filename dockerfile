FROM node:23.11.0-alpine3.21 AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

RUN npm install -g serve

CMD ["serve", "-s", "dist"]