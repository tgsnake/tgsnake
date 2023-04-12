/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { TLObject } from '../TL/TL.ts';
import { Raw, Helpers } from '../platform.deno.ts';
import type { Snake } from '../Client/index.ts';
import { getMessages, sendMessage, sendMessageParams } from './Messages/index.ts';
import { getParticipants, getParticipantsParams } from './Chats/index.ts';

export class Telegram extends TLObject {
  constructor(client: Snake) {
    super(client);
  }
  invoke(query: Raw.TypesTLRequest, retries?: number, timeout?: number, sleepTreshold?: number) {
    return this.client._client.invoke(query, retries, timeout, sleepTreshold);
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
