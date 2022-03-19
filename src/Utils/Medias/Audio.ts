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

export class MediaAudio extends Media {
  /** @hidden */
  _id!: bigint;
  /** @hidden */
  _accessHash!: bigint;
  /** @hidden */
  _fileReference!: string;
  dcId!: number;
  mimeType!: string;
  size!: number;
  fileId!: string;
  uniqueFileId!: string;
  duration!: number;
  title!: string;
  performer!: string;
  waveform!: Buffer;
  constructor() {
    super();
    this['_'] = 'audio';
  }
  async encode(audio: Api.Document, snakeClient: Snake) {
    snakeClient.log.debug('Creating MediaAudio');
    this.snakeClient = snakeClient;
    this._id = BigInt(String(audio.id));
    this._accessHash = BigInt(String(audio.accessHash));
    this._fileReference = audio.fileReference.toString('hex');
    this.mimeType = audio.mimeType;
    this.size = audio.size;
    this.dcId = audio.dcId;
    for (let attribute of audio.attributes) {
      if (attribute instanceof Api.DocumentAttributeAudio) {
        attribute as Api.DocumentAttributeAudio;
        //@ts-ignore
        this.title = attribute.title;
        //@ts-ignore
        this.performer = attribute.performer;
        //@ts-ignore
        this.waveform = attribute.waveform;
      }
    }
    let file = new FileId();
    file.version = 4;
    file.subVersion = 30;
    file.dcId = this.dcId;
    file.fileType = 'audio';
    file.typeId = 9;
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
    this.snakeClient.log.debug('Downloading Audio');
    const { client, log } = this.snakeClient;
    const file = fileId ?? this.fileId;
    const inRange = (x: number, min: number, max: number) => {
      return (x - min) * (x - max) <= 0;
    };
    if (!file) {
      this.snakeClient.log.error('Failed to download audio cause: FileId not found!');
      throw new BotError('FileId not found!', 'Audio.download', String(file));
    }
    if (file !== this.fileId) {
      let dFile = this.decode(file);
      if (dFile.typeId !== 9) {
        this.snakeClient.log.error('Failed to download audio cause: Miss match file type!');
        throw new BotError('Miss match file type!', 'Audio.download', String(file));
      }
      let dParams = Object.assign(
        {
          dcId: dFile.dcId,
          workers: 1,
          progressCallback: (progress) => {
            return log.debug(`Downloading audio [${Math.round(progress)}]`);
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
          return log.debug(`Downloading audio [${Math.round(progress)}]`);
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
