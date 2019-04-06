import Discord from 'discord.js';

export default class MessageCollector extends Discord.MessageCollector {
  constructor(updateBatch, channel, filter, options = {}) {
    super(channel, filter, options);
    setInterval(() => { updateBatch(this); }, 1000);
  }
}
