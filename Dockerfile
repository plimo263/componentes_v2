FROM node:14.4.0 as buildando


WORKDIR /dados 

COPY . /dados

RUN yarn install && yarn run build-storybook

FROM nginx:stable-alpine

COPY --from=buildando /dados/storybook-static /usr/share/nginx/html


