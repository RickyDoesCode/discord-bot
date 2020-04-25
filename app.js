if (process.env.NODE_ENV == 'development') {
	require('dotenv').config();
}

const fs = require('fs');
const Discord = require('discord.js');
const { random, getRules, getJokes } = require('./functions');

const bot = new Discord.Client();
const token = process.env.TOKEN;

let prefix = fs.readFileSync('./assets/prefix.txt', 'utf8');
let boxFights = [];

bot.on('ready', () => {
	bot.user.setActivity(`${prefix}help`, { type: 'LISTENING' });
});

bot.on('message', async (message) => {
	let [command, ...args] = message.content.toLowerCase().split(' ');
	if (command.includes(prefix)) {
		let embed = new Discord.MessageEmbed();
		switch (command) {
			case `${prefix}ping`:
				embed
					.setColor('1AFF00')
					.setDescription(`🏓 | Pong! That took ${bot.ws.ping}`);
				break;
			case `${prefix}help`:
				const messages = getRules(prefix);
				embed
					.setTitle('HELP PAGE')
					.setColor('F0FF00')
					.setDescription(messages.join('\n'));
				break;
			case `${prefix}random`:
				var { valid, result } = random(args, prefix);
				if (!valid) {
					embed.setTitle('SORRY...').setColor('FF0000').setDescription(result);
				} else {
					embed.setTitle('CONGRATS!').setColor('0052F4');
				}
				embed.setDescription(result);
				break;
			case `${prefix}joke`:
				var { valid, title, body } = await getJokes(args[0], prefix);
				if (valid) {
					embed.setTitle(title).setColor('00FF00').setDescription(body);
				} else {
					embed.setTitle(title).setColor('FF0000').setDescription(body);
				}
				break;
			case `${prefix}setprefix`:
				if (!args[0]) {
					embed
						.setTitle('ERROR!')
						.setColor('FF0000')
						.setDescription('Please supply an argument to set the prefix to!');
				} else {
					fs.writeFileSync(
						'./assets/prefix.txt',
						args[0] == 'default' ? '_' : args[0]
					);

					prefix = args[0] == 'default' ? '_' : args[0];
					embed
						.setTitle('SUCCESS!')
						.setColor('00FF00')
						.setDescription(`Successfully set prefix to: ${prefix}`);
					bot.user.setActivity(`${prefix}help`, { type: 'LISTENING' });
				}
				break;
			case `${prefix}prefix`:
				embed.setDescription(`Current prefix: ${prefix}`);

				break;
			case `${prefix}me`:
				const { username } = message.author;
				const avatar = message.author.displayAvatarURL();
				embed.setTitle(username).setImage(avatar);
				break;
			// case `${prefix}box`:
			// 	embed
			// 		.setColor('#FF0000')
			// 		.setTitle('Chaos Boxfights')
			// 		.setThumbnail('https://media.publit.io/file/IMG_5366.jpg')
			// 		.setDescription(
			// 			'Use the reactions in this message to play boxfghts\nPlease remember to read #how-to-play before playing a match'
			// 		)
			// 		.setFooter('Developed By Ricky | twitter.com/rickydoescode');

			// 	break;
			// default:
			// 	embed
			// 		.setTitle('OOPS')
			// 		.setColor('FF0000')
			// 		.setDescription('❌Sorry...The Command You Entered Does Not Exist❌');

			// 	break;
		}
		message.channel.send({ embed: embed }).then((embedMessage) => {
			if (embedMessage.embeds[0].title == 'Chaos Boxfights') {
				embedMessage.react(bot.emojis.resolveIdentifier('699236036462641213'));
				embedMessage.react(bot.emojis.resolveIdentifier('699236035283910717'));
				boxFights.push(embedMessage.id);
			}
		});
	}
});

bot.on('messageReactionAdd', async (reaction, user) => {
	// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
	try {
		await reaction.fetch();
	} catch (error) {
		console.log('Something went wrong when fetching the message: ', error);
		// Return as `reaction.message.author` may be undefined/null
		return;
	}
	console.log(
		`${reaction.count} user(s) have given the same reaction to this message!`
	);
});

bot.login(token);
