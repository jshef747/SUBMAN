# Use standard Node (Debian-based) instead of Alpine
# This solves the OpenSSL version mismatch automatically.
FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

# Generate Prisma Client
RUN npx prisma generate

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]