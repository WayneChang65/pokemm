module.exports = {
	name: 'messageCreate',
	async run(message) {
		/**
		 * @description The Message Content of the received message seperated by spaces (' ') in an array, this excludes prefix and command/alias itself.
		 */

		const args = message.content.split(/ +/);

		// Checks if the trigger author is a bot. Comment this line if you want to reply to bots as well.

		if (message.author.bot) return;

		// Checking ALL triggers using every function and breaking out if a trigger was found.

		let triggered = false;

		message.client.triggers.every((trigger) => {
			if (triggered) return false;

			trigger.name.every(async (name) => {
				if (triggered) return false;

				// If validated, it will try to run the trigger.

				if (message.content.includes(name)) {
					try {
						trigger.run(message, args);
					} catch (error) {
						// If triggereds fail, reply back!

						console.error(error);

						message.reply({
							content:
								'there was an error trying to run that trigger!',
						});
					}

					// Set the trigger to be true & return.

					triggered = true;
					return false;
				}
			});
		});
	},
};
