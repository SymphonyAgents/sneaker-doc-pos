FROM node:20-alpine AS deps
WORKDIR /app
RUN npm install -g pnpm@10
COPY package.json ./
RUN pnpm install --no-frozen-lockfile

FROM deps AS builder
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 8080
CMD ["node", "dist/src/main"]
