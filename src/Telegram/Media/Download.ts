// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import * as Medias from '../../Utils/Medias';
import { FileId, decodeFileId } from 'tg-file-id';
import { Snake } from '../../Client';
import bigInt, { BigInteger } from 'big-integer';
import { DownloadFileParams } from '../../Interface/Download';
import BotError from '../../Context/Error';

export async function Download(
  snakeClient: Snake,
  media: string | Medias.TypeMessageMediaDownload,
  params?: DownloadFileParams
) {
  try {
    snakeClient.log.debug('Running telegram.download');
    const { client, log } = snakeClient;
    if (typeof media == 'string') {
      media as string;
      let dFile = await decodeFileId(media!);
      let dParams = Object.assign(
        {
          dcId: dFile.dcId,
          progressCallback: (progress) => {
            return log.debug(`Downloading ${media} [${Math.round(progress)}]`);
          },
        },
        params ?? {}
      );
      if (dParams.fileSize && typeof dParams.fileSize == 'bigint') {
        // @ts-ignore
        dParams.fileSize = bigInt(String(dParams.fileSize));
      }
      switch (dFile.typeId) {
        // ChatPhoto
        case 1:
          const getInputPeer = (dialogId: bigint, dialogAccessHash: bigint) => {
            if (String(dialogId).startsWith('-100')) {
              return new Api.InputPeerChannel({
                channelId: bigInt(String(dialogId)),
                accessHash: bigInt(String(dialogAccessHash)),
              });
            }
            if (String(dialogId).startsWith('-')) {
              return new Api.InputPeerChat({
                chatId: bigInt(String(dialogId)),
              });
            }
            return new Api.InputPeerUser({
              userId: bigInt(String(dialogId)),
              accessHash: bigInt(String(dialogAccessHash)),
            });
          };
          return client.downloadFile(
            new Api.InputPeerPhotoFileLocation({
              big: dFile.photoSize == 'big',
              peer: getInputPeer(
                BigInt(String(dFile.dialogId!)),
                BigInt(String(dFile.dialogAccessHash!))
              ),
              photoId: bigInt(String(dFile.id)),
            }),
            // @ts-ignore
            dParams
          );
          break;
        // Photo
        case 2:
          return client.downloadFile(
            new Api.InputPhotoFileLocation({
              id: bigInt(String(dFile.id)),
              accessHash: bigInt(String(dFile.access_hash)),
              fileReference: Buffer.from(dFile.fileReference, 'hex'),
              thumbSize: 'w',
            }),
            // @ts-ignore
            dParams
          );
          break;
        // Document
        case 3:
        case 4:
        case 5:
        case 8:
        case 9:
        case 10:
        case 13:
          return client.downloadFile(
            new Api.InputDocumentFileLocation({
              id: bigInt(String(dFile.id)),
              accessHash: bigInt(String(dFile.access_hash)),
              fileReference: Buffer.from(dFile.fileReference, 'hex'),
              thumbSize: 'w',
            }),
            // @ts-ignore
            dParams
          );
          break;
        default:
          throw new Error(`This fileId has no attribute download!`);
      }
    } else {
      switch (media.constructor) {
        case Medias.MediaChatPhoto:
          media as Medias.MediaChatPhoto;
          return media.download(undefined, params);
          break;
        case Medias.MediaPhoto:
          media as Medias.MediaPhoto;
          return media.download(undefined, params);
          break;
        case Medias.MediaSticker:
        case Medias.MediaVoice:
        case Medias.MediaVideoNote:
        case Medias.MediaVideo:
        case Medias.MediaAnimation:
        case Medias.MediaAudio:
        case Medias.MediaDocument:
          //@ts-ignore
          return media.download(undefined, params);
          break;
        default:
          throw new Error(`This media has no attribute download!`);
      }
    }
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.download');
    throw new BotError(
      error.message,
      'telegram.download',
      `${typeof media == 'string' ? media : JSON.stringify(media)},${
        params ? JSON.stringify(params) : ''
      }`
    );
  }
}
