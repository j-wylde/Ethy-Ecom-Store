FROM node:lts-alpine3.18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5320

RUN npm install

CMD ["npm", "start"]
