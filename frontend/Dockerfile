# Production-ready Dockerfile for React (Vite)

# Build stage
FROM node:22-alpine AS build
ARG VITE_API_BASE_URL=http://localhost:8080/api/v1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --silent

COPY frontend/ ./
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Default config is SPA-friendly (overridden by compose volumes if present)
EXPOSE 80

