# =========================================
# STAGE 1: Builder (both dev/prod)
FROM node:20-bullseye-slim AS builder
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm install
COPY apps/api/. ./
COPY prisma ./prisma
RUN npx prisma generate
RUN npm run build

# =========================================
# STAGE 2: Production
FROM node:20-bullseye-slim AS production
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update -y \
  && apt-get install -y openssl chromium fonts-liberation \
  && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["npm", "run", "start:prod"]

# =========================================
# STAGE 3: Development (hot reload)
FROM node:20-bullseye-slim AS development
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm install
COPY apps/api/. ./
COPY prisma ./prisma
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "run", "start:dev"]
