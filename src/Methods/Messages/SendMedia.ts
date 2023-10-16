/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { Parser, type Entities, Raw, Helpers } from '../../platform.deno.ts';
import * as ReplyMarkup from '../../TL/Messages/ReplyMarkup.ts';
import type { Snake } from '../../Client/index.ts';
import { Message } from '../../TL/Messages/index.ts';
import { Chat } from '../../TL/Advanced/index.ts';

export interface sendMediaParams {
  disableNotification?: boolean;
  replyToMessageId?: number;
  messageThreadId?: number;
  scheduleDate?: number;
  sendAsChannel?: bigint | string;
  protectContent?: boolean;
  replyMarkup?: ReplyMarkup.TypeReplyMarkup;
  entities?: Array<Entities>;
  parseMode?: 'html' | 'markdown';
  caption?: string;
}
export async function sendMedia(
  client: Snake,
  chatId: bigint | string,
  media: Raw.TypeInputMedia,
  more: sendMediaParams = {},
) {
  var {
    disableNotification,
    replyToMessageId,
    messageThreadId,
    scheduleDate,
    sendAsChannel,
    protectContent,
    replyMarkup,
    entities,
    parseMode,
    caption,
  } = more;
  const peer = await client._client.resolvePeer(chatId);
  if (caption && parseMode) {
    const [t, e] = await Parser.parse(caption, parseMode);
    if (!entities) {
      entities = e;
    }
    caption = t;
  }
  const res = await client._client.invoke(
    new Raw.messages.SendMedia({
      silent: disableNotification,
      clearDraft: true,
      noforwards: protectContent,
      peer: peer,
      replyTo: replyToMessageId
        ? new Raw.InputReplyToMessage({
            replyToMsgId: replyToMessageId,
            topMsgId: messageThreadId,
          })
        : undefined,
      message: caption || '',
      media: media,
      randomId: client._rndMsgId.getMsgId(),
      replyMarkup: replyMarkup
        ? await ReplyMarkup.buildReplyMarkup(replyMarkup!, client)
        : undefined,
      entities: entities ? await Parser.toRaw(client._client, entities!) : undefined,
      scheduleDate: scheduleDate,
      sendAs: sendAsChannel ? await client._client.resolvePeer(sendAsChannel!) : undefined,
      updateStickersetsOrder: true,
    }),
  );
  console.log(res);
  if (res instanceof Raw.UpdateShortSentMessage) {
    let peerId = BigInt(0);
    let peerType = 'private';
    if (peer instanceof Raw.InputPeerUser) {
      peerId = (peer as Raw.InputPeerUser).userId;
    } else if (peer instanceof Raw.InputPeerChat) {
      peerId = BigInt(-(peer as Raw.InputPeerChat).chatId);
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
          client,
        ),
        date: new Date((res as Raw.UpdateShortSentMessage).date * 1000),
        empty: false,
        caption,
        replyMarkup,
        entities,
      },
      client,
    );
  }
  if ('updates' in res) {
    for (const update of res.updates) {
      if (
        update instanceof Raw.UpdateNewMessage ||
        update instanceof Raw.UpdateNewChannelMessage ||
        update instanceof Raw.UpdateNewScheduledMessage
      ) {
        return await Message.parse(client, update.message, res.chats || [], res.users || []);
      }
    }
  }
  return new Message(
    {
      id: 'id' in res ? res.id : 0,
      outgoing: true,
      empty: true,
    },
    client,
  );
}
