// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Telegram } from '../Telegram';
import { sendMessageMoreParams } from '../Telegram/Messages/sendMessage';
import { betterConsoleLog } from '../Utils/CleanObject';
import { inspect } from 'util';
export type TypeUpdates =
  | 'updateNewMessage' // done
  | 'updateMessageID' // done
  | 'updateDeleteMessages' // done
  | 'updateUserTyping' // done
  | 'updateChatUserTyping' // done
  | 'updateChatParticipants' // done
  | 'updateUserStatus' // done
  | 'updateUserName' // done
  | 'updateUserPhoto'
  | 'updateNewEncryptedMessage'
  | 'updateEncryptedChatTyping'
  | 'updateEncryption'
  | 'updateEncryptedMessagesRead'
  | 'updateChatParticipantAdd'
  | 'updateChatParticipantDelete'
  | 'updateDcOptions'
  | 'updateNotifySettings'
  | 'updateServiceNotification'
  | 'updatePrivacy'
  | 'updateUserPhone'
  | 'updateReadHistoryInbox'
  | 'updateReadHistoryOutbox'
  | 'updateWebPage'
  | 'updateReadMessagesContents'
  | 'updateChannelTooLong'
  | 'updateChannel'
  | 'updateNewChannelMessage' // done
  | 'updateReadChannelInbox'
  | 'updateDeleteChannelMessages'
  | 'updateChannelMessageViews'
  | 'updateChatParticipantAdmin'
  | 'updateNewStickerSet'
  | 'updateStickerSetsOrder'
  | 'updateStickerSets'
  | 'updateSavedGifs'
  | 'updateBotInlineQuery' // done
  | 'updateBotInlineSend'
  | 'updateEditChannelMessage' // done
  | 'updateBotCallbackQuery' // done
  | 'updateEditMessage' // done
  | 'updateInlineBotCallbackQuery' // done
  | 'updateReadChannelOutbox'
  | 'updateDraftMessage'
  | 'updateReadFeaturedStickers'
  | 'updateRecentStickers'
  | 'updateConfig'
  | 'updatePtsChanged'
  | 'updateChannelWebPage'
  | 'updateDialogPinned'
  | 'updatePinnedDialogs'
  | 'updateBotWebhookJSON'
  | 'updateBotWebhookJSONQuery'
  | 'updateBotShippingQuery'
  | 'updateBotPrecheckoutQuery'
  | 'updatePhoneCall'
  | 'updateLangPackTooLong'
  | 'updateLangPack'
  | 'updateFavedStickers'
  | 'updateChannelReadMessagesContents'
  | 'updateContactsReset'
  | 'updateChannelAvailableMessages'
  | 'updateDialogUnreadMark'
  | 'updateMessagePoll'
  | 'updateChatDefaultBannedRights'
  | 'updateFolderPeers'
  | 'updatePeerSettings'
  | 'updatePeerLocated'
  | 'updateNewScheduledMessage'
  | 'updateDeleteScheduledMessages'
  | 'updateTheme'
  | 'updateGeoLiveViewed'
  | 'updateLoginToken'
  | 'updateMessagePollVote'
  | 'updateDialogFilter'
  | 'updateDialogFilterOrder'
  | 'updateDialogFilters'
  | 'updatePhoneCallSignalingData'
  | 'updateChannelMessageForwards'
  | 'updateReadChannelDiscussionInbox'
  | 'updateReadChannelDiscussionOutbox'
  | 'updatePeerBlocked'
  | 'updateChannelUserTyping'
  | 'updatePinnedMessages'
  | 'updatePinnedChannelMessages'
  | 'updateChat'
  | 'updateGroupCallParticipants'
  | 'updateGroupCall'
  | 'updatePeerHistoryTTL'
  | 'updateChatParticipant'
  | 'updateChannelParticipant'
  | 'updateBotStopped'
  | 'updateGroupCallConnection'
  | 'updateBotCommands'
  | 'updatesTooLong'
  | 'updateShortMessage' // done
  | 'updateShortChatMessage' // done
  | 'updateShort'
  | 'updatesCombined'
  | 'updates'
  | 'updateShortSentMessage'; // done

export class Update {
  '_'!: TypeUpdates;
  /** @hidden */
  private _telegram!: Telegram;
  constructor() {}
  /** @hidden */
  [inspect.custom]() {
    return betterConsoleLog(this);
  }
  /** @hidden */
  toJSON() {
    let obj = betterConsoleLog(this);
    for (let [key, value] of Object.entries(obj)) {
      if (typeof value == 'bigint') obj[key] = String(value);
    }
    return obj;
  }
  get telegram() {
    return this._telegram;
  }
  set telegram(tg: Telegram) {
    this._telegram = tg;
  }
  get SnakeClient() {
    //@ts-ignore
    return this._telegram.SnakeClient;
  }
  get snakeClient() {
    //@ts-ignore
    return this._telegram.SnakeClient;
  }
}
