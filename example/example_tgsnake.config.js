/**
 * example config file. (tgsnake.config.js)
 * You don't have to create this file. You can put options in ``new Snake({options})``
*/
module.exports = {
    /**
   * Set Logger level for gramjs. Default is "none".
  */
  logger: "none",
  /**
   * An api_hash got from my.telegram.org
  */
  api_hash: "your api hash here.",
  /**
   * An api_id got from my.telegram.org
  */
  api_id: 123456,
  /**
   * String sessions. 
   * if you have the string sessions you can fill this. if not you can fill with blank string.
  */
  session: "",
  /**
   * Bot Token from botFather. If you need to login as bot this required. 
   * if you need login with user, delete this.
  */
  bot_token: "paste you bot token in here.",
  /**
   * Connection Retries for gramjs. Default is 5.
  */
  connection_retries: 5,
  /**
   * tgsnake console.log 
   * If set, tgsnake will showing the message in console like welcome to tgsnake or anything.
  */
  tgSnakeLog: true,
  /**
   * session name 
   * required to save the string session.
  */
  sessionName: "tgsnake",
  /**
   * storeSession 
   * required to save the session in storage.
  */
  storeSession: true
};