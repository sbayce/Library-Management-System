FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4000

CMD npx prisma migrate deploy && node dist/index.js