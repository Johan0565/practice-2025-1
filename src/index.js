require('dotenv').config(); // Для загрузки переменных окружения
const TelegramBot = require('node-telegram-bot-api');

// Токен из переменной окружения
const token = process.env.BOT_TOKEN;

// Инициализация бота
const bot = new TelegramBot(token, { polling: true });

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
        ['Рандомное число от 0 до 100']
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  };

  bot.sendMessage(chatId, `Привет, ${name}! Выберите одну из команд:`, menu);
});

// Эхо-режим: повторяет любое сообщение
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

  // Если эхо-режим включен, бот будет повторять сообщение
  if (echoMode[chatId] && msg.text !== '/start' && msg.text !== 'Стоп Эхо-бота' && msg.text !== 'Старт Эхо-бота' && msg.text !== 'Рандомное число от 0 до 100') {
    bot.sendMessage(chatId, `Вы сказали: ${msg.text}`);
  }
});
