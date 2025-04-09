FROM arm64v8/node:23.11.0-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

RUN npm install -g serve

CMD ["serve", "-s", "dist"]

#CMD ["npm", "start"]