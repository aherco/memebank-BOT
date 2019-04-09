import Discord from 'discord.js';
import BatchMessageCollector from './BatchMessageCollector.js';

const bot = new Discord.Client();
const bmcs = new BatchMessageCollector(bot, (channel, collection) => { return channel.type === 'text'; });

bmcs.on('addChannel', bmcs.listener);
bot.on('ready', () => { bot.channels.tap((channel) => { bmcs.emit('addChannel', channel); }); });
bot.on('error', console.error);

bot.login(process.env.TOKEN);
