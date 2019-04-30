import request from 'superagent';
import Item from './Item.js';

// accepted response types from http head requests
const acceptedUrlTypes = ['image/jpeg', 'image/png', 'image/gif'];

const types = {
  img: 'img',
  ifr: 'ifr',
};

export const parseContent = (message, mc) => {
  const content = message.content.split(/\n| /);
  for (const url in content) {
    if (content[url].startsWith('https://gfycat.com/')) {
      acceptGfycat(content[url], message, mc);
    } else {
      acceptImg(content[url], message, mc);    
    }
  }
};

export const parseAttachments = (message, mc) => {
  message.attachments.tap((attachment) => {
    acceptImg(attachment.url, message, mc); 
  });
};

const acceptImg = (url, message, mc) => {
  return request.head(url)
    .then((res) => {
      if (acceptedUrlTypes.includes(res.type)) {
        mc.collected.set(
          url + message.id,
          new Item(message, url, types.img),
        );
      }
    })
    .catch((err) => { /* catch the error to keep node from complaining then do nothing */ })
  ;
};

const acceptGfycat = (url, message, mc) => {
  const endIndex = url.includes('-') ? url.indexOf('-') : url.length;
  const  ifr = `https://gfycat.com/ifr/${url.substring(url.lastIndexOf('/') + 1, endIndex)}?autoplay=0&hd=1`;

  return request.head(ifr)
    .then((res) => {
      mc.collected.set(
        ifr + message.id,
        new Item(message, ifr, types.ifr),
      );
    })
    .catch((err) => { /* catch the error to keep node from complaining then do nothing */ })
  ;
};


