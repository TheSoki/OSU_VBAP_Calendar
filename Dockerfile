# Base image
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma
COPY .env ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]
