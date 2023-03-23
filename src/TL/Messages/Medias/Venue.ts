/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { Raw, Helpers } from '@tgsnake/core';
import { TLObject } from '../../TL';
import type { Snake } from '../../../Client';

// https://core.telegram.org/bots/api#location
export class Location extends TLObject {
  _accessHash!: bigint;
  longitude!: number;
  latitude!: number;
  horizontalAccuracy!: number;
  constructor(
    {
      accessHash,
      longitude,
      latitude,
      horizontalAccuracy,
    }: {
      accessHash: bigint;
      longitude: number;
      latitude: number;
      horizontalAccuracy: number;
    },
    client: Snake
  ) {
    super(client);
    this.className = 'location';
    this.classType = 'types';
    this.constructorId = 0xb2a2f663; // Raw.GeoPoint
    this.subclassOfId = 0xd610e16d; // Raw.TypeGeoPoint
    this._accessHash = accessHash;
    this.longitude = longitude;
    this.latitude = latitude;
    this.horizontalAccuracy = horizontalAccuracy;
  }
  static parse(client: Snake, location: Raw.TypeGeoPoint) {
    if (location instanceof Raw.GeoPointEmpty) {
      location as Raw.GeoPointEmpty;
      return new Location(
        {
          accessHash: BigInt(0),
          longitude: 0,
          latitude: 0,
          horizontalAccuracy: 0,
        },
        client
      );
    }
    location as Raw.GeoPoint;
    return new Location(
      {
        accessHash: location.accessHash,
        longitude: location.long,
        latitude: location.lat,
        horizontalAccuracy: location.accuracyRadius ?? 0,
      },
      client
    );
  }
}
// https://core.telegram.org/bots/api#venue
export class Venue extends TLObject {
  location!: Location;
  title!: string;
  address!: string;
  foursquareId!: string;
  foursquareType!: string;
  provider!: string;
  constructor(
    {
      location,
      title,
      address,
      foursquareId,
      foursquareType,
      provider,
    }: {
      location: Location;
      title: string;
      address: string;
      foursquareId: string;
      foursquareType: string;
      provider: string;
    },
    client: Snake
  ) {
    super(client);
    this.className = 'venue';
    this.classType = 'types';
    this.constructorId = 0x2ec0533f; // Raw.MessageMediaVenue
    this.subclassOfId = 0x476cbe32; // Raw.TypeMessageMedia
    this.location = location;
    this.title = title;
    this.address = address;
    this.foursquareId = foursquareId;
    this.foursquareType = foursquareType;
    this.provider = provider;
  }
  static parse(client: Snake, venue: Raw.MessageMediaVenue) {
    return new Venue(
      {
        location: Location.parse(client, venue.geo),
        title: venue.title,
        address: venue.address,
        foursquareId: venue.venueId,
        foursquareType: venue.venueType,
        provider: venue.provider,
      },
      client
    );
  }
}