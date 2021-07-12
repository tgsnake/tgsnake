import type * as define from "telegram/define"
import {Api} from "telegram"
import {BigInteger} from "big-integer"
// event interface
export interface Message {
  id?:number;
  chat?:Chat;
  from?:From;
  text?:string;
  entities?:Api.TypeMessageEntity;
  replyToMessageId?:number;
  date?:Date|number;
  media?:any
}
export interface Chat {
  id?:number;
  title?:string;
  first_name?:string;
  last_name?:string;
  username?:string;
  private?:boolean|string;
}
export interface From {
  id?:number;
  first_name?:string;
  last_name?:string;
  username?:string;
  deleted?:boolean;
  restricted?:boolean;
  lang?:string;
  status?:string;
}
// results interface
export interface ClassResultUploadFile {
  id?:Api.long;
  parts?:number;
  name?:string;
  md5Checksum?:string;
}
//method interface
export interface sendMessageMoreParams {
  noWebpage?:boolean; 
  silent?:boolean; 
  background?:boolean; 
  parseMode?:string;
  clearDraft?:boolean; 
  replyToMsgId?:define.MessageIDLike; 
  replyMarkup?:Api.TypeReplyMarkup; 
  entities?:Api.TypeMessageEntity[]; 
  scheduleDate?:number; 
}
export interface editMessageMoreParams {
  noWebpage?:boolean; 
  media?:Api.TypeInputMedia;
  replyMarkup?:Api.TypeReplyMarkup; 
  entities?:Api.TypeMessageEntity[]; 
  scheduleDate?:number; 
  parseMode?:string;
}
export interface forwardMessageMoreParams {
  /**
   * When forwarding games, whether to include your score in the game.
  */
  withMyScore?:boolean; 
  /**
   * Whether to send messages silently (no notification will be triggered on the destination clients).
  */
  silent?:boolean; 
  /**
   * Whether to send the message in background.
  */
  background?:boolean; 
  /**
   * Scheduled message date for scheduled messages.
  */
  scheduleDate?:number;
}
export interface getUserPhotosMoreParams {
  /**
   * Number of list elements to be skipped
  */
  offset?:number;
  /**
   * If a positive value was transferred, the method will return only photos with IDs less than the set one
  */
  maxId?:Api.long;
  /**
   * Number of list elements to be returned
  */
  limit?:number;
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
  silent?:boolean; 
  /**
   * Whether the message should unpinned or pinned
  */
  unpin?:boolean;
  /**
   * Whether the message should only be pinned on the local side of a one-to-one chat
  */
  pmOneside?:boolean;
}
export interface deleteHistoryMoreParams {
  /**
   * ID of message up to which the history must be deleted
  */
  maxId?: number;
  revoke?: boolean; 
  justClear?:boolean;
}
export interface editAdminMoreParams {
  /**
   * If set, allows the admin to modify the description of the channel/supergroup.
  */
  changeInfo?:boolean; 
  /**
   * If set, allows the admin to post messages in the channel.
  */
  postMessages?:boolean;
  /**
   * If set, allows the admin to also edit messages from other admins in the channel
  */
  editMessages?:boolean;
  /**
   * If set, allows the admin to also delete messages from other admins in the channel.
  */
  deleteMessages?:boolean;
  /**
   * If set, allows the admin to ban users from the channel/supergroup.
  */
  banUsers?:boolean;
  /**
   * If set, allows the admin to invite users in the channel/supergroup.
  */
  inviteUsers?:boolean;
  /**
   * If set, allows the admin to pin messages in the channel/supergroup.
  */
  pinMessages?:boolean;
  /**
   * If set, allows the admin to add other admins with the same (or more limited) permissions in the channel/supergroup.
  */
  addAdmins?:boolean;
  /**
   * Whether this admin is anonymous. 
  */
  anonymous?:boolean;
  /**
   * If set, allows the admin to manage voice call in the channel/supergroup.
  */
  manageCall?:boolean;
  /**
   * Indicates the role (rank) of the admin in the group: just an arbitrary string
  */
  rank?:string;
}
export interface editBannedMoreParams {
  /**
   * Validity of said permissions (it is considered forever any value less then 30 seconds or more then 366 days).
  */
  untilDate?:number;
  /**
   * If set, does not allow a user to view messages in a supergroup/channel/chat.
  */
  viewMessages?:boolean;
  /**
   * If set, does not allow a user to send messages in a supergroup/chat.
  */
  sendMessages?:boolean;
  /**
   * If set, does not allow a user to send any media in a supergroup/chat.
  */
  sendMedia?:boolean;
  /**
   * If set, does not allow a user to send stickers in a supergroup/chat.
  */
  sendStickers?:boolean;
  /**
   * If set, does not allow a user to send gifs in a supergroup/chat.
  */
  sendGifs?:boolean;
  /**
   * If set, does not allow a user to send games in a supergroup/chat.
  */
  sendGames?:boolean;
  /**
   * If set, does not allow a user to use inline bots in a supergroup/chat.
  */
  sendInline?:boolean;
  /**
   * If set, does not allow a user to send stickers in a supergroup/chat.
  */
  sendPolls?:boolean;
  /**
   * If set, does not allow any user to change the description of a supergroup/chat.
  */
  changeInfo?:boolean;
  /**
   * If set, does not allow any user to invite users in a supergroup/chat.
  */
  inviteUsers?:boolean;
  /**
   * If set, does not allow any user to pin messages in a supergroup/chat.
  */
  pinMessages?:boolean;
  /**
   * If set, does not allow a user to embed links in the messages of a supergroup/chat.
  */
  embedLinks?:boolean;
}
export interface exportMessageLinkMoreParams {
  /**
   * Whether to also include a thread ID, if available, inside of the link
  */
  thread?:boolean;
  /**
   * Whether to include other grouped media (for albums)
  */
  grouped?:boolean;
}
export interface getAdminLogMoreParams {
  /**
   * Search query, can be empty
  */
  q?:string;
  /**
   * A user has joined the group (in the case of big groups, info of the user that has joined isn't shown)
  */
  join?:boolean;
  /**
   * A user left the channel/supergroup (in the case of big groups, info of the user that has joined isn't shown)
  */
  leave?:boolean;
  /**
   * A user was invited to the group
  */
  invite?:boolean;
  /**
   * The banned rights of a user were changed
  */
  ban?:boolean;
  /**
   * The banned rights of a user were changed
  */
  unban?:boolean;
  /**
   * The banned rights of a user were changed
  */
  kick?:boolean;
  /**
   * The banned rights of a user were changed
  */
  unkick?:boolean;
  /**
   * The admin rights of a user were changed
  */
  promote?:boolean;
  /**
   * The admin rights of a user were changed
  */
  demote?:boolean;
  /**
   * Info change events (when about, linked chat, location, photo, stickerset, title or username data of a channel gets modified)
  */
  info?:boolean;
  /**
   * Settings change events (invites, hidden prehistory, signatures, default banned rights)
  */
  settings?:boolean;
  /**
   * A message was pinned
  */
  pinned?:boolean;
  /**
   * A event from group call started ended invited.
  */
  groupCall?:boolean;
  /**
   * A event from invites members
  */
  invites?:boolean;
  /**
   * A event from edited message
  */
  edit?:boolean;
  /**
   * A event from delete message
  */
  "delete"?:boolean;
  /**
   * Maximum ID of message to return (see pagination)
  */
  maxId?:BigInteger;
  /**
   * Minimum ID of message to return (see pagination)
  */
  minId?:BigInteger;
  /**
   * Maximum number of results to return, see pagination
  */
  limit?:number;
}