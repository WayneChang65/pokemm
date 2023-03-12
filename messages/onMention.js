const prefix = process.env.POKE_PREFIX;

module.exports = {
	async run(message) {
		return message.channel.send(
			`Hi ${message.author}! My prefix is \`${prefix}\`, get help by \`${prefix}help\``
		);
	},
};
