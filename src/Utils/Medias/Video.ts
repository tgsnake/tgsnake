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

export class MediaVideo extends Media {
  /** @hidden */
  _id!: bigint;
  /** @hidden */
  _accessHash!: bigint;
  /** @hidden */
  _fileReference!: string;
  dcId!: number;
  mimeType!: string;
  size!: number;
  supportStreaming!: boolean;
  duration!: number;
  width!: number;
  height!: number;
  fileId!: string;
  uniqueFileId!: string;
  filename!: string;
  hasSticker!: boolean;
  constructor() {
    super();
    this['_'] = 'video';
  }
  async encode(video: Api.Document, snakeClient: Snake) {
    snakeClient.log.debug('Creating MediaVideo');
    this.snakeClient = snakeClient;
    this._id = BigInt(String(video.id));
    this._accessHash = BigInt(String(video.accessHash));
    this._fileReference = video.fileReference.toString('hex');
    this.mimeType = video.mimeType;
    this.size = video.size;
    this.dcId = video.dcId;
    for (let attribute of video.attributes) {
      if (attribute instanceof Api.DocumentAttributeVideo) {
        attribute as Api.DocumentAttributeVideo;
        this.supportStreaming = attribute.supportsStreaming ?? false;
        this.duration = attribute.duration;
        this.width = attribute.w;
        this.height = attribute.h;
      }
      if (attribute instanceof Api.DocumentAttributeFilename) {
        attribute as Api.DocumentAttributeFilename;
        this.filename = attribute.fileName;
      }
      if (attribute instanceof Api.DocumentAttributeHasStickers) {
        attribute as Api.DocumentAttributeHasStickers;
        this.hasSticker = true;
      }
    }
    let file = new FileId();
    file.version = 4;
    file.subVersion = 30;
    file.dcId = this.dcId;
    file.fileType = 'video';
    file.typeId = 4;
    file.volumeId = BigInt(1);
    file.id = this._id;
    file.accessHash = this._accessHash;
    file.fileReference = this._fileReference;
    this.fileId = await file.toFileId();
    this.uniqueFileId = await file.toFileUniqId();
    await Cleaning(this);
    return this;
  }
  async download(fileId?: string, params?: DownloadFileParams) {
    this.snakeClient.log.debug('Downloading video');
    const { client, log } = this.snakeClient;
    const file = fileId ?? this.fileId;
    const inRange = (x: number, min: number, max: number) => {
      return (x - min) * (x - max) <= 0;
    };
    if (!file) {
      this.snakeClient.log.error('Failed to download video cause: FileId not found!');
      throw new BotError('FileId not found!', 'Video.download', String(file));
    }
    if (file !== this.fileId) {
      let dFile = this.decode(file);
      if (dFile.typeId !== 4) {
        this.snakeClient.log.error('Failed to download video cause: Miss match file type!');
        throw new BotError('Miss match file type!', 'Video.download', String(file));
      }
      let dParams = Object.assign(
        {
          dcId: dFile.dcId,
          workers: 1,
          progressCallback: (progress) => {
            return log.debug(`Downloading video [${Math.round(progress)}]`);
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
          return log.debug(`Downloading video [${Math.round(progress)}]`);
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
