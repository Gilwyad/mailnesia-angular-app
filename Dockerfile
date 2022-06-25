# build stage
FROM node:16-bullseye as node-build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:prod

# stage 2
FROM nginx:1.22.0
COPY --from=node-build /app/dist/mailnesia-angular-app /usr/share/nginx/html
