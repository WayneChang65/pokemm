module.exports = {
	name: 'ping',
	run(message, args) {
		message.channel.send({ content: 'Pong.' });
		message.reply(
			`Latency is ${
				Date.now() - message.createdTimestamp
			}ms. API Latency is ${Math.round(message.client.ws.ping)}ms`
		);		
	},
};
