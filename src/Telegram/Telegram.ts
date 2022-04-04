// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { inspect } from 'util';
import * as Utils from '../Utils';
import * as Users from './Users';
import * as Bots from './Bots';
import * as Media from './Media';
import * as Messages from './Messages';
import * as Chats from './Chats';
import * as Client from '../Client';
import * as Interface from '../Interface';

export class Telegram {
  /** @hidden */
  private _SnakeClient!: Client.Snake;
  constructor(SnakeClient: Client.Snake) {
    this._SnakeClient = SnakeClient;
  }
  /** @hidden */
  [inspect.custom]() {
    return Utils.betterConsoleLog(this);
  }
  /** @hidden */
  toJSON() {
    let obj = Utils.betterConsoleLog(this);
    for (let [key, value] of Object.entries(obj)) {
      if (typeof value == 'bigint') obj[key] = String(value);
    }
    return obj;
  }
  get SnakeClient() {
    return this._SnakeClient;
  }
  get snakeClient() {
    return this._SnakeClient;
  }
  // getEntity
  async getEntity(chatId: bigint | string | number, useCache?: boolean) {
    return Users.GetEntity(this.SnakeClient, chatId, useCache);
  }
  // getMe
  async getMe() {
    return this.getEntity('me');
  }
  // sendMessage
  async sendMessage(
    chatId: bigint | number | string,
    text: string,
    more?: Messages.sendMessageMoreParams
  ) {
    return Messages.sendMessage(this.SnakeClient, chatId, text, more);
  }
  // deleteMessages
  /**
   * This method allow you to deletes messages by their identifiers
   * @param {number|string|bigint} chatId - User or chat, where is the message located.
   * @param {Array} messageId - Message ID list which will be deleted.
   * ```ts
   * bot.command("delete", async (ctx) => {
   *     let results = await ctx.telegram.deleteMessages(ctx.chat.id,[ctx.id])
   *     return console.log(results)
   * })
   * ```
   */
  async deleteMessages(chatId: bigint | number | string, messageId: number[]) {
    return Messages.DeleteMessages(this.SnakeClient, chatId, messageId);
  }
  /**
   * This method allow you to delete message by their identifiers
   * @param {number|string|bigint} chatId - User or chat, where is the message located.
   * @param {number} messageId - Message ID which will be deleted.
   * ```ts
   * bot.command("delete", async (ctx) => {
   *     let results = await ctx.telegram.deleteMessages(ctx.chat.id,ctx.id)
   *     return console.log(results)
   * })
   * ```
   */
  async deleteMessage(chatId: bigint | number | string, messageId: number) {
    return Messages.DeleteMessages(this.SnakeClient, chatId, [messageId]);
  }
  // editMessage
  /**
   * This method allow you to edit a message.
   * @param snakeClient - Client
   * @param {number|string|bigint} chatId - Chat/Groups/Channel id.
   * @param {number} messageId - Message id to be edited.
   * @param {string} text - New Message/Caption. You can pass with blank string (`""`) if you want to edit media.
   * @param {Object} more - more parameters to use.
   */
  async editMessage(
    chatId: bigint | number | string,
    messageId: number,
    text: string,
    more?: Messages.editMessageMoreParams
  ) {
    return Messages.EditMessage(this.SnakeClient, chatId, messageId, text, more);
  }
  // forwardMessages
  /**
   * Forwards messages by their IDs.
   * @param {number|string|bigint} chatId - Destination.
   * @param {number|string|bigint} fromChatId - Source of messages.
   * @param {Array} messageId - IDs of messages which will forwarded.
   * @param {Object} more - more paramaters to use.
   * ```ts
   * bot.command("forward", async (ctx) => {
   *     let results = await ctx.telegram.forwardMessages(ctx.chat.id,ctx.chat.id,[ctx.id])
   *     return console.log(results)
   * })
   * ```
   */
  async forwardMessages(
    chatId: bigint | number | string,
    fromChatId: bigint | number | string,
    messageId: number[],
    more?: Messages.forwardMessageMoreParams
  ) {
    return Messages.ForwardMessages(this.SnakeClient, chatId, fromChatId, messageId, more);
  }
  /**
   * Forward message by their IDs.
   * @param {number|string|bigint} chatId - Destination.
   * @param {number|string|bigint} fromChatId - Source of messages.
   * @param {number} messageId - ID of messages which will forwarded.
   * @param {Object} more - more paramaters to use.
   * ```ts
   * bot.command("forward", async (ctx) => {
   *     let results = await ctx.telegram.forwardMessages(ctx.chat.id,ctx.chat.id,ctx.id)
   *     return console.log(results)
   * })
   * ```
   */
  async forwardMessage(
    chatId: bigint | number | string,
    fromChatId: bigint | number | string,
    messageId: number,
    more?: Messages.forwardMessageMoreParams
  ) {
    return Messages.ForwardMessages(this.SnakeClient, chatId, fromChatId, [messageId], more);
  }
  // getMessages
  /**
   * Returns the list of messages by their IDs.
   * @param {bigint|number|string} chatId - Chat/Groups/Channel id.
   * @param {Array} messageId - Message Id.
   * @param {boolean} replies - if `true` it will getting the nested reply. and will making floodwait.
   * ```ts
   *   bot.command("getMessages",async (ctx)=>{
   *       let results = await ctx.telegram.getMessages(ctx.chat.id,[ctx.id])
   *       console.log(results)
   *   })
   * ```
   */
  async getMessages(
    chatId: bigint | number | string,
    messageId: number[],
    replies: boolean = true
  ) {
    return Messages.GetMessages(this.SnakeClient, chatId, messageId, replies);
  }
  // getMessagesViews
  /**
   * Get and increase the view counter of a message sent or forwarded from a channel.
   * @param {number|string|bigint} chatId - Where the message was found.
   * @param {Array} messageId - IDs of message.
   * @param {boolean} increment - Whether to mark the message as viewed and increment the view counter
   * ```ts
   * bot.command("getMessagesViews",async (ctx)=>{
   *     let results = await ctx.telegram.getMessagesViews(ctx.chat.id,[ctx.id])
   *     console.log(results)
   * })
   * ```
   */
  async getMessagesViews(
    chatId: bigint | number | string,
    messageId: number[],
    increment: boolean = false
  ) {
    return Messages.GetMessagesViews(this.SnakeClient, chatId, messageId, increment);
  }
  // getUserPhotos
  /**
   * Getting all user profile photos.
   * @param {number|string|bigint} userId - id of user.
   * @param {Object} more - more object for getUserPhotos
   * ```ts
   * bot.command("getUserPhotos",async (ctx)=>{
   *     let results = await ctx.telegram.getUserPhotos(ctx.from.id)
   *     console.log(results)
   * })
   * ```
   */
  async getUserPhotos(chatId: bigint | number | string, more?: Users.getUserPhotosMoreParams) {
    return Users.GetUserPhotos(this.SnakeClient, chatId, more);
  }
  // readHistory
  /**
   * Marks message history as read.
   * @param {bigint|number|string} chatId - Target user or group.
   * @param {Object} more - more parameter for ReadHistory.
   * ```ts
   * bot.command("readHistory",async (ctx)=>{
   *     let results = await ctx.telegram.readHistory(ctx.chat.id,ctx.id)
   *     console.log(results)
   * })
   * ```
   */
  async readHistory(chatId: bigint | number | string, more?: Messages.readHistoryMoreParams) {
    return Messages.ReadHistory(this.SnakeClient, chatId, more);
  }
  // readMentions
  /**
   * Mark mentions as read.
   * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
   * ```ts
   * bot.command("readMentions",async (ctx)=>{
   *     let results = await ctx.telegram.readMentions(ctx.chat.id)
   *     console.log(results)
   * })
   * ```
   */
  async readMentions(chatId: bigint | number | string) {
    return Messages.ReadMentions(this.SnakeClient, chatId);
  }
  // readMessageContents
  /**
   * Notifies the sender about the recipient having listened a voice message or watched a video.
   * @param {Array} messageId - message ids
   * ```ts
   * bot.on("message",async (ctx)=>{
   *     if(ctx.media){
   *         let results = await ctx.telegram.readMessageContents([ctx.id])
   *         console.log(results)
   *     }
   * })
   * ```
   */
  async readMessageContents(messageId: number[]) {
    return Messages.ReadMessageContents(this.SnakeClient, messageId);
  }
  // unpinAllMessages
  /**
   * Unpin all message in chats.
   * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
   * ```ts
   * bot.command("unpinAll",async (ctx)=>{
   *     let results = await ctx.telegram.unpinAllMessages(ctx.chat.id)
   *     console.log(results)
   * })
   * ```
   */
  async unpinAllMessages(chatId: bigint | number | string) {
    return Messages.UnpinAllMessages(this.SnakeClient, chatId);
  }
  // pinMessages
  /**
   * Pin or unpin a message.
   * @param {number|string|bigint} chatId - where to pin or unpin the message.
   * @param {number} messageId - The message to pin or unpin
   * @param {Object} more - more parameter for PinMessage
   * ```ts
   * bot.command("pin",async (ctx)=>{
   *     let results = await ctx.telegram.pinMessage(ctx.chat.id,ctx.id)
   *     console.log(results)
   * })
   * // unpin a message
   * bot.command("unpin",async (ctx)=>{
   *     if(ctx.replyToMessage){
   *         let results = await ctx.telegram.unpinMessage(ctx.chat.id,ctx.replyToMessage.id)
   *         console.log(results)
   *     }
   * })
   * ```
   */
  async pinMessage(
    chatId: bigint | number | string,
    messageId: number,
    more?: Messages.pinMessageMoreParams
  ) {
    return Messages.PinMessage(this.SnakeClient, chatId, messageId, more);
  }
  // unpinMessages
  /**
   * unpin a message.
   * @param {number|string|bigint} chatId - where to pin or unpin the message.
   * @param {number} messageId - The message to pin or unpin
   * ```ts
   * bot.command("unpin",async (ctx)=>{
   *     if(ctx.replyToMessage){
   *         let results = await ctx.telegram.unpinMessage(ctx.chat.id,ctx.replyToMessage.id)
   *         console.log(results)
   *     }
   * })
   * ```
   */
  async unpinMessage(chatId: bigint | number | string, messageId: number) {
    return Messages.PinMessage(this.SnakeClient, chatId, messageId, { unpin: true });
  }
  // deleteHistory
  /**
   * This method allow you to deletes communication history.
   * @param {string|number|bigint} chatId - User or chat, communication history of which will be deleted.
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("clear", async (ctx) => {
   *     let results = await ctx.telegram.deleteHistory(ctx.chat.id)
   *     return console.log(results)
   * })
   * ```
   */
  async deleteHistory(chatId: bigint | number | string, more?: Messages.deleteHistoryMoreParams) {
    return Messages.DeleteHistory(this.SnakeClient, chatId, more);
  }
  //deleteUserHistory
  /**
   * Delete all messages sent by a certain user in a supergroup
   * @param {number|string|bigint} chatId - supergroup id.
   * @param {number|string|bigint} userId - User whose messages should be deleted.
   * ```ts
   * bot.command("deleteMe", async (ctx) => {
   *     let results = await ctx.telegram.deleteUserHistory(ctx.chat.id,ctx.from.id)
   *     return console.log(results)
   * })
   * ```
   */
  async deleteUserHistory(chatId: bigint | number | string, userId: number | string) {
    return Messages.DeleteUserHistory(this.SnakeClient, chatId, userId);
  }
  // editAdmin
  /**
   * Modify the admin rights of a user in a supergroup/channel.
   * @param {bigint|number|string} chatId - Chat/Channel/Group id.
   * @param {bigint|number|string} userId - User id.
   * @param {Object} - more parameters to use.
   *```ts
   * bot.command("promote",async (ctx) => {
   *    if((!ctx.chat.private) && ctx.replyToMessage){
   *        let results = await ctx.telegram.editAdmin(ctx.chat.id,ctx.replyToMessage.from.id)
   *        console.log(results)
   *    }
   * })
   *```
   * This method will return UpdateNewMessage or UpdateNewChannelMessage if success.
   */
  async editAdmin(
    chatId: bigint | number | string,
    userId: bigint | number | string,
    more?: Chats.editAdminMoreParams
  ) {
    return Chats.EditAdmin(this.SnakeClient, chatId, userId, more);
  }
  // editBanned
  /**
   * Ban/unban/kick a user in a supergroup/channel.
   * @param {number|bigint|string} chatId - Chat/Group/Channel id.
   * @param {number|bigint|string} userId - User id.
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("ban",async (ctx) => {
   * if((!ctx.chat.private) && ctx.replyToMessage){
   *   let results = await ctx.telegram.editBanned(ctx.chat.id,ctx.replyToMessage.from.id)
   *   console.log(results)
   * }
   * })
   * ```
   * This method will return UpdateNewMessage or UpdateNewChannelMessage. if success.
   */
  async editBanned(
    chatId: bigint | number | string,
    userId: bigint | number | string,
    more?: Chats.editBannedMoreParams
  ) {
    return Chats.EditBanned(this.SnakeClient, chatId, userId, more);
  }
  // editPhoto
  /**
   * Change the profile picture of chat.
   * @param {number|string|bigint} chatId - Chat/Groups/Channel which will change the profile picture.
   * @param {string|Buffer} photo - The location where the file is located/Url/The buffer of the file.
   * ```ts
   * bot.command("editPhoto", async (ctx)=>{
   *     if(!ctx.chat.private){
   *         let results = await ctx.telegram.editPhoto(ctx.chat.id,"https://tgsnake.js.org/images/tgsnake.jpg")
   *         console.log(results)
   *     }
   * })
   * ```
   */
  async editPhoto(chatId: bigint | number | string, photo: string | Buffer) {
    return Media.EditPhoto(this.SnakeClient, chatId, photo);
  }
  /**
   * edit chat/group/channel title.
   * @param {bigint|number|string} chatId - Chat/Groups/Channel id.
   * @param {string} title - New title.
   * ```ts
   * bot.command("editTitle",async (ctx) => {
   *    if(!ctx.chat.private){
   *        let results = await ctx.telegram.editTitle(ctx.chat.id,"hey new title")
   *        console.log(results)
   *    }
   * })
   * ```
   * This method will return UpdateNewMessage or UpdateNewChannelMessage. if success.
   */
  // editTitle
  async editTitle(chatId: bigint | number | string, title: string) {
    return Chats.EditTitle(this.SnakeClient, chatId, title);
  }
  // exportMessageLink
  /**
   * Get link and embed info of a message in a channel/supergroup
   * @param {number|string|bigint} chatId - supergroup/channel id.
   * @param {number} messageId - message id.
   * @param {Object} more - more paramaters to use.
   */
  async exportMessageLink(
    chatId: bigint | number | string,
    messageId: number,
    more?: Messages.exportMessageLinkMoreParams
  ) {
    return Messages.ExportMessageLink(this.SnakeClient, chatId, messageId, more);
  }
  // getAdminedPublicChannels
  /**
   * Get channels/supergroups/geogroups we're admin in. Usually called when the user exceeds the limit for owned public channels/supergroups/geogroups, and the user is given the choice to remove one of his channels/supergroups/geogroups.
   * @param {boolean} byLocation - Get geogroups.
   * @param {boolean} checkLimit - If set and the user has reached the limit of owned public channels/supergroups/geogroups, instead of returning the channel list one of the specified errors will be returned. <br/>
   * Useful to check if a new public channel can indeed be created, even before asking the user to enter a channel username to use in channels.checkUsername/channels.updateUsername.
   * ```ts
   * bot.command("getAdminedPublicChannels",async (ctx) => {
   *    if(!ctx.chat.private){
   *        let results = await ctx.telegram.getAdminedPublicChannels()
   *        console.log(results)
   *    }
   * })
   * ```
   */
  async getAdminedPublicChannels(byLocation: boolean = true, checkLimit: boolean = true) {
    return Chats.GetAdminedPublicChannels(this.SnakeClient, byLocation, checkLimit);
  }
  // getAdminLog
  /**
   * Get the admin log of a channel/supergroup.
   * @param snakeClient - Client
   * @param {number|string|bigint} chatId -  Chat/Channel/Group id.
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("getAdminLog",async (ctx) => {
   *     if(!ctx.chat.private){
   *        let results = await ctx.telegram.getAdminLog(ctx.chat.id)
   *        console.log(results)
   *     }
   * })
   * ```
   */
  async getAdminLog(chatId: bigint | number | string, more?: Chats.getAdminLogMoreParams) {
    return Chats.GetAdminLog(this.SnakeClient, chatId, more);
  }
  // getChannels
  /**
   * Get info about channels/supergroups.
   * @param {Array} chatId - List of channel ids.
   * ```ts
   * bot.command("getChannels",async (ctx) => {
   *     let results = await ctx.telegram.getChannels([ctx.chat.id])
   *     console.log(results)
   * })
   * ```
   */
  async getChannels(chatId: bigint[] | number[] | string[]) {
    return Chats.GetChannels(this.SnakeClient, chatId);
  }
  // getFullChat
  /**
   * Returns full chat/channel info according to its ID.
   * @param {number|string|bigint} chatId - Chat/Groups/Channel id.
   * ```ts
   * bot.command("getFullChat",async (ctx) => {
   *     let results = await ctx.telegram.getFullChat(ctx.chat.id)
   * })
   * ```
   */
  async getFullChat(chatId: bigint | number | string) {
    return Chats.GetFullChat(this.SnakeClient, chatId);
  }
  // getGroupsForDiscussion
  /**
   * Get all groups that can be used as discussion groups.<br/>
   * Returned legacy group chats must be first upgraded to supergroups before they can be set as a discussion group.<br/>
   * To set a returned supergroup as a discussion group, access to its old messages must be enabled using channels.togglePreHistoryHidden, first. <br/>
   * ```ts
   * bot.command("getGroupsForDiscussion",async (ctx) => {
   *     let results = await ctx.telegram.getGroupsForDiscussion()
   *     console.log(results)
   * })
   * ```
   */
  async getGroupsForDiscussion() {
    return Chats.GetGroupsForDiscussion(this.SnakeClient);
  }
  // getInactiveChannels
  /**
   * Get inactive channels and supergroups.
   * ```ts
   * bot.command("getInactiveChannels",async (ctx) => {
   *     let results = await ctx.telegram.getInactiveChannels()
   *     console.log(results)
   * })
   * ```
   */
  async getInactiveChannels() {
    return Chats.GetInactiveChannels(this.SnakeClient);
  }
  // getLeftChannels
  /**
   * Get a list of channels/supergroups we left.
   * @param {number} offset - offset of pagination.
   * ```ts
   * bot.command("getLeftChannels",async (ctx) => {
   *     let results = await ctx.telegram.getLeftChannels()
   *     console.log(results)
   * })
   * ```
   */
  async getLeftChannels(offset: number = 0) {
    return Chats.GetLeftChannels(this.SnakeClient, offset);
  }
  // sendMedia
  /**
   * Sending message media.
   * @param {number|string|bigint} chatId - Chat/Groups/Channel id.
   * @param {Object} media - Message Media.
   * @param more - more parameters to use.
   */
  async sendMedia(
    chatId: bigint | number | string,
    media: Api.TypeInputMedia,
    more?: Media.sendMediaMoreParams
  ) {
    return Media.SendMedia(this.SnakeClient, chatId, media, more);
  }
  // sendPhoto
  /**
   * Sending photo with fileId/file location/url/buffer.
   * @param {number|string|bigint} chatId - Chat/Groups/Channel id.
   * @param {string|Buffer|Object} fileId - FileId/File Location/Url/Buffer
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.on("message",async (ctx) => {
   *     if(ctx.media && ctx.media._ == "photo"){
   *         let results = await ctx.telegram.sendPhoto(ctx.chat.id,ctx.media.fileId)
   *         console.log(results)
   *     }
   * })
   * ```
   */
  async sendPhoto(
    chatId: bigint | number | string,
    fileId: string | Buffer | Utils.Medias.MediaPhoto,
    more?: Media.sendPhotoMoreParams
  ) {
    return Media.SendPhoto(this.SnakeClient, chatId, fileId, more);
  }
  // sendDocument
  /**
   * Sending Document file location/url/buffer.
   * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
   * @param {string|Buffer|Object} fileId - File Location/Url/Buffer .
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("doc",async (ctx) => {
   *     let results = await ctx.telegram.sendDocument(ctx.chat.id,"https://tgsnake.js.org/images/tgsnake.jpg")
   * })
   * ```
   */
  async sendDocument(
    chatId: bigint | number | string,
    fileId: string | Buffer | Utils.Medias.TypeMessageMediaDocument,
    more?: Media.sendDocumentMoreParams
  ) {
    return Media.SendDocument(this.SnakeClient, chatId, fileId, more);
  }
  // sendSticker
  /**
   * Sending sticker with fileId/file location/url/buffer.
   * @param {bigint|number|string} chatId - Chat/Groups/Channel id.
   * @param {string|Buffer|Object} fileId - Path file/FileId/Buffer.
   * ```ts
   * bot.on("message",async (ctx) => {
   *     if(ctx.media && ctx.media._ == "sticker"){
   *         let results = await ctx.telegram.sendSticker(ctx.chat.id,ctx.media.fileId)
   *         console.log(results)
   *     }
   * })
   * ```
   */
  async sendSticker(
    chatId: bigint | number | string,
    fileId: string | Buffer | Utils.Medias.MediaSticker
  ) {
    return Media.SendSticker(this.SnakeClient, chatId, fileId);
  }
  // sendVideo
  /**
   * Sending Video
   * @param snakeClient - Client
   * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
   * @param {string|Buffer} fileId - File Location/Url/Buffer .
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("vid",async (ctx) => {
   *     let results = await ctx.telegram.sendVideo(ctx.chat.id,"https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4")
   * })
   * ```
   */
  async sendVideo(
    chatId: bigint | number | string,
    fileId: string | Buffer | Utils.Medias.MediaVideo,
    more?: Media.sendVideoMoreParams
  ) {
    return Media.SendVideo(this.SnakeClient, chatId, fileId, more);
  }
  // sendVideoNote
  /**
   * Sending VideoNote (rounded video)
   * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
   * @param {string|Buffer} fileId - File Location/Url/Buffer .
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("vidnote",async (ctx) => {
   *     let results = await ctx.telegram.sendVideoNote(ctx.chat.id,"file id here")
   * })
   * ```
   */
  async sendVideoNote(
    chatId: bigint | number | string,
    fileId: string | Buffer | Utils.Medias.MediaVideoNote,
    more?: Media.sendVideoNoteMoreParams
  ) {
    return Media.SendVideoNote(this.SnakeClient, chatId, fileId, more);
  }
  // sendAnimation
  /**
   * Sending Animation
   * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
   * @param {string|Buffer} fileId - File Location/Url/Buffer .
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("ani",async (ctx) => {
   *     let results = await ctx.telegram.sendAnimation(ctx.chat.id,"file id here")
   * })
   * ```
   */
  async sendAnimation(
    chatId: bigint | number | string,
    fileId: string | Buffer | Utils.Medias.MediaAnimation,
    more?: Media.sendAnimationMoreParams
  ) {
    return Media.SendAnimation(this.SnakeClient, chatId, fileId, more);
  }
  // sendAudio
  /**
   * Sending Audio
   * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
   * @param {string|Buffer} fileId - File Location/Url/Buffer .
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("au",async (ctx) => {
   *     let results = await ctx.telegram.sendAudio(ctx.chat.id,"file id here")
   * })
   * ```
   */
  async sendAudio(
    chatId: bigint | number | string,
    fileId: string | Buffer | Utils.Medias.MediaAudio,
    more?: Media.sendAudioMoreParams
  ) {
    return Media.SendAudio(this.SnakeClient, chatId, fileId, more);
  }
  // sendVoice
  /**
   * Sending Voice
   * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
   * @param {string|Buffer} fileId - File Location/Url/Buffer .
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("voice",async (ctx) => {
   *     let results = await ctx.telegram.sendVoice(ctx.chat.id,"file id here")
   * })
   * ```
   */
  async sendVoice(
    chatId: bigint | number | string,
    fileId: string | Buffer | Utils.Medias.MediaVoice,
    more?: Media.sendVoiceMoreParams
  ) {
    return Media.SendVoice(this.SnakeClient, chatId, fileId, more);
  }
  // sendDice
  async sendDice(
    chatId: bigint | number | string,
    dice: string | Utils.Medias.MediaDice,
    more?: Media.defaultSendMediaMoreParams
  ) {
    return Media.SendDice(this.snakeClient, chatId, dice, more);
  }
  // sendContact
  /**
   * Sending Contact
   * @param snakeClient - Client
   * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
   * @param {Object} contact - contact.
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("contact",async (ctx) => {
   *     let results = await ctx.telegram.sendContact(ctx.chat.id,{
   *    firstName : "someone",
   *    lastName : "",
   *    phoneNumber : "1234567890",
   *    vcard : "something info"
   *  })
   * })
   * ```
   */
  async sendContact(
    chatId: bigint | number | string,
    contact: Media.InterfaceContact | Utils.Medias.MediaContact,
    more?: Media.defaultSendMediaMoreParams
  ) {
    return Media.SendContact(this.SnakeClient, chatId, contact, more);
  }
  // sendPoll
  /**
   * Sending Polling
   * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
   * @param {Object} poll - polling
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("poll",async (ctx) => {
   *     let results = await ctx.telegram.sendPoll(ctx.chat.id,{
   *    question : "something"
   *    options : ["A","B"],
   *  })
   * })
   * ```
   */
  async sendPoll(
    chatId: bigint | number | string,
    poll: Media.InterfacePoll | Utils.Medias.MediaPoll,
    more?: Media.sendPollMoreParams
  ) {
    return Media.SendPoll(this.SnakeClient, chatId, poll, more);
  }
  // sendLocation
  /**
   * Sending Location
   * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
   * @param {Object} location - location
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("loc",async (ctx) => {
   *     let results = await ctx.telegram.sendLocation(ctx.chat.id,{
   *    latitude : 0,
   *    longitude : 0
   *  })
   * })
   * ```
   */
  async sendLocation(
    chatId: bigint | number | string,
    location: Media.InterfaceLocation | Utils.Medias.MediaLocation,
    more?: Media.defaultSendMediaMoreParams
  ) {
    return Media.SendLocation(this.SnakeClient, chatId, location, more);
  }
  // sendVenue
  /**
   * Sending Venue
   * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
   * @param {Object} venue - venue
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("venue",async (ctx) => {
   *     let results = await ctx.telegram.sendVenue(ctx.chat.id,{
   *    latitude : 0,
   *    longitude : 0,
   *    title : "title",
   *    address : "address",
   *    provider : "provider",
   *    id : "some id here",
   *    type : "some type here"
   *  })
   * })
   * ```
   */
  async sendVenue(
    chatId: bigint | number | string,
    venue: Media.InterfaceVenue | Utils.Medias.MediaVenue,
    more?: Media.defaultSendMediaMoreParams
  ) {
    return Media.SendVenue(this.SnakeClient, chatId, venue, more);
  }
  // getParticipant
  /**
   * Get info about a channel/supergroup participant.
   * @param {number|string|bigint} - Chat or channels id to getting the list of members.
   * @param {number|string|bigint} - Participant to get info about.
   * ```ts
   * bot.command("getChatMember",async (ctx) => {
   *     let results = await ctx.telegram.getParticipant(ctx.chat.id,ctx.from.id) // getChatMember and getParticipant.is same methods.
   *     console.log(results)
   * })
   * ```
   */
  async getParticipant(chatId: bigint | string | number, userId: string | number) {
    return Chats.GetParticipant(this.SnakeClient, chatId, userId);
  }
  // getChatMember
  /**
   * Get info about a channel/supergroup participant.
   * @param {number|string|bigint} - Chat or channels id to getting the list of members.
   * @param {number|string|bigint} - Participant to get info about.
   * ```ts
   * bot.command("getChatMember",async (ctx) => {
   *     let results = await ctx.telegram.getParticipant(ctx.chat.id,ctx.from.id) // getChatMember and getParticipant.is same methods.
   *     console.log(results)
   * })
   * ```
   */
  async getChatMember(chatId: bigint | string | number, userId: string | number) {
    return Chats.GetParticipant(this.SnakeClient, chatId, userId);
  }
  // getChatMembersCount
  /**
   * Get the number of members in a chat.
   * @param {number|string|bigint} chatId - Chat or channels id to getting the number of members.
   * ```ts
   * bot.command("getChatMembersCount",async (ctx) => {
   *     let results = await ctx.telegram.getChatMembersCount(ctx.chat.id)
   *     console.log(results)
   * })
   * ```
   */
  async getChatMembersCount(chatId: bigint | number | string) {
    return Chats.GetChatMembersCount(this.SnakeClient, chatId);
  }
  // getParticipants
  /**
   * Getting list from all participants in channel or chats.
   * @param {number|string|bigint} chatId - Chat or channels id to getting the list of members.
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("getChatMembers",async (ctx) => {
   *     let results = await ctx.telegram.getParticipants(ctx.chat.id) // getChatMembers and getParticipants is same methods.
   *     console.log(results)
   * })
   * ```
   */
  async getParticipants(chatId: bigint | number | string, more?: Chats.GetParticipantMoreParams) {
    return Chats.GetParticipants(this.SnakeClient, chatId, more);
  }
  // getChatMembers
  /**
   * Getting list from all participants in channel or chats.
   * @param {number|string|bigint} chatId - Chat or channels id to getting the list of members.
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("getChatMembers",async (ctx) => {
   *     let results = await ctx.telegram.getParticipants(ctx.chat.id) // getChatMembers and getParticipants is same methods.
   *     console.log(results)
   * })
   * ```
   */
  async getChatMembers(chatId: bigint | number | string, more?: Chats.GetParticipantMoreParams) {
    return Chats.GetParticipants(this.SnakeClient, chatId, more);
  }
  // answerInlineQuery
  async answerInlineQuery(
    queryId: bigint,
    results: Array<Api.TypeInputBotInlineResult>,
    more?: Bots.AnswerInlineQueryMoreParams
  ) {
    return Bots.AnswerInlineQuery(this.SnakeClient, queryId, results, more);
  }
  async restrictChatMember(
    chatId: bigint | number | string,
    userId: bigint | number | string,
    more?: Chats.editBannedMoreParams
  ) {
    return Chats.EditBanned(
      this.SnakeClient,
      chatId,
      userId,
      Object.assign(
        {
          untilDate: 0,
          viewMessages: false,
          sendMessages: true,
          sendMedia: true,
          sendStickers: true,
          sendGifs: true,
          sendGames: true,
          sendInline: true,
          sendPolls: true,
          changeInfo: true,
          inviteUsers: true,
          pinMessages: true,
          embedLinks: true,
        },
        more
      )
    );
  }
  async banChatMember(chatId: bigint | number | string, userId: bigint | number | string) {
    return Chats.EditBanned(this.SnakeClient, chatId, userId);
  }
  async kickChatMember(chatId: bigint | number | string, userId: bigint | number | string) {
    await Chats.EditBanned(this.SnakeClient, chatId, userId);
    return Chats.EditBanned(this.SnakeClient, chatId, userId, {
      untilDate: 0,
      viewMessages: false,
      sendMessages: false,
      sendMedia: false,
      sendStickers: false,
      sendGifs: false,
      sendGames: false,
      sendInline: false,
      sendPolls: false,
      changeInfo: false,
      inviteUsers: false,
      pinMessages: false,
      embedLinks: false,
    });
  }
  async unbanChatMember(chatId: bigint | number | string, userId: bigint | number | string) {
    return Chats.EditBanned(this.SnakeClient, chatId, userId, {
      untilDate: 0,
      viewMessages: false,
      sendMessages: false,
      sendMedia: false,
      sendStickers: false,
      sendGifs: false,
      sendGames: false,
      sendInline: false,
      sendPolls: false,
      changeInfo: false,
      inviteUsers: false,
      pinMessages: false,
      embedLinks: false,
    });
  }
  /**
   * Downloading file, you can pass the media as JSON of message.media or you can pass with file id. If success it will returning a Buffer of that file.
   * ```ts
   * bot.on("message",async (ctx)=>{
   *  if(ctx.media){
   *    console.log(await ctx.telegram.download(ctx.media))
   *    // also you can do like :
   *    // console.log(await ctx.media.download())
   *   }
   * })
   * ```
   */
  async download(
    media: string | Utils.Medias.TypeMessageMediaDownload,
    params?: Interface.DownloadFileParams
  ) {
    return Media.Download(this.snakeClient, media, params);
  }
}
