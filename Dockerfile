# Etapa 1: build da aplicação Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: servir com Nginx
FROM nginx:1.27-alpine
COPY --from=build /app/dist/desafio-petrobras-front-end/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
