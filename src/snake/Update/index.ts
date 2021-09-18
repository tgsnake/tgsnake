// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

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

type TypeUpdate =
  | UpdateChatParticipants
  | UpdateChatUserTyping
  | UpdateDeleteMessages
  | UpdateMessageID
  | UpdateNewMessage
  | UpdateShortChatMessage
  | UpdateShortMessage
  | UpdateShortSentMessage
  | UpdateUserStatus
  | UpdateUserTyping;

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
};
