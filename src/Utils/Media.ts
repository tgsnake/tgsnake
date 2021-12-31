// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { BigInteger } from 'big-integer';
import { FileId, decodeFileId } from 'tg-file-id';
import { Cleaning } from './CleanObject';
import { toString } from './ToBigInt';
export let typeId = {
  THUMBNAIL: 0,
  CHAT_PHOTO: 1, // ProfilePhoto
  PHOTO: 2,
  VOICE: 3, // VoiceNote
  VIDEO: 4,
  DOCUMENT: 5,
  ENCRYPTED: 6,
  TEMP: 7,
  STICKER: 8,
  AUDIO: 9,
  ANIMATION: 10,
  ENCRYPTED_THUMBNAIL: 11,
  WALLPAPER: 12,
  VIDEO_NOTE: 13,
  SECURE_RAW: 14,
  SECURE: 15,
  BACKGROUND: 16,
  DOCUMENT_AS_FILE: 17,
};
export let thumbTypeId = {
  LEGACY: 0,
  THUMBNAIL: 1,
  CHAT_PHOTO_SMALL: 2, //DialogPhotoSmall
  CHAT_PHOTO_BIG: 3, // DialogPhotoBig
  STICKER_SET_THUMBNAIL: 4,
};
export interface GenerateFileId {
  version: number;
  subVersion: number;
  dcId: number;
  fileType: string | number;
  id: bigint | BigInteger;
  accessHash: bigint | BigInteger;
  typeId: number;
  fileReference?: string;
  url?: string;
  volumeId?: number | bigint | BigInteger;
  localId?: number;
  photoSizeSource?: 'legacy' | 'thumbnail' | 'dialogPhoto' | 'stickerSetThumbnail';
  photoSizeSourceId?: number;
  secret?: number;
  dialogId?: number | bigint | BigInteger;
  dialogAccessHash?: number | bigint | BigInteger;
  isSmallDialogPhoto?: boolean;
  stickerSetId?: number;
  stickerSetAccessHash?: number;
  thumbType?: string;
  thumbTypeId?: number;
}
export function generateFileId(medias: GenerateFileId) {
  let file = new FileId();
  for (let [key, value] of Object.entries(medias)) {
    if (
      key == 'id' ||
      key == 'accessHash' ||
      key == 'secret' ||
      key == 'dialogAccessHash' ||
      key == 'volumeId' ||
      key == 'dialogId' ||
      key == 'stickerSetId' ||
      key == 'stickerSetAccessHash'
    ) {
      if (BigInt(String(value)) < BigInt(0)) {
        let num = String(value).replace(/^\-/, ''); // generate positive number
        file[key] = BigInt(num);
        continue;
      } else {
        file[key] = BigInt(String(value));
        continue;
      }
    } else {
      file[key] = value;
      continue;
    }
  }
  let file_id = file.toFileId();
  let unfId = file.toFileUniqId();
  return {
    fileId: file_id,
    uniqueFileId: unfId,
  };
}
export class Media {
  type!:
    | 'sticker' //done
    | 'document'
    | 'photo' // done
    | 'location' //done
    | 'dice' //done
    | 'contact'
    | 'animation'
    | 'video'
    | 'poll' //done
    | 'venue'
    | 'videoNote'
    | 'voice'
    | 'webPage'
    | 'game'
    | 'invoice';
  fileId!: string;
  uniqueFileId!: string;
  fileName!: string;
  emoji!: string;
  width!: number;
  height!: number;
  isAnimated!: boolean;
  dcId!: number;
  size!: number;
  value!: number;
  closed!: boolean;
  publicVoters!: boolean;
  multipleChoice!: boolean;
  quiz!: boolean;
  question!: string;
  answers!: string[];
  longitude!: number;
  latitude!: number;
  phoneNumber!: string;
  firstName!: string;
  lastName!: string;
  vcard!: string;
  userId!: bigint;
  constructor() {}
  private stickerToFileId(doc: Api.Document) {
    let data: GenerateFileId = {
      version: 4,
      subVersion: 30,
      dcId: doc.dcId,
      fileType: 'sticker',
      id: BigInt(String(doc.id)),
      accessHash: BigInt(String(doc.accessHash)),
      typeId: typeId.STICKER,
      fileReference: doc.fileReference.toString('hex'),
      photoSizeSource: 'stickerSetThumbnail',
      thumbTypeId: thumbTypeId.STICKER_SET_THUMBNAIL,
      stickerSetId: 0,
      stickerSetAccessHash: 0,
      volumeId: 1,
    };
    for (let i = 0; i < doc.attributes.length; i++) {
      if (doc.attributes[i] instanceof Api.DocumentAttributeFilename) {
        let daf = doc.attributes[i] as Api.DocumentAttributeFilename;
        this.fileName = daf.fileName;
      }
      if (doc.attributes[i] instanceof Api.DocumentAttributeSticker) {
        let s = doc.attributes[i] as Api.DocumentAttributeSticker;
        if (s.alt !== '') {
          this.emoji = s.alt;
        }
        if (s.stickerset instanceof Api.InputStickerSetID) {
          let setId = s.stickerset as Api.InputStickerSetID;
          (data.stickerSetId = Number(setId.id)),
            (data.stickerSetAccessHash = Number(setId.accessHash));
        }
      }
      if (doc.attributes[i] instanceof Api.DocumentAttributeImageSize) {
        let size = doc.attributes[i] as Api.DocumentAttributeImageSize;
        this.width = size.w;
        this.height = size.h;
      }
    }
    let file = generateFileId(data);
    this.isAnimated = Boolean(doc.mimeType == 'application/x-tgsticker');
    this.fileId = file.fileId;
    this.uniqueFileId = file.uniqueFileId;
    this.dcId = doc.dcId;
    this.size = doc.size;
    return this;
  }
  private photoToFileId(photo: Api.Photo) {
    let data: GenerateFileId = {
      id: BigInt(String(photo.id)),
      accessHash: BigInt(String(photo.accessHash)),
      version: 4,
      subVersion: 30,
      volumeId: 1,
      localId: 0,
      fileReference: photo.fileReference.toString('hex'),
      fileType: 'photo',
      typeId: typeId.PHOTO,
      thumbTypeId: thumbTypeId.THUMBNAIL,
      thumbType: 'THUMBNAIL',
      photoSizeSource: 'thumbnail',
      photoSizeSourceId: thumbTypeId.THUMBNAIL,
      dcId: photo.dcId,
    };
    this.type = 'photo';
    for (let i = 0; i < photo.sizes.length; i++) {
      if (photo.sizes[i] instanceof Api.PhotoSizeProgressive) {
        let size = photo.sizes[i] as Api.PhotoSizeProgressive;
        this.size = size.sizes[size.sizes.length - 1];
        this.width = size.w;
        this.height = size.h;
        break;
      }
    }
    this.dcId = photo.dcId;
    let file = generateFileId(data);
    this.fileId = file.fileId;
    this.uniqueFileId = file.uniqueFileId;
    return this;
  }
  private formatPoll(poll: Api.Poll) {
    this.closed = poll.closed || false;
    this.publicVoters = poll.publicVoters || false;
    this.multipleChoice = poll.multipleChoice || false;
    this.quiz = poll.quiz || false;
    this.question = poll.question;
    this.type = 'poll';
    let asn: string[] = [];
    for (let i = 0; i < poll.answers.length; i++) {
      let cc = poll.answers[i] as Api.PollAnswer;
      asn.push(cc.text);
    }
    this.answers = asn;
    return this;
  }
  private contact(contact: Api.MessageMediaContact) {
    this.type = 'contact';
    this.phoneNumber = contact.phoneNumber;
    this.firstName = contact.firstName;
    this.lastName = contact.lastName;
    this.vcard = contact.vcard;
    this.userId = BigInt(toString(contact.userId) as string);
    return this;
  }
  encode(
    media?:
      | Api.Document
      | Api.Photo
      | Api.MessageMediaDice
      | Api.Poll
      | Api.GeoPoint
      | Api.MessageMediaContact
  ) {
    // document
    if (media instanceof Api.Document) {
      let doc = media as Api.Document;
      switch (doc.mimeType) {
        case 'image/webp':
        case 'application/x-tgsticker':
          this.type = 'sticker';
          return this.stickerToFileId(doc);
          break;
        default:
      }
    }
    // photo
    if (media instanceof Api.Photo) {
      let photo = media as Api.Photo;
      return this.photoToFileId(photo);
    }
    // Dice
    if (media instanceof Api.MessageMediaDice) {
      this.emoji = media.emoticon;
      this.value = media.value;
      this.type = 'dice';
    }
    // Poll
    if (media instanceof Api.Poll) {
      return this.formatPoll(media);
    }
    // Geo
    if (media instanceof Api.GeoPoint) {
      let loc = media as Api.GeoPoint;
      this.type = 'location';
      this.latitude = loc.lat;
      this.longitude = loc.long;
    }
    // contact
    if (media instanceof Api.MessageMediaContact) {
      return this.contact(media as Api.MessageMediaContact);
    }
    return this;
  }
  decode(fileId?: string) {
    let file = fileId || this.fileId;
    if (!file) return `FileId not found!`;
    return decodeFileId(String(file));
  }
  parseMedia(media: Api.TypeMessageMedia) {
    //console.log(JSON.stringify(media, null, 2));
    if (media instanceof Api.MessageMediaDocument) {
      if (media.document instanceof Api.Document) {
        return media.document as Api.Document;
      }
    }
    if (media instanceof Api.MessageMediaPhoto) {
      if (media.photo instanceof Api.Photo) {
        return media.photo as Api.Photo;
      }
    }
    if (media instanceof Api.MessageMediaDice) {
      return media as Api.MessageMediaDice;
    }
    if (media instanceof Api.MessageMediaPoll) {
      return media.poll as Api.Poll;
    }
    if (media instanceof Api.MessageMediaGeo) {
      return media.geo as Api.GeoPoint;
    }
    if (media instanceof Api.MessageMediaContact) {
      return media as Api.MessageMediaContact;
    }
  }
}
