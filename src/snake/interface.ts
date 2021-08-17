// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published

import type * as define from 'telegram/define';
import { Api, TelegramClient } from 'telegram';
import { BigInteger } from 'big-integer';
import { Telegram } from './tele';
import { Shortcut } from './shortcut';
import { Message } from './rewritejson';
// option and client
export interface options {
  /**
   * Set Logger level for gramjs. Default is "none".
   */
  logger?: string;
  /**
   * An api_hash got from my.telegram.org
   */
  apiHash?: string;
  /**
   * An api_id got from my.telegram.org
   */
  apiId?: number;
  /**
   * String sessions
   */
  session?: string;
  /**
   * Bot Token from botFather. If you need to login as bot this required
   */
  botToken?: string;
  /**
   * tgsnake console.log
   * If set, tgsnake will showing the message in console like welcome to tgsnake or anything.
   */
  tgSnakeLog?: boolean;
  /**
   * session name
   * required to save the string session.
   */
  sessionName?: string;
  /**
   * storeSession
   * required to save the session in storage.
   */
  storeSession?: boolean;
  /** The connection instance to be used when creating a new connection to the servers. It must be a type.<br/>
   * Defaults to  ConnectionTCPFull on Node and ConnectionTCPObfuscated on browsers.
   */
  connection?: any;
  /**
   * Whether to connect to the servers through IPv6 or not. By default this is false.
   */
  useIPV6?: boolean;
  /**
   * The timeout in seconds to be used when connecting. This does nothing for now.
   */
  timeout?: number;
  /**
   * How many times a request should be retried.<br/>
   * Request are retried when Telegram is having internal issues (due to INTERNAL error or RPC_CALL_FAIL error),<br/>
   * when there is a errors.FloodWaitError less than floodSleepThreshold, or when there's a migrate error.<br/>
   * defaults to 5.
   */
  requestRetries?: number;
  /**
   * How many times the reconnection should retry, either on the initial connection or when Telegram disconnects us.<br/>
   * May be set to a negative or undefined value for infinite retries, but this is not recommended, since the program can get stuck in an infinite loop.<br/>
   * defaults to 5
   */
  connectionRetries?: number;
  /**
   * How many times we should retry borrowing a sender from another DC when it fails. defaults to 5
   */
  downloadRetries?: number;
  /** The delay in milliseconds to sleep between automatic reconnections. defaults to 1000*/
  retryDelay?: number;
  /**Whether reconnection should be retried connection_retries times automatically if Telegram disconnects us or not. defaults to true */
  autoReconnect?: boolean;
  /** does nothing for now */
  sequentialUpdates?: boolean;
  /** The threshold below which the library should automatically sleep on flood wait and slow mode wait errors (inclusive).<br/>
   *  For instance, if a FloodWaitError for 17s occurs and floodSleepThreshold is 20s, the library will sleep automatically.<br/>
   *  If the error was for 21s, it would raise FloodWaitError instead. defaults to 60 sec.*/
  floodSleepThreshold?: number;
  /**
   * Device model to be sent when creating the initial connection. Defaults to os.type().toString().
   */
  deviceModel?: string;
  /**
   * System version to be sent when creating the initial connection. defaults to os.release().toString() -.
   */
  systemVersion?: string;
  /**
   * App version to be sent when creating the initial connection. Defaults to 1.0.
   */
  appVersion?: string;
  /**
   * Language code to be sent when creating the initial connection. Defaults to 'en'.
   */
  langCode?: string;
  /**
   * System lang code to be sent when creating the initial connection. Defaults to 'en'.
   */
  systemLangCode?: string;
  /**
   * Does nothing for now. don't change.
   */
  baseLogger?: string | any;
  /**
   * Whether to try to connect over Wss (or 443 port) or not.
   */
  useWSS?: boolean;
}
export interface ctxParams {
  /**
   * context - Shortcut and event update <br/>
   * message - json message from context.message
   */
  (context: Shortcut, message: Message);
}
export interface ctxEvent {
  (update: Api.TypeUpdate);
}
export interface catchError {
  (reason: any, promise: Promise<any>);
}
//shortcut interface
export interface replyMoreParams {
  /**
   * Set this flag to disable generation of the webpage preview
   */
  noWebpage?: boolean;
  /**
   * Send this message silently (no notifications for the receivers)
   */
  silent?: boolean;
  /**
   * Send this message as background message
   */
  background?: boolean;
  /**
   * send message with parse mode.
   */
  clearDraft?: boolean;
  /**
   * The message ID to which this message will reply to
   */
  replyToMsgId?: define.MessageIDLike;
  /**
   * Reply markup for sending bot buttons
   */
  replyMarkup?: TypeReplyMarkup;
  /**
   * Message entities for sending styled text.
   */
  entities?: Api.TypeMessageEntity[];
  /**
   * Scheduled message date for scheduled messages.
   */
  scheduleDate?: number;
  /**
   * parse mode
   */
  parseMode?: string;
}
export type TypeReplyMarkup = inlineKeyboard | replyKeyboard | removeKeyboard | forceReplyMarkup;
/**
 * Upon receiving a message with this object, Telegram clients will display a reply interface to the user (act as if the user has selected the bot's message and tapped 'Reply')
 */
