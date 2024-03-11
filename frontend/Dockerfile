FROM node:20-alpine3.18 as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci --silent
# Build the app
RUN npm run build


FROM nginx:1.19.6-alpine
COPY --from=builder /app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
