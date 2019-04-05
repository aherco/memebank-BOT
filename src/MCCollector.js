import Discord from 'discord.js';

export default class MCCollector extends Discord.Collector {
  constructor(client, filter, options = {}) {
	  super(client, filter, options);
  }

  handle(channel) {
    if (channel.type != 'text') { return null; }
    const mc = new Discord.MessageCollector(channel, (message) => { return true; });
    return { key: mc.channel.id, value: mc };
  } 
}
