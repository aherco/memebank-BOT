import Discord from 'discord.js';
import request from 'superagent';

import Item from './Item.js';

export default class MessageCollector extends Discord.MessageCollector {
  constructor(updateBatch, channel, filter, options = {}) {
    super(channel, filter, options);

    // accepted response types from http head requests
    this.acceptedUrlTypes = ['image/jpeg', 'image/png', 'image/gif'];

    setInterval(() => { updateBatch(this); }, 1000);
  }

  urlParser(message) {

    const content = message.content.split(" ");

    for (const url in content) {
      request.head(content[url])
        .then((res) => {
          if (this.acceptedUrlTypes.includes(res.type)) {
            this.collected.set(
              content[url],
              new Item(message.guild.id, message.channel.id, content[url])
            );
          }
        })
        .catch((err) => { /* catch the error to keep node from complaining then do nothing */ })
      ;
    }

    message.attachments.tap((attachment) => {
      request.head(attachment.url)
        .then((res) => {
          if (this.acceptedUrlTypes.includes(res.type)) {
            this.collected.set(
              attachment.url,
              new Item(message.guild.id, message.channel.id, attachment.url)
            );
          }
        })
        .catch((err) => { /* catch the error to keep node from complaining then do nothing */ })
      ;
    });

  }

  // override the inherited handler to run the urlParser on each message
  handle(message) {
    if (message.channel.id !== this.channel.id) return null;
    this.urlParser(message);
    return null;
  }
}
