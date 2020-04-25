const { ...otherFunctions } = require('./other');
const { ...gameFunctions } = require('./game');

module.exports = {
	...otherFunctions,
	...gameFunctions,
};
