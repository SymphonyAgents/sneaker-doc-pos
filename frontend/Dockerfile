FROM node:20-alpine AS deps
WORKDIR /app
RUN npm install -g pnpm@10
COPY package.json ./
RUN pnpm install --no-frozen-lockfile

FROM deps AS builder
WORKDIR /app
COPY . .

ENV NEXT_PUBLIC_API_URL=https://sneakerdoc-api.symph.co
ENV NEXT_PUBLIC_APP_URL=https://sneakerdoc.symph.co
ENV NEXT_PUBLIC_SUPABASE_URL=https://zcevzkovxfryhwkkuvlf.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_-UqXYTzlbYNOZK54UBQbtQ_ZXdJvOKC
ENV NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=sneaker-doc

RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
