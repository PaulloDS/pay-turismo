#!/bin/sh

echo "Aguardando o banco de dados ficar pronto..."
sleep 10

echo "Rodando migrações..."
npx prisma migrate deploy

echo "Iniciando standalone server..."
node .next/standalone/server.js
