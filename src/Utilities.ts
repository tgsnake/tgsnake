/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { exec } from 'child_process';
import { Raw, Helpers } from '@tgsnake/core';
import { Message } from './TL/Messages/Message';
import type { Snake } from './Client/Snake';

export type TypeChat = Raw.Chat | Raw.Channel;
export type TypeUser = Raw.User;
export function parseDialog(
  chats: Array<Raw.TypeChat>,
  users: Array<Raw.TypeUser>
): [chats: Array<TypeChat>, users: Array<TypeUser>] {
  return [
    chats.filter((chat): chat is TypeChat => {
      if (chat instanceof Raw.Chat) return true;
      if (chat instanceof Raw.Channel) return true;
      return false;
    }),
    users.filter((user): user is TypeUser => {
      return user instanceof Raw.User;
    }),
  ];
}
// adapted from https://stackoverflow.com/a/49013356
export function open(url: string) {
  if (process.platform === 'darwin') {
    return exec(`open ${url}`);
  }
  if (process.platform === 'win32') {
    return exec(`start ${url}`);
  }
  return exec(`xdg-open ${url}`);
}
// adapted from https://github.com/pyrogram/pyrogram/blob/abed55aea9d6687a8054282d8ee2d964ec39e23a/pyrogram/utils.py#L87
export async function parseMessages(
  client: Snake,
  messages: Raw.messages.Messages,
  replies: number = 1
): Promise<Array<Message>> {
  let [chats, users] = parseDialog(messages.chats, messages.users);
  const parsedMessages: Array<Message> = [];
  if ('messages' in messages) {
    for (let message of messages.messages) {
      parsedMessages.push(await Message.parse(client, message, chats, users, 0));
    }
    if (replies) {
      let messagesWithReplies: Map<number, number> = new Map();
      for (let message of messages.messages) {
        if (!(message instanceof Raw.MessageEmpty) && message.replyTo) {
          messagesWithReplies.set(message.id, message.replyTo.replyToMsgId);
        }
      }
      if (messagesWithReplies.size) {
        let chatId = BigInt(0);
        for (let message of parsedMessages) {
          if (message.chat) {
            chatId = message.chat.id;
            break;
          }
        }
        let replyMsgs = await client.api.getMessages(
          chatId,
          [],
          [...messagesWithReplies.keys()],
          replies - 1
        );
        for (let msg of parsedMessages) {
          let replyId = messagesWithReplies.get(msg.id);
          for (let reply of replyMsgs) {
            if (reply.id == replyId) {
              msg.replyToMessage = reply;
            }
          }
        }
      }
    }
  }
  return parsedMessages;
}
export function getId(peer: Raw.TypePeer): bigint | undefined {
  if (peer instanceof Raw.PeerUser) return (peer as Raw.PeerUser).userId;
  if (peer instanceof Raw.PeerChannel) return (peer as Raw.PeerChannel).channelId;
  if (peer instanceof Raw.PeerChat) return (peer as Raw.PeerChat).chatId;
  return;
}
export function getPeerId(peer: Raw.TypePeer): bigint | undefined {
  if (peer instanceof Raw.PeerUser) return (peer as Raw.PeerUser).userId;
  if (peer instanceof Raw.PeerChat) return -(peer as Raw.PeerChat).chatId;
  if (peer instanceof Raw.PeerChannel)
    return Helpers.MAX_CHANNEL_ID - (peer as Raw.PeerChannel).channelId;
  return;
}
