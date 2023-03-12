module.exports = {
	id: 'sample',

	async run(interaction) {
		await interaction.reply({
			content: 'This was a reply from modal handler!',
		});
		return;
	},
};
