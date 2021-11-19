// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import * as Updates from '../Update';
import { Api } from 'telegram';
import { ResultGetEntity } from '../Telegram/Users/GetEntity';
import { MessageContext } from '../Context/MessageContext';
export default interface UpdateEvent {
  /**
   * receive any event.
   * @example
   * ```ts
   * bot.on("*",(event)=>console.log(event))
   * ```
   */
  '*': (context: Updates.TypeUpdate | ResultGetEntity | MessageContext) => void;
  connected: (context: ResultGetEntity) => void;
  message: (context: MessageContext) => void;
  UpdateChatParticipants: (context: Updates.UpdateChatParticipants) => void;
  UpdateDeleteMessages: (context: Updates.UpdateDeleteMessages) => void;
  UpdateMessageID: (context: Updates.UpdateMessageID) => void;
  UpdateNewMessage: (context: Updates.UpdateNewMessage) => void;
  UpdateShortChatMessage: (context: Updates.UpdateShortChatMessage) => void;
  UpdateShortMessage: (context: Updates.UpdateShortMessage) => void;
  UpdateShortSentMessage: (context: Updates.UpdateShortSentMessage) => void;
  UpdateUserStatus: (context: Updates.UpdateUserStatus) => void;
  UpdateUserTyping: (context: Updates.UpdateUserTyping) => void;
}
