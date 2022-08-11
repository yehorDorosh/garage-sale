FROM node:16.15.1

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80
EXPOSE 443

RUN npm run build

CMD ["npm", "start"]