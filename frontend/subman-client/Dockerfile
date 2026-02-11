FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- CHANGE 1: Use relative path (Generic) ---
# This means "Talk to whatever IP the browser is currently on, at /api"
ENV VITE_API_URL=/api

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# --- CHANGE 2: Use our custom Nginx config ---
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]