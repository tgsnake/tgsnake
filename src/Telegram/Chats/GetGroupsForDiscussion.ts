// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Snake } from '../../client';
import BotError from '../../Context/Error';
/**
 * Get all groups that can be used as discussion groups.<br/>
 * Returned legacy group chats must be first upgraded to supergroups before they can be set as a discussion group.<br/>
 * To set a returned supergroup as a discussion group, access to its old messages must be enabled using channels.togglePreHistoryHidden, first. <br/>
 * @param snakeClient - client
 * ```ts
 * bot.command("getGroupsForDiscussion",async (ctx) => {
 *     let results = await ctx.telegram.getGroupsForDiscussion()
 *     console.log(results)
 * })
 * ```
 */
export async function GetGroupsForDiscussion(snakeClient: Snake) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getGroupsForDiscussion`
      );
    }
    let results: Api.messages.TypeChats = await snakeClient.client.invoke(
      new Api.channels.GetGroupsForDiscussion()
    );
    return results;
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.getGroupsForDiscussion';
    botError.functionArgs = ``;
    throw botError;
  }
}
