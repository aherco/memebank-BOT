import Discord from 'discord.js';
import BatchMessageCollector from './BatchMessageCollector.js';
import DeletionCollector from './DeletionCollector.js';

const bot = new Discord.Client();
const bmc = new BatchMessageCollector(bot, () => { return true; });
const dc = new DeletionCollector(bot, () => { return true; });

const deleteMessage = (message) => { dc.emit('deleteMessage', message); };
const addChannel = (channel) => { bmc.emit('addChannel', channel); };
const deleteChannel = (channel) => {
  // unhook the interval that updates the bmc batch, then delete it from the bmc
  if (bmc.collected.has(channel.id)) {
    bmc.collected.get(channel.id).stop();
    bmc.collected.delete(channel.id);
  }
};

dc.on('deleteMessage', dc.listener);
bmc.on('addChannel', bmc.listener);

bot.on('ready', () => { bot.channels.tap(addChannel); });
bot.on('error', console.error);

bot.on('guildCreate', (guild) => { guild.channels.tap(addChannel); });
bot.on('guildDelete', (guild) => { guild.channels.tap(deleteChannel); });

bot.on('channelCreate', addChannel);
bot.on('channelDelete', deleteChannel);

bot.on('messageDelete', deleteMessage);
bot.on('message', (message) => {
  if (message.mentions.users.has(bot.user.id) && bmc.collected.has(message.channel.id)) {

    const url = `http://www.memebank.me/${message.channel.guild.name.replace(/ /g, '-')}/${message.channel.name}/${message.channel.id}`;
    const response = new Discord.RichEmbed()
      .setTitle(`View #${message.channel.name}'s memebank here!`)
      .setDescription(`This message will self destruct in 10 seconds.`)
      .setTimestamp()
      .setThumbnail('https://cdn.discordapp.com/attachments/561521713901338635/566031952684253194/unknown.png')
      .setURL(url)
      .setColor(0x1f912f)

    message.delete().catch(console.error);
    message.channel.send(response).then((msg) => { msg.delete(10000); }).catch(console.error);
  }
});

bot.login(process.env.TOKEN);
