FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/
RUN npm install --workspace server

COPY server ./server
WORKDIR /app/server
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY server/package*.json ./server/
RUN npm install --workspace server --omit=dev

COPY --from=builder /app/server/dist ./server/dist

WORKDIR /app/server
EXPOSE 4000
CMD ["npm", "start"]
