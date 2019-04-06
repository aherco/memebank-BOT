import Discord from 'discord.js';

export default class MCCollector extends Discord.Collector {
  constructor(client, filter, options = {}) {
    super(client, filter, options);

    setInterval(() => { 
    	let batch = new Discord.Collection();
        this.collected.tap((mc) => { 
	  if (mc.collected.size != 0) {
	    batch = batch.concat(mc.collected);
	    mc.collected = new Discord.Collection();
	  }
	});

	if (batch.size != 0) {
	  // send the batch to the api here
	  console.log(batch);
	}
      }, 5000);
  }

  handle(channel) {
    const mc = new Discord.MessageCollector(channel, (message) => { return message.type === 'DEFAULT'; });
    return { key: mc.channel.id, value: mc };
  } 
}
