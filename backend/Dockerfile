FROM node:22-alpine
# RUN mkdir /app
RUN mkdir -p /app/src/public/temp /app/src/public/uploads
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN mkdir -p /app/src/public/images && \
    cp -r /app/src/public/images/* /app/src/public/images/ 2>/dev/null || true
CMD ["npm", "run", "dev"]
