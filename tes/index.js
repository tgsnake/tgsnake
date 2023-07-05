// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2023 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

const { Snake } = require('../lib/src/Client/Snake');
const bot = new Snake();
bot.on('msg.pinnedMessage', (ctx) => {
  ctx.message.reply(`Seseorang menyematkan pesan ini!`);
});
bot.cmd('start', (ctx) => {
  try {
    ctx.message.reply('Starting');
    // bot._client.startSecretChat(ctx.message.chat.id);
  } catch (e) {
    console.log(e);
  }
});
bot.run();
