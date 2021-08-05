FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
COPY security-headers.conf /etc/nginx/security-headers.conf
COPY /build /usr/share/nginx/html
