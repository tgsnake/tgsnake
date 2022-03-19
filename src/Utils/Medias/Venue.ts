// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Media } from './Media';
import { Snake } from '../../Client';
import { Cleaning } from '../CleanObject';

export class MediaVenue extends Media {
  latitude!: number;
  longitude!: number;
  accessHash!: bigint;
  accuracyRadius!: number;
  title!: string;
  address!: string;
  provider!: string;
  id!: string;
  type!: string;
  constructor() {
    super();
    this['_'] = 'venue';
  }
  async encode(venue: Api.MessageMediaVenue, snakeClient: Snake) {
    snakeClient.log.debug('Creating MediaVenue');
    this.snakeClient = snakeClient;
    if (venue.geo instanceof Api.GeoPoint) {
      const geo = venue.geo as Api.GeoPoint;
      this.latitude = geo.lat;
      this.longitude = geo.long;
      this.accessHash = BigInt(String(geo.accessHash ?? 0));
      this.accuracyRadius = geo.accuracyRadius ?? 0;
    }
    this.title = venue.title;
    this.provider = venue.provider;
    this.address = venue.address;
    this.id = venue.venueId;
    this.type = venue.venueType;
    await Cleaning(this);
    return this;
  }
}
