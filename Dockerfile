FROM node:16

RUN mkdir -p /usr/src/tscord
WORKDIR /usr/src/tscord

COPY package.json ./

RUN npm install --production

COPY . .

CMD ["npm", "start"]

