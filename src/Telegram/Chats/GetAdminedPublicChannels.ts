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
 * Get channels/supergroups/geogroups we're admin in. Usually called when the user exceeds the limit for owned public channels/supergroups/geogroups, and the user is given the choice to remove one of his channels/supergroups/geogroups.
 * @param snakeClient - client
 * @param {boolean} byLocation - Get geogroups.
 * @param {boolean} checkLimit - If set and the user has reached the limit of owned public channels/supergroups/geogroups, instead of returning the channel list one of the specified errors will be returned. <br/>
 * Useful to check if a new public channel can indeed be created, even before asking the user to enter a channel username to use in channels.checkUsername/channels.updateUsername.
 * ```ts
 * bot.command("getAdminedPublicChannels",async (ctx) => {
 *    if(!ctx.chat.private){
 *        let results = await ctx.telegram.getAdminedPublicChannels()
 *        console.log(results)
 *    }
 * })
 * ```
 */
export async function GetAdminedPublicChannels(
  snakeClient: Snake,
  byLocation: boolean = true,
  checkLimit: boolean = true
) {
  try {
    let mode = ['debug', 'info'];
    if (mode.includes(snakeClient.logger)) {
      snakeClient.log(
        `[${
          snakeClient.connectTime
        }] - [${new Date().toLocaleString()}] - Running telegram.getAdminedPublicChannels`
      );
    }
    let results: Api.messages.TypeChats = await snakeClient.client.invoke(
      new Api.channels.GetAdminedPublicChannels({
        byLocation: byLocation,
        checkLimit: checkLimit,
      })
    );
    // todo
    // change the json results
    return results;
  } catch (error) {
    let botError = new BotError();
    botError.error = error;
    botError.functionName = 'telegram.getAdminedPublicChannels';
    botError.functionArgs = `${byLocation},${checkLimit}`;
    throw botError;
  }
}
