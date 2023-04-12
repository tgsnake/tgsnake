/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { Raw, Helpers, Parser, type Entities } from '../../../platform.deno.ts';
import { TLObject } from '../../TL.ts';
import type { Snake } from '../../../Client/index.ts';

export class PollAnswer extends TLObject {
  text!: string;
  chosen!: boolean;
  correct!: boolean;
  voters!: number;
  option!: string;
  constructor(
    {
      text,
      chosen,
      correct,
      voters,
      option,
    }: {
      text: string;
      chosen: boolean;
      correct: boolean;
      voters: number;
      option: string;
    },
    client: Snake
  ) {
    super(client);
    this.className = 'pollAnswer';
    this.classType = 'types';
    this.constructorId = 0; // unknown
    this.subclassOfId = 0x248e557b; // Raw.TypePoll
    this.text = text;
    this.chosen = chosen;
    this.voters = voters;
    this.option = option;
  }
}
// https://core.telegram.org/bots/api#poll
export class Poll extends TLObject {
  id!: bigint;
  closed!: boolean;
  publicVoters!: boolean;
  multipleChoice!: boolean;
  quiz!: boolean;
  question!: string;
  answers!: Array<PollAnswer | undefined>;
  min!: boolean;
  totalVoters!: number;
  recentVoters!: any;
  closePeriod?: number;
  closeDate?: Date;
  solution?: string;
  solutionEntities?: Array<Entities>;
  constructor(
    {
      id,
      closed,
      publicVoters,
      multipleChoice,
      quiz,
      question,
      answers,
      closePeriod,
      closeDate,
      min,
      totalVoters,
      recentVoters,
      solution,
      solutionEntities,
    }: {
      id: bigint;
      closed: boolean;
      publicVoters: boolean;
      multipleChoice: boolean;
      quiz: boolean;
      question: string;
      answers: Array<PollAnswer | undefined>;
      min: boolean;
      totalVoters: number;
      recentVoters: any;
      closePeriod?: number;
      closeDate?: Date;
      solution?: string;
      solutionEntities?: Array<Entities>;
    },
    client: Snake
  ) {
    super(client);
    this.className = 'poll';
    this.classType = 'types';
    this.constructorId = 0x86e18161; // Raw.Poll
    this.subclassOfId = 0x248e557b; // Raw.TypePoll
    this.id = id;
    this.closed = closed;
    this.publicVoters = publicVoters;
    this.multipleChoice = multipleChoice;
    this.quiz = quiz;
    this.question = question;
    this.answers = answers;
    this.closePeriod = closePeriod;
    this.closeDate = closeDate;
    this.min = min;
    this.totalVoters = totalVoters;
    this.recentVoters = recentVoters;
    this.solution = solution;
    this.solutionEntities = solutionEntities;
  }
  static parse(client: Snake, poll: Raw.MessageMediaPoll) {
    return new Poll(
      {
        id: poll.poll.id,
        closed: poll.poll.closed ?? false,
        publicVoters: poll.poll.publicVoters ?? false,
        multipleChoice: poll.poll.multipleChoice ?? false,
        quiz: poll.poll.quiz ?? false,
        question: poll.poll.question,
        answers: poll.poll.answers.map((element, index) => {
          if (poll.results?.results) {
            const results = poll.results.results[index];
            if (element && results) {
              return new PollAnswer(
                {
                  text: element.text,
                  chosen: results.chosen ?? false,
                  correct: results.correct ?? false,
                  voters: results.voters ?? 0,
                  option: element.option.toString('utf8'),
                },
                client
              );
            }
          }
        }),
        closePeriod: poll.poll.closePeriod ?? undefined,
        closeDate: poll.poll.closeDate ? new Date(poll.poll.closeDate * 1000) : undefined,
        min: poll.results.min ?? false,
        totalVoters: poll.results.totalVoters ?? 0,
        recentVoters: poll.results.recentVoters,
        solution: poll.results.solution,
        solutionEntities: Parser.fromRaw(poll.results.solutionEntities ?? []),
      },
      client
    );
  }
}
