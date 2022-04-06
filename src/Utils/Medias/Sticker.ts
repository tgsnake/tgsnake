// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Media } from './Media';
import { FileId, decodeFileId } from '../../Libs/tg-file-id-1.1.3/src';
import { Snake } from '../../Client';
import bigInt, { BigInteger } from 'big-integer';
import { Cleaning } from '../CleanObject';
import BotError from '../../Context/Error';
import { DownloadFileParams } from '../../Interface/Download';
export class MediaSticker extends Media {
  /** @hidden */
  _stickerSetShortName!: string;
  /** @hidden */
  _stickerSetId!: bigint;
  /** @hidden */
  _stickerSetAccessHash!: bigint;
  /** @hidden */
  _id!: bigint;
  /** @hidden */
  _accessHash!: bigint;
  /** @hidden */
  _fileReference!: string;
  mimeType!: string;
  emoji!: string;
  fileId!: string;
  uniqueFileId!: string;
  width!: number;
  height!: number;
  dcId!: number;
  isAnimated!: boolean;
  isVideo!: boolean;
  size!: number;
  constructor() {
    super();
    this['_'] = 'sticker';
  }
  async encode(sticker: Api.Document, snakeClient: Snake) {
    snakeClient.log.debug('Creating MediaSticker');
    this.snakeClient = snakeClient;
    this.mimeType = sticker.mimeType;
    this.dcId = sticker.dcId;
    this.isAnimated = sticker.mimeType === 'application/x-tgsticker';
    this.isVideo = sticker.mimeType === 'video/webm';
    this.width = 512;
    this.height = 512;
    this.size = sticker.size;
    this._id = BigInt(String(sticker.id));
    this._accessHash = BigInt(String(sticker.accessHash));
    this._stickerSetId = BigInt(0);
    this._stickerSetAccessHash = BigInt(0);
    this._fileReference = sticker.fileReference.toString('hex');
    let file = new FileId();
    file.version = 4;
    file.subVersion = 30;
    file.dcId = sticker.dcId;
    file.fileType = 'sticker';
    file.typeId = 8;
    file.volumeId = BigInt(1);
    file.id = BigInt(String(sticker.id));
    file.accessHash = BigInt(String(sticker.accessHash));
    file.fileReference = sticker.fileReference.toString('hex');
    for (let attributes of sticker.attributes) {
      if (attributes instanceof Api.DocumentAttributeSticker) {
        attributes as Api.DocumentAttributeSticker;
        this.emoji = attributes.alt;
        if (attributes.stickerset instanceof Api.InputStickerSetID) {
          attributes.stickerset as Api.InputStickerSetID;
          this._stickerSetId = BigInt(String(attributes.stickerset.id ?? 0));
          this._stickerSetAccessHash = BigInt(String(attributes.stickerset.accessHash ?? 0));
        }
        if (attributes.stickerset instanceof Api.InputStickerSetShortName) {
          attributes.stickerset as Api.InputStickerSetShortName;
          this._stickerSetShortName = attributes.stickerset.shortName;
        }
      }
      if (attributes instanceof Api.DocumentAttributeImageSize) {
        attributes as Api.DocumentAttributeImageSize;
        this.width = attributes.w ?? 512;
        this.height = attributes.h ?? 512;
      }
    }
    file.stickerSetId = this._stickerSetId;
    file.stickerSetAccessHash = this._stickerSetAccessHash;
    this.fileId = await file.toFileId();
    this.uniqueFileId = await file.toFileUniqId();
    await Cleaning(this);
    return this;
  }
  async download(fileId?: string, params?: DownloadFileParams) {
    this.snakeClient.log.debug('Downloading sticker');
    const { client, log } = this.snakeClient;
    const file = fileId ?? this.fileId;
    const inRange = (x: number, min: number, max: number) => {
      return (x - min) * (x - max) <= 0;
    };
    if (!file) {
      this.snakeClient.log.error('Failed to download sticker cause: FileId not found!');
      throw new BotError('FileId not found!', 'Sticker.download', String(file));
    }
    if (file !== this.fileId) {
      let dFile = this.decode(file);
      if (dFile.typeId !== 8) {
        this.snakeClient.log.error('Failed to download sticker cause: Miss match file type!');
        throw new BotError('Miss match file type!', 'Sticker.download', String(file));
      }
      let dParams = Object.assign(
        {
          dcId: dFile.dcId,
          workers: 1,
          progressCallback: (progress) => {
            return log.debug(`Downloading Sticker [${Math.round(progress)} %]`);
          },
        },
        params ?? {}
      );
      if (!inRange(dParams.workers!, 1, 16)) {
        log.warning(
          `Workers (${dParams.workers}) out of range (1 <= workers <= 16). Chances are this will make tgsnake unstable.`
        );
      }
      return client.downloadFile(
        new Api.InputDocumentFileLocation({
          id: bigInt(String(dFile.id)),
          accessHash: bigInt(String(dFile.access_hash)),
          fileReference: Buffer.from(dFile.fileReference, 'hex'),
          thumbSize: 'w',
        }),
        dParams!
      );
    }
    let dParams = Object.assign(
      {
        dcId: this.dcId,
        fileSize: this.size,
        workers: 1,
        progressCallback: (progress) => {
          return log.debug(`Downloading Sticker [${Math.round(progress)}]`);
        },
      },
      params ?? {}
    );
    if (!inRange(dParams.workers!, 1, 16)) {
      log.warning(
        `Workers (${dParams.workers}) out of range (1 <= workers <= 16). Chances are this will make tgsnake unstable.`
      );
    }
    return client.downloadFile(
      new Api.InputDocumentFileLocation({
        id: bigInt(String(this._id)),
        accessHash: bigInt(String(this._accessHash)),
        fileReference: Buffer.from(this._fileReference, 'hex'),
        thumbSize: 'w',
      }),
      dParams!
    );
  }
}
