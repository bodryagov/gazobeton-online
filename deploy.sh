#!/bin/bash

# Скрипт для деплоя на сервер
# Использование: ./deploy.sh

set -e

echo "🚀 Начинаем деплой на сервер..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Параметры сервера
SERVER="root@91.229.8.154"
PROJECT_DIR="/var/www/gazobeton-online"

echo -e "${YELLOW}📦 Шаг 1: Обновление кода на сервере...${NC}"
ssh $SERVER "cd $PROJECT_DIR && git pull origin main"

echo -e "${YELLOW}📦 Шаг 2: Установка зависимостей...${NC}"
ssh $SERVER "cd $PROJECT_DIR && npm install"

echo -e "${YELLOW}📦 Шаг 3: Создание .env.local с токенами Telegram...${NC}"
ssh $SERVER "cd $PROJECT_DIR && cat > .env.local << 'EOF'
TELEGRAM_BOT_TOKEN=7694594630:AAE0trm0m1RQE95MWTX72GwdrFAsqYb5fKQ
TELEGRAM_CHAT_ID=423456833
EOF
chmod 600 .env.local"

echo -e "${YELLOW}📦 Шаг 4: Сборка проекта...${NC}"
ssh $SERVER "cd $PROJECT_DIR && npm run build"

echo -e "${YELLOW}📦 Шаг 5: Перезапуск приложения...${NC}"
ssh $SERVER "cd $PROJECT_DIR && pm2 restart gazobeton-online && pm2 save"

echo -e "${GREEN}✅ Деплой завершён успешно!${NC}"
echo -e "${GREEN}Проверьте логи: ssh $SERVER 'pm2 logs gazobeton-online --lines 20'${NC}"

