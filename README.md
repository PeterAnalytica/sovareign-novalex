# SOVEREIGN NOVALEX: NGINX CONFIGURATION
# Security Layer for SIL Ltd | Architect: Bamidele Peter

events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    # Gzip for fast loading in low-bandwidth regions (Africa)
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    server {
        listen 80;
        server_name acasovereign.online;

        # Frontend Gateway (The ASI Interface)
        location / {
            proxy_pass http://frontend:3314;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Backend Vault (The ASV/Chronos API)
        location /api {
            proxy_pass http://backend:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health Check for Probity
        location /health {
            return 200 'Novalex Systems Operational';
            add_header Content-Type text/plain;
        }
    }
}
