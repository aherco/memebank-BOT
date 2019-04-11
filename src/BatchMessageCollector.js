import Discord from 'discord.js';
import request from 'superagent';

import MessageCollector from './MessageCollector.js';

export default class BatchMessageCollector extends Discord.Collector {
  constructor(client, filter, options = {}) {
    super(client, filter, options);

    this.batch = new Discord.Collection();
    this.updateBatch = this.updateBatch.bind(this);

    setInterval(() => {
    	if (this.batch.size > 0) {

    	  console.log('Batch size: ', this.batch.size);
    	  console.log([...this.batch.values()]);

        request
          .post('https://1t7lfirpvc.execute-api.us-east-1.amazonaws.com/dev/items')
          .set('x-api-key', process.env.API_KEY)
          .send({ batch: [...this.batch.values()] })
          .then((res) => { /* does not add items to db unless .then() is called */ })
          .catch((err) => { /* kinda same with this one, i will look into it */ })
    	  ;

  	    this.batch = new Discord.Collection();
      }
    }, 5000);
  }

  updateBatch(mc) {
    if (mc.collected.size > 0) {
      this.batch = this.batch.concat(mc.collected);
      mc.collected = new Discord.Collection();
    }
  }

  handle(channel) {
    if (channel.type !== 'text') return null;
    const mc = new MessageCollector(this.updateBatch, channel);
    return { key: mc.channel.id, value: mc };
  }
}
