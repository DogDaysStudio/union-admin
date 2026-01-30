FROM nginx:alpine
COPY dist /usr/share/nginx/html
RUN echo $'server {\n\
              listen 80;\n\
              server_name localhost;\n\
              location / {\n\
                root /usr/share/nginx/html;\n\
                index index.html;\n\
              }\n\
              error_page 404 403 =200 /;\n\
            }\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
