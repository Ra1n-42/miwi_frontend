FROM node:22.11.0-alpine

WORKDIR /app

RUN npm install -g npm@latest

COPY package*.json ./

RUN npm cache clean --force && npm install --no-cache

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "dist"]
