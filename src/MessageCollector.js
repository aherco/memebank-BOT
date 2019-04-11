import Discord from 'discord.js';
import request from 'superagent';

import Item from './Item.js';

export default class MessageCollector extends Discord.MessageCollector {
  constructor(updateBatch, channel, filter, options = {}) {
    super(channel, filter, options);

    // accepted response types from http head requests
    this.acceptedUrlTypes = ['image/jpeg', 'image/png', 'image/gif'];

    this.interval = setInterval(() => { updateBatch(this); }, 1000);
  }

  cleanup() {
    clearInterval(this.interval);
  }

  urlParser(message) {

    // farm urls from the content of the message
    const content = message.content.split(" ");
    for (const url in content) {
      const currentUrl = content[url];
      request.head(currentUrl)
        .then((res) => {
          if (this.acceptedUrlTypes.includes(res.type)) {
            this.collected.set(
              currentUrl + message.id,
              new Item(message.guild.id, message.channel.id, currentUrl)
            );
          }
        })
        .catch((err) => { /* catch the error to keep node from complaining then do nothing */ })
      ;
    }

    // farm urls from the attachments of the message
    if (message.attachments.size > 0) {
      message.attachments.tap((attachment) => {
        const currentUrl = attachment.url;
        request.head(currentUrl)
          .then((res) => {
            if (this.acceptedUrlTypes.includes(res.type)) {
              this.collected.set(
                currentUrl + message.id,
                new Item(message.guild.id, message.channel.id, currentUrl)
              );
            }
          })
          .catch((err) => { /* catch the error to keep node from complaining then do nothing */ })
        ;
      });
    }
  }

  // override the inherited handler to run the urlParser on each message
  handle(message) {
    if (message.channel.id !== this.channel.id) return null;
    this.urlParser(message);
    return null;
  }
}
