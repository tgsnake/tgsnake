// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Logger } from 'telegram/extensions';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { NewMessage } from 'telegram/events';
import { NewMessageEvent } from 'telegram/events/NewMessage';
import { Message } from 'telegram/tl/custom/message';
import { Api } from 'telegram';
import * as define from 'telegram/define';
import * as reResults from './rewriteresults';
import BigInt from 'big-integer';
import { computeCheck } from 'telegram/Password';
import { CustomFile } from 'telegram/client/uploads';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import FileType from 'file-type';
import { _parseMessageText } from 'telegram/client/messageParse';
import * as Interface from './interface';
import { FileId, decodeFileId } from 'tg-file-id';
import * as Utils from './utils';

export let client: TelegramClient;

async function getFinnalId(chat_id: number | string) {
  if (typeof chat_id == 'string') {
    let entity = await client.getEntity(chat_id);
    return Number(entity.id);
  }
  if (typeof chat_id == 'number') {
    return Number(chat_id);
  }
}

export class Telegram {
  className: string = 'telegram';
  /**
   * Generate simple method from raw api gramjs
   * parameters :
   * @param tgclient - gramjs client
   * @example
   * ```ts
   * import {Telegram} from "tgsnake"
   * import {TelegramClient} from "telegram"
   * import {StringSession} from "telegram/sessions"
   * let client = new TelegramClient(
   *  new StringSession(""),
   *  api_id,
   *  api_hash,
   *  {
   *    connection_retries : 5
   *  }
   * )
   * let method = new Telegram(
   *  client
   * )
   * ```
   * now you can use this class with gramjs.
   */
  constructor(tgclient: TelegramClient) {
    client = tgclient;
  }
  /** @hidden
   * @param chat_id - chat which will to be check is channel or not.
   */
  private async isChannel(chat_id: number | string): Promise<boolean> {
    let type = await client.getEntity(chat_id);
    return Boolean(type.className == 'Channel');
  }
  /**
   * Sends a message to a chat.
   * @param chat_id - chat or channel or groups id.
   * @param text - text or message to send.
   * @param more - JSON object from {@link Interface.sendMessageMoreParams} which will be used to sendMessage.
   * @example
   * ```ts
   * ctx.telegram.sendMessage(1234567890,"Hello World!")
   * ```
   */
  async sendMessage(
    chat_id: number | string,
    text: string,
    more?: Interface.sendMessageMoreParams
  ) {
    let parseMode = '';
    let replyMarkup;
    if (more) {
      if (more.parseMode) {
        parseMode = more.parseMode.toLowerCase();
        delete more.parseMode;
      }
    }
    let [parseText, entities] = await _parseMessageText(client, text, parseMode);
    if (more) {
      if (more.entities) {
        entities = more.entities;
        parseText = text;
      }
      if (more.replyMarkup) {
        replyMarkup = Utils.BuildReplyMarkup(more.replyMarkup!);
        delete more.replyMarkup;
      }
    }
    return new reResults.ClassResultSendMessage(
      await client.invoke(
        new Api.messages.SendMessage({
          peer: chat_id,
          message: parseText,
          randomId: BigInt(-Math.floor(Math.random() * 10000000000000)),
          entities: entities,
          replyMarkup: replyMarkup,
          ...more,
        })
      )
    );
  }
  /**
   * Delete messages in a chat/channel/supergroup
   * @param chat_id - chat or Channel or groups id
   * @param message_id - array of number message id to be deleted.
   * @example
   * ```ts
   * ctx.telegram.deleteMessages(1234567890,[11])
   * ```
   */
  async deleteMessages(chat_id: number | string, message_id: number[]) {
    let type = await client.getEntity(chat_id);
    if (type.className == 'Channel') {
      return new reResults.ClassResultAffectedMessages(
        await client.invoke(
          new Api.channels.DeleteMessages({
            channel: chat_id,
            id: message_id,
          })
        )
      );
    } else {
      return new reResults.ClassResultAffectedMessages(
        await client.invoke(
          new Api.messages.DeleteMessages({
            revoke: true,
            id: message_id,
          })
        )
      );
    }
  }
  /**
   * Edit message
   * @param chat_id - chat or channel or groups id.
   * @param message_id - id from message to be edited.
   * @param text - new message if you need to edit media you can replace this with blank string ("")
   * @param more - JSON object from {@link Interface.editMessageMoreParams} which will be used to editMessage.
   * @example
   * ```ts
   * ctx.telegram.editMessage(123456789,11,"new text")
   * ```
   */
  async editMessage(
    chat_id: number | string,
    message_id: number,
    text: string,
    more?: Interface.editMessageMoreParams
  ) {
    let parseMode = '';
    let replyMarkup;
    if (more) {
      if (more.parseMode) {
        parseMode = more.parseMode.toLowerCase();
        delete more.parseMode;
      }
    }
    let [parseText, entities] = await _parseMessageText(client, text, parseMode);
    if (more) {
      if (more.entities) {
        entities = more.entities;
        parseText = text;
      }
      if (more.replyMarkup) {
        replyMarkup = Utils.BuildReplyMarkup(more.replyMarkup!);
        delete more.replyMarkup;
      }
    }
    return new reResults.ClassResultEditMessage(
      await client.invoke(
        new Api.messages.EditMessage({
          peer: chat_id,
          id: message_id,
          message: parseText,
          entities: entities,
          replyMarkup: replyMarkup,
          ...more,
        })
      )
    );
  }
  /**
   * Forwards messages by their IDs.
   * @param chat_id - chat or channel or groups id to be sending forwardMessages (receiver).
   * @param from_chat_id -  chat or channel or groups id which will forwarding messages  (sender).
   * @param message_id - array of number message id to be forward.
   * @param more - JSON object from {@link Interface.forwardMessageMoreParams} which will be used to forwardMessages.
   * @example
   * ```ts
   * ctx.telegram.forwardMessages(1234567890,0987654321,[11])
   * ```
   */
  async forwardMessages(
    chat_id: number | string,
    from_chat_id: number | string,
    message_id: number[],
    more?: Interface.forwardMessageMoreParams
  ) {
    let randomId: any = [];
    for (let i = 0; i < message_id.length; i++) {
      randomId.push(BigInt(Math.floor(Math.random() * 10000000000000)));
    }
    return new reResults.ClassResultForwardMessages(
      await client.invoke(
        new Api.messages.ForwardMessages({
          fromPeer: from_chat_id,
          toPeer: chat_id,
          id: message_id,
          randomId: randomId,
          ...more,
        })
      )
    );
  }
  /**
   * Get chat/channel/supergroup messages.
   * @param chat_id - chat or channel or groups id.
   * @param message_id - array of number message id.
   * @example
   * ```ts
   * ctx.telegram.getMessages(123456789,[11])
   * ```
   */
  async getMessages(chat_id: number | string, message_id: number[]) {
    let messageId: any = message_id;
    let type = await client.getEntity(chat_id);
    if (type.className == 'Channel') {
      return new reResults.ClassResultGetMessages(
        await client.invoke(
          new Api.channels.GetMessages({
            channel: chat_id,
            id: messageId,
          })
        )
      );
    } else {
      return new reResults.ClassResultGetMessages(
        await client.invoke(
          new Api.messages.GetMessages({
            id: messageId,
          })
        )
      );
    }
  }
  /**
   * Get and increase the view counter of a message sent or forwarded from a channel.
   * @param chat_id - channel id.
   * @param message_id - array of message id.
   * @param increment - Whether to mark the message as viewed and increment the view counter.
   * @example
   * ```ts
   * ctx.telegram.getMessagesViews(1234567890,[11])
   * ```
   */
  async getMessagesViews(
    chat_id: number | string,
    message_id: number[],
    increment: boolean = false
  ) {
    return new reResults.ClassResultGetMessagesViews(
      await client.invoke(
        new Api.messages.GetMessagesViews({
          peer: chat_id,
          id: message_id,
          increment: increment,
        })
      )
    );
  }
  /**
   * Returns the list of user photos.
   * @param chat_id - chat or channel or groups id.
   * @param more - JSON object from {@link Interface.getUserPhotosMoreParams} which will be used to getUserPhotos.
   * @example
   * ```ts
   * ctx.telegram.getUserPhotos(1234567890)
   * ```
   */
  async getUserPhotos(chat_id: number | string, more?: Interface.getUserPhotosMoreParams) {
    return client.invoke(
      new Api.photos.GetUserPhotos({
        userId: chat_id,
        ...more,
      })
    );
  }
  /**
   * Mark channel/supergroup history as read
   * @param chat_id - chat or channel or groups id.
   * @param more - JSON object from {@linl Interface.readHistoryMoreParams} which will be used to readHistory.
   * @example
   * ```ts
   * ctx.telegram.readHistory(1234567890)
   * ```
   */
  async readHistory(chat_id: number | string, more?: Interface.readHistoryMoreParams) {
    let type = await client.getEntity(chat_id);
    if (type.className == 'Channel') {
      return new reResults.ClassResultAffectedMessages(
        await client.invoke(
          new Api.channels.ReadHistory({
            channel: chat_id,
            ...more,
          })
        )
      );
    } else {
      return new reResults.ClassResultAffectedMessages(
        await client.invoke(
          new Api.messages.ReadHistory({
            peer: chat_id,
            ...more,
          })
        )
      );
    }
  }
  /**
   * Get unread messages where we were mentioned
   * @param chat_id - chat or channel or groups id.
   * @example
   * ```ts
   * ctx.telegram.readMentions(1234567890)
   * ```
   */
  async readMentions(chat_id: number | string) {
    return new reResults.ClassResultAffectedMessages(
      await client.invoke(
        new Api.messages.ReadMentions({
          peer: chat_id,
        })
      )
    );
  }
  /**
   * Mark channel/supergroup message contents as read
   * @param message_id - array of message id.
   * @example
   * ```ts
   * ctx.telegram.readMessageContents([11])
   * ```
   */
  async readMessageContents(message_id: number[]) {
    return new reResults.ClassResultAffectedMessages(
      await client.invoke(
        new Api.messages.ReadMessageContents({
          id: message_id,
        })
      )
    );
  }
  /**
   * Unpin all pinned messages
   * @param chat_id - chat or channel or groups id.
   * @example
   * ```ts
   * ctx.telegram.unpinAllMessages(1234567890)
   * ```
   */
  async unpinAllMessages(chat_id: number | string) {
    return new reResults.ClassResultAffectedMessages(
      await client.invoke(
        new Api.messages.UnpinAllMessages({
          peer: chat_id,
        })
      )
    );
  }
  /**
   * Pin a message
   * @param chat_id - chat or channel or groups id.
   * @param message_id - The message to pin or unpin
   * @param more - JSON object from {@link Interface.pinMessageMoreParams} which will be used to pinMessage.
   * @example
   * ```ts
   * ctx.telegram.pinMessage(1234567890,11)
   * ```
   */
  async pinMessage(
    chat_id: number | string,
    message_id: number,
    more?: Interface.pinMessageMoreParams
  ) {
    return new reResults.ClassResultPinMessage(
      await client.invoke(
        new Api.messages.UpdatePinnedMessage({
          peer: chat_id,
          id: message_id,
          ...more,
        })
      )
    );
  }
  /**
   * Delete the history of a supergroup
   * @param chat_id - Supergroup whose history must be deleted
   * @param more - JSON object from {@link Interface.deleteHistoryMoreParams} which will be used to deleteHistory.
   * @example
   * ```ts
   * ctx.telegram.deleteHistory(1234567890)
   * ```
   */
  async deleteHistory(chat_id: number | string, more?: Interface.deleteHistoryMoreParams) {
    let type = await client.getEntity(chat_id);
    if (type.className == 'Channel') {
      return client.invoke(
        new Api.channels.DeleteHistory({
          channel: chat_id,
          ...more,
        })
      );
    } else {
      return new reResults.ClassResultAffectedMessages(
        await client.invoke(
          new Api.messages.DeleteHistory({
            peer: chat_id,
            ...more,
          })
        )
      );
    }
  }
  /**
   * Delete all messages sent by a certain user in a supergroup
   * @param chat_id - channel or groups id.
   * @param user_id - User whose messages should be deleted
   * @example
   * ```ts
   * ctx.telegram.deleteUserHistory(1234567890,0987654321)
   * ```
   */
  async deleteUserHistory(chat_id: number | string, user_id: number | string) {
    return new reResults.ClassResultAffectedMessages(
      await client.invoke(
        new Api.channels.DeleteUserHistory({
          channel: chat_id,
          userId: user_id,
        })
      )
    );
  }
  /**
   * Modify the admin rights of a user in a supergroup/channel.
   * @param chat_id - channel or groups id
   * @param user_id - id from user which will modify the admin rights
   * @param more - JSON object from {@link Interface.editAdminMoreParams} which will be used to editAdmin.
   * @example
   * ```ts
   * ctx.telegram.editAdmin(1234567890,0987654321)
   * ```
   */
  async editAdmin(
    chat_id: number | string,
    user_id: number | string,
    more?: Interface.editAdminMoreParams
  ) {
    let permissions = {
      changeInfo: more?.changeInfo || true,
      postMessages: more?.postMessages || true,
      editMessages: more?.editMessages || true,
      deleteMessages: more?.deleteMessages || true,
      banUsers: more?.banUsers || true,
      inviteUsers: more?.inviteUsers || true,
      pinMessages: more?.pinMessages || true,
      addAdmins: more?.addAdmins || false,
      anonymous: more?.anonymous || false,
      manageCall: more?.manageCall || true,
    };
    return new reResults.ClassResultEditAdminOrBanned(
      await client.invoke(
        new Api.channels.EditAdmin({
          channel: chat_id,
          userId: user_id,
          adminRights: new Api.ChatAdminRights(permissions),
          rank: more?.rank || '',
        })
      )
    );
  }
  /**
   * Ban/unban/kick a user in a supergroup/channel.
   * @param chat_id - channel or groups id
   * @param user_id - id from user which will banned/kicked/unbanned
   * @param more - JSON object from {@link Interface.editBannedMoreParams} which will be used to editBanned.
   * @example
   * ```ts
   * ctx.telegram.editBanned(1234567890,0987654321)
   * ```
   */
  async editBanned(
    chat_id: number | string,
    user_id: number | string,
    more?: Interface.editBannedMoreParams
  ) {
    let permissions = {
      untilDate: more?.untilDate || 0,
      viewMessages: more?.viewMessages || true,
      sendMessages: more?.sendMessages || true,
      sendMedia: more?.sendMedia || true,
      sendStickers: more?.sendStickers || true,
      sendGifs: more?.sendGifs || true,
      sendGames: more?.sendGames || true,
      sendInline: more?.sendInline || true,
      sendPolls: more?.sendPolls || true,
      changeInfo: more?.changeInfo || true,
      inviteUsers: more?.inviteUsers || true,
      pinMessages: more?.pinMessages || true,
      embedLinks: more?.embedLinks || true,
    };
    return new reResults.ClassResultEditAdminOrBanned(
      await client.invoke(
        new Api.channels.EditBanned({
          channel: chat_id,
          participant: user_id,
          bannedRights: new Api.ChatBannedRights(permissions),
        })
      )
    );
  }
  /**
   * Change the photo of a channel/Supergroup
   * @param chat_id - Channel/supergroup whose photo should be edited
   * @param photo - new photo.
   * @example
   * ```ts
   * ctx.telegram.editPhoto(1234567890,"./media/tgsnake.jpg")
   * ```
   */
  async editPhoto(chat_id: number | string, photo: string | Buffer) {
    let rr = await this.uploadFile(photo);
    let toUpload = new Api.InputFile({ ...rr! });
    if (await this.isChannel(chat_id)) {
      return new reResults.ClassResultEditPhotoOrTitle(
        await client.invoke(
          new Api.channels.EditPhoto({
            channel: chat_id,
            photo: toUpload,
          })
        )
      );
    } else {
      return client.invoke(
        new Api.messages.EditChatPhoto({
          chatId: await getFinnalId(chat_id),
          photo: toUpload,
        })
      );
    }
  }
  /**
   * upload file from url or buffer or file path
   * @param file - file to uploaded
   * @param more - JSON object from {@link Interface.uploadFileMoreParams} which will be used to uploadFile.
   * @example
   * ```ts
   * ctx.telegram.uploadFile("./media/tgsnake.jpg")
   * ```
   */
  async uploadFile(file: string | Buffer, more?: Interface.uploadFileMoreParams) {
    if (Buffer.isBuffer(file)) {
      let fileInfo = await FileType.fromBuffer(file);
      if (fileInfo) {
        let file_name = more?.fileName || `${Date.now() / 1000}.${fileInfo.ext}`;
        let toUpload = new CustomFile(file_name, Buffer.byteLength(file), '', file);
        return new reResults.ClassResultUploadFile(
          await client.uploadFile({
            file: toUpload,
            workers: more?.workers || 1,
            onProgress: more?.onProgress,
          })
        );
      }
    } else {
      let basename = path.basename(file);
      if (/^http/i.exec(file)) {
        let res = await axios.get(file, {
          responseType: 'arraybuffer',
        });
        let basebuffer = Buffer.from(res.data, 'utf-8');
        let file_name = more?.fileName || basename;
        let match = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim.exec(file_name);
        if (!match) {
          let fileInfo = await FileType.fromBuffer(basebuffer);
          if (fileInfo) {
            file_name = `${file_name}.${fileInfo.ext}`;
          }
        }
        let toUpload = new CustomFile(file_name, Buffer.byteLength(basebuffer), '', basebuffer);
        return new reResults.ClassResultUploadFile(
          await client.uploadFile({
            file: toUpload,
            workers: more?.workers || 1,
            onProgress: more?.onProgress,
          })
        );
      }
      if (/^(\/|\.\.?\/|~\/)/i.exec(file)) {
        let file_name = more?.fileName || basename;
        let match = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim.exec(file_name);
        if (!match) {
          let fileInfo = await FileType.fromFile(file);
          if (fileInfo) {
            file_name = `${file_name}.${fileInfo.ext}`;
          }
        }
        let toUpload = new CustomFile(file_name, fs.statSync(file).size, file);
        return new reResults.ClassResultUploadFile(
          await client.uploadFile({
            file: toUpload,
            workers: more?.workers || 1,
            onProgress: more?.onProgress,
          })
        );
      }
    }
  }
  /**
   * Edit the name of a channel/supergroup
   * @param chat_id - chat or channel or groups id.
   * @param title - new title.
   * @example
   * ```ts
   * ctx.telegram.editTitle(1234567890,"new title")
   * ```
   */
  async editTitle(chat_id: number | string, title: string) {
    if (await this.isChannel(chat_id)) {
      return new reResults.ClassResultEditPhotoOrTitle(
        await client.invoke(
          new Api.channels.EditTitle({
            channel: chat_id,
            title: title,
          })
        )
      );
    } else {
      return client.invoke(
        new Api.messages.EditChatTitle({
          chatId: await getFinnalId(chat_id),
          title: title,
        })
      );
    }
  }
  /**
   * Get link and embed info of a message in a channel/supergroup.
   * @param chat_id - chat or channel or groups id.
   * @param message_id - message id
   * @param more - JSON object from {@link Interface.exportMessageLinkMoreParams} which will be used to exportMessageLink
   * @example
   * ```ts
   * ctx.telegram.exportMessageLink(1234567890,11)
   * ```
   */
  async exportMessageLink(
    chat_id: number | string,
    message_id: number,
    more?: Interface.exportMessageLinkMoreParams
  ) {
    return client.invoke(
      new Api.channels.ExportMessageLink({
        channel: chat_id,
        id: message_id,
        ...more,
      })
    );
  }
  /**
   * Get channels/supergroups/geogroups we're admin in. Usually called when the user exceeds the limit for owned public channels/supergroups/geogroups, and the user is given the choice to remove one of his channels/supergroups/geogroups.
   * @param by_location - Get geogroups
   * @param check_limit - If set and the user has reached the limit of owned public channels/supergroups/geogroups, instead of returning the channel list one of the specified errors will be returned. Useful to check if a new public channel can indeed be created, even before asking the user to enter a channel username to use in channels.checkUsername/channels.updateUsername.
   * @example
   * ```ts
   * ctx.telegram.getAdminedPublicChannels()
   * ```
   */
  async getAdminedPublicChannels(by_location: boolean = true, check_limit: boolean = true) {
    return new reResults.ClassResultMessageChat(
      await client.invoke(
        new Api.channels.GetAdminedPublicChannels({
          byLocation: by_location,
          checkLimit: check_limit,
        })
      )
    );
  }
  /**
   * Get the admin log of a channel/supergroup
   * @param chat_id - chat or channel or groups id.
   * @param more - JSON object from {@link Interface.getAdminLogMoreParams} which will be used to getAdminLog
   * @example
   * ```ts
   * ctx.telegram.getAdminLog(1234567890)
   * ```
   */
  async getAdminLog(chat_id: number | string, more?: Interface.getAdminLogMoreParams) {
    let filter = {
      join: more?.join || true,
      leave: more?.leave || true,
      invite: more?.invite || true,
      ban: more?.ban || true,
      unban: more?.unban || true,
      kick: more?.kick || true,
      unkick: more?.unkick || true,
      promote: more?.promote || true,
      demote: more?.demote || true,
      info: more?.info || true,
      settings: more?.settings || true,
      pinned: more?.pinned || true,
      groupCall: more?.groupCall || true,
      invites: more?.invites || true,
      edit: more?.edit || true,
      delete: more?.delete || true,
    };
    return new reResults.ClassResultGetAdminLog(
      await client.invoke(
        new Api.channels.GetAdminLog({
          channel: chat_id,
          eventsFilter: new Api.ChannelAdminLogEventsFilter(filter),
          q: more?.q || '',
          maxId: more?.maxId || undefined,
          minId: more?.minId || undefined,
          limit: more?.limit || undefined,
        })
      )
    );
  }
  /**
   * Get info about channels/supergroups
   * @param chat_id - IDs of channels/supergroups to get info about
   * @example
   * ```ts
   * ctx.telegram.getChannels([1234567890])
   * ```
   */
  async getChannels(chat_id: number[] | string[]) {
    return new reResults.ClassResultMessageChat(
      await client.invoke(
        new Api.channels.GetChannels({
          id: chat_id,
        })
      )
    );
  }
  /**
   * Get full info about a channel or chats
   * @param chat_id - IDs of chat/channels/supergroups to get info about
   * @example
   * ```ts
   * ctx.telegram.getFullChat(1234567890)
   * ```
   */
  async getFullChat(chat_id: number | string) {
    if (await this.isChannel(chat_id)) {
      return client.invoke(
        new Api.channels.GetFullChannel({
          channel: chat_id,
        })
      );
    } else {
      return client.invoke(
        new Api.messages.GetFullChat({
          chatId: await getFinnalId(chat_id),
        })
      );
    }
  }
  /**
   * Get all groups that can be used as discussion groups.
   * @example
   * ```ts
   * ctx.telegram.getGroupsForDiscussion()
   * ```
   */
  async getGroupsForDiscussion() {
    return new reResults.ClassResultMessageChat(
      await client.invoke(new Api.channels.GetGroupsForDiscussion())
    );
  }
  /**
   * Get inactive channels and supergroups
   * @example
   * ```ts
   * ctx.telegram.getInactiveChannels()
   * ```
   */
  async getInactiveChannels() {
    return client.invoke(new Api.channels.GetInactiveChannels());
  }
  /**
   * Get a list of channels/supergroups we left.
   * @param offset - Offset for pagination.
   * @example
   * ```ts
   * ctx.TelegramClient.getLeftChannels()
   * ```
   */
  async getLeftChannels(offset: number = 0) {
    return client.invoke(
      new Api.channels.GetLeftChannels({
        offset: offset,
      })
    );
  }
  /**
   * Sending Media.
   * @param chat_id - chat id
   * @param media - media
   * @param more - JSON object from {@link Interface.sendMediaMoreParams} which will be used to sendMedia.
   * @example
   * ```ts
   * let toUpload = await ctx.telegram.uploadFile("./media/tgsnake.jpg")
   * ctx.telegram.sendMedia(
   *  1234567890,
   *  new Api.InputMediaUploadedPhoto({
   *    file : new Api.InputFile({...toUpload!})
   *  })
   * )
   * ```
   */
  async sendMedia(
    chat_id: number | string,
    media: Api.TypeInputMedia,
    more?: Interface.sendMediaMoreParams
  ) {
    let parseMode = '';
    if (more) {
      if (more.parseMode) {
        parseMode = more.parseMode.toLowerCase();
        delete more.parseMode;
      }
    }
    let parseText;
    let entities;
    let replyMarkup;
    if (more) {
      if (more.entities) {
        entities = more.entities;
        parseText = more.caption || '';
        delete more.entities;
      }
      if (more.caption && !entities) {
        let parse = await _parseMessageText(client, more.caption, parseMode);
        parseText = parse[0];
        entities = parse[1];
        delete more.caption;
      }
      if (more.replyMarkup) {
        replyMarkup = Utils.BuildReplyMarkup(more.replyMarkup!);
        delete more.replyMarkup;
      }
      if (more.workers) {
        delete more.workers;
      }
    }
    return client.invoke(
      new Api.messages.SendMedia({
        peer: chat_id,
        media: media,
        message: parseText || '',
        randomId: BigInt(-Math.floor(Math.random() * 10000000000000)),
        entities: entities,
        replyMarkup: replyMarkup,
        ...more,
      })
    );
  }
  /**
   * Sending Photo with fileId or PathFile or buffer or message.media
   * @param chat_id - Destination
   * @param fileId - Attached media
   * @param more - JSON object from {@link Interface.sendMediaMoreParams} which will be used to sendPhoto.
   * @example
   * ```ts
   * ctx.telegram.sendPhoto(1234567890,"./media/tgsnake.jpg")
   * ```
   */
  async sendPhoto(
    chat_id: number | string,
    fileId: string | Buffer | Api.MessageMediaPhoto | Api.Photo,
    more?: Interface.sendMediaMoreParams
  ) {
    let final: any;
    if (fileId instanceof Api.MessageMediaPhoto) {
      final = fileId as Api.MessageMediaPhoto;
    }
    if (fileId instanceof Api.Photo) {
      final = fileId as Api.Photo;
    }
    if (typeof fileId == 'string') {
      if (
        Buffer.isBuffer(fileId) ||
        /^http/i.exec(String(fileId)) ||
        /^(\/|\.\.?\/|~\/)/i.exec(String(fileId))
      ) {
        let file = await this.uploadFile(fileId, {
          workers: more?.workers || 1,
        });
        final = new Api.InputMediaUploadedPhoto({
          file: new Api.InputFile({ ...file! }),
        });
      }
    }
    return this.sendMedia(chat_id, final, more);
  }
  /**
   * Sending Document with fileId or PathFile or buffer or message.media
   * @param chat_id - Destination
   * @param fileId - Attached media
   * @param more - JSON object from {@link Interface.sendMediaMoreParams} which will be used to sendDocument.
   * @example
   * ```ts
   * ctx.telegram.sendDocument(1234567890,"./media/tgsnake.jpg")
   * ```
   */
  async sendDocument(
    chat_id: number | string,
    fileId: string | Buffer | Api.MessageMediaDocument | Api.Document,
    more?: Interface.sendMediaMoreParams
  ) {
    let final: any;
    if (fileId instanceof Api.MessageMediaDocument) {
      final = fileId as Api.MessageMediaDocument;
    }
    if (fileId instanceof Api.Document) {
      final = fileId as Api.Document;
    }
    if (typeof fileId == 'string') {
      if (
        Buffer.isBuffer(fileId) ||
        /^http/i.exec(String(fileId)) ||
        /^(\/|\.\.?\/|~\/)/i.exec(String(fileId))
      ) {
        let file = await this.uploadFile(fileId, {
          workers: more?.workers || 1,
        });
        let info = await this._getFileInfo(fileId);
        let basename = path.basename(String(fileId));
        if (!/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim.exec(basename)) {
          basename = `${basename}.${info?.ext}`;
        }
        final = new Api.InputMediaUploadedDocument({
          file: new Api.InputFile({ ...file! }),
          mimeType: info?.mime!,
          attributes: [
            new Api.DocumentAttributeFilename({
              fileName: basename,
            }),
          ],
        });
      }
    }
    return this.sendMedia(chat_id, final, more);
  }
  /**
   * Sending sticker.
   * @param chat_id - destination
   * @param fileId - path/buffer/fileId to sending sticker.
   * @example
   * ```ts
   * ctx.telegram.sendSticker(1234567890,message.media.fileId)
   * ```
   */
  async sendSticker(
    chat_id: number | string,
    fileId: string | Buffer | Api.MessageMediaDocument | Api.Document
  ) {
    let final: any;
    if (fileId instanceof Api.MessageMediaDocument) {
      final = fileId as Api.MessageMediaDocument;
    }
    if (fileId instanceof Api.Document) {
      final = fileId as Api.Document;
    }
    if (typeof fileId == 'string') {
      if (
        Buffer.isBuffer(fileId) ||
        /^http/i.exec(String(fileId)) ||
        /^(\/|\.\.?\/|~\/)/i.exec(String(fileId))
      ) {
        let file = await this.uploadFile(fileId);
        final = new Api.InputMediaUploadedDocument({
          file: new Api.InputFile({ ...file! }),
          mimeType: 'image/webp',
          attributes: [
            new Api.DocumentAttributeFilename({
              fileName: `sticker.webp`,
            }),
          ],
        });
      }
    }
    if (final) {
      return this.sendMedia(chat_id, final);
    } else {
      let decode;
      if (typeof fileId !== 'string') {
        throw new Error('Invalid FileId!');
      }
      try {
        decode = decodeFileId(String(fileId));
      } catch (error) {
        throw new Error('Invalid FileId!');
      }
      if (decode) {
        if (decode.fileType == 'sticker') {
          let resultsSendSticker;
          let accessHash = Number(decode.access_hash);
          while (true) {
            let inputDocument = new Api.InputDocument({
              id: BigInt(decode.id),
              accessHash: BigInt(accessHash),
              fileReference: Buffer.from(decode.fileReference, 'hex'),
            });
            try {
              resultsSendSticker = await this.sendMedia(
                chat_id,
                new Api.InputMediaDocument({
                  id: inputDocument,
                })
              );
              break;
            } catch (e) {
              if (!String(accessHash).startsWith('-')) {
                accessHash = accessHash * -1;
              } else {
                throw new Error(e.message);
                break;
              }
            }
          }
          return resultsSendSticker;
        } else {
          throw new Error(`Invalid FileType. It must be "sticker". Received ${decode.fileType}`);
        }
      }
    }
  }
  /**
   * @hidden
   * Get the fileInfo from url or filePath.
   */
  private async _getFileInfo(file: string) {
    if (/^http/i.exec(file)) {
      let res = await axios.get(file, {
        responseType: 'arraybuffer',
      });
      let basebuffer = Buffer.from(res.data, 'utf-8');
      let fileInfo = await FileType.fromBuffer(basebuffer);
      return fileInfo;
    }
    if (/^(\/|\.\.?\/|~\/)/i.exec(file)) {
      let fileInfo = await FileType.fromFile(file);
      return fileInfo;
    }
  }
  /**
   * Turns the given entity into a valid Telegram entity.
   * @param chat_id - The chatId which will getting entity.
   * @example
   * ```ts
   * ctx.telegram.getEntity("me")
   * ```
   */
  async getEntity(chat_id: string | number) {
    return new reResults.ClassResultGetEntity(await client.getEntity(chat_id));
  }
}
