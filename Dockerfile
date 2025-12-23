# ---------- Build stage ----------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- Runtime stage ----------
FROM registry.access.redhat.com/ubi8/nginx-120

# Copy React build output
COPY --from=build /app/build /usr/share/nginx/html

# IMPORTANT:
# ❌ DO NOT copy nginx.conf
# ❌ DO NOT override default config

EXPOSE 8080
