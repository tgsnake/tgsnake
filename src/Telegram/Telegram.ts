// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { betterConsoleLog } from '../Utils/CleanObject';
import { GetEntity } from './Users/GetEntity';
import { sendMessage, sendMessageMoreParams } from './Messages/sendMessage';
import { DeleteMessages } from './Messages/DeleteMessages';
import { EditMessage, editMessageMoreParams } from './Messages/EditMessage';
import { ForwardMessages, forwardMessageMoreParams } from './Messages/ForwardMessages';
import { GetMessages } from './Messages/GetMessages';
import { GetMessagesViews } from './Messages/GetMessagesViews';
import { GetUserPhotos, getUserPhotosMoreParams } from './Users/GetUserPhotos';
import { ReadHistory, readHistoryMoreParams } from './Messages/ReadHistory';
import { ReadMentions } from './Messages/ReadMentions';
import { ReadMessageContents } from './Messages/ReadMessageContents';
import { UnpinAllMessages } from './Messages/UnpinAllMessages';
import { PinMessage, pinMessageMoreParams } from './Messages/PinMessage';
import { DeleteHistory, deleteHistoryMoreParams } from './Messages/DeleteHistory';
import { DeleteUserHistory } from './Messages/DeleteUserHistory';
import { EditAdmin, editAdminMoreParams } from './Chats/EditAdmin';
import { EditBanned, editBannedMoreParams } from './Chats/EditBanned';
import { EditPhoto } from './Media/EditPhoto';
import { EditTitle } from './Chats/EditTitle';
import { exportMessageLinkMoreParams, ExportMessageLink } from './Messages/ExportMessageLink';
import { GetAdminedPublicChannels } from './Chats/GetAdminedPublicChannels';
import { GetAdminLog, getAdminLogMoreParams } from './Chats/GetAdminLog';
import { GetChannels } from './Chats/GetChannels';
import { GetFullChat } from './Chats/GetFullChat';
import { GetGroupsForDiscussion } from './Chats/GetGroupsForDiscussion';
import { GetInactiveChannels } from './Chats/GetInactiveChannels';
import { GetLeftChannels } from './Chats/GetLeftChannels';
import { SendMedia, sendMediaMoreParams } from './Media/SendMedia';
import { SendPhoto, sendPhotoMoreParams } from './Media/SendPhoto';
import { SendDocument, sendDocumentMoreParams } from './Media/SendDocument';
import { SendSticker } from './Media/SendSticker';
import { Snake } from '../Client';
import { Api, TelegramClient } from 'telegram';
import { Media } from '../Utils/Media';
import { GetParticipant } from './Chats/GetParticipant';
import { GetChatMembersCount } from './Chats/GetChatMembersCount';
import { GetParticipants, GetParticipantMoreParams } from './Chats/GetParticipants';
import { AnswerInlineQuery, AnswerInlineQueryMoreParams } from './Bots/AnswerInlineQuery';
import { inspect } from 'util';
export class Telegram {
  private _SnakeClient!: Snake;
  constructor(SnakeClient: Snake) {
    this._SnakeClient = SnakeClient;
  }
  [inspect.custom]() {
    return betterConsoleLog(this);
  }
  get SnakeClient() {
    return this._SnakeClient;
  }
  // getEntity
  async getEntity(chatId: bigint | string | number, useCache?: boolean) {
    return await GetEntity(this.SnakeClient, chatId, useCache);
  }
  // getMe
  async getMe() {
    return await this.getEntity('me');
  }
  // sendMessage
  async sendMessage(chatId: bigint | number | string, text: string, more?: sendMessageMoreParams) {
    return await sendMessage(this.SnakeClient, chatId, text, more);
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
    return await DeleteMessages(this.SnakeClient, chatId, messageId);
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
    return await DeleteMessages(this.SnakeClient, chatId, [messageId]);
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
    more?: editMessageMoreParams
  ) {
    return await EditMessage(this.SnakeClient, chatId, messageId, text, more);
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
    more?: forwardMessageMoreParams
  ) {
    return await ForwardMessages(this.SnakeClient, chatId, fromChatId, messageId, more);
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
    more?: forwardMessageMoreParams
  ) {
    return await ForwardMessages(this.SnakeClient, chatId, fromChatId, [messageId], more);
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
    return await GetMessages(this.SnakeClient, chatId, messageId, replies);
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
    return await GetMessagesViews(this.SnakeClient, chatId, messageId, increment);
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
  async getUserPhotos(chatId: bigint | number | string, more?: getUserPhotosMoreParams) {
    return await GetUserPhotos(this.SnakeClient, chatId, more);
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
  async readHistory(chatId: bigint | number | string, more?: readHistoryMoreParams) {
    return await ReadHistory(this.SnakeClient, chatId, more);
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
    return await ReadMentions(this.SnakeClient, chatId);
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
    return await ReadMessageContents(this.SnakeClient, messageId);
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
    return await UnpinAllMessages(this.SnakeClient, chatId);
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
    more?: pinMessageMoreParams
  ) {
    return await PinMessage(this.SnakeClient, chatId, messageId, more);
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
    return await PinMessage(this.SnakeClient, chatId, messageId, { unpin: true });
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
  async deleteHistory(chatId: bigint | number | string, more?: deleteHistoryMoreParams) {
    return await DeleteHistory(this.SnakeClient, chatId, more);
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
    return await DeleteUserHistory(this.SnakeClient, chatId, userId);
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
    more?: editAdminMoreParams
  ) {
    return await EditAdmin(this.SnakeClient, chatId, userId, more);
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
    more?: editBannedMoreParams
  ) {
    return await EditBanned(this.SnakeClient, chatId, userId, more);
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
    return await EditPhoto(this.SnakeClient, chatId, photo);
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
    return await EditTitle(this.SnakeClient, chatId, title);
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
    more?: exportMessageLinkMoreParams
  ) {
    return await ExportMessageLink(this.SnakeClient, chatId, messageId, more);
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
    return await GetAdminedPublicChannels(this.SnakeClient, byLocation, checkLimit);
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
  async getAdminLog(chatId: bigint | number | string, more?: getAdminLogMoreParams) {
    return GetAdminLog(this.SnakeClient, chatId, more);
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
    return await GetChannels(this.SnakeClient, chatId);
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
    return await GetFullChat(this.SnakeClient, chatId);
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
    return await GetGroupsForDiscussion(this.SnakeClient);
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
    return await GetInactiveChannels(this.SnakeClient);
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
    return await GetLeftChannels(this.SnakeClient, offset);
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
    more?: sendMediaMoreParams
  ) {
    return await SendMedia(this.SnakeClient, chatId, media, more);
  }
  // sendPhoto
  /**
   * Sending photo with fileId/file location/url/buffer.
   * @param {number|string|bigint} chatId - Chat/Groups/Channel id.
   * @param {string|Buffer|Object} fileId - FileId/File Location/Url/Buffer
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.on("message",async (ctx) => {
   *     if(ctx.media && ctx.media.type == "photo"){
   *         let results = await ctx.telegram.sendPhoto(ctx.chat.id,ctx.media.fileId)
   *         console.log(results)
   *     }
   * })
   * ```
   */
  async sendPhoto(
    chatId: bigint | number | string,
    fileId: string | Buffer | Media,
    more?: sendPhotoMoreParams
  ) {
    return await SendPhoto(this.SnakeClient, chatId, fileId, more);
  }
  // sendDocument
  /**
   * Sending Document file location/url/buffer.
   * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
   * @param {string|Buffer} fileId - File Location/Url/Buffer .
   * @param {Object} more - more parameters to use.
   * ```ts
   * bot.command("doc",async (ctx) => {
   *     let results = await ctx.telegram.sendDocument(ctx.chat.id,"https://tgsnake.js.org/images/tgsnake.jpg")
   * })
   * ```
   */
  async sendDocument(
    chatId: bigint | number | string,
    fileId: string | Buffer,
    more?: sendDocumentMoreParams
  ) {
    return await SendDocument(this.SnakeClient, chatId, fileId, more);
  }
  // sendSticker
  /**
   * Sending sticker with fileId/file location/url/buffer.
   * @param {bigint|number|string} chatId - Chat/Groups/Channel id.
   * @param {string|Buffer|Object} fileId - Path file/FileId/Buffer.
   * ```ts
   * bot.on("message",async (ctx) => {
   *     if(ctx.media && ctx.media.type == "sticker"){
   *         let results = await ctx.telegram.sendSticker(ctx.chat.id,ctx.media.fileId)
   *         console.log(results)
   *     }
   * })
   * ```
   */
  async sendSticker(
    chatId: bigint | number | string,
    fileId: string | Buffer | Api.MessageMediaDocument | Api.Document
  ) {
    return await SendSticker(this.SnakeClient, chatId, fileId);
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
    return await GetParticipant(this.SnakeClient, chatId, userId);
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
    return await GetParticipant(this.SnakeClient, chatId, userId);
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
    return await GetChatMembersCount(this.SnakeClient, chatId);
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
  async getParticipants(chatId: bigint | number | string, more?: GetParticipantMoreParams) {
    return await GetParticipants(this.SnakeClient, chatId, more);
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
  async getChatMembers(chatId: bigint | number | string, more?: GetParticipantMoreParams) {
    return await GetParticipants(this.SnakeClient, chatId, more);
  }
  // answerInlineQuery
  async answerInlineQuery(
    queryId: bigint,
    results: Array<Api.TypeInputBotInlineResult>,
    more?: AnswerInlineQueryMoreParams
  ) {
    return await AnswerInlineQuery(this.SnakeClient, queryId, results, more);
  }
  async restrictChatMember(
    chatId: bigint | number | string,
    userId: bigint | number | string,
    more?: editBannedMoreParams
  ) {
    return await EditBanned(
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
    return await EditBanned(this.SnakeClient, chatId, userId);
  }
  async kickChatMember(chatId: bigint | number | string, userId: bigint | number | string) {
    await EditBanned(this.SnakeClient, chatId, userId);
    return await EditBanned(this.SnakeClient, chatId, userId, {
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
    return await EditBanned(this.SnakeClient, chatId, userId, {
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
}
