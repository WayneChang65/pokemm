const config = require('./config.js');
const fs = require('fs');
const {
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
} = require('discord.js');
// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');

const token = config.token;
// const client_id = config.client_id;
// const test_guild_id = config.test_guild_id; // (Relase的時候用全域模式，測試要用test guild模式)

const client = new Client({
	// Please add all intents you need, more detailed information @ https://ziad87.net/intents/
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
});

/**********************************************************************/
// Below we will be making an event handler!

const eventFiles = fs
	.readdirSync('./events')
	.filter((file) => file.endsWith('.js'));

// Loop through all files and run the event when it is actually emmited.
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.run(...args, client));
	} else {
		client.on(
			event.name,
			async (...args) => await event.run(...args, client)
		);
	}
}

/**********************************************************************/
// Define Collection of Commands, Slash Commands and cooldowns

client.commands = new Collection();
client.slashCommands = new Collection();
client.buttonCommands = new Collection();
client.selectCommands = new Collection();
client.contextCommands = new Collection();
client.modalCommands = new Collection();
client.cooldowns = new Collection();
client.autocompleteInteractions = new Collection();
client.triggers = new Collection();

/**********************************************************************/
// Registration of Message-Based Legacy Commands.

const commandFolders = fs.readdirSync('./commands');

// Loop through all files and store commands in commands collection.

for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

/**********************************************************************/
// Registration of Slash-Command Interactions.

const slashCommands = fs.readdirSync('./interactions/slash');

// Loop through all files and store slash-commands in slashCommands collection.

for (const module of slashCommands) {
	const commandFiles = fs
		.readdirSync(`./interactions/slash/${module}`)
		.filter((file) => file.endsWith('.js'));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/slash/${module}/${commandFile}`);
		client.slashCommands.set(command.data.name, command);
	}
}

/**********************************************************************/
// Registration of Autocomplete Interactions.

const autocompleteInteractions = fs.readdirSync('./interactions/autocomplete');

// Loop through all files and store autocomplete interactions in autocompleteInteractions collection.

for (const module of autocompleteInteractions) {
	const files = fs
		.readdirSync(`./interactions/autocomplete/${module}`)
		.filter((file) => file.endsWith('.js'));

	for (const interactionFile of files) {
		const interaction = require(`./interactions/autocomplete/${module}/${interactionFile}`);
		client.autocompleteInteractions.set(interaction.name, interaction);
	}
}

/**********************************************************************/
// Registration of Context-Menu Interactions

const contextMenus = fs.readdirSync('./interactions/context-menus');

// Loop through all files and store context-menus in contextMenus collection.

for (const folder of contextMenus) {
	const files = fs
		.readdirSync(`./interactions/context-menus/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of files) {
		const menu = require(`./interactions/context-menus/${folder}/${file}`);
		const keyName = `${folder.toUpperCase()} ${menu.data.name}`;
		client.contextCommands.set(keyName, menu);
	}
}

/**********************************************************************/
// Registration of Button-Command Interactions.

const buttonCommands = fs.readdirSync('./interactions/buttons');

// Loop through all files and store button-commands in buttonCommands collection.

for (const module of buttonCommands) {
	const commandFiles = fs
		.readdirSync(`./interactions/buttons/${module}`)
		.filter((file) => file.endsWith('.js'));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/buttons/${module}/${commandFile}`);
		client.buttonCommands.set(command.id, command);
	}
}

/**********************************************************************/
// Registration of Modal-Command Interactions.

const modalCommands = fs.readdirSync('./interactions/modals');

// Loop through all files and store modal-commands in modalCommands collection.

for (const module of modalCommands) {
	const commandFiles = fs
		.readdirSync(`./interactions/modals/${module}`)
		.filter((file) => file.endsWith('.js'));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/modals/${module}/${commandFile}`);
		client.modalCommands.set(command.id, command);
	}
}

/**********************************************************************/
// Registration of select-menus Interactions

const selectMenus = fs.readdirSync('./interactions/select-menus');

// Loop through all files and store select-menus in selectMenus collection.

for (const module of selectMenus) {
	const commandFiles = fs
		.readdirSync(`./interactions/select-menus/${module}`)
		.filter((file) => file.endsWith('.js'));
	for (const commandFile of commandFiles) {
		const command = require(`./interactions/select-menus/${module}/${commandFile}`);
		client.selectCommands.set(command.id, command);
	}
}

/**********************************************************************/
// Registration of Slash-Commands in Discord API

// const rest = new REST({ version: '9' }).setToken(token);

// const commandJsonData = [
// 	...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()),
// 	...Array.from(client.contextCommands.values()).map((c) => c.data),
// ];

/* 要更新 slash commands 再打開下面程式 */
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		//await rest.put(
		//* 測試的時候打開下面這行程式，動態在特定的guild進行更新slash commands.
		//* 測試開發完成後，這行mark掉，把下面那一行打開，執行一次更新所有bot所在的guild，
		//* 然後就可以把下面第二行程式給mark掉，兩行都被mark掉也就代表不用更新slash commands.
		//* 也就是正常bot運作了。

		// Routes.applicationGuildCommands(client_id, test_guild_id),
		// Routes.applicationCommands(client_id),

		//	{ body: commandJsonData }
		//);
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

/**********************************************************************/
// Registration of Message Based Chat Triggers

const triggerFolders = fs.readdirSync('./triggers');

// Loop through all files and store triggers in triggers collection.

for (const folder of triggerFolders) {
	const triggerFiles = fs
		.readdirSync(`./triggers/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of triggerFiles) {
		const trigger = require(`./triggers/${folder}/${file}`);
		client.triggers.set(trigger.name, trigger);
	}
}

// Handle nodejs events
process.on('unhandledRejection', (error) => {
	console.log(error);
});
process.on('uncaughtException', (error) => {
	console.log(error);
});
process.on('uncaughtExceptionMonitor', (error) => {
	console.log(error);
});
//

// Login into your client application with bot's token.

client.login(token);
