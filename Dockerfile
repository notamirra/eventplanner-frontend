# ---------- Build stage (Node) ----------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- Runtime stage (OpenShift-safe Nginx) ----------
FROM registry.access.redhat.com/ubi8/nginx-120

# Copy React build output to nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Optional: custom nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
