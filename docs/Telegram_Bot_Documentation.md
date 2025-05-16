# Документация Telegram-бота

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
             ['Рандомное число от 0 до 100'],
             ['Конвертировать валюту']
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
   - Этот файл используется для логирования сообщений, чтобы отслеживать работу бота. Все логи бота записываются в файл `bot.log` и выводятся в консоль.
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

## Новая добавленная функция: Конвертация валют

В боте была добавлена новая функция для конвертации рублей в другие валюты, такие как китайский юань (CNY), доллары США (USD) и дирхамы ОАЭ (AED). Эта функция использует статические курсы обмена для расчета суммы, которую необходимо перевести.

### 1. **Как работает конвертация валют?**

- Когда пользователь выбирает команду **Конвертировать валюту**, ему предлагается выбрать валюту для конвертации (например, RUB → CNY, RUB → USD или RUB → AED).
- После выбора валюты, бот запрашивает сумму в рублях (RUB), которую необходимо конвертировать.
- Бот рассчитывает конвертированную сумму и отображает результат пользователю.

### 2. **Как добавить и настроить конвертер валют?**

В файле `index.js` для работы с валютами был добавлен следующий код:

```javascript
// Статические курсы обмена (RUB в другие валюты)
const rates = {
  RUB: {
    CNY: 0.092,  // Пример курса обмена RUB на CNY
    USD: 0.012,  // Пример курса обмена RUB на USD
    AED: 0.044   // Пример курса обмена RUB на AED
  }
};

// Обработка выбора пользователя для конвертации валют
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Проверка на кнопку "Конвертировать валюту"
  if (text === 'Конвертировать валюту') {
    const menu = {
      reply_markup: {
        keyboard: [
          ['RUB → CNY', 'RUB → USD', 'RUB → AED'],
          ['Отменить']
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    };
    bot.sendMessage(chatId, 'Пожалуйста, выберите валюту для конвертации:', menu);
  }

  if (text === 'RUB → CNY' || text === 'RUB → USD' || text === 'RUB → AED') {
    bot.sendMessage(chatId, 'Введите сумму в рублях, которую хотите конвертировать:');
    
    // Сохранение выбора пользователя для следующего шага
    bot.once('message', (response) => {
      const amount = parseFloat(response.text);
      let convertedAmount;
      let currency = '';

      if (isNaN(amount)) {
        bot.sendMessage(chatId, 'Пожалуйста, введите корректное число для суммы.');
        return;
      }

      // Логика конвертации в зависимости от выбора пользователя
      switch (text) {
        case 'RUB → CNY':
          convertedAmount = amount * rates.RUB.CNY;
          currency = 'CNY';
          break;
        case 'RUB → USD':
          convertedAmount = amount * rates.RUB.USD;
          currency = 'USD';
          break;
        case 'RUB → AED':
          convertedAmount = amount * rates.RUB.AED;
          currency = 'AED';
          break;
      }

      bot.sendMessage(chatId, `Ваши ${amount} рублей равны ${convertedAmount.toFixed(2)} ${currency}.`);
    });
  }

  // Обработка отмены
  if (text === 'Отменить') {
    bot.sendMessage(chatId, 'Конвертация валют отменена.');
  }
});