export interface forceReplyMarkup {
  /**
   * Shows reply interface to the user, as if they manually selected the bot's message and tapped 'Reply'
   */
  forceReply: boolean;
  /**
   * The placeholder to be shown in the input field when the reply is active
   */
  inputFieldPlaceholder?: string;
  /**
   * Use this parameter if you want to force reply from specific users only.
   */
  selective?: boolean;
  /**
   * Requests clients to hide the keyboard as soon as it's been used.
   */
  singleUse?: boolean;
}
/**
 * Upon receiving a message with this object, Telegram clients will remove the current custom keyboard and display the default letter-keyboard.
 */
export interface removeKeyboard {
  /**
   * Requests clients to remove the custom keyboard (user will not be able to summon this keyboard
   */
  removeKeyboard: boolean;
  /**
   * Use this parameter if you want to remove the keyboard for specific users only
   */
  selective?: boolean;
}
/**
 * Bot keyboard
 */
export interface replyKeyboard {
  /**
   * Array of array of {@link replyKeyboardButton} or Array of array of string.
   * @example
   * ```ts
   * [["hello"]]
   * ```
   */
  keyboard: replyKeyboardButton[][] | string[][];
  /**
   * Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons).
   */
  resizeKeyboard?: boolean;
  /**
   * Requests clients to hide the keyboard as soon as it's been used.
   */
  oneTimeKeyboard?: boolean;
  /**
   * The placeholder to be shown in the input field when the keyboard is active.
   */
  inputFieldPlaceholder?: string;
  /**
   * Use this parameter if you want to show the keyboard to specific users only.
   */
  selective?: boolean;
}
export interface replyKeyboardButton {
  /** keyboard text */
  text: string;
  /** The user's phone number will be sent as a contact when the button is pressed */
  requestContact?: boolean;
  /** The user's current location will be sent when the button is pressed. */
  requestLocation?: boolean;
  /**
   * The user will be asked to create a poll and send it to the bot when the button is pressed. <br/>
   * If _quiz_ is passed, the user will be allowed to create only polls in the quiz mode. <br/>
   * If _regular_ is passed, only regular polls will be allowed. Otherwise, the user will be allowed to create a poll of _any_ type.
   */
  requestPoll?: 'regular' | 'quiz';
}
/**
 * Bot button
 */
