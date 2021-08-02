// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Telegram } from './tele';
import { NewMessage } from 'telegram/events';
import { NewMessageEvent } from 'telegram/events/NewMessage';
import { Api } from 'telegram';
import { Message } from './rewritejson';
import { TelegramClient } from 'telegram';
import * as Interface from './interface';
let client: TelegramClient;

export class Shortcut {
  /**
   * Original Event from gramjs.
   */
  event: NewMessageEvent;
  /**
   * New JSON Message.
   */
  message: Interface.Message;
  /**
   * All method in here.
   */
  telegram: Telegram;
  /**
   * @param tgclient - Telegram Client
   * @param event - Incomming new Event (NewMessageEvent)
   */
  constructor(tgclient: TelegramClient, event: NewMessageEvent) {
    client = tgclient;
    this.telegram = new Telegram(tgclient);
    this.event = event;
    this.message = new Message(event);
  }
  /**
   * shortcut from {@link Telegram.sendMessage} with replying message and markdown parse.
   * @param text - text which will be used to send message.
   * @param more - JSON object from {@link Interface.replyMoreParams} which will be used to send message.
   * @example
   * ```ts
   * ctx.reply("**Hello World!**")
   * ```
   */
  async reply(text: string, more?: Interface.replyMoreParams) {
    return this.telegram.sendMessage(this.message.chat.id, text, {
      replyToMsgId: this.message.id,
      parseMode: more?.parseMode || 'markdown',
      ...more,
    });
  }
  /**
   * shortcut from {@link Telegram.sendMessage} with replying message and HTML parse.
   * @param text - text which will be used to send message.
   * @param more - JSON object from {@link Interface.replyMoreParams} which will be used to send message.
   * @example
   * ```ts
   * ctx.replyHTML("<b>Hello World!</b>")
   * ```
   */
  async replyHTML(text: string, more?: Interface.replyMoreParams) {
    return this.telegram.sendMessage(this.message.chat.id, text, {
      replyToMsgId: this.message.id,
      parseMode: 'html',
      ...more,
    });
  }
  /**
   * shortcut from {@link Telegram.sendMessage} without replying message and without parse mode
   * @param text - text which will be used to send message.
   * @param more - JSON object from {@link Interface.sendMessageMoreParams} which will be used to send message.
   * @example
   * ```ts
   * ctx.respond("Hello World!")
   * ```
   */
  async respond(text: string, more?: Interface.sendMessageMoreParams) {
    return this.telegram.sendMessage(this.message.chat.id, text, more);
  }
  /**
   * shortcut from {@link Telegram.deleteMessages}
   * @param message_id - array of message id to be deleted.
   * @example
   * ```ts
   * ctx.deleteMessages([1,2,3])
   * ```
   */
  async deleteMessages(message_id: number[]) {
    return this.telegram.deleteMessages(this.message.chat.id, message_id);
  }
  /**
   * shortcut from {@link Telegram.editMessage}
   * @param message_id - message id which will edited.
   * @param text - new text. you can fill with empty string (`""`) if you need to edit a media.
   * @param more - JSON object from {@link Interface.editMessageMoreParams} which will be used to edit message.
   * @example
   * ```ts
   * ctx.editMessage(123,"New Text!")
   * ```
   */
  async editMessage(message_id: number, text: string, more?: Interface.editMessageMoreParams) {
    return this.telegram.editMessage(this.message.chat.id, message_id, text, more);
  }
  /**
   * shortcut from {@link Telegram.forwardMessages}
   * Forwards messages by their IDs.
   * @param chat_id - chat or channel or groups id to be sending forwardMessages (receiver).
   * @param from_chat_id -  chat or channel or groups id which will forwarding messages  (sender).
   * @param message_id - array of number message id to be forward.
   * @param more - JSON object from {@link Interface.forwardMessageMoreParams} which will be used to {@link Telegram.forwardMessages}
   * @example
   * ```ts
   * ctx.forwardMessages(12234,55278,[1,4,7])
   * ```
   */
  async forwardMessages(
    chat_id: number,
    from_chat_id: number,
    message_id: number[],
    more?: Interface.forwardMessageMoreParams
  ) {
    return this.telegram.forwardMessages(chat_id, from_chat_id, message_id, more);
  }
  /**
   * shortcut from {@link Telegram.getMessages}
   * Get chat/channel/supergroup messages.
   * @param message_id - array of number message id.
   * @example
   * ```ts
   * ctx.getMessages([123,545])
   * ```
   */
  async getMessages(message_id: number[]) {
    return this.telegram.getMessages(this.message.chat.id, message_id);
  }
  /**
   * shortcut from {@link Telegram.getMessagesViews}
   * Get and increase the view counter of a message sent or forwarded from a channel.
   * @param message_id - array of message id.
   * @param increment - Whether to mark the message as viewed and increment the view counter.
   * @example
   * ```ts
   * ctx.getMessagesViews([12,55])
   * ```
   */
  async getMessagesViews(message_id: number[], increment: boolean = false) {
    return this.telegram.getMessagesViews(this.message.chat.id, message_id, increment);
  }
  /**
   * Returns the list of user photos.
   * Shortcut from {@link Telegram.getUserPhotos}.
   * @param chat_id - chat or channel or groups id.
   * @param more - JSON object from {@link Interface.getUserPhotosMoreParams} which will be used to {@link Telegram.getUserPhotos}.
   * @example
   * ```ts
   * ctx.getUserPhotos(1234567890)
   * ```
   */
  async getUserPhotos(chat_id: number | string, more?: Interface.getUserPhotosMoreParams) {
    return this.telegram.getUserPhotos(chat_id, more);
  }
  /**
   * Mark channel/supergroup history as read
   * shortcut from {@link Telegram.readHistory}
   * @param more - JSON object from {@link Interface.readHistoryMoreParams} which will be used to {@link Telegram.readHistory}.
   * @example
   * ```ts
   * ctx.readHistory()
   * ```
   */
  async readHistory(more?: Interface.readHistoryMoreParams) {
    return this.telegram.readHistory(this.message.chat.id, more);
  }
  /**
   * Get unread messages where we were mentioned.
   * shortcut from {@link Telegram.readMentions}
   * @example
   * ```ts
   * ctx.readMentions()
   * ```
   */
  async readMentions() {
    return this.telegram.readMentions(this.message.chat.id);
  }
  /**
   * Mark channel/supergroup message contents as read
   * @param message_id - array of message id.
   * @example
   * ```ts
   * ctx.readMessageContents([11])
   * ```
   */
  async readMessageContents(message_id: number[]) {
    return this.telegram.readMessageContents(message_id);
  }
  /**
   * Unpin all pinned messages.
   * shortcut from {@link Telegram.unpinAllMessages}
   * @example
   * ```ts
   * ctx.unpinAllMessages()
   * ```
   */
  async unpinAllMessages() {
    return this.telegram.unpinAllMessages(this.message.chat.id);
  }
  /**
   * Pin a message.
   * shortcut from {@link Telegram.pinMessage}
   * @param message_id - The message to pin or unpin
   * @param more - JSON object from {@link Interface.pinMessageMoreParams} which will be used to {@link Telegram.pinMessage}.
   * @example
   * ```ts
   * ctx.pinMessage(11)
   * ```
   */
  async pinMessage(message_id: number, more?: Interface.pinMessageMoreParams) {
    return this.telegram.pinMessage(this.message.chat.id, message_id, more);
  }
  /**
   * Unpin a message.
   * modified from {@link Telegram.pinMessage}
   * @param message_id - The message to pin or unpin
   * @example
   * ```ts
   * ctx.unpinMessage(11)
   * ```
   */
  async unpinMessage(message_id: number) {
    return this.telegram.pinMessage(this.message.chat.id, message_id, {
      unpin: true,
    });
  }
  /**
   * Delete the history of a supergroup.
   * shortcut from {@link Telegram.deleteHistory}
   * @param more - JSON object from {@link Interface.deleteHistoryMoreParams} which will be used to {@link Telegram.deleteHistory}.
   * @example
   * ```ts
   * ctx.deleteHistory()
   * ```
   */
  async deleteHistory(more?: Interface.deleteHistoryMoreParams) {
    return this.telegram.deleteHistory(this.message.chat.id, more);
  }
  /**
   * Delete all messages sent by a certain user in a supergroup.
   * shortcut from {@link Telegram.deleteUserHistory}
   * @param user_id - User whose messages should be deleted
   * @example
   * ```ts
   * ctx.deleteUserHistory(1234567890)
   * ```
   */
  async deleteUserHistory(user_id: number | string) {
    return this.telegram.deleteUserHistory(this.message.chat.id, user_id);
  }
  /**
   * Modify the admin rights of a user in a supergroup/channel.
   * shortcut from {@link Telegram.editAdmin}.
   * @param user_id - id from user which will modify the admin rights
   * @param more - JSON object from {@link Interface.editAdminMoreParams} which will be used to {@link Telegram.editAdmin}.
   * @example
   * ```ts
   * ctx.editAdmin(1234567890)
   * ```
   */
  async editAdmin(user_id: number | string, more?: Interface.editAdminMoreParams) {
    return this.telegram.editAdmin(this.message.chat.id, user_id, more);
  }
  /**
   * Ban/unban/kick a user in a supergroup/channel.
   * shortcut from {@link Telegram.editBanned}.
   * @param user_id - id from user which will banned/kicked/unbanned
   * @param more - JSON object from {@link Interface.editBannedMoreParams} which will be used to {@link Telegram.editBanned}.
   * @example
   * ```ts
   * ctx.editBanned(1234567890)
   * ```
   */
  async editBanned(user_id: number | string, more?: Interface.editBannedMoreParams) {
    return this.telegram.editBanned(this.message.chat.id, user_id, more);
  }
  /**
   * Change the photo of a channel/Supergroup.
   * shortcut from {@link Telegram.editPhoto}
   * @param photo - new photo.
   * @example
   * ```ts
   * ctx.editPhoto("./media/tgsnake.jpg")
   * ```
   */
  async editPhoto(photo: string | Buffer) {
    return this.telegram.editPhoto(this.message.chat.id, photo);
  }
  /**
   * upload file from url or buffer or file path.
   * shortcut from {@link Telegram.uploadFile}.
   * @param file - file to uploaded
   * @param more - JSON object from {@link Interface.uploadFileMoreParams} which will be used to {@link Telegram.uploadFile}.
   * @example
   * ```ts
   * ctx.uploadFile("./media/tgsnake.jpg")
   * ```
   */
  async uploadFile(file: string | Buffer, more?: Interface.uploadFileMoreParams) {
    return this.telegram.uploadFile(file, more);
  }
  /**
   * Edit the name of a channel/supergroup.
   * shortcut from {@link Telegram.editTitle}
   * @param title - new title.
   * @example
   * ```ts
   * ctx.editTitle("new title")
   * ```
   */
  async editTitle(title: string) {
    return this.telegram.editTitle(this.message.chat.id, title);
  }
  /**
   * Get link and embed info of a message in a channel/supergroup.
   * shortcut from {@link Telegram.exportMessageLink}
   * @param message_id - message id
   * @param more - JSON object from {@link Interface.exportMessageLinkMoreParams} which will be used to {@link Telegram.exportMessageLink}
   * @example
   * ```ts
   * ctx.exportMessageLink(11)
   * ```
   */
  async exportMessageLink(message_id: number, more?: Interface.exportMessageLinkMoreParams) {
    return this.telegram.exportMessageLink(this.message.chat.id, message_id, more);
  }
  /**
   * Get channels/supergroups/geogroups we're admin in. Usually called when the user exceeds the limit for owned public channels/supergroups/geogroups, and the user is given the choice to remove one of his channels/supergroups/geogroups.
   * shortcut from {@link Telegram.getAdminedPublicChannels}.
   * @param by_location - Get geogroups
   * @param check_limit - If set and the user has reached the limit of owned public channels/supergroups/geogroups, instead of returning the channel list one of the specified errors will be returned. Useful to check if a new public channel can indeed be created, even before asking the user to enter a channel username to use in channels.checkUsername/channels.updateUsername.
   * @example
   * ```ts
   * ctx.getAdminedPublicChannels()
   * ```
   */
  async getAdminedPublicChannels(by_location: boolean = true, check_limit: boolean = true) {
    return this.telegram.getAdminedPublicChannels(by_location, check_limit);
  }
  /**
   * Get the admin log of a channel/supergroup.
   * shortcut from {@link Telegram.getAdminLog}
   * @param more - JSON object from {@link Interface.getAdminLogMoreParams} which will be used to {@link Telegram.getAdminLog}.
   * @example
   * ```ts
   * ctx.getAdminLog()
   * ```
   */
  async getAdminLog(more?: Interface.getAdminLogMoreParams) {
    return this.telegram.getAdminLog(this.message.chat.id, more);
  }
  /**
   * Get info about channels/supergroups
   * shortcut from {@link Telegram.getChannels}
   * @param chat_id - IDs of channels/supergroups to get info about
   * @example
   * ```ts
   * ctx.getChannels([1234567890])
   * ```
   */
  async getChannels(chat_id: number[] | string[]) {
    return this.telegram.getChannels(chat_id);
  }
  /**
   * Get full info about a channel or chats
   * shortcut from {@link Telegram.getFullChat}
   * @param chat_id - IDs of chat/channels/supergroups to get info about
   * @example
   * ```ts
   * ctx.getFullChat()
   * ```
   */
  async getFullChat(chat_id: number | string = this.message.chat.id) {
    return this.telegram.getFullChat(chat_id);
  }
  /**
   * Get all groups that can be used as discussion groups.
   * shortcut from {@link Telegram.getGroupsForDiscussion}
   * @example
   * ```ts
   * ctx.getGroupsForDiscussion()
   * ```
   */
  async getGroupsForDiscussion() {
    return this.telegram.getGroupsForDiscussion();
  }
  /**
   * Get inactive channels and supergroups
   * shortcut from {@link Telegram.getInactiveChannels}
   * @example
   * ```ts
   * ctx.getInactiveChannels()
   * ```
   */
  async getInactiveChannels() {
    return this.telegram.getInactiveChannels();
  }
  /**
   * Get a list of channels/supergroups we left.
   * shortcut from {@link Telegram.getLeftChannels}
   * @param offset - Offset for pagination.
   * @example
   * ```ts
   * ctx.getLeftChannels()
   * ```
   */
  async getLeftChannels() {
    return this.telegram.getLeftChannels();
  }
  /**
   * Sending Media.
   * shortcut from {@link Telegram.sendMedia}
   * @param media - media
   * @param more - JSON object from {@link Interface.sendMediaMoreParams} which will be used to {@link Telegram.sendMedia}.
   * @example
   * ```ts
   * let toUpload = await ctx.uploadFile("./media/tgsnake.jpg")
   * ctx.replyMedia(
   *  new Api.InputMediaUploadedPhoto({
   *    file : new Api.InputFile({...toUpload!})
   *  })
   * )
   * ```
   */
  async replyMedia(media: Api.TypeInputMedia, more?: Interface.sendMediaMoreParams) {
    return this.telegram.sendMedia(this.message.chat.id, media, more);
  }
  /**
   * Sending Photo with fileId or PathFile or buffer or message.media
   * shortcut from {@link Telegram.sendPhoto}
   * @param fileId - Attached media
   * @param more - JSON object from {@link Interface.sendMediaMoreParams} which will be used to {@link Telegram.sendPhoto}.
   * @example
   * ```ts
   * ctx.replyPhoto("./media/tgsnake.jpg")
   * ```
   */
  async replyPhoto(
    fileId: string | Buffer | Api.MessageMediaPhoto | Api.Photo,
    more?: Interface.sendMediaMoreParams
  ) {
    return this.telegram.sendPhoto(this.message.chat.id, fileId, more);
  }
  /**
   * Sending Document with fileId or PathFile or buffer or message.media
   * shortcut from {@link Telegram.sendDocument}
   * @param fileId - Attached media
   * @param more - JSON object from {@link Interface.sendMediaMoreParams} which will be used to sendDocument.
   * @example
   * ```ts
   * ctx.replyDocument("./media/tgsnake.jpg")
   * ```
   */
  async replyDocument(
    fileId: string | Buffer | Api.MessageMediaDocument | Api.Document,
    more?: Interface.sendMediaMoreParams
  ) {
    return this.telegram.sendDocument(this.message.chat.id, fileId, more);
  }
  /**
   * Sending sticker.
   * shortcut from {@link Telegram.sendSticker}
   * @param fileId - path/buffer/fileId to sending sticker.
   * @example
   * ```ts
   * ctx.replySticker(message.media.fileId)
   * ```
   */
  async replySticker(fileId: string | Buffer | Api.MessageMediaDocument | Api.Document) {
    return this.telegram.sendSticker(this.message.chat.id, fileId);
  }
}
