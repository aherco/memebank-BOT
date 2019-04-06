import Discord from 'discord.js';
import MessageCollector from './MessageCollector.js';
import Item from './Item.js';

export default class BatchMessageCollector extends Discord.Collector {
  constructor(client, filter, options = {}) {
    super(client, filter, options);
    this.batch = new Discord.Collection();
    this.updateBatch = this.updateBatch.bind(this);

    setInterval(() => { 
	if (this.batch.size > 0) {
	  // send the batch to the api here
	  console.log('Batch size: ', this.batch.size);
	  console.log(this.batch);
	  this.batch = new Discord.Collection();
	}
      }, 5000);
  }

  updateBatch(mc) {
    if (mc.collected.size > 0) {

      const newBatch = mc.collected.reduce((accumulator, val, key, collection) => {
        
	for (const item in val.embeds) {
	  if (val.embeds[item].type === 'image') {
	    accumulator.set(
	      val.embeds[item].id,
              new Item(val.guild.id, val.channel.id, val.embeds[item].url),
	    );
	  }
	}

	val.attachments.tap((attachment) => {
	  if (attachment.url.endsWith('.jpg')) {
	    accumulator.set(attachment.id, new Item(val.guild.id, val.channel.id, attachment.url));
	  }	 
	});

        return accumulator;	
      }, new Discord.Collection());

      this.batch = this.batch.concat(newBatch);
      mc.collected = new Discord.Collection();
    }
  }

  handle(channel) {
    const mc = new MessageCollector(this.updateBatch, channel, (message) => { 
	    return message.type === 'DEFAULT'
	      && message.embeds.length > 0
	      || message.attachments.size > 0;
    });
    return { key: mc.channel.id, value: mc };
  } 
}
