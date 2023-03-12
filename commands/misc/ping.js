module.exports = {
	name: 'ping',
	run(message, args) {
		message.channel.send({ content: 'Pong.' });
	},
};
