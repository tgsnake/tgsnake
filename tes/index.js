// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

const { Snake } = require('../lib/src/Client/Snake');
const bot = new Snake();
bot.run().then(async () => {
  console.log(await bot._client.exportSession());
});
