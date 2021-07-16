export {Snake} from "./snake/client";
export {Filters} from "./snake/filters";
export {Shortcut} from "./snake/shortcut";
export {Telegram} from "./snake/tele";
export * as GenerateResult from "./snake/rewriteresults";
export * as GenerateJson from "./snake/rewritejson";
export * as Interface from "./snake/interface"
// importing gramjs
import {Api} from "telegram/tl"
import * as Tl from "telegram/tl"
import * as Helpers from "telegram/Helpers"
import * as Password from "telegram/Password"
import * as Utils from "telegram/Utils"
import * as EntityCache from "telegram/entityCache"
import * as Version from "telegram/Version"
import * as TelegramClient from "telegram/client/TelegramClient"
import * as Uploads from "telegram/client/uploads"
import * as MessageParse from "telegram/client/messageParse"
export let GramJs = {
  Api,Tl,Helpers,Password,Utils,Version,
  TelegramClient,Uploads,MessageParse
}