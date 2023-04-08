// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2023 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

const { Snake } = require('../lib/src/Client/Snake');
const bot = new Snake();
bot.on('cb.data', (update) => {
  console.log(update);
});
bot.cmd('start', (update) => {
  update.message.reply('Yo man!!', {
    replyMarkup: {
      inlineKeyboard: [[{ text: "Don't press me!", callbackData: 'press' }]],
    },
  });
});
bot.run();
