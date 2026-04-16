FROM node:20-alpine AS builder
WORKDIR /app

# Copy frontend package.json and install with npm (not pnpm - avoids symlink issues)
COPY frontend/package.json ./
RUN npm install

# Copy source and build
COPY frontend ./

# Production env vars baked at build time
ENV NEXT_PUBLIC_API_URL=https://sneakerdoc-api.symph.co
ENV NEXT_PUBLIC_APP_URL=https://sneakerdoc.symph.co
ENV NEXT_PUBLIC_SUPABASE_URL=https://zcevzkovxfryhwkkuvlf.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_-UqXYTzlbYNOZK54UBQbtQ_ZXdJvOKC
ENV NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=sneaker-doc
ENV NEXT_PUBLIC_POSTHOG_KEY=phc_AKKwHoQ8szyC4yzfBuCec9oAGMFib5MPnWBUrFs8Ce6s
ENV NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Runtime env vars (needed by middleware/SSR)
ENV NEXT_PUBLIC_API_URL=https://sneakerdoc-api.symph.co
ENV NEXT_PUBLIC_APP_URL=https://sneakerdoc.symph.co
ENV NEXT_PUBLIC_SUPABASE_URL=https://zcevzkovxfryhwkkuvlf.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_-UqXYTzlbYNOZK54UBQbtQ_ZXdJvOKC
ENV NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=sneaker-doc
ENV NEXT_PUBLIC_POSTHOG_KEY=phc_AKKwHoQ8szyC4yzfBuCec9oAGMFib5MPnWBUrFs8Ce6s
ENV NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Copy built app + dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

CMD ["./node_modules/.bin/next", "start", "-p", "8080"]
