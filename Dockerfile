FROM node:6-alpine

COPY ./ /oem
WORKDIR /oem

RUN npm install

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["start"]

