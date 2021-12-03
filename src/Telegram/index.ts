// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
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
import { SendPhoto } from './Media/SendPhoto';
import { SendDocument } from './Media/SendDocument';
import { SendSticker } from './Media/SendSticker';
import { Snake } from '../client';
import { Api, TelegramClient } from 'telegram';
import { Media } from '../Utils/Media';
import { GetParticipant } from './Chats/GetParticipant';
import { GetChatMembersCount } from './Chats/GetChatMembersCount';
import { GetParticipants, GetParticipantMoreParams } from './Chats/GetParticipants';
import { AnswerInlineQuery, AnswerInlineQueryMoreParams } from './Bots/AnswerInlineQuery';
let _SnakeClient: Snake;
export class Telegram {
  constructor(SnakeClient: Snake) {
    _SnakeClient = SnakeClient;
  }
  get SnakeClient() {
    return _SnakeClient;
  }
  // getEntity
  async getEntity(chatId: string | number, useCache?: boolean) {
    return await GetEntity(this.SnakeClient, chatId, useCache);
  }
  // getMe
  async getMe() {
    return await this.getEntity('me');
  }
  // sendMessage
  async sendMessage(chatId: number | string, text: string, more?: sendMessageMoreParams) {
    return await sendMessage(this.SnakeClient, chatId, text, more);
  }
  // deleteMessages
  async deleteMessage(chatId: number | string, messageId: number[]) {
    return await DeleteMessages(this.SnakeClient, chatId, messageId);
  }
  // editMessage
  async editMessage(
    chatId: number | string,
    messageId: number,
    text: string,
    more?: editMessageMoreParams
  ) {
    return await EditMessage(this.SnakeClient, chatId, messageId, text, more);
  }
  // forwardMessages
  async forwardMessages(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number[],
    more?: forwardMessageMoreParams
  ) {
    return await ForwardMessages(this.SnakeClient, chatId, fromChatId, messageId, more);
  }
  // getMessages
  async getMessages(chatId: number | string, messageId: number[], replies: boolean = true) {
    return await GetMessages(this.SnakeClient, chatId, messageId, replies);
  }
  // getMessagesViews
  async getMessagesViews(chatId: number | string, messageId: number[], increment: boolean = false) {
    return await GetMessagesViews(this.SnakeClient, chatId, messageId, increment);
  }
  // getUserPhotos
  async getUserPhotos(chatId: number | string, more?: getUserPhotosMoreParams) {
    return await GetUserPhotos(this.SnakeClient, chatId, more);
  }
  // readHistory
  async readHistory(chatId: number | string, more?: readHistoryMoreParams) {
    return await ReadHistory(this.SnakeClient, chatId, more);
  }
  // readMentions
  async readMentions(chatId: number | string) {
    return await ReadMentions(this.SnakeClient, chatId);
  }
  // readMessageContents
  async readMessageContents(messageId: number[]) {
    return await ReadMessageContents(this.SnakeClient, messageId);
  }
  // unpinAllMessages
  async unpinAllMessages(chatId: number | string) {
    return await UnpinAllMessages(this.SnakeClient, chatId);
  }
  // pinMessages
  async pinMessages(chatId: number | string, messageId: number, more?: pinMessageMoreParams) {
    return await PinMessage(this.SnakeClient, chatId, messageId, more);
  }
  // unpinMessages
  async unpinMessage(chatId: number | string, messageId: number) {
    return await PinMessage(this.SnakeClient, chatId, messageId, { unpin: true });
  }
  // deleteHistory
  async deleteHistory(chatId: number | string, more?: deleteHistoryMoreParams) {
    return await DeleteHistory(this.SnakeClient, chatId, more);
  }
  //deleteUserHistory
  async deleteUserHistory(chatId: number | string, userId: number | string) {
    return await DeleteUserHistory(this.SnakeClient, chatId, userId);
  }
  // editAdmin
  async editAdmin(chatId: number | string, userId: number | string, more?: editAdminMoreParams) {
    return await EditAdmin(this.SnakeClient, chatId, userId, more);
  }
  // editBanned
  async editBanned(chatId: number | string, userId: number | string, more?: editBannedMoreParams) {
    return await EditBanned(this.SnakeClient, chatId, userId, more);
  }
  // editPhoto
  async editPhoto(chatId: number | string, photo: string | Buffer) {
    return await EditPhoto(this.SnakeClient, chatId, photo);
  }
  // editTitle
  async editTitle(chatId: number | string, title: string) {
    return await EditTitle(this.SnakeClient, chatId, title);
  }
  // exportMessageLink
  async exportMessageLink(
    chatId: number | string,
    messageId: number,
    more?: exportMessageLinkMoreParams
  ) {
    return await ExportMessageLink(this.SnakeClient, chatId, messageId, more);
  }
  // getAdminedPublicChannels
  async getAdminedPublicChannels(byLocation: boolean = true, checkLimit: boolean = true) {
    return await GetAdminedPublicChannels(this.SnakeClient, byLocation, checkLimit);
  }
  // getAdminLog
  async getAdminLog(chatId: number | string, more?: getAdminLogMoreParams) {
    return GetAdminLog(this.SnakeClient, chatId, more);
  }
  // getChannels
  async getChannels(chatId: number[] | string[]) {
    return await GetChannels(this.SnakeClient, chatId);
  }
  // getFullChat
  async getFullChat(chatId: number | string) {
    return await GetFullChat(this.SnakeClient, chatId);
  }
  // getGroupsForDiscussion
  async getGroupsForDiscussion() {
    return await GetGroupsForDiscussion(this.SnakeClient);
  }
  // getInactiveChannels
  async getInactiveChannels() {
    return await GetInactiveChannels(this.SnakeClient);
  }
  // getLeftChannels
  async getLeftChannels(offset: number = 0) {
    return await GetLeftChannels(this.SnakeClient, offset);
  }
  // sendMedia
  async sendMedia(chatId: number | string, media: Api.TypeInputMedia, more?: sendMediaMoreParams) {
    return await SendMedia(this.SnakeClient, chatId, media, more);
  }
  // sendPhoto
  async sendPhoto(
    chatId: number | string,
    fileId: string | Buffer | Media,
    more?: sendMediaMoreParams
  ) {
    return await SendPhoto(this.SnakeClient, chatId, fileId, more);
  }
  // sendDocument
  async sendDocument(chatId: number | string, fileId: string | Buffer, more?: sendMediaMoreParams) {
    return await SendDocument(this.SnakeClient, chatId, fileId, more);
  }
  // sendSticker
  async sendSticker(
    chatId: number | string,
    fileId: string | Buffer | Api.MessageMediaDocument | Api.Document
  ) {
    return await SendSticker(this.SnakeClient, chatId, fileId);
  }
  // getParticipant
  async getParticipant(chatId: string | number, userId: string | number) {
    return await GetParticipant(this.SnakeClient, chatId, userId);
  }
  // getChatMember
  async getChatMember(chatId: string | number, userId: string | number) {
    return await GetParticipant(this.SnakeClient, chatId, userId);
  }
  // getChatMembersCount
  async getChatMembersCount(chatId: number | string) {
    return await GetChatMembersCount(this.SnakeClient, chatId);
  }
  // getParticipants
  async getParticipants(chatId: number | string, more?: GetParticipantMoreParams) {
    return await GetParticipants(this.SnakeClient, chatId, more);
  }
  // getChatMembers
  async getChatMembers(chatId: number | string, more?: GetParticipantMoreParams) {
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
}
