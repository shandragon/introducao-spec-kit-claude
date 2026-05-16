#!/bin/sh
set -e

echo "[entrypoint] Removendo binários antigos do Prisma..."
rm -rf node_modules/.prisma

echo "[entrypoint] Gerando Prisma Client (linux-musl-openssl-3.0.x)..."
npx prisma generate

echo "[entrypoint] Iniciando servidor em modo desenvolvimento..."
exec npm run dev
