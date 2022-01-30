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
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getParticipant`
      );
    }
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
    let _results = new ChatParticipants();
    await _results.init(result, snakeClient);
    return _results.participants[0];
  } catch (error: any) {
    throw new BotError(error.message, 'telegram.getParticipant', `${chatId},${userId}`);
  }
}
