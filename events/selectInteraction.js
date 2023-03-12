module.exports = {
	name: 'interactionCreate',
	async run(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a select menu interaction (to prevent weird bugs)

		if (!interaction.isAnySelectMenu()) return;

		const command = client.selectCommands.get(interaction.customId);

		// If the interaction is not a command in cache, return error message.
		// You can modify the error message at ./messages/defaultSelectError.js file!

		if (!command) {
			await require('../messages/defaultSelectError').run(
				interaction
			);
			return;
		}

		// A try to run the interaction.

		try {
			await command.run(interaction);
			return;
		} catch (err) {
			console.error(err);
			await interaction.reply({
				content:
					'There was an issue while executing that select menu option!',
				ephemeral: true,
			});
			return;
		}
	},
};
