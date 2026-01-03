# Use Node 22 (matching your devDependencies)
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
# Copy prisma schema so we can generate the client
COPY prisma ./prisma/

RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]