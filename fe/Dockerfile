# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS build

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://localhost:3005/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runner

RUN apk add --no-cache tzdata

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start"]
