import Discord from 'discord.js';
import BatchMessageCollector from './BatchMessageCollector.js';

const bot = new Discord.Client();
const bmc = new BatchMessageCollector(bot, () => { return true; });

const addChannel = (channel) => { bmc.emit('addChannel', channel); };
const deleteChannel = (channel) => {
  // Unhook the interval that updates the bmc batch, then delete it from the bmc
  if (bmc.collected.has(channel.id)) {
    bmc.collected.get(channel.id).stop();
    bmc.collected.delete(channel.id);
  }
};
bmc.on('addChannel', bmc.listener);

bot.on('ready', () => { bot.channels.tap(addChannel); });
bot.on('error', console.error);

bot.on('guildCreate', (guild) => { guild.channels.tap(addChannel); });
bot.on('guildDelete', (guild) => { guild.channels.tap(deleteChannel); });

bot.on('channelCreate', addChannel);
bot.on('channelDelete', deleteChannel);


bot.login(process.env.TOKEN);
