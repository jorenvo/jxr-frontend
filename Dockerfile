FROM node:lts-alpine3.15

# Bash for post_build.sh
RUN apk add --no-cache bash

WORKDIR /jxr-frontend
COPY . .

RUN npm install
RUN npm build

CMD [ "npm", "run", "server" ]
EXPOSE 80