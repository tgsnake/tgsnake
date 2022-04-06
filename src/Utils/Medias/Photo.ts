// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Media } from './Media';
import { FileId, decodeFileId } from 'tg-file-id';
import { Snake } from '../../Client';
import bigInt, { BigInteger } from 'big-integer';
import { Cleaning } from '../CleanObject';
import BotError from '../../Context/Error';
import { DownloadFileParams } from '../../Interface/Download';

export class MediaPhoto extends Media {
  _id!: bigint;
  _accessHash!: bigint;
  _fileReference!: string;
  fileId!: string;
  uniqueFileId!: string;
  dcId!: number;
  hasStickers!: boolean;
  size!: number;
  width!: number;
  height!: number;
  constructor() {
    super();
    this['_'] = 'photo';
  }
  async encode(media: Api.MessageMediaPhoto | Api.Photo | Api.PhotoEmpty, snakeClient: Snake) {
    snakeClient.log.debug('Creating MediaPhoto');
    this.snakeClient = snakeClient;
    if (media instanceof Api.PhotoEmpty) return this;
    const create = async (photo: Api.Photo) => {
      this._id = BigInt(String(photo.id));
      this._accessHash = BigInt(String(photo.accessHash));
      this._fileReference = photo.fileReference.toString('hex');
      this.dcId = photo.dcId;
      this.hasStickers = photo.hasStickers ?? false;
      if (photo.sizes) {
        for (let i = 0; i < photo.sizes.length; i++) {
          if (photo.sizes[i] instanceof Api.PhotoSizeProgressive) {
            let size = photo.sizes[i] as Api.PhotoSizeProgressive;
            this.size = Math.max(...size.sizes);
            this.width = size.w;
            this.height = size.h;
            break;
          }
        }
      }
      const file = new FileId();
      file.id = BigInt(String(photo.id));
      file.accessHash = BigInt(String(photo.accessHash));
      file.version = 4;
      file.subVersion = 30;
      file.volumeId = BigInt(1);
      file.localId = 1;
      file.fileReference = photo.fileReference.toString('hex');
      file.fileType = 'photo';
      file.typeId = 2;
      file.thumbTypeId = 1;
      (file.thumbType = 'THUMBNAIL'),
        (file.photoSizeSource = 'thumbnail'),
        (file.photoSizeSourceId = 1);
      file.dcId = photo.dcId;
      this.fileId = await file.toFileId();
      this.uniqueFileId = await file.toFileUniqId();
    };
    if (media instanceof Api.Photo) {
      await create(media as Api.Photo);
    }
    if (media instanceof Api.MessageMediaPhoto) {
      media as Api.MessageMediaPhoto;
      if (media.photo instanceof Api.Photo) {
        await create(media.photo as Api.Photo);
      }
    }
    await Cleaning(this);
    return this;
  }
  async download(fileId?: string, params?: DownloadFileParams) {
    this.snakeClient.log.debug('Downloading photo');
    const { client, log } = this.snakeClient;
    const file = fileId ?? this.fileId;
    const inRange = (x: number, min: number, max: number) => {
      return (x - min) * (x - max) <= 0;
    };
    if (!file) {
      this.snakeClient.log.error('Failed to download photo cause: FileId not found!');
      throw new BotError('FileId not found!', 'Photo.download', String(file));
    }
    if (file !== this.fileId) {
      let dFile = this.decode(file);
      if (dFile.typeId !== 2) {
        this.snakeClient.log.error('Failed to download photo cause: Miss match file type!');
        throw new BotError('Miss match file type!', 'Photo.download', String(file));
      }
      let dParams = Object.assign(
        {
          dcId: dFile.dcId,
          workers: 1,
          progressCallback: (progress) => {
            return log.debug(`Downloading photo [${Math.round(progress)}]`);
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
        new Api.InputPhotoFileLocation({
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
          return log.debug(`Downloading photo [${Math.round(progress)}]`);
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
      new Api.InputPhotoFileLocation({
        id: bigInt(String(this._id)),
        accessHash: bigInt(String(this._accessHash)),
        fileReference: Buffer.from(this._fileReference, 'hex'),
        thumbSize: 'w',
      }),
      dParams!
    );
  }
}
