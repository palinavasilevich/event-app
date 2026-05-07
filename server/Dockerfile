FROM oven/bun:1-alpine AS build

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM node:20.19-alpine3.21

RUN apk upgrade --no-cache

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]