# ---------- Build stage ----------
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# ---------- Runtime stage ----------
FROM registry.access.redhat.com/ubi8/httpd-24

COPY --from=build /app/build /var/www/html/

# Apache rewrite config (REQUIRED for React)
RUN printf '<Directory "/var/www/html">\n\
Require all granted\n\
RewriteEngine On\n\
RewriteCond %%{REQUEST_FILENAME} -f\n\
RewriteRule ^ - [L]\n\
RewriteCond %%{REQUEST_FILENAME} -d\n\
RewriteRule ^ - [L]\n\
RewriteRule ^ /index.html [L]\n\
</Directory>\n' \
> /etc/httpd/conf.d/react.conf

EXPOSE 8080
