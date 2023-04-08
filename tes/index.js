// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2023 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

const { createContext } = require('vm');
const { Snake } = require('../lib/src/Client/Snake');
const filter = require('../lib/src/Context/Filters');
const bot = new Snake();
bot.cmd('start', (update) => {
  update.message.reply('Yo man!!');
});
bot.run();
