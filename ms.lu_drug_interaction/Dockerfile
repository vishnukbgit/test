From node:14.20.0-alpine3.16

WORKDIR /app

COPY package*.json /app/

COPY . /app/

ENV PG_USERNAME 'ubuntu'
ENV PG_PASSWORD 'foreverG00d'
ENV PG_DATABASE 'gessit'
ENV PG_HOST 'localhost'

RUN npm install

EXPOSE 3005

CMD ["node", "app.js"]