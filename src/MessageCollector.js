import Discord from 'discord.js';

import { parseContent, parseAttachments } from './UrlParsers.js';

export default class MessageCollector extends Discord.MessageCollector {
  constructor(updateBatch, channel, filter, options = {}) {
    super(channel, filter, options);

    
    this.interval = setInterval(() => { updateBatch(this); }, 1000);
  }

  cleanup() {
    clearInterval(this.interval);
  }

  urlParser(message) {

    // farm urls from the content of the message
    parseContent(message, this); 

    // farm urls from the attachments of the message
    if (message.attachments.size > 0) {
      parseAttachments(message, this); 
    }

  }

  // override the inherited handler to run the urlParser on each message
  handle(message) {
    if (message.channel.id !== this.channel.id || message.author.bot) return null;
    console.log(message);
    this.urlParser(message);
    return null;
  }
}
