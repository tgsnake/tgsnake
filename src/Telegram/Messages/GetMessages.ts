// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Snake } from '../../Client';
import BigInt from 'big-integer';
import { MessageContext } from '../../Context/MessageContext';
import * as Update from '../../Update';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
/**
 * Returns the list of messages by their IDs.
 * @param snakeClient - Client
 * @param {bigint|number|string} chatId - Chat/Groups/Channel id.
 * @param {Array} messageId - Message Id.
 * @param {boolean} replies - if `true` it will getting the nested reply. and will making floodwait.
 * ```ts
 *   bot.command("getMessages",async (ctx)=>{
 *       let results = await ctx.telegram.getMessages(ctx.chat.id,[ctx.id])
 *       console.log(results)
 *   })
 * ```
 */
export async function GetMessages(
  snakeClient: Snake,
  chatId: number | string | bigint,
  messageId: number[],
  replies: boolean = false
) {
  try {
    snakeClient.log.debug('Running telegram.getMessages');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let messageIds: any = messageId;
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    if (type == 'channel' || type == 'supergroup') {
      let results: Api.messages.TypeMessages = await snakeClient.client.invoke(
        new Api.channels.GetMessages({
          channel: peer,
          id: messageIds,
        })
      );
      let final: ResultsGetMessage = new ResultsGetMessage();
      await final.init(results, snakeClient, replies);
      return final;
    } else {
      let results: Api.messages.TypeMessages = await snakeClient.client.invoke(
        new Api.messages.GetMessages({
          id: messageIds,
        })
      );
      let final: ResultsGetMessage = new ResultsGetMessage();
      await final.init(results, snakeClient, replies);
      return final;
    }
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.getMessages');
    throw new BotError(
      error.message,
      'telegram.getMessages',
      `${chatId},${JSON.stringify(messageId)}`
    );
  }
}
export class ResultsGetMessage {
  messages!: MessageContext[];
  date: number | Date = Math.floor(Date.now() / 1000);
  constructor() {}
  async init(results: Api.messages.TypeMessages, SnakeClient: Snake, replies: boolean = false) {
    SnakeClient.log.debug('Creating results telegram.getMessages');
    let tempMessages: MessageContext[] = [];
    if (results instanceof Api.messages.ChannelMessages) {
      for (let i = 0; i < results.messages.length; i++) {
        let msg = results.messages[i] as Api.Message;
        if (!replies) {
          delete msg.replyTo;
        }
        let msgc = new MessageContext();
        await msgc.init(msg, SnakeClient);
        tempMessages.push(msgc);
      }
    }
    if (results instanceof Api.messages.Messages) {
      for (let i = 0; i < results.messages.length; i++) {
        let msg = results.messages[i] as Api.Message;
        if (!replies) {
          delete msg.replyTo;
        }
        let msgc = new MessageContext();
        await msgc.init(msg, SnakeClient);
        tempMessages.push(msgc);
      }
    }
    this.messages = tempMessages;
    return this;
  }
}
