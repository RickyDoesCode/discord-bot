const fetch = require('node-fetch');

const random = (args, prefix) => {
	if (!args.length)
		return {
			valid: false,
			result: `Incorrect format!\n1. ${prefix}random [range]\n2. ${prefix}random [start] [range]`,
		};
	if (args.length > 2)
		return {
			valid: false,
			result: `❌  Maximum inputs exceeded by: ${args.length - 2}  ❌`,
		};
	if (args[0] > args[1])
		return { valid: false, result: '❌  Your number is out of range  ❌' };
	let start, finish;
	if (args.length == 1) [start, finish] = [1, args[0]];
	else [start, finish] = args;
	if (!isNaN(Number(start)) && !isNaN(Number(finish))) {
		let number = Math.floor(Math.random() * parseInt(finish));
		if (number < start) number += Number(parseInt(start));
		return {
			valid: true,
			result: `Your lucky number is....\n🎉  ${number}  🎉`,
		};
	} else {
		return {
			valid: false,
			result: `Incorrect format!\n1. ${prefix}random [range]\n2. ${prefix}random [start] [range]`,
		};
	}
};

const getRules = (prefix) => {
	return [
		`${prefix}ping :arrow_right: Request Response Speed`,
		`${prefix}random :arrow_right: Random Number Generator`,
		`${prefix}joke :arrow_right: Random Joke Generator`,
		`${prefix}setprefix :arrow_right: New Prefix Setter`,
		`${prefix}prefix :arrow_right: Display Current Prefix`,
		`${prefix}me :arrow_right: Display Profile Details`,
	];
};

const getJokes = (type, prefix) => {
	const available = ['general', 'programming', 'knock-knock'];
	if (!type || !available.includes(type))
		return {
			valid: false,
			title: 'ERROR!',
			body: `Please follow this syntax:\n${prefix}joke type\nTypes:\n - general\n - programming\n - knock-knock\n`,
		};
	return fetch(`https://official-joke-api.appspot.com/jokes/${type}/random`)
		.then((res) => res.json())
		.then((data) => data[0])
		.then(({ setup, punchline }) => {
			return {
				valid: true,
				title: setup,
				body: punchline,
			};
		})
		.catch(() => {
			return {
				valid: false,
				title: 'OOPS!',
				body: '❌  Failed to get joke..  ❌',
			};
		});
};

module.exports = { random, getRules, getJokes };
