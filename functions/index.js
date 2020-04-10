const random = (args) => {
	if (!args.length) return { valid: false, result: 'Range not specified' };
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
	let number = Math.floor(Math.random() * parseInt(finish));
	if (number < start) number += Number(parseInt(start));
	return { valid: true, result: `Your lucky number is....\n🎉  ${number}  🎉` };
};

const getRules = (prefix) => {
	return [
		`${prefix}ping :arrow_right: Request speed of server`,
		`${prefix}random :arrow_right: Random Number Generator`,
	];
};

module.exports = { random, getRules };
