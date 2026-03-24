FROM nginx:stable-alpine

# Copy the Sovereign config into the container
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
