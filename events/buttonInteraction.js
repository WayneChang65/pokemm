const { InteractionType, ComponentType } = require('discord-api-types/v10');

module.exports = {
	name: 'interactionCreate',

	async run(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a button interaction (to prevent weird bugs)

		if (!interaction.isButton()) return;

		const command = client.buttonCommands.get(interaction.customId);

		// If the interaction is not a command in cache, return error message.
		// You can modify the error message at ./messages/defaultButtonError.js file!

		if (!command) {
			await require('../messages/defaultButtonError').run(
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
				content: 'There was an issue while executing that button!',
				ephemeral: true,
			});
			return;
		}
	},
};
