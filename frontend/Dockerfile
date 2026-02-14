# build
FROM node:18 AS build

WORKDIR /production
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build


# nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /production/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
