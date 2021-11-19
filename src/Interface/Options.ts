// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { ProxyInterface } from 'telegram/network/connection/TCPMTProxy';
export interface Options {
  /**
   * Set Logger level for gramjs. Default is "none".
   */
  logger?: string;
  /**
   * An api_hash got from my.telegram.org
   */
  apiHash?: string;
  /**
   * An api_id got from my.telegram.org
   */
  apiId?: number;
  /**
   * String sessions
   */
  session?: string;
  /**
   * Bot Token from botFather. If you need to login as bot this required
   */
  botToken?: string;
  /**
   * tgsnake console.log
   * If set, tgsnake will showing the message in console like welcome to tgsnake or anything.
   */
  tgSnakeLog?: boolean;
  /**
   * session name
   * required to save the string session.
   */
  sessionName?: string;
  /**
   * storeSession
   * required to save the session in storage.
   */
  storeSession?: boolean;
  /** The connection instance to be used when creating a new connection to the servers. It must be a type.<br/>
   * Defaults to  ConnectionTCPFull on Node and ConnectionTCPObfuscated on browsers.
   */
  connection?: any;
  /**
   * Whether to connect to the servers through IPv6 or not. By default this is false.
   */
  useIPV6?: boolean;
  /**
   * The timeout in seconds to be used when connecting. This does nothing for now.
   */
  timeout?: number;
  /**
   * How many times a request should be retried.<br/>
   * Request are retried when Telegram is having internal issues (due to INTERNAL error or RPC_CALL_FAIL error),<br/>
   * when there is a errors.FloodWaitError less than floodSleepThreshold, or when there's a migrate error.<br/>
   * defaults to 5.
   */
  requestRetries?: number;
  /**
   * How many times the reconnection should retry, either on the initial connection or when Telegram disconnects us.<br/>
   * May be set to a negative or undefined value for infinite retries, but this is not recommended, since the program can get stuck in an infinite loop.<br/>
   * defaults to 5
   */
  connectionRetries?: number;
  /**
   * Experimental proxy to be used for the connection. (only supports MTProxies)
   */
  proxy?: ProxyInterface;
  /**
   * How many times we should retry borrowing a sender from another DC when it fails. defaults to 5
   */
  downloadRetries?: number;
  /** The delay in milliseconds to sleep between automatic reconnections. defaults to 1000*/
  retryDelay?: number;
  /**Whether reconnection should be retried connection_retries times automatically if Telegram disconnects us or not. defaults to true */
  autoReconnect?: boolean;
  /** does nothing for now */
  sequentialUpdates?: boolean;
  /** The threshold below which the library should automatically sleep on flood wait and slow mode wait errors (inclusive).<br/>
   *  For instance, if a FloodWaitError for 17s occurs and floodSleepThreshold is 20s, the library will sleep automatically.<br/>
   *  If the error was for 21s, it would raise FloodWaitError instead. defaults to 60 sec.*/
  floodSleepThreshold?: number;
  /**
   * Device model to be sent when creating the initial connection. Defaults to os.type().toString().
   */
  deviceModel?: string;
  /**
   * System version to be sent when creating the initial connection. defaults to os.release().toString() -.
   */
  systemVersion?: string;
  /**
   * App version to be sent when creating the initial connection. Defaults to 1.0.
   */
  appVersion?: string;
  /**
   * Language code to be sent when creating the initial connection. Defaults to 'en'.
   */
  langCode?: string;
  /**
   * System lang code to be sent when creating the initial connection. Defaults to 'en'.
   */
  systemLangCode?: string;
  /**
   * Does nothing for now. don't change.
   */
  baseLogger?: string | any;
  /**
   * Whether to try to connect over Wss (or 443 port) or not.
   */
  useWSS?: boolean;
}
