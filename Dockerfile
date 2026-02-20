FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE $PORT
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
