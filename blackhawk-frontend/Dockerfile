FROM alpine

RUN apk add --update nodejs npm

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm ci

EXPOSE 3000
CMD [ "npm", "start" ]
