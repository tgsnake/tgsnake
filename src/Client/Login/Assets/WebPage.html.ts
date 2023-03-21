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
const html: string = `
<!--
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
-->
<!DOCTYPE html>
<html data-theme="pastel">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>tgsnake login</title>
    <link
      href="https://cdn.jsdelivr.net/npm/daisyui@2.24.0/dist/full.css"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2/dist/tailwind.min.css"
      rel="stylesheet"
      type="text/css"
    />
  </head>
  <body>
    <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
    <div class="container mx-auto my-2 px-2 py-2 items-center justify-center">
      <div id="content"><p>Entering the forest.<p></div>
      <p class="text-center my-2 py-2">Copyright (C) tgsnake ${new Date().getFullYear()}</p>
      <!--alert section-->
      <div id="alert-wait" class="hidden toast toast-top toast-end">
        <div class="alert alert-info shadow-lg mb-2">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Please Wait!</span>
          </div>
        </div>
      </div>
      <div id="alert-error" class="hidden toast toast-top toast-end">
        <div class="alert alert-error shadow-lg mb-2">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span
              >Some error occurred: <span id="alert-error-msg" class="font-bold">null</span></span
            >
          </div>
        </div>
      </div>
      <div id="alert-success" class="hidden toast toast-top toast-end">
        <div class="alert alert-success shadow-lg mb-2">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>You have successfully login!</span>
          </div>
        </div>
      </div>
    </div>
    <script src="/Assets/WebPage.min.js" type="text/javascript" charset="utf-8"></script>
  </body>
</html>
`;
export default html;
