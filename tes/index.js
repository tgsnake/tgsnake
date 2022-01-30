// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

const {Snake} = require("../lib/Client/Snake")
const bot = new Snake()
bot.on("*",(ctx)=>{
  console.log(ctx)
})
bot.run()