const { InteractionType } = require('discord-api-types/v10');

module.exports = {
	name: 'interactionCreate',
	async run(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a modal interaction (to prevent weird bugs)

		if (!interaction.isModalSubmit()) return;

		const command = client.modalCommands.get(interaction.customId);

		// If the interaction is not a command in cache, return error message.
		// You can modify the error message at ./messages/defaultModalError.js file!

		if (!command) {
			await require('../messages/defaultModalError').run(interaction);
			return;
		}

		// A try to run the interaction.

		try {
			await command.run(interaction);
			return;
		} catch (err) {
			console.error(err);
			await interaction.reply({
				content: 'There was an issue while understanding this modal!',
				ephemeral: true,
			});
			return;
		}
	},
};
