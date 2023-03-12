module.exports = {
	name: 'ready',
	once: true,
	run(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
