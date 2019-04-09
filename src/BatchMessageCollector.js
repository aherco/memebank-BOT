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

    	  // send the batch to the api here
    	  console.log('Batch size: ', this.batch.size);
    	  console.log([...this.batch.values()]);

        // request
    	  //   .post('https://7g8anxmwm7.execute-api.us-east-1.amazonaws.com/dev/items')
    	  //   .send({ batch: [...this.batch.values()] })
    	  // ;

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
    const mc = new MessageCollector(this.updateBatch, channel);
    return { key: mc.channel.id, value: mc };
  }
}
