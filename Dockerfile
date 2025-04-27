FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --force

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

COPY start.sh ./
RUN chmod +x start.sh

CMD ["./start.sh"]
