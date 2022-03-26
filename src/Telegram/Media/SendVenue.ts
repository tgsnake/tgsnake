// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../Client';
import { SendMedia, defaultSendMediaMoreParams } from './SendMedia';
import * as Medias from '../../Utils/Medias';
import BotError from '../../Context/Error';
import bigInt from 'big-integer';

export interface InterfaceVenue {
  latitude: number;
  longitude: number;
  accuracyRadius?: number;
  title: string;
  address: string;
  provider: string;
  id: string;
  type: string;
}
/**
 * Sending Venue
 * @param snakeClient - Client
 * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
 * @param {Object} venue - venue
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.command("venue",async (ctx) => {
 *     let results = await ctx.telegram.sendVenue(ctx.chat.id,{
 *    latitude : 0,
 *    longitude : 0,
 *    title : "title",
 *    address : "address",
 *    provider : "provider",
 *    id : "some id here",
 *    type : "some type here"
 *  })
 * })
 * ```
 */
export async function SendVenue(
  snakeClient: Snake,
  chatId: number | string | bigint,
  venue: InterfaceVenue | Medias.MediaVenue,
  more?: defaultSendMediaMoreParams
) {
  try {
    snakeClient.log.debug('Running telegram.sendVenue');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    return await SendMedia(
      snakeClient,
      chatId,
      new Api.InputMediaVenue({
        geoPoint: new Api.InputGeoPoint({
          lat: venue.latitude,
          long: venue.longitude,
          accuracyRadius: venue.accuracyRadius,
        }),
        title: venue.title,
        address: venue.address,
        provider: venue.provider,
        venueId: venue.id,
        venueType: venue.type,
      }),
      more
    );
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.sendVenue');
    throw new BotError(
      error.message,
      'telegram.sendVenue',
      `${chatId},${JSON.stringify(venue)}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
