FROM node:18 AS build

WORKDIR /production
COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build


#nginx
FROM nginx:alpine
COPY --from=build /production/build /etc/share/nginx/html

EXPOSE 40

CMD [ "nginx", "-g", "daemon off;" ]