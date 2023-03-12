module.exports = {
	async run(interaction) {
		await interaction.reply({
			content:
				'There was an issue while fetching this select menu option!',
			ephemeral: true,
		});
		return;
	},
};
