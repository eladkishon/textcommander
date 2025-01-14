FROM node:22

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN apt-get update && apt-get install -y chromium

RUN pnpm install

COPY . .

RUN npm run build

CMD ["node", "dist/main.js"]