/**
 * tgsnake - Telegram MTProto framework for nodejs.

 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import type { Snake } from '../Snake';
import type { Options } from '../Options';
import { Logger } from '../../Context/Logger';
import { Client, Raw } from '@tgsnake/core';
import { open } from '../../Utilities';

class BetterPromise<T> {
  promise!: Promise<T>;
  reject!: any;
  resolve!: any;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}
export async function LoginWithWebPage(snake: Snake) {
  // @ts-ignore
  await snake._options.login.session.load();
  // @ts-ignore
  if (!snake._options.login.session?.authKey) {
    return WizardWebPage(snake);
  } else {
    await snake._client.connect();
    return await snake._client.getMe();
  }
}
export async function WizardWebPage(snake: Snake) {
  Logger.info('Initial login with WebPage.');
  http
    .createServer(async (req, res) => {
      try {
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
            'Access-Control-Allow-Headers':
              'Origin, X-Requested-With, Content-Type, Accept, Authorization',
          });
        }
        const { method, headers } = req;
        if (method === 'GET') {
          if (req.url === '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end(require(path.join(__dirname, 'Assets/WebPage.html.js')).default);
          }
          if (req.url === '/Assets/WebPage.min.js') {
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            return res.end(fs.readFileSync(path.join(__dirname, 'Assets/WebPage.js')));
          }
          if (req.url === '/Assets/InitWebPage.min.js') {
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            return res.end(fs.readFileSync(path.join(__dirname, 'Assets/InitWebPage.js')));
          }
          res.writeHead(404);
          return res.end('');
        }
        const data = await handleData(req);
        if (method !== 'POST') {
          res.writeHead(300, { 'Content-Type': 'application/json' });
          return res.end(
            JSON.stringify({
              ok: false,
              message: 'Only accept POST method with application/json Content-Type.',
            })
          );
        }
        if (headers['content-type'] !== 'application/json') {
          res.writeHead(300, { 'Content-Type': 'application/json' });
          return res.end(
            JSON.stringify({
              ok: false,
              message: 'Only accept POST method with application/json Content-Type.',
            })
          );
        }
        const body = JSON.parse(data.toString('utf8'));
        switch (body.method) {
          case 'init':
            Logger.debug('Initial WebPage');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(
              JSON.stringify({
                ok: true,
                content: {
                  apiId: snake._options.apiId ?? false,
                  apiHash: snake._options.apiHash ?? false,
                },
              })
            );
            break;
          case 'setApiId':
            Logger.debug('Setting up Api Id');
            if (!body.apiId) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              return res.end(
                JSON.stringify({
                  ok: false,
                  message: 'Missing Api Id field.',
                })
              );
            }
            if (Number.isNaN(Number(body.apiId))) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(
                JSON.stringify({
                  ok: false,
                  message: 'Api Id should be as a number.',
                })
              );
            }
            snake._options.apiId = Number(body.apiId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(
              JSON.stringify({
                ok: true,
                content: {
                  apiId: snake._options.apiId ?? false,
                  apiHash: snake._options.apiHash ?? false,
                },
              })
            );
            break;
          case 'setApiHash':
            Logger.debug('Setting up Api Id');
            if (!body.apiHash) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              return res.end(
                JSON.stringify({
                  ok: false,
                  message: 'Missing Api Hash field.',
                })
              );
            }
            snake._options.apiHash = body.apiHash;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(
              JSON.stringify({
                ok: true,
                content: {
                  apiId: snake._options.apiId ?? false,
                  apiHash: snake._options.apiHash ?? false,
                },
              })
            );
            break;
          case 'createClient':
            Logger.debug('Creating Client');
            snake._client = new Client(
              // @ts-ignore
              snake._options.login.session,
              snake._options.apiHash,
              snake._options.apiId,
              snake._options.clientOptions
            );
            break;
          case 'initBot':
          case 'initUser':
          case 'initQrCode':
          case 'setBotToken':
          case 'setPhoneNumber':
          case 'setOtp':
          case 'setTFAPw':
            break;
          default:
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(
              JSON.stringify({
                ok: false,
                message: `Unknown method: ${body.method}.`,
              })
            );
        }
      } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(
          JSON.stringify({
            ok: false,
            message: error.message,
          })
        );
      }
    }) // @ts-ignore
    .listen(snake._options.useWebPage.port);
  // @ts-ignore
  Logger.info(`Open localhost:${snake._options.useWebPage?.port} on your browser for login!`);
  //@ts-ignore
  if (snake._options.useWebPage?.autoOpen) {
    //@ts-ignore
    return open(`http://localhost:${snake._options.useWebPage?.port}`);
  }
  return;
}
function handleData(req): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let chunk: Array<Buffer> = [];
    req.on('data', (chunks) => {
      chunk.push(chunks);
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunk));
    });
    req.on('error', (error) => {
      reject(error);
    });
  });
}
