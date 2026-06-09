FROM node:18-alpine
WORKDIR /usr/src/app

# Copiar package.json primero para aprovechar cache de capas
COPY package.json package-lock.json ./
RUN npm ci --production --no-audit --no-fund

# Copiar el resto del código
COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/index.js"]
