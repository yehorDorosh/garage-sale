FROM node:16.15.1

WORKDIR /app

COPY package.json .

# RUN npm config set fetch-retry-mintimeout 20000
# RUN npm config set fetch-retry-maxtimeout 120000
RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 443

# CMD ["npm", "run", "dev"]
