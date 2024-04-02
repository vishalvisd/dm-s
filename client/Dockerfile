FROM node:20-alpine

COPY . /app/

WORKDIR /app

RUN npm i

EXPOSE 4173

CMD ["/bin/sh", "entrypoint.sh"]