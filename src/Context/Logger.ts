// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import chalk from 'chalk';
import * as NodeUtil from 'util';
import { betterConsoleLog } from '../Utils/CleanObject';
export interface LoggerColor {
  debug?: string;
  info?: string;
  error?: string;
  warning?: string;
}
export type TypeLogLevel = 'none' | 'info' | 'debug' | 'error' | 'verbose' | 'warning';
export type TypeWarningLog = 'soft' | 'hard';
export class Logger {
  /** @hidden */
  private _color!: LoggerColor;
  /** @hidden */
  private _level!: TypeLogLevel;
  /** @hidden */
  private _enable!: boolean;
  /** @hidden */
  private _warningLogLevel!: TypeWarningLog;
  constructor(level: TypeLogLevel, enable: boolean, color?: LoggerColor) {
    this._level = level;
    this._enable = enable;
    this._warningLogLevel = 'hard';
    this._color = Object.assign(
      {
        debug: 'blue',
        info: 'green',
        error: 'red',
        warning: 'yellow',
      },
      color ? color : {}
    );
  }
  /** @hidden */
  [NodeUtil.inspect.custom]() {
    return betterConsoleLog(this);
  }
  /** @hidden */
  toJSON() {
    let obj = betterConsoleLog(this);
    for (let [key, value] of Object.entries(obj)) {
      if (typeof value == 'bigint') obj[key] = String(value);
    }
    return obj;
  }
  /**
   * @hidden
   * Creating a log template.
   */
  private template(level: string) {
    return ['🐍', chalk[this._color[level]](level), '-'];
  }
  /**
   * Setting a log level.
   */
  setLogLevel(level: TypeLogLevel) {
    let _level = level.toLowerCase().trim();
    let approved: Array<TypeLogLevel> = ['none', 'info', 'debug', 'error', 'verbose'];
    //@ts-ignore
    if (!approved.includes(_level!))
      return this.error(
        `Level of warning must be "none" or "info" or "debug" or "error" or "verbose", but got "${level}"`
      );
    //@ts-ignore
    return (this._level = _level);
  }
  /**
   * Setting a warning level. <br/>
   * If you set "hard" the warning will be appears in any log levels.<br/>
   * If you set "soft" the warning will be appears only in warning log level.
   */
  setWarningLevel(level: TypeWarningLog) {
    let _level = level.toLowerCase().trim();
    let approved: Array<TypeWarningLog> = ['hard', 'soft'];
    //@ts-ignore
    if (!approved.includes(_level!))
      return this.error(`Level of warning must be "hard" or "soft", but got "${level}"`);
    //@ts-ignore
    return (this._warningLogLevel = _level);
  }
  /**
   * Create log without template and without levels.
   */
  log(...args: Array<any>) {
    if (this._enable) {
      if (args.length > 1) {
        let fargs: Array<any> = new Array();
        for (let arg of args) {
          if (typeof arg == 'object') {
            fargs.push(
              NodeUtil.inspect(arg, {
                showHidden: true,
                colors: true,
              })
            );
          } else {
            fargs.push(arg);
          }
        }
        console.log(...fargs);
      } else {
        let fargs: Array<any> = new Array();
        if (typeof args[0] == 'object') {
          fargs.push(
            NodeUtil.inspect(args[0], {
              showHidden: true,
              colors: true,
            })
          );
        } else {
          fargs.push(args[0]);
        }
        console.log(...fargs);
      }
    }
    return args;
  }
  /**
   * Creating log with debug level
   */
  debug(...args: Array<any>) {
    let level: Array<TypeLogLevel> = ['debug', 'verbose'];
    if (!level.includes(this._level)) return this._level;
    return this.log(...this.template('debug'!), ...args);
  }
  /**
   * Creating log with info level
   */
  info(...args: Array<any>) {
    let level: Array<TypeLogLevel> = ['info', 'debug', 'verbose'];
    if (!level.includes(this._level)) return this._level;
    return this.log(...this.template('info'!), ...args);
  }
  /**
   * Creating log with error level
   */
  error(...args: Array<any>) {
    let level: Array<TypeLogLevel> = ['error', 'debug', 'verbose'];
    if (!level.includes(this._level)) return this._level;
    return this.log(...this.template('error'!), ...args);
  }
  /**
   * Creating log with warning level
   */
  warning(...args: Array<any>) {
    let level: Array<TypeLogLevel> = ['warning', 'debug', 'verbose'];
    if (this._warningLogLevel === 'hard') {
      level.concat(['none', 'info', 'error']);
    }
    if (!level.includes(this._level)) return this._level;
    return this.log(...this.template('warning'!), ...args);
  }
  /**
   * Creating log with combine level. <br/>
   * Like if you want to show the console in level "error" and "info" pass it as array in first arguments.<br/>
   * The selected template will use the first index in the array.
   */
  combine(level: Array<TypeLogLevel>, ...args: Array<any>) {
    if (!level.includes(this._level)) return this._level;
    return this.log(...this.template(level[0]!), ...args);
  }
}
