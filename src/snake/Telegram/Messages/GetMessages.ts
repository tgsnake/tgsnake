// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
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
export async function GetMessages(
  snakeClient: Snake,
  chatId: number | string,
  messageId: number[]
) {
  try {
    let messageIds: any = messageId;
    let type = await snakeClient.telegram.getEntity(chatId);
    if (type.type == 'channel') {
      let results: Api.messages.TypeMessages = await snakeClient.client.invoke(
        new Api.channels.GetMessages({
          channel: chatId,
          id: messageIds,
        })
      );
      let final: ResultsGetMessage = new ResultsGetMessage();
      await final.init(results, snakeClient);
      return final;
    } else {
      let results: Api.messages.TypeMessages = await snakeClient.client.invoke(
        new Api.messages.GetMessages({
          id: messageIds,
        })
      );
      let final: ResultsGetMessage = new ResultsGetMessage();
      await final.init(results, snakeClient);
      return final;
    }
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.getMessages(${chatId},${JSON.stringify(messageId)})`
    );
  }
}
export class ResultsGetMessage {
  messages!: MessageContext[];
  date: number | Date = Math.floor(Date.now() / 1000);
  constructor() {}
  async init(results: Api.messages.TypeMessages, SnakeClient: Snake) {
    let tempMessages: MessageContext[] = [];
    if (results instanceof Api.messages.ChannelMessages) {
      for (let i = 0; i < results.messages.length; i++) {
        let msg = results.messages[i] as Api.Message;
        let msgc = new MessageContext();
        await msgc.init(msg, SnakeClient);
        tempMessages.push(msgc);
      }
    }
    if (results instanceof Api.messages.Messages) {
      for (let i = 0; i < results.messages.length; i++) {
        let msg = results.messages[i] as Api.Message;
        let msgc = new MessageContext();
        await msgc.init(msg, SnakeClient);
        tempMessages.push(msgc);
      }
    }
    this.messages = tempMessages;
    return this;
  }
}
