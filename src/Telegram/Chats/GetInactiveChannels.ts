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
    snakeClient.log.debug('Running telegram.getInactiveChannels');
    return await snakeClient.client.invoke(new Api.channels.GetInactiveChannels());
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.getInactiveChannels');
    throw new BotError(error.message, 'telegram.getInactiveChannels', '');
  }
}
