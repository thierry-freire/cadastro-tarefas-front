FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.27-alpine

RUN apk add --no-cache gettext

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY env.template.js /usr/share/nginx/html/env.template.js

COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

COPY --from=build /app/dist/desafio-petrobras-front-end/browser/ /usr/share/nginx/html/

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
