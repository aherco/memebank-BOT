export default class Item {
  constructor(guild_id, channel_id, message_id, content) {
    this.guild_id = guild_id;
    this.channel_id = channel_id;
    this.message_id = message_id;
    this.content = content;
  }
}
