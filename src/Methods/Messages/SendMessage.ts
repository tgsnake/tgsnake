/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { Parser, type Entities } from '@tgsnake/parser';
import { TLObject } from '../../TL/TL';
import { Raw, Helpers } from '@tgsnake/core';
import { parseMessages } from '../../Utilities';
import * as ReplyMarkup from '../../TL/Messages/ReplyMarkup';
import type { Snake } from '../../Client';
import { Message } from '../../TL/Messages';
import { Chat } from '../../TL/Advanced';

export interface sendMessageParams {
  disableWebPagePreview?: boolean;
  disableNotification?: boolean;
  replyToMessageId?: number;
  messageThreadId?: number;
  scheduleDate?: number;
  sendAsChannel?: bigint | string;
  protectContent?: boolean;
  replyMarkup?: ReplyMarkup.TypeReplyMarkup;
  entities?: Array<Entities>;
  parseMode?: 'html' | 'markdown';
}
export async function sendMessage(
  client: Snake,
  chatId: bigint | string,
  text: string,
  more: sendMessageParams = {}
) {
  var {
    disableWebPagePreview,
    disableNotification,
    replyToMessageId,
    messageThreadId,
    scheduleDate,
    sendAsChannel,
    protectContent,
    replyMarkup,
    entities,
    parseMode,
  } = more;
  const peer = await client._client.resolvePeer(chatId);
  if (parseMode) {
    const [t, e] = await Parser.parse(text, parseMode);
    if (!entities) {
      entities = e;
    }
    text = t;
  }
  const res = await client._client.invoke(
    new Raw.messages.SendMessage({
      noWebpage: disableWebPagePreview,
      silent: disableNotification,
      clearDraft: true,
      noforwards: protectContent,
      peer: peer,
      replyToMsgId: replyToMessageId,
      topMsgId: messageThreadId,
      message: text,
      randomId: client._rndMsgId.getMsgId(),
      replyMarkup: replyMarkup
        ? await ReplyMarkup.buildReplyMarkup(replyMarkup!, client)
        : undefined,
      entities: entities ? await Parser.toRaw(client._client, entities!) : undefined,
      scheduleDate: scheduleDate,
      sendAs: sendAsChannel ? await client._client.resolvePeer(sendAsChannel!) : undefined,
    })
  );
  if (res instanceof Raw.UpdateShortSentMessage) {
    let peerId = BigInt(0);
    let peerType = 'private';
    if (peer instanceof Raw.InputPeerUser) {
      peerId = (peer as Raw.InputPeerUser).userId;
    } else if (peer instanceof Raw.InputPeerChat) {
      peerId = -(peer as Raw.InputPeerChat).chatId;
      peerType = 'group';
    }
    return new Message(
      {
        id: (res as Raw.UpdateShortSentMessage).id,
        chat: new Chat(
          {
            id: peerId,
            type: peerType,
            accessHash: BigInt(0),
          },
          client
        ),
        date: new Date((res as Raw.UpdateShortSentMessage).date * 1000),
        empty: false,
        text,
        replyMarkup,
        entities,
      },
      client
    );
  }
  if (res.updates) {
    for (const update of res.updates) {
      if (
        update instanceof Raw.UpdateNewMessage ||
        update instanceof Raw.UpdateNewChannelMessage ||
        update instanceof Raw.UpdateNewScheduledMessage
      ) {
        return await Message.parse(client, update.message, res.chats, res.users);
      }
    }
  }
  return new Message(
    {
      id: res.id,
      outgoing: true,
      empty: true,
    },
    client
  );
}
