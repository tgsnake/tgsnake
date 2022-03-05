// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Snake } from '../../Client';
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
    snakeClient.log.debug('Running telegram.getAdminedPublicChannels');
    let results: Api.messages.TypeChats = await snakeClient.client.invoke(
      new Api.channels.GetAdminedPublicChannels({
        byLocation: byLocation,
        checkLimit: checkLimit,
      })
    );
    // todo
    // change the json results
    return results;
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.getAdminedPublicChannels');
    throw new BotError(
      error.message,
      'telegram.getAdminedPublicChannels',
      `${byLocation},${checkLimit}`
    );
  }
}
