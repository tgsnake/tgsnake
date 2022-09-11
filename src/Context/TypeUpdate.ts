/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import type { Snake } from '../Client/Snake';
export interface InterfaceTL {
  className: string;
  classType: string;
  constructorId: number;
  subclassOfId: number;
  client: Snake;
  telegram: any;
}
/**
 * Context for composer
 */
export interface Context {
  '*': UpdateMessage | UpdateEditedMessage;
  message: UpdateMessage;
  editedMessage: UpdateEditedMessage;
  channelPost: InterfaceTL;
  editedChannelPost: InterfaceTL;
  inlineQuery: InterfaceTL;
  chosenInlineResult: InterfaceTL;
  callbackQuery: InterfaceTL;
  shippingQuery: InterfaceTL;
  preCheckoutQuery: InterfaceTL;
  poll: InterfaceTL;
  pollAnswer: InterfaceTL;
  chatJoinRequest: InterfaceTL;
}
export interface UpdateMessage extends InterfaceTL {
  message: InterfaceTL;
  editedMessage?: InterfaceTL;
  channelPost?: InterfaceTL;
  editedChannelPost?: InterfaceTL;
  inlineQuery?: InterfaceTL;
  chosenInlineResult?: InterfaceTL;
  callbackQuery?: InterfaceTL;
  shippingQuery?: InterfaceTL;
  preCheckoutQuery?: InterfaceTL;
  poll?: InterfaceTL;
  pollAnswer?: InterfaceTL;
  chatJoinRequest?: InterfaceTL;
}
export interface UpdateEditedMessage extends InterfaceTL {
  message?: InterfaceTL;
  editedMessage: InterfaceTL;
  channelPost?: InterfaceTL;
  editedChannelPost?: InterfaceTL;
  inlineQuery?: InterfaceTL;
  chosenInlineResult?: InterfaceTL;
  callbackQuery?: InterfaceTL;
  shippingQuery?: InterfaceTL;
  preCheckoutQuery?: InterfaceTL;
  poll?: InterfaceTL;
  pollAnswer?: InterfaceTL;
  chatJoinRequest?: InterfaceTL;
}
