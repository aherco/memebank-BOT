import Discord from 'discord.js';
import MCCollector from './MCCollector.js';

const bot = new Discord.Client();
const mcs = new MCCollector();

mcs.on('add', (channel) => { mcs.handle(channel); });

bot.on('ready', () => {
  bot.channels.tap((channel) => {
    if (channel.type === 'text') {
      mcs.emit('add', channel);
    } 
  })
});

bot.on('error', console.error);

bot.login(process.env.TOKEN);
