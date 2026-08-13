FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
    git \
    curl \
    bash \
    openssl \
    openssl-dev \
    ca-certificates \
    libc6-compat \
    && update-ca-certificates

# Copy package files first for Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

EXPOSE 3000

# Start Next.js development server
CMD ["npm", "run", "dev"]