FROM node:12.13.0 as builder
WORKDIR /shipping-admin
ADD ./ /shipping-admin

RUN yarn install
ARG MODE
RUN yarn run build --mode ${MODE}

# Serve
FROM nginx:1.18.0-alpine
WORKDIR /usr/share/nginx
COPY --from=builder /shipping-admin/dist dist
RUN rm -rf html
RUN mv dist html
COPY --chown=root:root ./deploy/docker/nginx.conf /etc/nginx/conf.d/default.conf
