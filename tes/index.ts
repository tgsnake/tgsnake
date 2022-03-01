// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

//import {Snake,GramJs,Composer,Updates} from "../src"
import {Snake} from "../src/Client/Snake"
interface MyContext {
  hello?:string
}
const bot = new Snake()
bot.cmd("start",(ctx)=>{
  console.log(ctx)
})
bot.run()
/*
interface Hello {
  halo?:string
}
type Combine<T,U> = T & Partial<U>
class HelloClass<T = {}> {
  hai?:string
  constructor () {}
}
let context = {}
let b:Combine<HelloClass<any>,Hello> = new HelloClass()
Object.assign(b,context)
console.log(String(b.halo))*/