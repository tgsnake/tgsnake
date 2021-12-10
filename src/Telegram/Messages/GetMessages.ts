// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Snake } from '../../client';
import BigInt from 'big-integer';
import { MessageContext } from '../../Context/MessageContext';
import * as Update from '../../Update';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';

export async function GetMessages(
  snakeClient: Snake,
  chatId: number | string | bigint,
  messageId: number[],
  replies: boolean = false
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getMessages`
      );
    }
    let messageIds: any = messageId;
    let [id, type, peer] = await toBigInt(chatId, snakeClient);
    if (type == 'channel') {
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
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.getMessages';
    botError.functionArgs = `${chatId},${JSON.stringify(messageId)}`;
    throw botError;
  }
}
export class ResultsGetMessage {
  messages!: MessageContext[];
  date: number | Date = Math.floor(Date.now() / 1000);
  constructor() {}
  async init(results: Api.messages.TypeMessages, SnakeClient: Snake, replies: boolean = false) {
    let mode = ['debug', 'info'];
    if (mode.includes(SnakeClient.logger)) {
      SnakeClient.log(
        `[${
          SnakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Creating results telegram.getMessages`
      );
    }
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
