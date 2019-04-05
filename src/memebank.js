import Discord from 'discord.js';

const bot = new Discord.Client();

bot.on('error', console.error);

bot.login(process.env.TOKEN);
