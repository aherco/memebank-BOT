export default class Item {
  constructor(message, content, type) {
    this.guild_id = message.guild.id;
    this.channel_id = message.channel.id;
    this.message_id = message.id;
    this.content = content;
    this.type = type;
  }
}
