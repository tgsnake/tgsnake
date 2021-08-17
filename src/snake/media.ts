// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import * as Interface from './interface';
import { Api } from 'telegram';
import { BigInteger } from 'big-integer';
import { FileId } from 'tg-file-id';
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
      key == 'dialogId'
    ) {
      if (String(value).startsWith('-')) {
        file[key] = BigInt(Number(value) * -1);
      } else {
        file[key] = BigInt(Number(value));
      }
    } else {
      file[key] = value;
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
  type?: string;
  fileId!: string;
  uniqueFileId!: string;
  fileName?: string;
  constructor(media: Api.TypeMessageMedia) {
    if (media instanceof Api.MessageMediaDocument) {
      if (media.document instanceof Api.Document) {
        let doc = media.document as Api.Document;
        switch (doc.mimeType) {
          case 'image/webp':
            this.type = 'sticker';
            for (let i = 0; i < doc.attributes.length; i++) {
              if (doc.attributes[i] instanceof Api.DocumentAttributeFilename) {
                let daf = doc.attributes[i] as Api.DocumentAttributeFilename;
                this.fileName = daf.fileName;
                break;
              }
            }
            let fId = generateFileId({
              version: 4,
              subVersion: 30,
              dcId: doc.dcId,
              fileType: 'sticker',
              id: doc.id,
              accessHash: doc.accessHash,
              typeId: typeId.STICKER,
              fileReference: doc.fileReference.toString('hex'),
            });
            this.fileId = fId.fileId;
            this.uniqueFileId = fId.uniqueFileId;
            break;
          default:
        }
      }
    }
  }
}
