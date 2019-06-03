FROM node:10-alpine

COPY ./ /src
WORKDIR /src

RUN npm install

ENV TRAY_ENDPOINT=prod

CMD npm run api & npm run start

