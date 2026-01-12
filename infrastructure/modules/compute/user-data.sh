#!/bin/bash
# Magento EC2 User Data Script
# This script runs on first boot to configure the Magento server

set -e

# Update system
yum update -y

# Install required packages
amazon-linux-extras install -y php8.2 nginx1 redis6
yum install -y \
    php-fpm \
    php-mysqlnd \
    php-opcache \
    php-xml \
    php-gd \
    php-mbstring \
    php-intl \
    php-bcmath \
    php-soap \
    php-zip \
    php-json \
    composer \
    git \
    unzip \
    amazon-cloudwatch-agent

# Configure PHP-FPM
cat > /etc/php-fpm.d/www.conf << 'EOF'
[www]
user = nginx
group = nginx
listen = /run/php-fpm/www.sock
listen.owner = nginx
listen.group = nginx
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500
php_admin_value[memory_limit] = 2G
php_admin_value[max_execution_time] = 1800
EOF

# Configure Nginx
cat > /etc/nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 4096;

    gzip on;
    gzip_types text/plain application/json application/javascript text/css;

    include /etc/nginx/conf.d/*.conf;
}
EOF

cat > /etc/nginx/conf.d/magento.conf << 'EOF'
upstream fastcgi_backend {
    server unix:/run/php-fpm/www.sock;
}

server {
    listen 80;
    server_name _;

    set $MAGE_ROOT /var/www/magento;
    include /var/www/magento/nginx.conf.sample;

    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
EOF

# Create Magento directory
mkdir -p /var/www/magento
chown -R nginx:nginx /var/www/magento

# Environment variables for Magento
cat > /etc/profile.d/magento.sh << EOF
export MAGENTO_DB_HOST="${db_endpoint}"
export MAGENTO_REDIS_HOST="${redis_endpoint}"
export MAGENTO_ENV="${environment}"
EOF

# Start services
systemctl enable nginx php-fpm
systemctl start nginx php-fpm

# Install CloudWatch agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -s \
    -c ssm:AmazonCloudWatch-linux

echo "Magento server setup complete!"
