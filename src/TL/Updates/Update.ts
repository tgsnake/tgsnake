/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { TLObject } from '../TL';
import { Raw } from '@tgsnake/core';
import { Message } from '../Messages/Message';
import type { Snake } from '../../Client';

export class Update extends TLObject {
  message?: TLObject;
  editedMessage?: TLObject;
  channelPost?: TLObject;
  editedChannelPost?: TLObject;
  inlineQuery?: TLObject;
  chosenInlineResult?: TLObject;
  callbackQuery?: TLObject;
  shippingQuery?: TLObject;
  preCheckoutQuery?: TLObject;
  poll?: TLObject;
  pollAnswer?: TLObject;
  chatJoinRequest?: TLObject;
  constructor(
    {
      message,
      editedMessage,
      channelPost,
      editedChannelPost,
      inlineQuery,
      chosenInlineResult,
      callbackQuery,
      shippingQuery,
      preCheckoutQuery,
      poll,
      pollAnswer,
      chatJoinRequest,
    }: {
      message?: TLObject;
      editedMessage?: TLObject;
      channelPost?: TLObject;
      editedChannelPost?: TLObject;
      inlineQuery?: TLObject;
      chosenInlineResult?: TLObject;
      callbackQuery?: TLObject;
      shippingQuery?: TLObject;
      preCheckoutQuery?: TLObject;
      poll?: TLObject;
      pollAnswer?: TLObject;
      chatJoinRequest?: TLObject;
    },
    client: Snake
  ) {
    super(client);
    this.className = 'Update';
    this.classType = 'types';
    this.message = message;
    this.editedMessage = editedMessage;
    this.channelPost = channelPost;
    this.editedChannelPost = editedChannelPost;
    this.inlineQuery = inlineQuery;
    this.chosenInlineResult = chosenInlineResult;
    this.callbackQuery = callbackQuery;
    this.shippingQuery = shippingQuery;
    this.preCheckoutQuery = preCheckoutQuery;
    this.poll = poll;
    this.pollAnswer = pollAnswer;
    this.chatJoinRequest = chatJoinRequest;
  }
  static async parse(
    client: Snake,
    update: Raw.TypeUpdate,
    chats: Array<Raw.Chat | Raw.Channel>,
    users: Array<Raw.User>
  ): Promise<Update> {
    if (update instanceof Raw.UpdateNewMessage) {
      return Update.updateNewMessage(client, update as Raw.UpdateNewMessage, chats, users);
    }
    if (update instanceof Raw.UpdateNewChannelMessage) {
      return Update.updateNewMessage(client, update as Raw.UpdateNewChannelMessage, chats, users);
    }
    return new Update({}, client);
  }
  static async updateNewMessage(
    client: Snake,
    update: Raw.UpdateNewMessage | Raw.UpdateNewChannelMessage,
    chats: Array<Raw.Chat | Raw.Channel>,
    users: Array<Raw.User>
  ): Promise<Update> {
    if (update.message instanceof Raw.Message && (update.message as Raw.Message).post) {
      return new Update(
        {
          channelPost: await Message.parse(client, update.message, chats, users),
        },
        client
      );
    }
    return new Update(
      {
        message: await Message.parse(client, update.message, chats, users),
      },
      client
    );
  }
}
