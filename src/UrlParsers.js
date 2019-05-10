import request from 'superagent';
import Item from './Item.js';

// accepted response types from http head requests
const imgTypes = ['image/jpeg', 'image/png', 'image/gif'];
const vidTypes = ['video/webm', 'video/mp4'];

const types = {
  img: 'img',
  ifr: 'ifr',
  vid: 'vid',
};

export const parseContent = (message, mc) => {
  const content = message.content.split(/\n| /);
  for (const url in content) {
    if (content[url].startsWith('https://gfycat.com/')) {
      validateGfycat(content[url], message, mc);
    } else {
      validateUrl(content[url], message, mc);    
    }
  }
};

export const parseAttachments = (message, mc) => {
  message.attachments.tap((attachment) => {
   validateUrl(attachment.url, message, mc); 
  });
};

const acceptUrl = (url, message, mc, type) => {
  mc.collected.set(
    url + message.id,
    new Item(message, url, type),
  );
};

const validateUrl = (url, message, mc) => {
  request.head(url).then((res) => {
    let type;
    if (imgTypes.includes(res.type)) {
      type = types.img;
    } else if (vidTypes.includes(res.type)) {
      type = types.vid;
    }
    if (type) acceptUrl(url, message,mc, type);
  }).catch((err) => {});
};

const validateGfycat = (url, message, mc) => {
  const endIndex = url.includes('-') ? url.indexOf('-') : url.length;
  const  ifr = `https://gfycat.com/ifr/${url.substring(url.lastIndexOf('/') + 1, endIndex)}`;

  request.head(ifr).then((res) => {
    acceptUrl(ifr, message, mc, types.ifr);    
  }).catch((err) => {});

};


