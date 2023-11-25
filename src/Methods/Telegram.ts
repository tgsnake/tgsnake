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
import { Raw, Helpers, type Readable, type Files } from '../platform.deno.ts';
import type { Snake } from '../Client/index.ts';
import {
  getMessages,
  sendMessage,
  sendMessageParams,
  sendDocument,
  sendDocumentParams,
} from './Messages/index.ts';
import { getParticipants, getParticipantsParams } from './Chats/index.ts';

export class Telegram extends TLObject {
  constructor(client: Snake) {
    super(client);
  }
  /**
   * Requesting function using raw api.
   * Raw api is a function constructor which is declared in the telegram schema.
   * @param {T} query - Constructor which will be sent to the Telegram server.
   * @param {number} retries - If the function fails, how many attempts should it run.
   * @param {number} timeout - The maximum time limit for running the <query> function.
   * @param {number} sleepTreshold - Pause sleep time if a flood occurs.
   */
  invoke<T extends Raw.TypesTLRequest>(
    query: T,
    retries?: number,
    timeout?: number,
    sleepTreshold?: number,
  ): Promise<T['__response__']> {
    return this.client._client.invoke(query, retries, timeout, sleepTreshold);
  }
  getMessages(
    chatId: bigint | string,
    msgIds?: Array<number>,
    replyToMsgIds?: Array<number>,
    replies?: number,
  ) {
    return getMessages(this.client!, chatId, msgIds, replyToMsgIds, replies);
  }
  /**
   * Sending a text message.
   * > [message].respond
   * > [message].reply
   * @param { bigint | string } chatId - Destination.
   * @param { string } text - Message which will sending.
   * @param { sendMessageParams } more - Extra param for sending message, like parseMode, replyToMsgId, etc..
   */
  sendMessage(chatId: bigint | string, text: string, more?: sendMessageParams) {
    return sendMessage(this.client!, chatId, text, more);
  }
  /**
   * Sending a document message.
   * > Shorthand :
   * > [document].resend
   * @param { bigint | string } chatId - Destination.
   * @param { string | Buffer | Readable | Files.File } document - File to be sent. The file can be a fileId or path where the file is located or a buffer of the file or streamable which can be piped.
   * @param { sendDocumentParams } more - Extra param for sending message, like parseMode, replyToMsgId, etc..
   */
  sendDocument(
    chatId: bigint | string,
    document: string | Buffer | Readable | Files.File,
    more?: sendDocumentParams,
  ) {
    return sendDocument(this.client!, chatId, document, more);
  }
  getParticipants(chatId: bigint | string, more?: getParticipantsParams) {
    return getParticipants(this.client, chatId, more);
  }
}
