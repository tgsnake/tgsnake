// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../Client';
import { SendMedia, defaultSendMediaMoreParams } from './SendMedia';
import { TypeReplyMarkup, BuildReplyMarkup } from '../../Utils/ReplyMarkup';
import * as Medias from '../../Utils/Medias';
import BotError from '../../Context/Error';
/**
 * Sending Dice
 * @param snakeClient - Client
 * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
 * @param {string|Object} dice - dice emoticon .
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.command("dice",async (ctx) => {
 *     let results = await ctx.telegram.sendDice(ctx.chat.id,"🎯")
 * })
 * ```
 */
export async function SendDice(
  snakeClient: Snake,
  chatId: number | string | bigint,
  dice: string | Medias.MediaDice,
  more?: defaultSendMediaMoreParams
) {
  try {
    snakeClient.log.debug('Running telegram.sendDice');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    //@ts-ignore
    let emoji = typeof dice == 'string' ? dice : dice.emoji;
    return await SendMedia(
      snakeClient,
      chatId,
      new Api.InputMediaDice({
        emoticon: emoji,
      }),
      more!
    );
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.sendDice');
    throw new BotError(
      error.message,
      'telegram.sendDice',
      `${chatId},${dice}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
