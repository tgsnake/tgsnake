// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { ResultGetEntity } from '../Telegram/Users/GetEntity';
import { MessageContext } from '../Context/MessageContext';
import { UpdateChatParticipants } from './UpdateChatParticipants';
import { UpdateChatUserTyping } from './UpdateChatUserTyping';
import { UpdateDeleteMessages } from './UpdateDeleteMessages';
import { UpdateMessageID } from './UpdateMessageID';
import { UpdateNewMessage } from './UpdateNewMessage';
import { UpdateShortChatMessage } from './UpdateShortChatMessage';
import { UpdateShortMessage } from './UpdateShortMessage';
import { UpdateShortSentMessage } from './UpdateShortSentMessage';
import { UpdateUserStatus } from './UpdateUserStatus';
import { UpdateUserTyping } from './UpdateUserTyping';
import { UpdateNewChannelMessage } from './UpdateNewChannelMessage';
import { UpdateInlineBotCallbackQuery } from './UpdateInlineBotCallbackQuery';
import { UpdateBotCallbackQuery } from './UpdateBotCallbackQuery';
import { UpdateBotInlineQuery } from './UpdateBotInlineQuery';
import { UpdateEditChannelMessage } from './UpdateEditChannelMessage';
import { UpdateEditMessage } from './UpdateEditMessage';
type TypeUpdate =
  | ResultGetEntity
  | MessageContext
  | UpdateChatParticipants
  | UpdateChatUserTyping
  | UpdateDeleteMessages
  | UpdateMessageID
  | UpdateNewMessage
  | UpdateShortChatMessage
  | UpdateShortMessage
  | UpdateShortSentMessage
  | UpdateUserStatus
  | UpdateUserTyping
  | UpdateNewChannelMessage
  | UpdateInlineBotCallbackQuery
  | UpdateBotCallbackQuery
  | UpdateBotInlineQuery
  | UpdateEditChannelMessage
  | UpdateEditMessage;
interface Context {
  '*': TypeUpdate;
  connected: ResultGetEntity;
  // shorthand event
  message: MessageContext;
  newChatMember: MessageContext;
  migrateTo: MessageContext;
  chatCreate: MessageContext;
  editChatTitle: MessageContext;
  editChatPhoto: MessageContext;
  leftChatMember: MessageContext;
  channelCreate: MessageContext;
  migrateFrom: MessageContext;
  gameScore: MessageContext;
  paymentSentMe: MessageContext;
  paymentSent: MessageContext;
  phoneCall: MessageContext;
  customAction: MessageContext;
  botAllowed: MessageContext;
  secureValuesSentMe: MessageContext;
  secureValuesSent: MessageContext;
  deleteChatPhoto: MessageContext;
  pinMessage: MessageContext;
  historyClear: MessageContext;
  screenshotTaken: MessageContext;
  contactSingUp: MessageContext;
  groupCall: MessageContext;
  groupCallScheduled: MessageContext;
  callbackQuery: UpdateInlineBotCallbackQuery | UpdateBotCallbackQuery;
  inlineQuery: UpdateBotInlineQuery;
  editMessage: UpdateEditMessage | UpdateEditChannelMessage;
  // original names
  updateChatParticipants: UpdateChatParticipants;
  updateChatUserTyping: UpdateUserTyping;
  updateDeleteMessages: UpdateDeleteMessages;
  updateMessageID: UpdateMessageID;
  updateNewMessage: UpdateNewMessage;
  updateShortChatMessage: UpdateShortChatMessage;
  updateShortMessage: UpdateShortMessage;
  updateShortSentMessage: UpdateShortSentMessage;
  updateUserStatus: UpdateUserStatus;
  updateUserTyping: UpdateUserTyping;
  updateNewChannelMessage: UpdateNewChannelMessage;
  updateInlineBotCallbackQuery: UpdateInlineBotCallbackQuery;
  updateBotCallbackQuery: UpdateBotCallbackQuery;
  updateBotInlineQuery: UpdateBotInlineQuery;
  updateEditMessage: UpdateEditMessage;
  updateEditChannelMessage: UpdateEditChannelMessage;
}
export {
  TypeUpdate,
  UpdateChatParticipants,
  UpdateChatUserTyping,
  UpdateDeleteMessages,
  UpdateMessageID,
  UpdateNewMessage,
  UpdateShortChatMessage,
  UpdateShortMessage,
  UpdateShortSentMessage,
  UpdateUserStatus,
  UpdateUserTyping,
  UpdateNewChannelMessage,
  Context,
  UpdateInlineBotCallbackQuery,
  UpdateBotCallbackQuery,
  UpdateBotInlineQuery,
  UpdateEditChannelMessage,
  UpdateEditMessage,
};
