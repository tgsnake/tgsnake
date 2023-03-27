/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { TLObject } from '../TL';
import { Raw, Helpers } from '@tgsnake/core';
import * as Advanceds from '../Advanced';
import * as Medias from './Medias';
import * as ReplyMarkup from './ReplyMarkup';
import { Entity } from './Entity';
import { getId, getPeerId } from '../../Utilities';
import type { Snake } from '../../Client';

export interface TypeMessage {
  id: number;
  outgoing?: boolean;
  date?: Date;
  chat?: Advanceds.Chat;
  from?: Advanceds.User;
  threadId?: number;
  senderChat?: Advanceds.Chat;
  forwardFrom?: Advanceds.User;
  forwardFromChat?: Advanceds.Chat;
  forwardFromMessageId?: number;
  forwardSignature?: string;
  forwardSenderName?: string;
  forwardDate?: Date;
  isTopicMessage?: boolean;
  isAutomaticForward?: boolean;
  replyToMessage?: Message;
  replyToMessageId?: number;
  replyToTopMessageId?: number;
  mentioned?: boolean;
  empty?: boolean;
  viaBot?: Advanceds.User;
  hasProtectedContent?: boolean;
  mediaGroupId?: bigint;
  authorSignatrure?: string;
  text?: string;
  entities?: Array<Entity>;
  animation?: Medias.Animation;
  audio?: Medias.Audio;
  document?: Medias.Document;
  photo?: Medias.Photo;
  sticker?: Medias.Sticker;
  video?: Medias.Video;
  videoNote?: Medias.VideoNote;
  voice?: Medias.Voice;
  webpage?: Medias.WebPage;
  caption?: string;
  captionEntities?: Array<Entity>;
  hasSpoilerMode?: boolean;
  contact?: Medias.Contact;
  dice?: Medias.Dice;
  game?: Medias.Game;
  poll?: Medias.Poll;
  venue?: Medias.Venue;
  location?: Medias.Location;
  newChatMembers?: Array<Advanceds.User>;
  leftChatMember?: Advanceds.User;
  newChatTitle?: string;
  newChatPhoto?: Medias.Photo;
  deleteChatPhoto?: boolean;
  groupChatCreated?: boolean;
  supergroupChatCreated?: boolean;
  channelChatCreated?: boolean;
  messageAutoDeleteTimeChanged?: any;
  migrateToChatId?: bigint;
  migrateFromChatId?: bigint;
  pinnedMessage?: Message;
  invoice?: any;
  successfulPayment?: any;
  userShared?: any;
  chatShared?: any;
  connectedWebsite?: string;
  writeAccessAllowed?: any;
  passportData?: any;
  forumTopicCreated?: Raw.MessageActionTopicCreate;
  forumTopicEdited?: Raw.MessageActionTopicEdit;
  videoChatScheduled?: any;
  videoChatEnded?: any;
  videoChatStarted?: any;
  videoChatParticipantInvalid?: any;
  webAppData?: Advanceds.WebAppData;
  replyMarkup?: ReplyMarkup.TypeReplyMarkup;
  giftPremium?: Raw.MessageActionGiftPremium;
  chatThemeChanged?: Raw.MessageActionSetChatTheme;
  setMessagesTTL?: Raw.MessageActionSetMessagesTTL;
  screenshot?: boolean;
}
// TODO:
// Support message services
export class Message extends TLObject {
  id!: number;
  outgoing?: boolean;
  date?: Date;
  chat?: Advanceds.Chat;
  from?: Advanceds.User;
  threadId?: number;
  senderChat?: Advanceds.Chat;
  forwardFrom?: Advanceds.User;
  forwardFromChat?: Advanceds.Chat;
  forwardFromMessageId?: number;
  forwardSignature?: string;
  forwardSenderName?: string;
  forwardDate?: Date;
  isTopicMessage?: boolean;
  isAutomaticForward?: boolean;
  replyToMessage?: Message;
  replyToMessageId?: number;
  replyToTopMessageId?: number;
  mentioned?: boolean;
  empty?: boolean;
  viaBot?: Advanceds.User;
  hasProtectedContent?: boolean;
  mediaGroupId?: bigint;
  authorSignatrure?: string;
  text?: string;
  entities?: Array<Entity>;
  animation?: Medias.Animation;
  audio?: Medias.Audio;
  document?: Medias.Document;
  photo?: Medias.Photo;
  sticker?: Medias.Sticker;
  video?: Medias.Video;
  videoNote?: Medias.VideoNote;
  voice?: Medias.Voice;
  caption?: string;
  captionEntities?: Array<Entity>;
  hasSpoilerMode?: boolean;
  contact?: Medias.Contact;
  dice?: Medias.Dice;
  game?: Medias.Game;
  poll?: Medias.Poll;
  venue?: Medias.Venue;
  location?: Medias.Location;
  webpage?: Medias.WebPage;
  newChatMembers?: Array<Advanceds.User>;
  leftChatMember?: Advanceds.User;
  newChatTitle?: string;
  newChatPhoto?: Medias.Photo;
  deleteChatPhoto?: boolean;
  groupChatCreated?: boolean;
  supergroupChatCreated?: boolean;
  channelChatCreated?: boolean;
  messageAutoDeleteTimeChanged?: any;
  migrateToChatId?: bigint;
  migrateFromChatId?: bigint;
  pinnedMessage?: Message;
  invoice?: any;
  successfulPayment?: any;
  userShared?: any;
  chatShared?: any;
  connectedWebsite?: string;
  writeAccessAllowed?: any;
  passportData?: any;
  forumTopicCreated?: Raw.MessageActionTopicCreate;
  forumTopicEdited?: Raw.MessageActionTopicEdit;
  videoChatScheduled?: any;
  videoChatEnded?: any;
  videoChatStarted?: any;
  videoChatParticipantInvalid?: any;
  webAppData?: Advanceds.WebAppData;
  replyMarkup?: ReplyMarkup.TypeReplyMarkup;
  giftPremium?: Raw.MessageActionGiftPremium;
  chatThemeChanged?: Raw.MessageActionSetChatTheme;
  setMessagesTTL?: Raw.MessageActionSetMessagesTTL;
  screenshot?: boolean;
  constructor(
    {
      id,
      outgoing,
      date,
      chat,
      from,
      threadId,
      senderChat,
      forwardFrom,
      forwardFromChat,
      forwardFromMessageId,
      forwardSignature,
      forwardSenderName,
      forwardDate,
      isTopicMessage,
      isAutomaticForward,
      replyToMessage,
      replyToMessageId,
      replyToTopMessageId,
      mentioned,
      empty,
      viaBot,
      hasProtectedContent,
      mediaGroupId,
      authorSignatrure,
      text,
      entities,
      animation,
      audio,
      document,
      photo,
      sticker,
      video,
      videoNote,
      voice,
      webpage,
      caption,
      captionEntities,
      hasSpoilerMode,
      contact,
      dice,
      game,
      poll,
      venue,
      location,
      newChatMembers,
      leftChatMember,
      newChatTitle,
      newChatPhoto,
      deleteChatPhoto,
      groupChatCreated,
      supergroupChatCreated,
      channelChatCreated,
      messageAutoDeleteTimeChanged,
      migrateToChatId,
      migrateFromChatId,
      pinnedMessage,
      invoice,
      successfulPayment,
      userShared,
      chatShared,
      connectedWebsite,
      writeAccessAllowed,
      passportData,
      forumTopicCreated,
      forumTopicEdited,
      videoChatScheduled,
      videoChatEnded,
      videoChatStarted,
      videoChatParticipantInvalid,
      webAppData,
      replyMarkup,
      giftPremium,
      chatThemeChanged,
      setMessagesTTL,
      screenshot,
    }: TypeMessage,
    client: Snake
  ) {
    super(client);
    this.id = id;
    this.outgoing = outgoing;
    this.date = date;
    this.chat = chat;
    this.from = from;
    this.threadId = threadId;
    this.senderChat = senderChat;
    this.forwardFrom = forwardFrom;
    this.forwardFromChat = forwardFromChat;
    this.forwardFromMessageId = forwardFromMessageId;
    this.forwardSignature = forwardSignature;
    this.forwardSenderName = forwardSenderName;
    this.forwardDate = forwardDate;
    this.isTopicMessage = isTopicMessage;
    this.isAutomaticForward = isAutomaticForward;
    this.replyToMessage = replyToMessage;
    this.replyToMessageId = replyToMessageId;
    this.replyToTopMessageId = replyToTopMessageId;
    this.mentioned = mentioned;
    this.empty = empty;
    this.viaBot = viaBot;
    this.hasProtectedContent = hasProtectedContent;
    this.mediaGroupId = mediaGroupId;
    this.authorSignatrure = authorSignatrure;
    this.text = text;
    this.entities = entities;
    this.animation = animation;
    this.audio = audio;
    this.document = document;
    this.photo = photo;
    this.sticker = sticker;
    this.video = video;
    this.videoNote = videoNote;
    this.voice = voice;
    this.webpage = webpage;
    this.caption = caption;
    this.captionEntities = captionEntities;
    this.hasSpoilerMode = hasSpoilerMode;
    this.contact = contact;
    this.dice = dice;
    this.game = game;
    this.poll = poll;
    this.venue = venue;
    this.location = location;
    this.newChatMembers = newChatMembers;
    this.leftChatMember = leftChatMember;
    this.newChatTitle = newChatTitle;
    this.newChatPhoto = newChatPhoto;
    this.deleteChatPhoto = deleteChatPhoto;
    this.groupChatCreated = groupChatCreated;
    this.supergroupChatCreated = supergroupChatCreated;
    this.channelChatCreated = channelChatCreated;
    this.messageAutoDeleteTimeChanged = messageAutoDeleteTimeChanged;
    this.migrateToChatId = migrateToChatId;
    this.migrateFromChatId = migrateFromChatId;
    this.pinnedMessage = pinnedMessage;
    this.invoice = invoice;
    this.successfulPayment = successfulPayment;
    this.userShared = userShared;
    this.chatShared = chatShared;
    this.connectedWebsite = connectedWebsite;
    this.writeAccessAllowed = writeAccessAllowed;
    this.passportData = passportData;
    this.forumTopicCreated = forumTopicCreated;
    this.forumTopicEdited = forumTopicEdited;
    this.videoChatScheduled = videoChatScheduled;
    this.videoChatEnded = videoChatEnded;
    this.videoChatStarted = videoChatStarted;
    this.videoChatParticipantInvalid = videoChatParticipantInvalid;
    this.webAppData = webAppData;
    this.replyMarkup = replyMarkup;
    this.giftPremium = giftPremium;
    this.chatThemeChanged = chatThemeChanged;
    this.setMessagesTTL = setMessagesTTL;
    this.screenshot = screenshot;
  }
  static async parse(
    client: Snake,
    message: Raw.TypeMessage,
    chats: Array<Raw.Chat | Raw.Channel>,
    users: Array<Raw.User>,
    replies: number = 1
  ) {
    if (!(message instanceof Raw.MessageEmpty)) {
      const fromId = getId(message.fromId!);
      const peerId = getId(message.peerId!);
      const userId = fromId ?? peerId;
      if (
        message.fromId &&
        message.fromId instanceof Raw.PeerUser &&
        message.peerId instanceof Raw.PeerUser
      ) {
        let hasFromId = users.some((user) => fromId === user.id);
        let hasPeerId = users.some((user) => peerId === user.id);
        if (!hasFromId || !hasPeerId) {
          let user = await client._client.invoke(
            new Raw.users.GetUsers({
              id: [
                await client._client.resolvePeer(fromId!),
                await client._client.resolvePeer(peerId!),
              ],
            })
          );
          users = users.concat(user);
        }
      }
      if (message instanceof Raw.MessageService) {
        message as Raw.MessageService;
        let from = Advanceds.User.parse(
          client,
          users.find((user) => user.id === userId)
        );
        let senderChat = Advanceds.Chat.parseMessage(client, message, users, chats, false);
        let chat = Advanceds.Chat.parseMessage(client, message, users, chats, true);
        return new Message(
          {
            from,
            senderChat,
            chat,
            outgoing: message.out,
            id: message.id,
            empty: false,
            date: new Date(message.date * 1000),
          },
          client
        );
      }
      if (message instanceof Raw.Message) {
        message as Raw.Message;
        let entities: Array<Entity> | undefined = message.entities
          ?.map((entity) => Entity.parse(client, entity))
          ?.sort((a, b) => a.offset - b.offset);
        let forwardFrom;
        let forwardFromChat;
        let forwardFromMessageId;
        let forwardSignature;
        let forwardSenderName;
        let forwardDate;
        if (message.fwdFrom) {
          forwardDate = new Date(message.fwdFrom.date * 1000);
          if (message.fwdFrom.fromId) {
            let afromId = getId(message.fwdFrom.fromId!);
            let bfromId = getPeerId(message.fwdFrom.fromId!);
            if (bfromId !== undefined && bfromId > 0) {
              forwardFrom = Advanceds.User.parse(
                client,
                users.find((user) => user.id === afromId)
              );
            } else {
              forwardFromChat = Advanceds.Chat.parseDialog(
                client,
                message.fwdFrom.fromId!,
                users,
                chats
              );
              forwardFromMessageId = message.fwdFrom.channelPost;
              forwardSignature = message.fwdFrom.postAuthor;
            }
          } else if (message.fwdFrom.fromName) {
            forwardSenderName = message.fwdFrom.fromName;
          }
        }
        let animation;
        let audio;
        let document;
        let photo;
        let sticker;
        let video;
        let videoNote;
        let voice;
        let hasSpoilerMode;
        let contact;
        let dice;
        let game;
        let poll;
        let venue;
        let location;
        let webpage;
        if (message.media && !(message.media instanceof Raw.MessageMediaEmpty)) {
          if (message.media instanceof Raw.MessageMediaPhoto) {
            hasSpoilerMode = (message.media as Raw.MessageMediaPhoto).spoiler ?? false;
            if (message.media.photo instanceof Raw.Photo) {
              photo = Medias.Photo.parse(
                client,
                (message.media as Raw.MessageMediaPhoto).photo as Raw.Photo
              );
            }
          }
          if (message.media instanceof Raw.MessageMediaGeo) {
            location = Medias.Location.parse(client, (message.media as Raw.MessageMediaGeo).geo);
          }
          if (message.media instanceof Raw.MessageMediaContact) {
            contact = Medias.Contact.parse(client, message.media as Raw.MessageMediaContact);
          }
          if (message.media instanceof Raw.MessageMediaVenue) {
            venue = Medias.Venue.parse(client, message.media as Raw.MessageMediaVenue);
          }
          if (message.media instanceof Raw.MessageMediaGame) {
            if (message.media.game instanceof Raw.Game) {
              game = Medias.Game.parse(
                client,
                (message.media as Raw.MessageMediaGame).game as Raw.Game
              );
            }
          }
          if (message.media instanceof Raw.MessageMediaPoll) {
            poll = Medias.Poll.parse(client, message.media as Raw.MessageMediaPoll);
          }
          if (message.media instanceof Raw.MessageMediaDice) {
            dice = Medias.Dice.parse(client, message.media as Raw.MessageMediaDice);
          }
          if (message.media instanceof Raw.MessageMediaWebPage) {
            if (message.media.webpage instanceof Raw.WebPage) {
              webpage = Medias.WebPage.parse(
                client,
                (message.media as Raw.MessageMediaWebPage).webpage as Raw.WebPage
              );
            }
          }
          if (message.media instanceof Raw.MessageMediaDocument) {
            hasSpoilerMode = (message.media as Raw.MessageMediaDocument).spoiler ?? false;
            let doc = (message.media as Raw.MessageMediaDocument).document as Raw.Document;
            if (
              doc.attributes.some((attribute) => attribute instanceof Raw.DocumentAttributeAudio)
            ) {
              let attr = doc.attributes.find(
                (attribute) => attribute instanceof Raw.DocumentAttributeAudio
              );
              if ((attr as Raw.DocumentAttributeAudio)?.voice) {
                voice = Medias.Voice.parse(client, doc);
              } else {
                audio = Medias.Audio.parse(client, doc);
              }
            } else if (
              doc.attributes.some((attribute) => attribute instanceof Raw.DocumentAttributeAnimated)
            ) {
              animation = Medias.Animation.parse(client, doc);
            } else if (
              doc.attributes.some((attribute) => attribute instanceof Raw.DocumentAttributeVideo)
            ) {
              let attr = doc.attributes.find(
                (attribute) => attribute instanceof Raw.DocumentAttributeVideo
              );
              if ((attr as Raw.DocumentAttributeVideo)?.roundMessage) {
                videoNote = Medias.VideoNote.parse(client, doc);
              } else {
                video = Medias.Video.parse(client, doc);
              }
            } else if (
              doc.attributes.some((attribute) => attribute instanceof Raw.DocumentAttributeSticker)
            ) {
              sticker = Medias.Sticker.parse(client, doc);
            } else {
              document = Medias.Document.parse(client, doc);
            }
          }
        }
        let from = Advanceds.User.parse(
          client,
          users.find((user) => user.id === userId)
        );
        let senderChat = Advanceds.Chat.parseMessage(client, message, users, chats, false);
        let chat = Advanceds.Chat.parseMessage(client, message, users, chats, true);
        let parsedMessage = new Message(
          {
            from,
            senderChat,
            chat,
            forwardFrom,
            forwardFromChat,
            forwardFromMessageId,
            forwardSignature,
            forwardSenderName,
            forwardDate,
            animation,
            audio,
            document,
            photo,
            sticker,
            video,
            videoNote,
            voice,
            hasSpoilerMode,
            contact,
            dice,
            game,
            poll,
            venue,
            location,
            webpage,
            id: message.id,
            text: !message.media ? message.message : undefined,
            caption: message.media ? message.message : undefined,
            captionEntities: message.media ? entities : undefined,
            entities: !message.media ? entities : undefined,
            outgoing: message.out,
            date: new Date(message.date * 1000),
            hasProtectedContent: message.noforwards,
            mentioned: message.mentioned,
            mediaGroupId: message.groupedId,
            authorSignatrure: message.postAuthor,
          },
          client
        );
        if (message.replyTo) {
          parsedMessage.isTopicMessage = message.replyTo?.forumTopic ?? false;
          parsedMessage.replyToMessageId = message.replyTo?.replyToMsgId;
          parsedMessage.replyToTopMessageId = message.replyTo?.replyToTopId;
          if (replies) {
            let cchat = client._cacheMessage.get(parsedMessage.chat?.id!);
            if (cchat) {
              let cmsg = cchat.get(parsedMessage?.replyToMessageId!);
              if (cmsg) {
                parsedMessage.replyToMessage = cmsg;
              } else {
                try {
                  let fmsg = await client.api.getMessages(
                    parsedMessage.chat?.id!,
                    [],
                    [message.id],
                    replies - 1
                  );
                  parsedMessage.replyToMessage = fmsg[0];
                } catch (error) {}
              }
            }
          }
        }
        if (message.replyMarkup) {
          parsedMessage.replyMarkup = await ReplyMarkup.convertReplyMarkup(
            message.replyMarkup!,
            client
          );
        }
        if (!parsedMessage.poll) {
          let cchat: Map<number, Message> | undefined = client._cacheMessage.get(
            parsedMessage.chat?.id!
          );
          if (cchat) {
            cchat.set(parsedMessage.id, parsedMessage);
          } else {
            let cmsg: Map<number, Message> = new Map();
            cmsg.set(parsedMessage.id, parsedMessage);
            client._cacheMessage.set(parsedMessage.chat?.id!, cmsg);
          }
        }
        return parsedMessage;
      }
    }
    return new Message(
      {
        empty: true,
        id: (message as Raw.MessageEmpty).id,
      },
      client
    );
  }
}
