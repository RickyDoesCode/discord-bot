require('dotenv').config();

const Discord = require('discord.js');
const fetch = require('node-fetch');
const { random, getRules } = require('./functions');

const bot = new Discord.Client();
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;

//status setup and console log "ready"
bot.on('ready', () => {
	console.log('Logged On!');
	bot.user.setActivity(`${prefix}help`, { type: 'LISTENING' });
});

bot.on('message', async (message) => {
	let [command, ...args] = message.content.toLowerCase().split(' ');
	let embed;
	if (command[0] != prefix) return;
	switch (command) {
		case `${prefix}ping`:
			embed = new Discord.MessageEmbed()
				.setColor('1AFF00')
				.setDescription(`🏓 | Pong! That took ${bot.ws.ping}`);
			message.channel.send({ embed: embed });
			break;
		case `${prefix}help`:
			const messages = getRules(prefix);
			embed = new Discord.MessageEmbed()
				.setTitle('HELP PAGE')
				.setColor('F0FF00')
				.setDescription(messages);
			message.channel.send({ embed: embed });
			break;
		case `${prefix}random`:
			const { valid, result } = random(args);
			if (!valid) {
				embed = new Discord.MessageEmbed()
					.setTitle('SORRY...')
					.setColor('FF0000');
			} else {
				embed = new Discord.MessageEmbed()
					.setTitle('CONGRATS!')
					.setColor('0052F4');
			}
			embed.setDescription(result);
			message.channel.send({ embed: embed });
			break;
		case `${prefix}joke`:
			embed = new Discord.MessageEmbed();
			fetch('https://sv443.net/jokeapi/v2/joke/Programming?type=twopart')
				.then((res) => res.json())
				.then(({ setup, delivery }) => {
					embed.setTitle(setup).setColor('0052F4').setDescription(delivery);
				})
				.catch(() => {
					embed
						.setTitle('OOPS!')
						.setColor('FF0000')
						.setDescription('❌  Failed to get joke..  ❌');
				})
				.finally(() => {
					message.channel.send({ embed });
				});
			break;
		default:
			embed = new Discord.MessageEmbed()
				.setTitle('OOPS')
				.setColor('FF0000')
				.setDescription('❌Sorry...The Command You Entered Does Not Exist❌');
			message.channel.send({ embed: embed });
			break;
	}
});

bot.login(token);
