FROM node:current-alpine3.21 AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

RUN npm install -g serve

CMD ["serve", "-s", "dist"]