// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../Client';
import bigInt, { BigInteger } from 'big-integer';
import BotError from '../../Context/Error';
import { toString, convertId } from '../../Utils/ToBigInt';
export class ClassResultGetAdminLog {
  log!: ClassLogGetAdminLog[];
  constructor(resultGetAdminLog: any) {
    if (resultGetAdminLog) {
      if (resultGetAdminLog.events.length > 0) {
        let tempLog: ClassLogGetAdminLog[] = new Array();
        for (let i = 0; i < resultGetAdminLog.events.length; i++) {
          let event = resultGetAdminLog.events[i];
          tempLog.push(new ClassLogGetAdminLog(event));
        }
        this.log = tempLog;
      }
    }
  }
}
export class ClassLogGetAdminLog {
  id?: number | string;
  date?: Date | number;
  action?: string;
  userId?: number | bigint;
  constructor(event) {
    if (event) {
      if (event.id) this.id = event.id;
      if (event.date) this.date = event.date;
      if (event.userId) this.userId = BigInt(toString(event.userId!) as string);
      if (event.action) {
        let tempAction = { ...event.action };
        delete tempAction.CONSTRUCTOR_ID;
        delete tempAction.SUBCLASS_OF_ID;
        delete tempAction.classType;
        tempAction.actionName = String(tempAction.className).replace(
          /^(ChannelAdminLogEventAction|AdminLogEventAction)/i,
          ''
        );
        delete tempAction.className;
        this.action = tempAction;
      }
    }
  }
}
export interface getAdminLogMoreParams {
  query?: string;
  filter?: {
    join?: boolean;
    leave?: boolean;
    invite?: boolean;
    ban?: boolean;
    unban?: boolean;
    kick?: boolean;
    unkick?: boolean;
    promote?: boolean;
    demote?: boolean;
    info?: boolean;
    settings?: boolean;
    pinned?: boolean;
    groupCall?: boolean;
    invites?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
  maxId?: bigint;
  minId?: bigint;
  limit?: number;
}
/**
 * Get the admin log of a channel/supergroup.
 * @param snakeClient - Client
 * @param {number|string|bigint} chatId -  Chat/Channel/Group id.
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.command("getAdminLog",async (ctx) => {
 *     if(!ctx.chat.private){
 *        let results = await ctx.telegram.getAdminLog(ctx.chat.id)
 *        console.log(results)
 *     }
 * })
 * ```
 */
export async function GetAdminLog(
  snakeClient: Snake,
  chatId: number | string | bigint,
  more?: getAdminLogMoreParams
) {
  try {
    snakeClient.log.debug('Running telegram.getAdminLog');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let options = Object.assign(
      {
        query: '',
        filter: {
          join: true,
          leave: true,
          invite: true,
          ban: true,
          unban: true,
          kick: true,
          unkick: true,
          promote: true,
          demote: true,
          info: true,
          settings: true,
          pinned: true,
          groupCall: true,
          invites: true,
          edit: true,
          delete: true,
        },
        maxId: undefined,
        minId: undefined,
        limit: undefined,
      },
      more
    );
    return new ClassResultGetAdminLog(
      await snakeClient.client.invoke(
        new Api.channels.GetAdminLog({
          channel: convertId(chatId),
          eventsFilter: new Api.ChannelAdminLogEventsFilter(options.filter),
          q: options.query,
          maxId: options.maxId ? bigInt(options.maxId!) : options.maxId,
          minId: options.minId ? bigInt(options.minId!) : options.minId,
          limit: options.limit!,
        })
      )
    );
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.getAdminLog');
    throw new BotError(
      error.message,
      'telegram.getAdminLog',
      `${chatId}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