export interface inlineKeyboard {
  /**
   * array of array of {@link inlineKeyboardButton}
   * @example
   * ```ts
   * [[{
   *  text : "button", // the text of button
   *  callbackData : "cbdata" // the callback data of button.
   * }]]
   * ```
   */
  inlineKeyboard: inlineKeyboardButton[][];
}
export interface inlineKeyboardButton {
  /** Button text */
  text: string;
  /** Button url */
  url?: string;
  /** loginUrl button*/
  loginUrl?: loginUrl;
  /** callback data button */
  callbackData?: string;
  /** query to fill the inline query */
  switchInlineQuery?: string;
  /** query to fill the inline query */
  switchInlineQueryCurrentChat?: string;
  /** description of game */
  callbackGame?: string;
  /** description of product */
  buy?: string;
}
export interface loginUrl {
  /**
   * Set this flag to request the permission for your bot to send messages to the user.
   */
  requestWriteAccess?: boolean;
  /**
   * New text of the button in forwarded messages.
   */
  forwardText?: string;
  /**
   * An HTTP URL to be opened with user authorization data added to the query string when the button is pressed. If the user refuses to provide authorization data, the original URL without information about the user will be opened. The data added is the same as described in Receiving authorization data. <br/>
   * NOTE: You must always check the hash of the received data to verify the authentication and the integrity of the data as described in Checking authorization.
   */
  url: string;
  /**
   * id and access hash of a bot, which will be used for user authorization. The url's domain must be the same as the domain linked with the bot.
   */
  bot: BotLoginUrl;
}
export interface BotLoginUrl {
  /**
   * Bot Id.
   * bot id getting from .getEntity()
   */
  id: number;
  /**
   * Bot access hash
   * access hash getting from .getEntity()
   */
  accessHash: BigInteger;
}
//method interface
interface onProgress {
  /** Float between 0 and 1.*/
  (progress: number): void;
  isCanceled?: boolean;
}
export interface uploadFileMoreParams {
  /**
   * custom file name.
   */
  fileName?: string;
  /**
   * How many workers to use to upload the file. anything above 16 is unstable.
   */
  workers?: number;
  /**
   * a progress callback for the upload.
   */
  onProgress?: onProgress;
}
export interface sendMessageMoreParams {
  /**
   * Set this flag to disable generation of the webpage preview
   */
  noWebpage?: boolean;
  /**
   * Send this message silently (no notifications for the receivers)
   */
  silent?: boolean;
  /**
   * Send this message as background message
   */
  background?: boolean;
  /**
   * send message with parse mode.
   */
  parseMode?: string;
  /**
   * Clear the draft field
   */
  clearDraft?: boolean;
  /**
   * The message ID to which this message will reply to
   */
  replyToMsgId?: define.MessageIDLike;
  /**
   * Reply markup for sending bot buttons
   */
  replyMarkup?: TypeReplyMarkup;
  /**
   * Message entities for sending styled text.
   * if you set parse mode don't set this.
   */
  entities?: Api.TypeMessageEntity[];
  /**
   * Scheduled message date for scheduled messages.
   */
  scheduleDate?: number;
}
export interface editMessageMoreParams {
  /**
   * Set this flag to disable generation of the webpage preview
   */
  noWebpage?: boolean;
  /**
   * New attached media
   */
  media?: Api.TypeInputMedia;
  /**
   * Reply markup for sending bot buttons
   */
  replyMarkup?: TypeReplyMarkup;
  /**
   * Message entities for sending styled text.
   * if you set parse mode don't set this.
   */
  entities?: Api.TypeMessageEntity[];
  /**
   * Scheduled message date for scheduled messages.
   */
  scheduleDate?: number;
  /**
   * send message with parse mode.
   */
  parseMode?: string;
}
export interface forwardMessageMoreParams {
  /**
   * When forwarding games, whether to include your score in the game.
   */
  withMyScore?: boolean;
  /**
   * Whether to send messages silently (no notification will be triggered on the destination clients).
   */
  silent?: boolean;
  /**
   * Whether to send the message in background.
   */
  background?: boolean;
  /**
   * Scheduled message date for scheduled messages.
   */
  scheduleDate?: number;
}
export interface getUserPhotosMoreParams {
  /**
   * Number of list elements to be skipped
   */
  offset?: number;
  /**
   * If a positive value was transferred, the method will return only photos with IDs less than the set one
   */
  maxId?: Api.long;
  /**
   * Number of list elements to be returned
   */
  limit?: number;
}
export interface readHistoryMoreParams {
  /**
   * ID of message up to which messages should be marked as read
   */
  maxId?: number;
}
export interface pinMessageMoreParams {
  /**
   * Pin the message silently, without triggering a notification
   */
  silent?: boolean;
  /**
   * Whether the message should unpinned or pinned
   */
  unpin?: boolean;
  /**
   * Whether the message should only be pinned on the local side of a one-to-one chat
   */
  pmOneside?: boolean;
}
export interface deleteHistoryMoreParams {
  /**
   * ID of message up to which the history must be deleted
   */
  maxId?: number;
  revoke?: boolean;
  justClear?: boolean;
}
export interface editAdminMoreParams {
  /**
   * If set, allows the admin to modify the description of the channel/supergroup.
   */
  changeInfo?: boolean;
  /**
   * If set, allows the admin to post messages in the channel.
   */
  postMessages?: boolean;
  /**
   * If set, allows the admin to also edit messages from other admins in the channel
   */
  editMessages?: boolean;
  /**
   * If set, allows the admin to also delete messages from other admins in the channel.
   */
  deleteMessages?: boolean;
  /**
   * If set, allows the admin to ban users from the channel/supergroup.
   */
  banUsers?: boolean;
  /**
   * If set, allows the admin to invite users in the channel/supergroup.
   */
  inviteUsers?: boolean;
  /**
   * If set, allows the admin to pin messages in the channel/supergroup.
   */
  pinMessages?: boolean;
  /**
   * If set, allows the admin to add other admins with the same (or more limited) permissions in the channel/supergroup.
   */
  addAdmins?: boolean;
  /**
   * Whether this admin is anonymous.
   */
  anonymous?: boolean;
  /**
   * If set, allows the admin to manage voice call in the channel/supergroup.
   */
  manageCall?: boolean;
  /**
   * Indicates the role (rank) of the admin in the group: just an arbitrary string
   */
  rank?: string;
}
export interface editBannedMoreParams {
  /**
   * Validity of said permissions (it is considered forever any value less then 30 seconds or more then 366 days).
   */
  untilDate?: number;
  /**
   * If set, does not allow a user to view messages in a supergroup/channel/chat.
   */
  viewMessages?: boolean;
  /**
   * If set, does not allow a user to send messages in a supergroup/chat.
   */
  sendMessages?: boolean;
  /**
   * If set, does not allow a user to send any media in a supergroup/chat.
   */
  sendMedia?: boolean;
  /**
   * If set, does not allow a user to send stickers in a supergroup/chat.
   */
  sendStickers?: boolean;
  /**
   * If set, does not allow a user to send gifs in a supergroup/chat.
   */
  sendGifs?: boolean;
  /**
   * If set, does not allow a user to send games in a supergroup/chat.
   */
  sendGames?: boolean;
  /**
   * If set, does not allow a user to use inline bots in a supergroup/chat.
   */
  sendInline?: boolean;
  /**
   * If set, does not allow a user to send stickers in a supergroup/chat.
   */
  sendPolls?: boolean;
  /**
   * If set, does not allow any user to change the description of a supergroup/chat.
   */
  changeInfo?: boolean;
  /**
   * If set, does not allow any user to invite users in a supergroup/chat.
   */
  inviteUsers?: boolean;
  /**
   * If set, does not allow any user to pin messages in a supergroup/chat.
   */
  pinMessages?: boolean;
  /**
   * If set, does not allow a user to embed links in the messages of a supergroup/chat.
   */
  embedLinks?: boolean;
}
export interface exportMessageLinkMoreParams {
  /**
   * Whether to also include a thread ID, if available, inside of the link
   */
  thread?: boolean;
  /**
   * Whether to include other grouped media (for albums)
   */
  grouped?: boolean;
}
export interface getAdminLogMoreParams {
  /**
   * Search query, can be empty
   */
  q?: string;
  /**
   * A user has joined the group (in the case of big groups, info of the user that has joined isn't shown)
   */
  join?: boolean;
  /**
   * A user left the channel/supergroup (in the case of big groups, info of the user that has joined isn't shown)
   */
  leave?: boolean;
  /**
   * A user was invited to the group
   */
  invite?: boolean;
  /**
   * The banned rights of a user were changed
   */
  ban?: boolean;
  /**
   * The banned rights of a user were changed
   */
  unban?: boolean;
  /**
   * The banned rights of a user were changed
   */
  kick?: boolean;
  /**
   * The banned rights of a user were changed
   */
  unkick?: boolean;
  /**
   * The admin rights of a user were changed
   */
  promote?: boolean;
  /**
   * The admin rights of a user were changed
   */
  demote?: boolean;
  /**
   * Info change events (when about, linked chat, location, photo, stickerset, title or username data of a channel gets modified)
   */
  info?: boolean;
  /**
   * Settings change events (invites, hidden prehistory, signatures, default banned rights)
   */
  settings?: boolean;
  /**
   * A message was pinned
   */
  pinned?: boolean;
  /**
   * A event from group call started ended invited.
   */
  groupCall?: boolean;
  /**
   * A event from invites members
   */
  invites?: boolean;
  /**
   * A event from edited message
   */
  edit?: boolean;
  /**
   * A event from delete message
   */
  delete?: boolean;
  /**
   * Maximum ID of message to return (see pagination)
   */
  maxId?: BigInteger;
  /**
   * Minimum ID of message to return (see pagination)
   */
  minId?: BigInteger;
  /**
   * Maximum number of results to return, see pagination
   */
  limit?: number;
}
export interface sendMediaMoreParams {
  /**
   * Send this message silently (no notifications for the receivers)
   */
  silent?: boolean;
  /**
   * Send this message as background message
   */
  background?: boolean;
  /**
   * send message with parse mode.
   */
  parseMode?: string;
  /**
   * Clear the draft field
   */
  clearDraft?: boolean;
  /**
   * The message ID to which this message will reply to
   */
  replyToMsgId?: define.MessageIDLike;
  /**
   * Reply markup for sending bot buttons
   */
  replyMarkup?: TypeReplyMarkup;
  /**
   * Message entities for sending styled text.
   * if you set parse mode don't set this.
   */
  entities?: Api.TypeMessageEntity[];
  /**
   * Scheduled message date for scheduled messages.
   */
  scheduleDate?: number;
  /**
   * captiom
   */
  caption?: string;
  /**
   * workers to sending media
   */
  workers?: number;
}
