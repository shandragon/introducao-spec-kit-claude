FROM node:20-alpine AS construtor

WORKDIR /app

COPY package.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY src ./src/

FROM node:20-alpine AS producao

WORKDIR /app

COPY package.json ./
RUN npm ci --omit=dev

COPY --from=construtor /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=construtor /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma/
COPY src ./src/

EXPOSE 3000

CMD ["node", "src/index.js"]
