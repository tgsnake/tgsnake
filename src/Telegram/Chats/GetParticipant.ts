// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Snake } from '../../Client';
import { ResultGetEntity } from '../Users/GetEntity';
import { Api } from 'telegram';
import { ChatParticipants } from '../../Utils/ChatParticipants';
import BotError from '../../Context/Error';
import bigInt from 'big-integer';
/**
 * Get info about a channel/supergroup participant.
 * @param snakeClient - Client.
 * @param {number|string|bigint} - Chat or channels id to getting the list of members.
 * @param {number|string|bigint} - Participant to get info about.
 * ```ts
 * bot.command("getChatMember",async (ctx) => {
 *     let results = await ctx.telegram.getParticipant(ctx.chat.id,ctx.from.id) // getChatMember and getParticipant.is same methods.
 *     console.log(results)
 * })
 * ```
 */
export async function GetParticipant(
  snakeClient: Snake,
  chatId: number | string | bigint,
  userId: number | string | bigint
) {
  try {
    snakeClient.log.debug('Running telegram.getParticipant');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    if (typeof userId === 'number')
      snakeClient.log.warning(
        'Type of userId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let { client } = snakeClient;
    let result: Api.channels.ChannelParticipant = await client.invoke(
      new Api.channels.GetParticipant({
        channel:
          typeof chatId == 'string'
            ? (chatId as string)
            : typeof chatId == 'number'
            ? bigInt(chatId as number)
            : bigInt(chatId as bigint),
        participant:
          typeof userId == 'string'
            ? (userId as string)
            : typeof userId == 'number'
            ? bigInt(userId as number)
            : bigInt(userId as bigint),
      })
    );
    snakeClient.log.debug('Creating results telegram.getParticipant');
    let _results = new ChatParticipants();
    await _results.init(result, snakeClient);
    return _results.participants[0];
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.getParticipant');
    throw new BotError(error.message, 'telegram.getParticipant', `${chatId},${userId}`);
  }
}
