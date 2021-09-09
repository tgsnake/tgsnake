// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import { SendMedia, sendMediaMoreParams } from './SendMedia';
import { UploadFile } from './UploadFile';
import { decodeFileId } from 'tg-file-id';
import { Media } from '../../Utils/Media';
import BigInt from 'big-integer';

export async function SendSticker(
  snakeClient: Snake,
  chatId: number | string,
  fileId: string | Buffer | Api.MessageMediaDocument | Api.Document
) {
  try {
    let final: any;
    if (fileId instanceof Api.MessageMediaDocument) {
      final = fileId as Api.MessageMediaDocument;
    }
    if (fileId instanceof Api.Document) {
      final = fileId as Api.Document;
    }
    if (
      Buffer.isBuffer(fileId) ||
      /^http/i.exec(String(fileId)) ||
      /^(\/|\.\.?\/|~\/)/i.exec(String(fileId))
    ) {
      //@ts-ignore
      let file = await UploadFile(snakeClient, fileId);
      final = new Api.InputMediaUploadedDocument({
        file: new Api.InputFile({ ...file! }),
        mimeType: 'image/webp',
        attributes: [
          new Api.DocumentAttributeFilename({
            fileName: `sticker.webp`,
          }),
        ],
      });
    }
    if (final) {
      return SendMedia(snakeClient, chatId, final);
    } else {
      let decode;
      if (typeof fileId !== 'string') {
        throw new Error('Invalid FileId!');
      }
      try {
        decode = decodeFileId(String(fileId));
      } catch (error) {
        throw new Error('Invalid FileId!');
      }
      if (decode) {
        if (decode.fileType == 'sticker') {
          let resultsSendSticker;
          let accessHash: string = String(decode.access_hash);
          let id: string = String(decode.id);
          while (true) {
            try {
              resultsSendSticker = await SendMedia(
                snakeClient,
                chatId,
                new Api.InputMediaDocument({
                  id: new Api.InputDocument({
                    id: BigInt(id),
                    accessHash: BigInt(accessHash),
                    fileReference: Buffer.from(decode.fileReference, 'hex'),
                  }),
                })
              );
              break;
            } catch (e) {
              if (Number(accessHash) > 0 && Number(id) > 0) {
                // id (+) accessHash (+)
                accessHash = `-${accessHash}`; // id (+) accessHash (-)
              } else if (Number(accessHash) < 0 && Number(id) > 0) {
                // id (+) accessHash (-)
                id = `-${id}`; // id (-) accessHash (-)
              } else if (Number(accessHash) < 0 && Number(id) < 0) {
                // id (-) accessHash (-)
                accessHash = accessHash.replace(/^\-/, '');
                // id (-) accessHash (+)
              } else {
                throw new Error(e.message);
                break;
              }
            }
          }
          return resultsSendSticker;
        } else {
          throw new Error(`Invalid FileType. It must be "sticker". Received ${decode.fileType}`);
        }
      }
    }
  } catch (error) {
    return snakeClient._handleError(
      error,
      `telegram.sendSticker(${chatId},${
        Buffer.isBuffer(fileId) ? `<Buffer ${fileId.toString('hex')}>` : JSON.stringify(fileId)
      })`
    );
  }
}
