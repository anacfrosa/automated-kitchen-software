ARG IMAGE_VERSION=20.9.0-alpine

#========== Local Image ==========#

FROM node:${IMAGE_VERSION} AS local

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build notifications


#========== Prod Image ==========#

FROM node:${IMAGE_VERSION} AS prod

ENV NODE_ENV production

WORKDIR /home/node/cook4me

COPY --chown=node:node package*.json ./

COPY --chown=node:node . .

COPY --chown=node:node --from=local /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=local /usr/src/app/dist ./dist

USER node

CMD [ "node", "dist/apps/notifications/main.js" ]
