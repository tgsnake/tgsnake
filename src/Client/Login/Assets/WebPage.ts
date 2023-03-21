// @ts-nocheck
/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
const htmlContent = document.querySelector('#content');
const alertError = document.querySelector('#alert-error');
const alertErrorMsg = document.querySelector('#alert-error-msg');
const alertSuccess = document.querySelector('#alert-success');
const alertWait = document.querySelector('#alert-wait');

(async () => {
  try {
    let initData = await f({
      method: 'init',
    });
    if (!initData.ok) {
      return (htmlContent.innerHTML =
        "Something Wrong in the Forest: Can't resolve the response from server.");
    }
    if (!initData.content.apiId) {
      await InputApiId(new BetterPromise<any>());
    }
    if (!initData.content.apiHash) {
      await InputApiHash(new BetterPromise<any>());
    }
    await f({ method: 'createClient' });
  } catch (error: any) {
    return (htmlContent.innerHTML = `Something Wrong in the Forest: ${error.message}`);
  }
})();
function SubmitApiId(promise: BetterPromise<any>): any {
  let domApiId = content.querySelector('#input-api-id');
  let nextBtn = content.querySelector('#next');
  try {
    domApiId.disabled = true;
    nextBtn.classList.toggle('hidden');
    if (domApiId.value === '' || Number.isNaN(Number(domApiId.value))) {
      throw new Error('Api Id should be as number!');
    }
    alertWait();
    let json = await f({
      method: 'setApiId',
      apiId: Number(domApiId.value),
    });
    if (!json.ok) {
      throw new Error(json.message);
    }
    promise.resolve(domApiId.value);
    return alertSuccess();
  } catch (error: any) {
    domApiId.disabled = false;
    nextBtn.classList.toggle('hidden');
    return alertError(error.message);
  }
}
function InputApiId(promise: BetterPromise<any>) {
  return inner(`<div id="input-api" class="card transition-all ease-in duration-700">
    <div class="card-body">
      <h2 class="font-bold text-xl">Input your Api Id</h2>
      <p>Fill in Api Id according to what you get on <a href="https://my.telegram.org" target="_blank">my.telegram.org</a></p>
      <div class="my-card-actions flex items-center">
        <input
          type="number"
          class="input input-bordered w-full max-w-xs mr-2"
          name="input-api-id"
          id="input-api-id"
          value=""
          placeholder="Input Your Api Id"
        />
        <button id="next" class="btn btn-success" onclick="SubmitApiId(${promise})">Next</button>
      </div>
    </div>
  </div>`);
}
function SubmitApiHash(promise: BetterPromise<any>): any {
  let domApiHash = content.querySelector('#input-api-hash');
  let nextBtn = content.querySelector('#next');
  try {
    domApiId.disabled = true;
    nextBtn.classList.toggle('hidden');
    if (domApiId.value === '') {
      throw new Error('Invalid Api Hash!');
    }
    alertWait();
    let json = await f({
      method: 'setApiHash',
      apiHash: domApiHash.value,
    });
    if (!json.ok) {
      throw new Error(json.message);
    }
    promise.resolve(domApiHash.value);
    return alertSuccess();
  } catch (error: any) {
    domApiId.disabled = false;
    nextBtn.classList.toggle('hidden');
    return alertError(error.message);
  }
}
function InputApiHash(promise: BetterPromise<any>) {
  return inner(`<div id="input-api" class="card transition-all ease-in duration-700">
    <div class="card-body">
      <h2 class="font-bold text-xl">Input your Api Hash</h2>
      <p>Fill in Api Hash according to what you get on <a href="https://my.telegram.org" target="_blank">my.telegram.org</a></p>
      <div class="my-card-actions flex items-center">
        <input
          type="text"
          class="input input-bordered w-full max-w-xs mr-2"
          name="input-api-hash"
          id="input-api-hash"
          value=""
          placeholder="Input Your Api Hash"
        />
        <button id="next" class="btn btn-success" onclick="SubmitApiHash(${promise})">Next</button>
      </div>
    </div>
  </div>`);
}

// utilities
let timeoutAlertError;
let timeoutAlertSuccess;
let timeoutAlertWait;
function callAlertSuccess() {
  if (alertSuccess.classList.contains('hidden')) {
    alertSuccess.classList.toggle('hidden');
    timeoutAlertSuccess = setTimeout(() => {
      if (!alertSuccess.classList.contains('hidden')) {
        alertSuccess.classList.toggle('hidden');
      }
    }, 10000);
  }
}
function callAlertWait() {
  if (alertWait.classList.contains('hidden')) {
    alertWait.classList.toggle('hidden');
    timeoutAlertWait = setTimeout(() => {
      if (!alertWait.classList.contains('hidden')) {
        alertWait.classList.toggle('hidden');
      }
    }, 10000);
  }
}
function callAlertError(error: any) {
  alertErrorMsg.innerText = error;
  if (alertError.classList.contains('hidden')) {
    alertError.classList.toggle('hidden');
    timeoutAlertError = setTimeout(() => {
      if (!alertError.classList.contains('hidden')) {
        alertError.classList.toggle('hidden');
      }
    }, 10000);
  }
}
alertError.addEventListener('click', (e) => {
  e.preventDefault();
  alertError.classList.toggle('hidden');
  clearTimeout(timeoutAlertError);
});
alertSuccess.addEventListener('click', (e) => {
  e.preventDefault();
  alertSuccess.classList.toggle('hidden');
  clearTimeout(timeoutAlertSuccess);
});
alertWait.addEventListener('click', (e) => {
  e.preventDefault();
  alertWait.classList.toggle('hidden');
  clearTimeout(timeoutAlertWait);
});
function inner(str: string) {
  for (let el of Object.values(htmlContent.children)) {
    htmlContent.removeChild(el);
  }
  let div = document.createElement('div');
  div.innerHTML = str;
  return content.appendChild(div);
}
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
async function f(body: any) {
  let res = await fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await res.json();
}
