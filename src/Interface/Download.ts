// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
export interface progressCallback {
  (
    /** float between 0 and 1 */
    progress: number,
    /** other args to be passed if needed */
    ...args: any[]
  ): void;
  /** When this value is set to true the download will stop */
  isCanceled?: boolean;
  /** Does nothing for now. */
  acceptsBuffer?: boolean;
}
/**
 * Low level interface for downloading files
 */
export interface DownloadFileParams {
  /** The dcId that the file belongs to. Used to borrow a sender from that DC */
  dcId?: number;
  /** How much to download. The library will download until it reaches this amount.<br/>
   *  can be useful for downloading by chunks */
  fileSize?: number;
  /** Used to determine how many download tasks should be run in parallel. anything above 16 is unstable. */
  workers?: number;
  /** How much to download in each chunk. The larger the less requests to be made. (max is 512kb). */
  partSizeKb?: number;
  /** Where to start downloading. useful for chunk downloading. */
  start?: number;
  /** Where to stop downloading. useful for chunk downloading. */
  end?: number;
  /** Progress callback accepting one param. (progress :number) which is a float between 0 and 1 */
  progressCallback?: progressCallback;
}
