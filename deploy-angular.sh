#!/bin/bash

# Script de despliegue para aplicación Angular en Apache2 Ubuntu 24
# Uso: sudo ./deploy-angular.sh

set -e  # Salir si hay error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración
APP_NAME="angular-app"
DOMAIN="tu-dominio.com"  # Cambiar por tu dominio
BUILD_DIR="dist/ImgAIS"
APACHE_DIR="/var/www/html/$APP_NAME"
APACHE_CONF="/etc/apache2/sites-available/$APP_NAME.conf"

echo -e "${GREEN}🚀 Iniciando despliegue de aplicación Angular...${NC}"

# 1. Verificar que estamos ejecutando como root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Este script debe ejecutarse como root (sudo)${NC}"
    exit 1
fi

# 2. Verificar que existe el build
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ No se encuentra el directorio de build: $BUILD_DIR${NC}"
    echo -e "${YELLOW}💡 Ejecuta: ng build --configuration=production${NC}"
    exit 1
fi

# 3. Instalar Apache2 si no está instalado
if ! command -v apache2 &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Apache2...${NC}"
    apt update
    apt install -y apache2
fi

# 4. Habilitar módulos necesarios
echo -e "${YELLOW}🔧 Habilitando módulos de Apache...${NC}"
a2enmod rewrite
a2enmod headers
a2enmod deflate
a2enmod expires
a2enmod ssl

# 5. Crear directorio de la aplicación
echo -e "${YELLOW}📁 Creando directorio de aplicación...${NC}"
mkdir -p "$APACHE_DIR"

# 6. Copiar archivos de build
echo -e "${YELLOW}📋 Copiando archivos...${NC}"
cp -r "$BUILD_DIR"/* "$APACHE_DIR"/

# 7. Configurar permisos
echo -e "${YELLOW}🔐 Configurando permisos...${NC}"
chown -R www-data:www-data "$APACHE_DIR"
chmod -R 755 "$APACHE_DIR"

# 8. Crear configuración de Virtual Host
echo -e "${YELLOW}⚙️ Creando configuración de Apache...${NC}"
cat > "$APACHE_CONF" << EOF
<VirtualHost *:80>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN
    DocumentRoot $APACHE_DIR
    
    <Directory $APACHE_DIR>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # CONFIGURACIÓN CRÍTICA PARA ANGULAR SPA
        RewriteEngine On
        RewriteBase /
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
        
        # Headers de seguridad
        Header always set X-Frame-Options "SAMEORIGIN"
        Header always set X-Content-Type-Options "nosniff"
        Header always set X-XSS-Protection "1; mode=block"
        Header always set Referrer-Policy "strict-origin-when-cross-origin"
    </Directory>
    
    # Cache para assets
    <LocationMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header set Cache-Control "public, max-age=31536000, immutable"
    </LocationMatch>
    
    # No cache para index.html
    <Files "index.html">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
    </Files>
    
    # Compresión
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain text/html text/css
        AddOutputFilterByType DEFLATE application/javascript application/json
    </IfModule>
    
    ErrorLog \${APACHE_LOG_DIR}/${APP_NAME}_error.log
    CustomLog \${APACHE_LOG_DIR}/${APP_NAME}_access.log combined
</VirtualHost>
EOF

# 9. Habilitar el sitio
echo -e "${YELLOW}🌐 Habilitando sitio...${NC}"
a2ensite "$APP_NAME"

# 10. Deshabilitar sitio por defecto (opcional)
read -p "¿Deshabilitar sitio por defecto de Apache? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    a2dissite 000-default
fi

# 11. Verificar configuración
echo -e "${YELLOW}✅ Verificando configuración...${NC}"
if apache2ctl configtest; then
    echo -e "${GREEN}✅ Configuración válida${NC}"
else
    echo -e "${RED}❌ Error en configuración${NC}"
    exit 1
fi

# 12. Reiniciar Apache
echo -e "${YELLOW}🔄 Reiniciando Apache...${NC}"
systemctl restart apache2

# 13. Verificar estado
if systemctl is-active --quiet apache2; then
    echo -e "${GREEN}✅ Apache está ejecutándose correctamente${NC}"
else
    echo -e "${RED}❌ Error: Apache no está ejecutándose${NC}"
    exit 1
fi

# 14. Configurar firewall (si ufw está activo)
if command -v ufw &> /dev/null && ufw status | grep -q "Status: active"; then
    echo -e "${YELLOW}🔥 Configurando firewall...${NC}"
    ufw allow 'Apache'
    ufw allow 'Apache Secure'
fi

echo
echo -e "${GREEN}🎉 ¡Despliegue completado exitosamente!${NC}"
echo -e "${GREEN}🌐 Tu aplicación está disponible en:${NC}"
echo -e "${GREEN}   HTTP:  http://$DOMAIN${NC}"
echo -e "${GREEN}   HTTP:  http://$(hostname -I | awk '{print $1}')${NC}"
echo
echo -e "${YELLOW}📝 Próximos pasos recomendados:${NC}"
echo -e "${YELLOW}   1. Configurar SSL con Let's Encrypt:${NC}"
echo -e "${YELLOW}      sudo apt install certbot python3-certbot-apache${NC}"
echo -e "${YELLOW}      sudo certbot --apache -d $DOMAIN${NC}"
echo -e "${YELLOW}   2. Verificar logs: sudo tail -f /var/log/apache2/${APP_NAME}_*.log${NC}"
echo -e "${YELLOW}   3. Configurar backups automáticos${NC}"
echo 