/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { TLObject } from '../../TL';
import { Raw, Helpers } from '@tgsnake/core';
import type { Snake } from '../../../Client';
import { PhotoSize } from './PhotoSize';
import { FileId, FileType, ThumbnailSource, FileTypeUniqueId } from '@tgsnake/fileid';

// https://core.telegram.org/bots/api#document
export class Document extends TLObject {
  fileId!: string;
  fileUniqueId!: string;
  thumb!: Array<PhotoSize>;
  date!: Date;
  dcId!: number;
  filename?: string;
  mimeType?: string;
  fileSize?: bigint;
  constructor(
    {
      fileId,
      fileUniqueId,
      thumb,
      date,
      dcId,
      filename,
      mimeType,
      fileSize,
    }: {
      fileId: string;
      fileUniqueId: string;
      thumb: Array<PhotoSize>;
      date: Date;
      dcId: number;
      filename?: string;
      mimeType?: string;
      fileSize?: bigint;
    },
    client: Snake
  ) {
    super(client);
    this.className = 'Document';
    this.classType = 'types';
    this.constructorId = 0x8fd4c4d8; // Raw.Document
    this.subclassOfId = 0x211fe820; // Raw.Document
    this.fileId = fileId;
    this.fileUniqueId = fileUniqueId;
    this.thumb = thumb;
    this.date = date;
    this.dcId = dcId;
    this.filename = filename;
    this.mimeType = mimeType;
    this.fileSize = fileSize;
  }
  static parse(client: Snake, document: Raw.Document): Document {
    const { fileId, fileUniqueId } = FileId.encode({
      version: 4,
      subVersion: 32,
      dcId: document.dcId,
      fileType: FileType.DOCUMENT,
      fileTypeUniqueId: FileTypeUniqueId.DOCUMENT,
      volumeId: BigInt(0),
      localId: 0,
      id: document.id,
      accessHash: document.accessHash,
      fileReference: document.fileReference,
    });
    let thumb: Array<PhotoSize> = [];
    let filename: string | undefined;
    for (let attribute of document.attributes) {
      if (attribute instanceof Raw.DocumentAttributeFilename) {
        attribute as Raw.DocumentAttributeFilename;
        filename = attribute.fileName;
      }
    }
    if (document.thumbs) {
      for (let t of document.thumbs) {
        if (t instanceof Raw.PhotoSize) {
          thumb.push(
            PhotoSize.parse(
              client,
              t as Raw.PhotoSize,
              document.id,
              document.accessHash,
              document.fileReference,
              document.dcId
            )
          );
        }
      }
    }
    return new Document(
      {
        fileId,
        fileUniqueId,
        thumb,
        filename,
        mimeType: document.mimeType,
        fileSize: document.size,
        dcId: document.dcId,
        date: new Date(document.date * 1000),
      },
      client
    );
  }
}
