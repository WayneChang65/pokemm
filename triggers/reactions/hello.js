// For now, the only available property is name array. Not making the name array will result in an error.

module.exports = {
	name: ['your', 'trigger', 'words', 'in', 'array'],

	run(message, args) {
		// Put all your trigger code over here. This code will be rund when any of the element in the "name" array is found in the message content.

		// message.channel.send({
		// 	content:
		// 		'Set this trigger response from `./triggers/reactions/hello.js`',
		// });
	},
};
