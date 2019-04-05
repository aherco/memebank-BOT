import Discord from 'discord.js';

export default class MCCollector extends Discord.Collector {
  handle(channel) {
    console.log(channel);
    return new Discord.MessageCollector(channel);
  } 
}
