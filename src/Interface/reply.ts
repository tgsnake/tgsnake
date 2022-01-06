// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import Parser, { Entities } from '@tgsnake/parser';
import { TypeReplyMarkup } from '../Utils/ReplyMarkup';
export interface replyMoreParams {
  /**
   * Set this flag to disable generation of the webpage preview
   */
  noWebpage?: boolean;
  /**
   * Send this message silently (no notifications for the receivers)
   */
  silent?: boolean;
  /**
   * Send this message as background message
   */
  background?: boolean;
  /**
   * send message with parse mode.
   */
  clearDraft?: boolean;
  /**
   * The message ID to which this message will reply to
   */
  replyToMsgId?: number;
  /**
   * Reply markup for sending bot buttons
   */
  replyMarkup?: TypeReplyMarkup;
  /**
   * Message entities for sending styled text.
   */
  entities?: Entities[];
  /**
   * Scheduled message date for scheduled messages.
   */
  scheduleDate?: number;
  /**
   * parse mode
   */
  parseMode?: string;
}
