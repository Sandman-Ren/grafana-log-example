# Stage 1: Build the TypeScript code
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2: Run the app
FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev

ENV NODE_ENV=production
COPY .env .env

CMD ["node", "dist/index.js"]
