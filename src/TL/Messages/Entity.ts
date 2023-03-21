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
import { Raw, Helpers } from '@tgsnake/core';
import type { Snake } from '../../Client';

const ContextEntityType = {
  'Raw.MessageEntityUnknown': 'unknown',
  'Raw.MessageEntityMention': 'mention',
  'Raw.MessageEntityHashtag': 'hastag',
  'Raw.MessageEntityBotCommand': 'botCommand',
  'Raw.MessageEntityUrl': 'url',
  'Raw.MessageEntityEmail': 'email',
  'Raw.MessageEntityBold': 'bold',
  'Raw.MessageEntityItalic': 'italic',
  'Raw.MessageEntityCode': 'code',
  'Raw.MessageEntityPre': 'pre',
  'Raw.MessageEntityTextUrl': 'textLink',
  'Raw.MessageEntityMentionName': 'textMention',
  'Raw.MessageEntityPhone': 'phoneNumber',
  'Raw.MessageEntityCashtag': 'cashtag',
  'Raw.MessageEntityUnderline': 'underline',
  'Raw.MessageEntityStrike': 'strikethrough',
  'Raw.MessageEntityBlockquote': 'blockquote',
  'Raw.MessageEntityBankCard': 'bankCard',
  'Raw.MessageEntitySpoiler': 'spoiler',
  'Raw.MessageEntityCustomEmoji': 'customEmoji',
};
export class Entity extends TLObject {
  type!:
    | 'unknown'
    | 'mention'
    | 'hastag'
    | 'cashtag'
    | 'botCommand'
    | 'url'
    | 'email'
    | 'phoneNumber'
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strikethrough'
    | 'blockquote'
    | 'bankCard'
    | 'spoiler'
    | 'code'
    | 'pre'
    | 'textLink'
    | 'textMention'
    | 'customEmoji';
  offset!: number;
  length!: number;
  url?: string;
  user?: bigint;
  language?: string;
  customEmojiId?: bigint;
  constructor(
    {
      className,
      constructorId,
      type,
      offset,
      length,
      url,
      user,
      language,
      customEmojiId,
    }: {
      className: string;
      constructorId: number;
      type:
        | 'unknown'
        | 'mention'
        | 'hastag'
        | 'cashtag'
        | 'botCommand'
        | 'url'
        | 'email'
        | 'phoneNumber'
        | 'bold'
        | 'italic'
        | 'underline'
        | 'strikethrough'
        | 'blockquote'
        | 'bankCard'
        | 'spoiler'
        | 'code'
        | 'pre'
        | 'textLink'
        | 'textMention'
        | 'customEmoji';
      offset: number;
      length: number;
      url?: string;
      user?: bigint;
      language?: string;
      customEmojiId?: bigint;
    },
    client: Snake
  ) {
    super(client);
    this.className = className;
    this.classType = 'types';
    this.constructorId = constructorId;
    this.subclassOfId = 0xcf6419dc; // TypeMessageEntity
    this.type = type;
    this.offset = offset;
    this.length = length;
    this.url = url;
    this.user = user;
    this.language = language;
    this.customEmojiId = customEmojiId;
  }
  static parse(entity: Raw.TypeMessageEntity, client: Snake): Entity {
    if (
      entity instanceof Raw.MessageEntityUnknown ||
      entity instanceof Raw.MessageEntityMention ||
      entity instanceof Raw.MessageEntityHashtag ||
      entity instanceof Raw.MessageEntityCashtag ||
      entity instanceof Raw.MessageEntityBotCommand ||
      entity instanceof Raw.MessageEntityUrl ||
      entity instanceof Raw.MessageEntityEmail ||
      entity instanceof Raw.MessageEntityPhone ||
      entity instanceof Raw.MessageEntityBold ||
      entity instanceof Raw.MessageEntityItalic ||
      entity instanceof Raw.MessageEntityUnderline ||
      entity instanceof Raw.MessageEntityUnderline ||
      entity instanceof Raw.MessageEntityStrike ||
      entity instanceof Raw.MessageEntityBlockquote ||
      entity instanceof Raw.MessageEntityBankCard ||
      entity instanceof Raw.MessageEntitySpoiler ||
      entity instanceof Raw.MessageEntityCode
    ) {
      return new Entity(
        {
          className: entity.className.replace('Raw.', ''),
          constructorId: entity.constructorId,
          type: ContextEntityType[entity.className],
          offset: entity.offset,
          length: entity.length,
        },
        client
      );
    }
    if (entity instanceof Raw.MessageEntityTextUrl) {
      entity as Raw.MessageEntityTextUrl;
      return new Entity(
        {
          className: entity.className.replace('Raw.', ''),
          constructorId: entity.constructorId,
          type: ContextEntityType[entity.className],
          offset: entity.offset,
          length: entity.length,
          url: entity.url,
        },
        client
      );
    }
    if (entity instanceof Raw.MessageEntityMentionName) {
      entity as Raw.MessageEntityMentionName;
      return new Entity(
        {
          className: entity.className.replace('Raw.', ''),
          constructorId: entity.constructorId,
          type: ContextEntityType[entity.className],
          offset: entity.offset,
          length: entity.length,
          user: entity.userId,
        },
        client
      );
    }
    if (entity instanceof Raw.MessageEntityCustomEmoji) {
      entity as Raw.MessageEntityCustomEmoji;
      return new Entity(
        {
          className: entity.className.replace('Raw.', ''),
          constructorId: entity.constructorId,
          type: ContextEntityType[entity.className],
          offset: entity.offset,
          length: entity.length,
          customEmojiId: entity.documentId,
        },
        client
      );
    }
    return new Entity(
      {
        className: entity.className.replace('Raw.', ''),
        constructorId: entity.constructorId,
        type: 'unknown',
        offset: entity.offset,
        length: entity.length,
      },
      client
    );
  }
}
