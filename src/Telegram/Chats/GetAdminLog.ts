// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
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
class ClassLogGetAdminLog {
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
  q?: string;
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
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getAdminLog`
      );
    }
    let filter = {
      join: more?.join || true,
      leave: more?.leave || true,
      invite: more?.invite || true,
      ban: more?.ban || true,
      unban: more?.unban || true,
      kick: more?.kick || true,
      unkick: more?.unkick || true,
      promote: more?.promote || true,
      demote: more?.demote || true,
      info: more?.info || true,
      settings: more?.settings || true,
      pinned: more?.pinned || true,
      groupCall: more?.groupCall || true,
      invites: more?.invites || true,
      edit: more?.edit || true,
      delete: more?.delete || true,
    };
    return new ClassResultGetAdminLog(
      await snakeClient.client.invoke(
        new Api.channels.GetAdminLog({
          channel: convertId(chatId),
          eventsFilter: new Api.ChannelAdminLogEventsFilter(filter),
          q: more?.q ? more.q : '',
          maxId: more?.maxId ? bigInt(more.maxId!) : undefined,
          minId: more?.minId ? bigInt(more.minId!) : undefined,
          limit: more?.limit ? Number(more.limit!) : undefined,
        })
      )
    );
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.getAdminLog';
    botError.functionArgs = `${chatId}${more ? ',' + JSON.stringify(more) : ''}`;
    throw botError;
  }
}
