FROM node:alpine as builder

WORKDIR /app
COPY ./package.json ./
RUN yarn install
COPY . .
RUN yarn run build

FROM nginx:alpine
EXPOSE 5173
COPY --from=builder ./app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder ./app/dist /usr/share/nginx/html
