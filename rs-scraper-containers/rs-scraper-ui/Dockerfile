FROM node:16 as ui-builder
WORKDIR /
COPY . .

RUN npm install

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

FROM nginx:1.17.1-alpine
COPY --from=ui-builder nginx.conf /etc/nginx/nginx.conf
COPY --from=ui-builder mime.types /etc/nginx/mime.types
COPY --from=ui-builder security-headers.conf /etc/nginx/security-headers.conf
COPY --from=ui-builder /build /usr/share/nginx/html
