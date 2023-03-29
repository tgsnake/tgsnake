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
bot.cmd('start', async (ctx) => {
  console.log(ctx);
  console.log(await ctx.message.reply('startooo'));
  console.log(await ctx.message.respond('endddddd'));
  console.log(await ctx.api.getParticipants(ctx.message.chat.id));
});
bot.on('message.photo', async (ctx) => {
  console.log(ctx);
  console.log(await ctx.client._client.resolvePeer(BigInt(-1001467257798)));
});
bot.run();
