const config = require('../../config.js');
const token = config.token;
const client_id = config.client_id;
const test_guild_id = config.test_guild_id;

const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '9' }).setToken(token);

module.exports = {
	name: 'clearslashcmd',
	run(message, args) {
		// ** Delete slash command ** //
		// for guild-based commands
		rest.put(Routes.applicationGuildCommands(client_id, test_guild_id), {
			body: [],
		})
			.then(() => {
				const msg = 'Successfully deleted all guild commands.';
				console.log(msg);
				message.reply(msg);
			})
			.catch(console.error);

		// for global commands
		// rest.put(Routes.applicationCommands(client_id), { body: [] })
		// 	.then(() => {
        //         const msg = 'Successfully deleted all application commands.';
		// 		console.log(msg);
        //         message.reply(msg);
		// 	})
		// 	.catch(console.error);
	},
};
