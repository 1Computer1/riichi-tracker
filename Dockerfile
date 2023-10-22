FROM node:lts AS build

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build dist /usr/share/nginx/html
