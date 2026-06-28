#!/bin/sh
set -e

echo "🔄 Gerando cliente Prisma..."
npx prisma generate

echo "🚀 Iniciando servidor..."
npm start
