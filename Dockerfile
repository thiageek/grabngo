FROM node:20-alpine

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npx prisma generate --schema ./prisma/schema.prisma
RUN npm run build

CMD npm run start:migrate:prod ; npm run start:prod
