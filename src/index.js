import Discord from 'discord.js';
import DBL from 'dblapi.js';
import env from 'dotenv';

import BatchMessageCollector from './BatchMessageCollector.js';
import DeletionCollector from './DeletionCollector.js';

env.config();
const bot = new Discord.Client();
const dbl = new DBL(process.env.DBL_TOKEN, bot);
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

bot.on('ready', () => { 
  console.log('memebank online!');
  bot.channels.tap(addChannel);
  setInterval(() => { dbl.postStats(bot.guilds.size, 0, 1); }, 1500000);
}); 

bot.on('error', console.error);

bot.on('guildCreate', (guild) => { guild.channels.tap(addChannel); });
bot.on('guildDelete', (guild) => { guild.channels.tap(deleteChannel); });

bot.on('channelCreate', addChannel);
bot.on('channelDelete', deleteChannel);

bot.on('messageDelete', deleteMessage);
bot.on('messageDeleteBulk', (messages) => { messages.tap(deleteMessage); });

bot.on('message', (message) => {
  if (message.mentions.users.has(bot.user.id) && bmc.collected.has(message.channel.id) && !message.author.bot) {

    const url = `${process.env.DOMAIN}/${message.channel.guild.name.replace(/ /g, '-').replace(/\?|\//g, '')}/${message.channel.name}/${message.channel.id}`;

    const response = new Discord.RichEmbed()
      .setTitle(`View #${message.channel.name}'s memebank here!`)
      .setDescription('This message will self destruct in 10 seconds.')
      .setThumbnail(process.env.THUMBNAIL)
      .setURL(url)
      .setColor(0x1f912f)
    ;

    const vote = new Discord.RichEmbed()
      .setTitle('Vote for memebank!')
      .setDescription('Please support us by voting on discortbots.org!')
      .setThumbnail(process.env.THUMBNAIL)
      .setURL(process.env.VOTE)
      .setColor(0x1f912f)
    ;

    message.delete().catch(console.error);
    message.channel.send(response).then((msg) => { 
      msg.delete(10000);
      message.channel.send(vote).then((msg) => {
        msg.delete(10000);
      }).catch(console.error);
    }).catch(console.error);
  }
});

bot.login(process.env.TOKEN);
