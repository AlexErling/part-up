proxy_cache_path /tmp/nginx levels=1:2 keys_zone={{ item.environment }}:8m max_size=100m inactive=10m;

upstream {{ item.environment }} {
    ip_hash;

    {% for ip in groups['appservers-' + item.environment] %}
    server {{ hostvars[ip]['ansible_eth1']['ipv4']['address'] }}:3000;
    {% endfor %}
}

server {
    listen 80;
    server_name {{ item.url }};

    location ~* {
        rewrite ^ https://{{ item.url }}$request_uri? permanent;
    }
}

server {
    listen 443 ssl spdy;
    server_name {{ item.url }};

    ssl on;
    ssl_certificate /etc/ssl/{{ item.certificate }};
    ssl_certificate_key /etc/ssl/{{ item.key }};
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_ciphers ECDH+AESGCM:ECDH+AES256:ECDH+AES128:DES-CBC3-SHA:!ADH:!AECDH:!MD5;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    add_header Strict-Transport-Security "max-age=63072000";
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4;

    error_page 500 502 503 504 =200 @maintenance;
    location @maintenance {
        root /var/www/partup-maintenance/;
        try_files $uri /index.html =404;
    }

    location / {
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $http_host;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Nginx-Proxy true;

        proxy_http_version 1.1;
        proxy_redirect off;

        proxy_ignore_headers X-Accel-Expires Expires Cache-Control Set-Cookie;
        proxy_hide_header Cache-Control;

        proxy_cache {{ item.environment }};
        proxy_cache_key $host$uri$is_args$args;
        proxy_cache_valid 200 1m;
        proxy_cache_bypass $http_cache_control;
        add_header X-Proxy-Cache $upstream_cache_status;

        proxy_pass http://{{ item.environment }};
    }
}
