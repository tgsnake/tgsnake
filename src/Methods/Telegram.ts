/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { TLObject } from '../TL/TL';
import { Raw, Helpers } from '@tgsnake/core';
import type { Snake } from '../Client';
import { getMessages, sendMessage, sendMessageParams } from './Messages';
import { getParticipants, getParticipantsParams } from './Chats';

export class Telegram extends TLObject {
  constructor(client: Snake) {
    super(client);
  }
  getMessages(
    chatId: bigint | string,
    msgIds?: Array<number>,
    replyToMsgIds?: Array<number>,
    replies?: number
  ) {
    return getMessages(this.client!, chatId, msgIds, replyToMsgIds, replies);
  }
  sendMessage(chatId: bigint | string, text: string, more?: sendMessageParams) {
    return sendMessage(this.client!, chatId, text, more);
  }
  getParticipants(chatId: bigint | string, more?: getParticipantsParams) {
    return getParticipants(this.client, chatId, more);
  }
}
