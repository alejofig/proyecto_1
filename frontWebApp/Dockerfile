FROM node:alpine as angular
WORKDIR /ng-app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=angular /ng-app/dist/front-webb-app/browser /usr/share/nginx/html
EXPOSE 80
