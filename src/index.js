require('dotenv').config(); // Для загрузки переменных окружения
const TelegramBot = require('node-telegram-bot-api');

// Токен из переменной окружения
const token = process.env.BOT_TOKEN;

// Инициализация бота
const bot = new TelegramBot(token, { polling: true });

// Статические курсы обмена (RUB в другие валюты)
const rates = {
  RUB: {
    CNY: 0.092,  // Пример курса обмена RUB на CNY
    USD: 0.012,  // Пример курса обмена RUB на USD
    AED: 0.044   // Пример курса обмена RUB на AED
  }
};

console.log('Бот запущен...');

// Структура для хранения состояния эхо-режима
let echoMode = {};

// Обработка команды /start
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

  // Эхо-режим: повторяет любое сообщение
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

  // Если эхо-режим включен, бот будет повторять сообщение
  if (echoMode[chatId] && msg.text !== '/start' && msg.text !== 'Стоп Эхо-бота' && msg.text !== 'Старт Эхо-бота' && msg.text !== 'Рандомное число от 0 до 100') {
    bot.sendMessage(chatId, `Вы сказали: ${msg.text}`);
  }
});
