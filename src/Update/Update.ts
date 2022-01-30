// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Telegram } from '../Telegram';
import { sendMessageMoreParams } from '../Telegram/Messages/sendMessage';
export type TypeUpdates =
  | 'updateNewMessage'
  | 'updateMessageID'
  | 'updateDeleteMessages'
  | 'updateUserTyping'
  | 'updateChatUserTyping'
  | 'updateChatParticipants'
  | 'updateUserStatus'
  | 'updateUserName'
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
  | 'updateNewChannelMessage'
  | 'updateReadChannelInbox'
  | 'updateDeleteChannelMessages'
  | 'updateChannelMessageViews'
  | 'updateChatParticipantAdmin'
  | 'updateNewStickerSet'
  | 'updateStickerSetsOrder'
  | 'updateStickerSets'
  | 'updateSavedGifs'
  | 'updateBotInlineQuery'
  | 'updateBotInlineSend'
  | 'updateEditChannelMessage'
  | 'updateBotCallbackQuery'
  | 'updateEditMessage'
  | 'updateInlineBotCallbackQuery'
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
  | 'updateShortMessage'
  | 'updateShortChatMessage'
  | 'updateShort'
  | 'updatesCombined'
  | 'updates'
  | 'updateShortSentMessage';

let _telegram: Telegram;
export class Update {
  '_'!: TypeUpdates;
  constructor() {}
  get telegram() {
    return _telegram;
  }
  set telegram(tg: Telegram) {
    _telegram = tg;
  }
  get SnakeClient() {
    //@ts-ignore
    return _telegram.SnakeClient;
  }
}
