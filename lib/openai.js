'use strict';
const fmlog = require('@waynechang65/fml-consolelog').log;
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const ERROR_MSG_UNSUPPORT_MODAL = 'GPT模式錯誤！';

async function _gpt3Response(currentMsg) {
	const ask = currentMsg.content.slice(3);
	console.log(ask);
	try {
		await currentMsg.channel.sendTyping();
		const response = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: ask,
			temperature: 0.3,
			max_tokens: 2000,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 0.0,
		});
		return response.data.choices[0].text;
	} catch (error) {
		console.log(`ERR: ${error}`);
	}
}

// (async () => {
//     console.log(await _gpt3Response('台灣現在天氣如何？'));
// })();

async function _gpt35Response(currentMsg) {
	let conversationLog = [
		{ role: 'system', content: '你是一個機器人，請用繁體中文進行回答。' },
	];

	try {
		await currentMsg.channel.sendTyping();

		let prevMessages = await currentMsg.channel.messages.fetch({
			limit: 10,
		});
		prevMessages.reverse();
		//console.log(prevMessages);

		prevMessages.forEach((msg) => {
			if (
				msg.content.startsWith('ai ') &&
				msg.author.id === currentMsg.author.id
			) {
				conversationLog.push({
					role: 'user',
					content: msg.content.slice(3),
				});
			}
		});

		console.log(conversationLog);

		const response = await openai
			.createChatCompletion({
				model: 'gpt-3.5-turbo',
				messages: conversationLog,
				// max_tokens: 256, // limit token usage
			})
			.catch((error) => {
				console.log(`OPENAI ERR: ${error}`);
			});

		console.log(response.data.choices[0]);
		return response.data.choices[0].message;
	} catch (error) {
		console.log(`ERR: ${error}`);
	}
}

async function _gpt35ResponseSimple(currentMsg) {
	let conversationLog = [
		{ role: 'user', content: currentMsg.content.slice(4) },
	];

	try {
		await currentMsg.channel.sendTyping();

		console.log(conversationLog);

		const response = await openai
			.createChatCompletion({
				model: 'gpt-3.5-turbo',
				messages: conversationLog,
				// max_tokens: 256, // limit token usage
			})
			.catch((error) => {
				console.log(`OPENAI ERR: ${error}`);
			});

		console.log(response.data.choices[0]);
		return response.data.choices[0].message;
	} catch (error) {
		console.log(`ERR: ${error}`);
	}
}

async function _response(message, modal) {
	switch (modal) {
		case 'gpt3':
			return _gpt3Response(message);
		case 'gpt35':
			return _gpt35Response(message);
		case 'gpt35s':
			return _gpt35ResponseSimple(message);
		default:
			fmlog('error_msg', ['openai', ERROR_MSG_UNSUPPORT_MODAL, modal]);
			break;
	}
}

//////////////  Module Exports //////////////////
module.exports = {
	response: _response,
};
