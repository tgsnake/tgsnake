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
 * Get a list of channels/supergroups we left.
 * @param snakeClient - Client.
 * @param {number} offset - offset of pagination.
 * ```ts
 * bot.command("getLeftChannels",async (ctx) => {
 *     let results = await ctx.telegram.getLeftChannels()
 *     console.log(results)
 * })
 * ```
 */
export async function GetLeftChannels(snakeClient: Snake, offset: number = 0) {
  try {
    snakeClient.log.debug('Running telegram.getLeftChannels');
    return await snakeClient.client.invoke(
      new Api.channels.GetLeftChannels({
        offset: offset,
      })
    );
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.getLeftChannels');
    throw new BotError(error.message, 'telegram.getLeftChannels', `${offset}`);
  }
}
