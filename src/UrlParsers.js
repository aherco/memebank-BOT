import request from 'superagent';
import Item from './Item.js';

export const parseContent = (message, mc) => {
  const content = message.content.split(/\n| /);
  for (const url in content) {
    const currentUrl = content[url];
    request.head(currentUrl)
      .then((res) => {
        if (mc.acceptedUrlTypes.includes(res.type)) {
          mc.collected.set(
            currentUrl + message.id,
            new Item(message.guild.id, message.channel.id, message.id, currentUrl)
          );
        }
      })
      .catch((err) => { /* catch the error to keep node from complaining then do nothing */ })
    ;
  }
}

export const parseAttachments = (message, mc) => {
  message.attachments.tap((attachment) => {
    const currentUrl = attachment.url;
      request.head(currentUrl)
        .then((res) => {
          if (mc.acceptedUrlTypes.includes(res.type)) {
            mc.collected.set(
              currentUrl + message.id,
              new Item(message.guild.id, message.channel.id, message.id, currentUrl)
            );
          }
        })
        .catch((err) => { /* catch the error to keep node from complaining then do nothing */ })
      ;
  });
}
