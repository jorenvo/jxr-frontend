FROM node:lts-alpine3.15

# Bash for post_build.sh
RUN apk add --no-cache bash

WORKDIR /jxr-frontend
COPY . .

RUN npm install

# TODO: building is done by docker compose because it determines JXR_BACKEND
# RUN npm run build

CMD [ "npm", "run", "server" ]
EXPOSE 80