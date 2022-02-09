// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { From } from '../Utils/From';
import { Update } from './Update';
import { Telegram } from '../Telegram';
import { Snake } from '../Client';
import { Chat } from '../Utils/Chat';
import { sendMessageMoreParams } from '../Telegram/Messages/sendMessage';
import { toString } from '../Utils/ToBigInt';

export class UpdateChatUserTyping extends Update {
  user!: From;
  chat!: Chat;
  action!: string;
  progress!: number;
  messageId!: number;
  emoticon!: string;
  interaction!: any;
  constructor() {
    super();
    this['_'] = 'updateChatUserTyping';
  }
  async init(update: Api.UpdateChatUserTyping, SnakeClient: Snake) {
    let mode = ['debug', 'info'];
    if (mode.includes(SnakeClient.logger)) {
      SnakeClient.log(
        `[${SnakeClient.connectTime}] - [${new Date().toLocaleString()}] - Creating update ${
          this['_']
        }`
      );
    }
    this.telegram = SnakeClient.telegram;
    if (update.fromId) {
      let user = new From();
      await user.init(update.fromId, SnakeClient);
      this.user = user;
    }
    if (update.chatId) {
      let chat = new Chat();
      await chat.init(BigInt(toString(update.chatId!) as string), SnakeClient);
      this.chat = chat;
    }
    if (update.action instanceof Api.SendMessageTypingAction) {
      this.action = 'typing';
    }
    if (update.action instanceof Api.SendMessageCancelAction) {
      this.action = 'cancel';
    }
    if (update.action instanceof Api.SendMessageRecordVideoAction) {
      this.action = 'recordVideo';
    }
    if (update.action instanceof Api.SendMessageUploadVideoAction) {
      update.action as Api.SendMessageUploadVideoAction;
      this.action = 'uploadVideo';
      this.progress = update.action.progress;
    }
    if (update.action instanceof Api.SendMessageRecordAudioAction) {
      this.action = 'recordAudio';
    }
    if (update.action instanceof Api.SendMessageUploadAudioAction) {
      update.action as Api.SendMessageUploadAudioAction;
      this.action = 'uploadAudio';
      this.progress = update.action.progress;
    }
    if (update.action instanceof Api.SendMessageUploadPhotoAction) {
      update.action as Api.SendMessageUploadPhotoAction;
      this.action = 'uploadPhoto';
      this.progress = update.action.progress;
    }
    if (update.action instanceof Api.SendMessageUploadDocumentAction) {
      update.action as Api.SendMessageUploadDocumentAction;
      this.action = 'uploadDocument';
      this.progress = update.action.progress;
    }
    if (update.action instanceof Api.SendMessageGeoLocationAction) {
      this.action = 'geoLocation';
    }
    if (update.action instanceof Api.SendMessageChooseContactAction) {
      this.action = 'chooseContact';
    }
    if (update.action instanceof Api.SendMessageGamePlayAction) {
      this.action = 'gamePlay';
    }
    if (update.action instanceof Api.SendMessageRecordRoundAction) {
      this.action = 'recordRound';
    }
    if (update.action instanceof Api.SendMessageUploadRoundAction) {
      update.action as Api.SendMessageUploadRoundAction;
      this.action = 'uploadRound';
      this.progress = update.action.progress;
    }
    if (update.action instanceof Api.SpeakingInGroupCallAction) {
      this.action = 'speakingInGroupCall';
    }
    if (update.action instanceof Api.SendMessageHistoryImportAction) {
      update.action as Api.SendMessageHistoryImportAction;
      this.action = 'historyImport';
      this.progress = update.action.progress;
    }
    if (update.action instanceof Api.SendMessageHistoryImportAction) {
      update.action as Api.SendMessageHistoryImportAction;
      this.action = 'historyImport';
      this.progress = update.action.progress;
    }
    if (update.action instanceof Api.SendMessageChooseStickerAction) {
      update.action as Api.SendMessageChooseStickerAction;
      this.action = 'chooseSticker';
    }
    if (update.action instanceof Api.SendMessageEmojiInteraction) {
      update.action as Api.SendMessageEmojiInteraction;
      this.action = 'emojiInteraction';
      this.emoticon = update.action.emoticon;
      this.messageId = update.action.msgId;
      this.interaction = update.action.interaction;
    }
    if (update.action instanceof Api.SendMessageEmojiInteractionSeen) {
      this.action = 'emojiInteractionSeen';
      this.emoticon = update.action.emoticon;
    }
    return this;
  }
}
