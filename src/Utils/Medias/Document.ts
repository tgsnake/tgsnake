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

export class MediaDocument extends Media {
  /** @hidden */
  _id!: bigint;
  /** @hidden */
  _accessHash!: bigint;
  /** @hidden */
  _fileReference!: string;
  dcId!: number;
  mimeType!: string;
  size!: number;
  width!: number;
  height!: number;
  fileId!: string;
  uniqueFileId!: string;
  filename!: string;
  constructor() {
    super();
    this['_'] = 'document';
  }
  async encode(document: Api.Document, snakeClient: Snake) {
    snakeClient.log.debug('Creating MediaDocument');
    this.snakeClient = snakeClient;
    this._id = BigInt(String(document.id));
    this._accessHash = BigInt(String(document.accessHash));
    this._fileReference = document.fileReference.toString('hex');
    this.mimeType = document.mimeType;
    this.size = document.size;
    this.dcId = document.dcId;
    for (let attribute of document.attributes) {
      if (attribute instanceof Api.DocumentAttributeImageSize) {
        attribute as Api.DocumentAttributeImageSize;
        this.width = attribute.w;
        this.height = attribute.h;
      }
      if (attribute instanceof Api.DocumentAttributeFilename) {
        attribute as Api.DocumentAttributeFilename;
        this.filename = attribute.fileName;
      }
    }
    let file = new FileId();
    file.version = 4;
    file.subVersion = 30;
    file.dcId = this.dcId;
    file.fileType = 'document';
    file.typeId = 5;
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
    this.snakeClient.log.debug('Downloading Document');
    const { client, log } = this.snakeClient;
    const file = fileId ?? this.fileId;
    const inRange = (x: number, min: number, max: number) => {
      return (x - min) * (x - max) <= 0;
    };
    if (!file) {
      this.snakeClient.log.error('Failed to download document cause: FileId not found!');
      throw new BotError('FileId not found!', 'Document.download', String(file));
    }
    if (file !== this.fileId) {
      let dFile = this.decode(file);
      if (dFile.typeId !== 4) {
        this.snakeClient.log.error('Failed to download document cause: Miss match file type!');
        throw new BotError('Miss match file type!', 'Document.download', String(file));
      }
      let dParams = Object.assign(
        {
          dcId: dFile.dcId,
          workers: 1,
          progressCallback: (progress) => {
            return log.debug(`Downloading document [${Math.round(progress)}]`);
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
          return log.debug(`Downloading document [${Math.round(progress)}]`);
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
