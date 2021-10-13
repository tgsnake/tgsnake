// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Telegram } from '../Telegram';
import { ResultGetEntity } from '../Telegram/Users/GetEntity';
import * as Update from '../Update';
import { Snake } from '../client';
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import { Api } from 'telegram';
import { NewMessage } from 'telegram/events';
import { NewMessageEvent } from 'telegram/events/NewMessage';
import { MessageContext } from './MessageContext';
import { Message } from 'telegram/tl/custom/message';
export type Handler = 'use' | 'hears' | 'command';
type TypeCmd = string | string[];
type TypeHears = string | RegExp;
export interface HandlerFunction {
  (ctx: MessageContext, match: RegExpExecArray): void;
}
export interface MiddlewareFunction {
  (ctx: MessageContext | any, next: any): void;
}
export interface HandlerObject {
  type: 'command' | 'hears';
  run: MiddlewareFunction | HandlerFunction;
  key: string | RegExp | string[];
}
export interface eventsOn {
  '*': (context: Api.TypeUpdate | Update.TypeUpdate | ResultGetEntity | MessageContext) => void;
  connected: (context: ResultGetEntity) => void;
  message: (context: MessageContext) => void;
  UpdateNewMessage: (context: Api.UpdateNewMessage) => void;
  UpdateMessageID: (context: Update.UpdateMessageID) => void;
  UpdateDeleteMessages: (context: Update.UpdateDeleteMessages) => void;
  UpdateUserTyping: (context: Update.UpdateUserTyping) => void;
  UpdateChatUserTyping: (context: Update.UpdateChatUserTyping) => void;
  UpdateChatParticipants: (context: Update.UpdateChatParticipants) => void;
  UpdateUserStatus: (context: Update.UpdateUserStatus) => void;
  UpdateUserName: (context: Api.UpdateUserName) => void;
  UpdateUserPhoto: (context: Api.UpdateUserPhoto) => void;
  UpdateNewEncryptedMessage: (context: Api.UpdateNewEncryptedMessage) => void;
  UpdateEncryptedChatTyping: (context: Api.UpdateEncryptedChatTyping) => void;
  UpdateEncryption: (context: Api.UpdateEncryption) => void;
  UpdateEncryptedMessagesRead: (context: Api.UpdateEncryptedMessagesRead) => void;
  UpdateChatParticipantAdd: (context: Api.UpdateChatParticipantAdd) => void;
  UpdateChatParticipantDelete: (context: Api.UpdateChatParticipantDelete) => void;
  UpdateDcOptions: (context: Api.UpdateDcOptions) => void;
  UpdateNotifySettings: (context: Api.UpdateNotifySettings) => void;
  UpdateServiceNotification: (context: Api.UpdateServiceNotification) => void;
  UpdatePrivacy: (context: Api.UpdatePrivacy) => void;
  UpdateUserPhone: (context: Api.UpdateUserPhone) => void;
  UpdateReadHistoryInbox: (context: Api.UpdateReadHistoryInbox) => void;
  UpdateReadHistoryOutbox: (context: Api.UpdateReadHistoryOutbox) => void;
  UpdateWebPage: (context: Api.UpdateWebPage) => void;
  UpdateReadMessagesContents: (context: Api.UpdateReadMessagesContents) => void;
  UpdateChannelTooLong: (context: Api.UpdateChannelTooLong) => void;
  UpdateChannel: (context: Api.UpdateChannel) => void;
  UpdateNewChannelMessage: (context: Api.UpdateNewChannelMessage) => void;
  UpdateReadChannelInbox: (context: Api.UpdateReadChannelInbox) => void;
  UpdateDeleteChannelMessages: (context: Api.UpdateDeleteChannelMessages) => void;
  UpdateChannelMessageViews: (context: Api.UpdateChannelMessageViews) => void;
  UpdateChatParticipantAdmin: (context: Api.UpdateChatParticipantAdmin) => void;
  UpdateNewStickerSet: (context: Api.UpdateNewStickerSet) => void;
  UpdateStickerSetsOrder: (context: Api.UpdateStickerSetsOrder) => void;
  UpdateStickerSets: (context: Api.UpdateStickerSets) => void;
  UpdateSavedGifs: (context: Api.UpdateSavedGifs) => void;
  UpdateBotInlineQuery: (context: Api.UpdateBotInlineQuery) => void;
  UpdateBotInlineSend: (context: Api.UpdateBotInlineSend) => void;
  UpdateEditChannelMessage: (context: Api.UpdateEditChannelMessage) => void;
  UpdateBotCallbackQuery: (context: Api.UpdateBotCallbackQuery) => void;
  UpdateEditMessage: (context: Api.UpdateEditMessage) => void;
  UpdateInlineBotCallbackQuery: (context: Api.UpdateInlineBotCallbackQuery) => void;
  UpdateReadChannelOutbox: (context: Api.UpdateReadChannelInbox) => void;
  UpdateDraftMessage: (context: Api.UpdateDraftMessage) => void;
  UpdateReadFeaturedStickers: (context: Api.UpdateReadFeaturedStickers) => void;
  UpdateRecentStickers: (context: Api.UpdateRecentStickers) => void;
  UpdateConfig: (context: Api.UpdateConfig) => void;
  UpdatePtsChanged: (context: Api.UpdatePtsChanged) => void;
  UpdateChannelWebPage: (context: Api.UpdateChannelWebPage) => void;
  UpdateDialogPinned: (context: Api.UpdateDialogPinned) => void;
  UpdatePinnedDialogs: (context: Api.UpdatePinnedDialogs) => void;
  UpdateBotWebhookJSON: (context: Api.UpdateBotWebhookJSON) => void;
  UpdateBotWebhookJSONQuery: (context: Api.UpdateBotWebhookJSONQuery) => void;
  UpdateBotShippingQuery: (context: Api.UpdateBotShippingQuery) => void;
  UpdateBotPrecheckoutQuery: (context: Api.UpdateBotPrecheckoutQuery) => void;
  UpdatePhoneCall: (context: Api.UpdatePhoneCall) => void;
  UpdateLangPackTooLong: (context: Api.UpdateLangPackTooLong) => void;
  UpdateLangPack: (context: Api.UpdateLangPack) => void;
  UpdateFavedStickers: (context: Api.UpdateFavedStickers) => void;
  UpdateChannelReadMessagesContents: (context: Api.UpdateChannelReadMessagesContents) => void;
  UpdateContactsReset: (context: Api.UpdateContactsReset) => void;
  UpdateChannelAvailableMessages: (context: Api.UpdateChannelAvailableMessages) => void;
  UpdateDialogUnreadMark: (context: Api.UpdateDialogUnreadMark) => void;
  UpdateMessagePoll: (context: Api.UpdateMessagePoll) => void;
  UpdateChatDefaultBannedRights: (context: Api.UpdateChatDefaultBannedRights) => void;
  UpdateFolderPeers: (context: Api.UpdateFolderPeers) => void;
  UpdatePeerSettings: (context: Api.UpdatePeerSettings) => void;
  UpdatePeerLocated: (context: Api.UpdatePeerLocated) => void;
  UpdateNewScheduledMessage: (context: Api.UpdateNewScheduledMessage) => void;
  UpdateDeleteScheduledMessages: (context: Api.UpdateDeleteScheduledMessages) => void;
  UpdateTheme: (context: Api.UpdateTheme) => void;
  UpdateGeoLiveViewed: (context: Api.UpdateGeoLiveViewed) => void;
  UpdateLoginToken: (context: Api.UpdateLoginToken) => void;
  UpdateMessagePollVote: (context: Api.UpdateMessagePollVote) => void;
  UpdateDialogFilter: (context: Api.UpdateDialogFilter) => void;
  UpdateDialogFilterOrder: (context: Api.UpdateDialogFilters) => void;
  UpdateDialogFilters: (context: Api.UpdateDialogFilters) => void;
  UpdatePhoneCallSignalingData: (context: Api.UpdatePhoneCallSignalingData) => void;
  UpdateChannelMessageForwards: (context: Api.UpdateChannelMessageForwards) => void;
  UpdateReadChannelDiscussionInbox: (context: Api.UpdateReadChannelDiscussionOutbox) => void;
  UpdateReadChannelDiscussionOutbox: (context: Api.UpdateReadChannelDiscussionOutbox) => void;
  UpdatePeerBlocked: (context: Api.UpdatePeerBlocked) => void;
  UpdateChannelUserTyping: (context: Api.UpdateChannelUserTyping) => void;
  UpdatePinnedMessages: (context: Api.UpdatePinnedMessages) => void;
  UpdatePinnedChannelMessages: (context: Api.UpdatePinnedChannelMessages) => void;
  UpdateChat: (context: Api.UpdateChat) => void;
  UpdateGroupCallParticipants: (context: Api.UpdateGroupCallParticipants) => void;
  UpdateGroupCall: (context: Api.UpdateGroupCall) => void;
  UpdatePeerHistoryTTL: (context: Api.UpdatePeerHistoryTTL) => void;
  UpdateChatParticipant: (context: Api.UpdateChatParticipant) => void;
  UpdateChannelParticipant: (context: Api.UpdateChannelParticipant) => void;
  UpdateBotStopped: (context: Api.UpdateBotStopped) => void;
  UpdateGroupCallConnection: (context: Api.UpdateGroupCall) => void;
  UpdateBotCommands: (context: Api.UpdateBotCommands) => void;
  UpdatesTooLong: (context: Api.UpdatesTooLong) => void;
  UpdateShortMessage: (context: Update.UpdateShortMessage) => void;
  UpdateShortChatMessage: (context: Update.UpdateShortChatMessage) => void;
  UpdateShortSentMessage: (context: Update.UpdateShortSentMessage) => void;
}
export class MainContext extends (EventEmitter as new () => TypedEmitter<eventsOn>) {
  private middleware: MiddlewareFunction[] = [];
  private handler: HandlerObject[] = [];
  connected: Boolean = false;
  ctx!: any;
  nowPrefix: string = '.!/';
  /**@hidden*/
  entityCache: Map<number, ResultGetEntity> = new Map();
  constructor() {
    super();
  }
  async handleUpdate(update: Api.TypeUpdate | NewMessageEvent, SnakeClient: Snake) {
    if (update instanceof NewMessageEvent) {
      update as NewMessageEvent;
      let message: Message = update.message as Message;
      if (update.originalUpdate) {
        if (update.originalUpdate._entities) {
          let en = update.originalUpdate._entities;
          en.forEach((e, i) => {
            this.entityCache.set(i, new ResultGetEntity(e));
          });
        }
      }
      let parse = new MessageContext();
      await parse.init(message, SnakeClient);
      this.emit('message', parse);
      this.emit('*', parse);
      let runHandler = (updates) => {
        if (this.connected) {
          this.handler.forEach(async (item) => {
            switch (item.type) {
              case 'command':
                let command = item.key as TypeCmd;
                let me = await SnakeClient.telegram.getEntity('me');
                let username = '';
                if (me.username) {
                  username = me.username;
                }
                if (Array.isArray(command)) {
                  let regex = new RegExp(
                    `(?<cmd>^[${this.nowPrefix}](${command
                      .join('|')
                      .replace(/\s+/gim, '')})(\@${username})?)$`,
                    ''
                  );
                  if (parse.text) {
                    let spl = parse.text.split(' ')[0];
                    let match = regex.exec(spl) as RegExpExecArray;
                    if (match as RegExpExecArray) {
                      return item.run(parse, match);
                    }
                  }
                } else {
                  let regex = new RegExp(
                    `(?<cmd>^[${this.nowPrefix}]${command.replace(/\s+/gim, '')}(\@${username})?)$`,
                    ''
                  );
                  if (parse.text) {
                    let spl = parse.text.split(' ')[0];
                    let match = regex.exec(spl) as RegExpExecArray;
                    if (match as RegExpExecArray) {
                      return item.run(parse, match);
                    }
                  }
                }
                break;
              case 'hears':
                let key = item.key as TypeHears;
                if (key instanceof RegExp) {
                  if (parse) {
                    if (parse.text) {
                      if (key.exec(parse.text)) {
                        return item.run(parse, key.exec(parse.text) as RegExpExecArray);
                      }
                    }
                  }
                } else {
                  let regex = new RegExp(key, '');
                  if (parse) {
                    if (parse.text) {
                      if (regex.exec(parse.text)) {
                        return item.run(parse, regex.exec(parse.text) as RegExpExecArray);
                      }
                    }
                  }
                }
                break;
              default:
            }
          });
          return this.handler;
        }
      };
      if (this.middleware.length > 0) {
        let next = (updates, index: number) => {
          return () => {
            if (this.connected) {
              if (this.middleware[index + 1]) {
                return this.middleware[index + 1](updates, next(updates, index + 1));
              } else {
                return runHandler(updates);
              }
            }
          };
        };
        return this.middleware[0](parse, next(update, 0));
      } else {
        return runHandler(parse);
      }
    } else {
      let parse = await this.parseUpdate(update, SnakeClient);
      //@ts-ignore
      this.emit(update.className, parse);
      this.emit('*', parse);
      if (this.middleware.length > 0) {
        let next = (updates, index: number) => {
          return () => {
            if (this.connected) {
              if (this.middleware[index + 1]) {
                return this.middleware[index + 1](updates, next(updates, index + 1));
              }
            }
          };
        };
        return this.middleware[0](parse, next(update, 0));
      }
      return this;
    }
    return this;
  }
  private async parseUpdate(update: Api.TypeUpdate, SnakeClient: Snake) {
    //@ts-ignore
    if (update._entities) {
      //@ts-ignore
      let en = update._entities;
      en.forEach((e, i) => {
        this.entityCache.set(i, new ResultGetEntity(e));
      });
    }
    if (Update[update.className]) {
      let up = new Update[update.className]();
      await up.init(update, SnakeClient);
      return up;
    } else {
      return update;
    }
  }
  use(next: MiddlewareFunction) {
    return this.middleware.push(next);
  }
  hears(key: string | RegExp, next: HandlerFunction) {
    return this.handler.push({
      type: 'hears',
      run: next,
      key: key!,
    });
  }
  command(key: string | string[], next: HandlerFunction) {
    return this.handler.push({
      type: 'command',
      run: next,
      key: key!,
    });
  }
}
