FROM node:10-alpine

COPY ./ /src
WORKDIR /src

RUN npm install

ENV TRAY_ENDPOINT=staging
ENV TRAY_PARTNER=partner
ENV TRAY_MASTER_TOKEN=abc123

CMD npm run api & npm run start

