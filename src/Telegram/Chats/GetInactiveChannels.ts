// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../Client';
import BotError from '../../Context/Error';
/**
 * Get inactive channels and supergroups.
 * @param snakeClient - Client
 * ```ts
 * bot.command("getInactiveChannels",async (ctx) => {
 *     let results = await ctx.telegram.getInactiveChannels()
 *     console.log(results)
 * })
 * ```
 */
export async function GetInactiveChannels(snakeClient: Snake) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getInactiveChannels`
      );
    }
    return await snakeClient.client.invoke(new Api.channels.GetInactiveChannels());
  } catch (error: any) {
    throw new BotError(error.message, 'telegram.getInactiveChannels', '');
  }
}
