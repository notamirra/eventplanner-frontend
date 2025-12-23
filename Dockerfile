# ---------- Build stage ----------
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# ---------- Runtime stage (OpenShift SAFE) ----------
FROM registry.access.redhat.com/ubi8/httpd-24

# Copy React build output
COPY --from=build /app/build /var/www/html/

EXPOSE 8080
