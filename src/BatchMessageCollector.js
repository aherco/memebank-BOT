import Discord from 'discord.js';
import MessageCollector from './MessageCollector.js';

export default class BatchMessageCollector extends Discord.Collector {
  constructor(client, filter, options = {}) {
    super(client, filter, options);
    this.batch = new Discord.Collection();
    this.updateBatch = this.updateBatch.bind(this);

    setInterval(() => { 
	if (this.batch.size > 0) {
	  // send the batch to the api here
	  console.log(this.batch.size);
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
    const mc = new MessageCollector(this.updateBatch, channel, (message) => { return message.type === 'DEFAULT'; });
    return { key: mc.channel.id, value: mc };
  } 
}
