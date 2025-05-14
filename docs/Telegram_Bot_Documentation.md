
# Документация по установке и созданию Telegram-бота

## Установка Node.js

### Для macOS

1. **Использование Homebrew**:
   - Откройте терминал и выполните команду:
     ```bash
     brew install node
     ```

2. **Через официальный сайт**:
   - Перейдите на [официальную страницу Node.js](https://nodejs.org/).
   - Скачайте и установите последнюю версию LTS.

### Для Windows

1. **Использование установщика**:
   - Перейдите на [официальную страницу Node.js](https://nodejs.org/).
   - Скачайте установщик для Windows и следуйте инструкциям на экране.

2. **Через Chocolatey**:
   - Если у вас установлен [Chocolatey](https://chocolatey.org/), используйте команду:
     ```bash
     choco install nodejs
     ```

### Для Linux (Ubuntu/Debian)

1. **Использование apt**:
   - Выполните следующие команды:
     ```bash
     sudo apt update
     sudo apt install nodejs
     sudo apt install npm
     ```

2. **Через NodeSource**:
   - Для установки последней версии Node.js используйте:
     ```bash
     curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
     sudo apt install -y nodejs
     ```

---

## Создание Telegram-бота с помощью BotFather

1. **Создайте нового бота**:
   - Откройте [BotFather](https://core.telegram.org/bots#botfather) в Telegram.
   - Нажмите **Start**.
   - Введите команду `/newbot`.
   - Придумайте имя для вашего бота и выберите уникальный юзернейм (он должен заканчиваться на `bot`).
   - BotFather даст вам **токен** для вашего бота, который нужно сохранить. Этот токен будет использоваться в вашем коде.

2. **Настройте параметры бота**:
   - Используйте BotFather для настройки дополнительных параметров, таких как описание и команд.

---

## Описание файлов проекта

1. **`package.json`**:
   - Этот файл управляет зависимостями и настройками проекта.
   - Содержит основную информацию о проекте, а также список зависимостей, таких как `axios`, `dotenv`, и `node-telegram-bot-api`.
   - Пример:
     ```json
     {
       "name": "telegram-bot",
       "version": "1.0.0",
       "description": "Telegram bot with weather, time, echo mode, advice and currency converter",
       "main": "index.js",
       "scripts": {
         "start": "node index.js"
       },
       "dependencies": {
         "axios": "^1.3.3",
         "dotenv": "^16.0.3",
         "node-telegram-bot-api": "^0.56.0",
         "winston": "^3.8.2"
       },
       "engines": {
         "node": ">=14.0.0"
       }
     }
     ```

2. **`package-lock.json`**:
   - Этот файл генерируется автоматически при установке зависимостей и фиксирует версии пакетов, используемых в проекте.

3. **`.env`**:
   - Файл для хранения переменных окружения, таких как токен вашего бота.
   - Пример:
     ```bash
     BOT_TOKEN=ВАШ ТОКЕН
     ```

4. **`index.js`**:
   - Основной файл, который содержит логику Telegram-бота.
   - Используется библиотека `node-telegram-bot-api` для взаимодействия с Telegram.
   - Пример кода:
     ```javascript
     require('dotenv').config(); // Для загрузки переменных окружения
     const TelegramBot = require('node-telegram-bot-api');

     const token = process.env.BOT_TOKEN; // Токен из переменной окружения
     const bot = new TelegramBot(token, { polling: true });

     console.log('Бот запущен...');

     // Эхо-режим
     let echoMode = {};

     bot.onText(/\/start/, (msg) => {
       const chatId = msg.chat.id;
       const name = msg.from.first_name || 'друг';

       const menu = {
         reply_markup: {
           keyboard: [
             ['Старт Эхо-бота', 'Стоп Эхо-бота'],
             ['Рандомное число от 0 до 100']
           ],
           resize_keyboard: true,
           one_time_keyboard: true
         }
       };

       bot.sendMessage(chatId, `Привет, ${name}! Выберите одну из команд:`, menu);
     });

     bot.on('message', (msg) => {
       const chatId = msg.chat.id;

       if (msg.text === 'Старт Эхо-бота') {
         echoMode[chatId] = true;
         bot.sendMessage(chatId, 'Эхо-бот включен. Я буду повторять ваши сообщения!');
       } else if (msg.text === 'Стоп Эхо-бота') {
         echoMode[chatId] = false;
         bot.sendMessage(chatId, 'Эхо-бот выключен. Я больше не буду повторять ваши сообщения.');
       } else if (msg.text === 'Рандомное число от 0 до 100') {
         const randomNumber = Math.floor(Math.random() * 101); // Генерация случайного числа от 0 до 100
         bot.sendMessage(chatId, `Ваше случайное число: ${randomNumber}`);
       }

       if (echoMode[chatId] && msg.text !== '/start' && msg.text !== 'Стоп Эхо-бота' && msg.text !== 'Старт Эхо-бота' && msg.text !== 'Рандомное число от 0 до 100') {
         bot.sendMessage(chatId, `Вы сказали: ${msg.text}`);
       }
     });
     ```

5. **`logger.js`**:
   - Этот файл отвечает за настройку логирования с использованием библиотеки `winston`.
   - Пример:
     ```javascript
     const { createLogger, format, transports } = require('winston');

     module.exports = createLogger({
         level: 'info',
         format: format.combine(
             format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
             format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
         ),
         transports: [new transports.File({ filename: 'bot.log' }), new transports.Console()]
     });
     ```

---

