FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
RUN npm install --workspace client

COPY client ./client
WORKDIR /app/client

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.27-alpine

COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/client/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
