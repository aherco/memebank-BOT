import Discord from 'discord.js';
import MCCollector from './MCCollector.js';

const bot = new Discord.Client();
const mcs = new MCCollector(bot, (channel, collection) => { return channel.type === 'text'; });

mcs.on('add', mcs.listener);
bot.on('ready', () => { bot.channels.tap((channel) => { mcs.emit('add', channel); }); });

bot.on('error', console.error);

bot.login(process.env.TOKEN);
