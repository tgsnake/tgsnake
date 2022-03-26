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
import { TypeReplyMarkup, BuildReplyMarkup } from '../../Utils/ReplyMarkup';
import * as Medias from '../../Utils/Medias';
import BotError from '../../Context/Error';
import Parser, { Entities } from '@tgsnake/parser';
import bigInt from 'big-integer';
const parser = new Parser(Api);
export interface sendPollMoreParams extends defaultSendMediaMoreParams {
  closed?: boolean;
  publicVoters?: boolean;
  multipleChoice?: boolean;
  quiz?: boolean;
  closePeriod?: number;
  closeDate?: number;
  correctAnswers?: number;
  solution?: string;
  solutionEntities?: Entities[];
  solutionParseMode?: string;
}
export interface InterfacePoll {
  question: string;
  options: Array<string>;
}
function clean(more?: sendPollMoreParams) {
  if (more) {
    let purge = [
      'closed',
      'publicVoters',
      'multipleChoice',
      'quiz',
      'closePeriod',
      'closeDate',
      'correctAnswers',
      'solution',
      'solutionEntities',
      'solutionParseMode',
    ];
    for (let [key] of Object.entries(more)) {
      if (purge.includes(key)) delete more[key];
    }
  }
  return more;
}
/**
 * Sending Polling
 * @param snakeClient - Client
 * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
 * @param {Object} poll - polling
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.command("poll",async (ctx) => {
 *     let results = await ctx.telegram.sendPoll(ctx.chat.id,{
 *    question : "something"
 *    options : ["A","B"],
 *  })
 * })
 * ```
 */
export async function SendPoll(
  snakeClient: Snake,
  chatId: number | string | bigint,
  poll: InterfacePoll | Medias.MediaPoll,
  more?: sendPollMoreParams
) {
  try {
    snakeClient.log.debug('Running telegram.sendPoll');
    if (typeof chatId === 'number')
      snakeClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    if (poll instanceof Medias.MediaPoll) {
      poll as Medias.MediaPoll;
      let options: Array<Api.TypePollAnswer> = [];
      let correct: Array<Buffer> = [];
      for (let answer of poll.answers) {
        if (answer.correct) {
          correct.push(Buffer.from(answer.option));
        }
        options.push(
          new Api.PollAnswer({
            text: answer.text,
            option: Buffer.from(answer.option),
          })
        );
      }
      return await SendMedia(
        snakeClient,
        chatId,
        new Api.InputMediaPoll({
          poll: new Api.Poll({
            id: bigInt(String(poll.id)),
            closed: poll.closed,
            publicVoters: poll.publicVoters,
            multipleChoice: poll.multipleChoice,
            quiz: poll.quiz,
            question: poll.question,
            answers: options,
            closePeriod: poll.closePeriod,
            closeDate: poll.closeDate,
          }),
          correctAnswers: correct,
          solution: poll.solution,
          solutionEntities: poll.solutionEntities
            ? ((await parser.toRaw(
                snakeClient.client!,
                poll.solutionEntities
              )) as Array<Api.TypeMessageEntity>)
            : [],
        }),
        clean(more)
      );
    }
    if (typeof poll == 'object' && poll.question && poll.options) {
      let options: Array<Api.TypePollAnswer> = [];
      let correct: Array<Buffer> = [];
      let solutionEntities: Array<Api.TypeMessageEntity> | undefined = undefined;
      let solution: string | undefined = undefined;
      for (let index in poll.options) {
        let answer = poll.options[index];
        if (more && more.correctAnswers !== undefined && more.correctAnswers == Number(index)) {
          correct.push(Buffer.from(String(index)));
        }
        options.push(
          new Api.PollAnswer({
            text: answer,
            option: Buffer.from(String(index)),
          })
        );
      }
      if (more) {
        if (more.solution && more.solutionEntities) {
          snakeClient.log.debug('Building Entities');
          solutionEntities = (await parser.toRaw(
            snakeClient.client!,
            more.solutionEntities
          )) as Array<Api.TypeMessageEntity>;
          solution = more.solution;
        }
        if (more.solution && more.solutionParseMode && !more.solutionEntities) {
          let parseMode = String(more.solutionParseMode).toLowerCase();
          //@ts-ignore
          let [t, e] = parser.parse(more.solution, parseMode!);
          solution = t;
          solutionEntities = (await parser.toRaw(
            snakeClient.client!,
            e!
          )) as Array<Api.TypeMessageEntity>;
        }
      }
      return await SendMedia(
        snakeClient,
        chatId,
        new Api.InputMediaPoll({
          poll: new Api.Poll({
            id: bigInt(0),
            closed: more?.closed,
            publicVoters: more?.publicVoters,
            multipleChoice: more?.multipleChoice,
            quiz: more?.quiz,
            question: poll.question,
            answers: options,
            closePeriod: more?.closePeriod,
            closeDate: more?.closeDate,
          }),
          correctAnswers: correct,
          solution: solution,
          solutionEntities: solutionEntities,
        }),
        clean(more)
      );
    }
    throw new Error(`Couldn't resolve this poll.`);
  } catch (error: any) {
    snakeClient.log.error('Failed to running telegram.sendPoll');
    throw new BotError(
      error.message,
      'telegram.sendPoll',
      `${chatId},${JSON.stringify(poll)}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
