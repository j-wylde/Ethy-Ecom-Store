FROM node:slim AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

RUN npm install -g serve

CMD ["npm", "start"]

#CMD ["serve", "-s", "dist"]