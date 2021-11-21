// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
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
  | UpdateNewChannelMessage;
interface Context {
  '*': TypeUpdate;
  connected: ResultGetEntity;
  message: MessageContext;
  UpdateChatParticipants: UpdateChatParticipants;
  UpdateChatUserTyping: UpdateUserTyping;
  UpdateDeleteMessages: UpdateDeleteMessages;
  UpdateMessageID: UpdateMessageID;
  UpdateNewMessage: UpdateNewMessage;
  UpdateShortChatMessage: UpdateShortChatMessage;
  UpdateShortMessage: UpdateShortMessage;
  UpdateShortSentMessage: UpdateShortSentMessage;
  UpdateUserStatus: UpdateUserStatus;
  UpdateUserTyping: UpdateUserTyping;
  UpdateNewChannelMessage: UpdateNewChannelMessage;
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
};
