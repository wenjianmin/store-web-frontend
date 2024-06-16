FROM nginx:stable

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY ./dist /usr/share/nginx/html

EXPOSE 4444

ENV TZ=Asia/Guangzhou
