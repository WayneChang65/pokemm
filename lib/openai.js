'use strict';
const fmlog = require('@waynechang65/fml-consolelog').log;
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const ERROR_MSG_UNSUPPORT_MODAL = 'GPT模式錯誤！';

async function _gpt3Response(text, message) {
	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: text,
		temperature: 0.3,
		max_tokens: 2000,
		top_p: 1.0,
		frequency_penalty: 0.0,
		presence_penalty: 0.0,
	});
	return response.data.choices[0].text;
}

// (async () => {
//     console.log(await _gpt3Response('台灣現在天氣如何？'));
// })();

async function _gpt35Response(text, message) {
	let conversationLog = [
		{ role: 'system', content: '你是一個會說繁體中文的機器人.' },
	];

	try {
		await message.channel.sendTyping();

		let prevMessages = await message.channel.messages.fetch({ limit: 5 });
		prevMessages.reverse();
		console.log(prevMessages);

		prevMessages.forEach((msg) => {
			// if (message.content.startsWith('ai')) return;
			// if (message.content.startsWith('iv,')) return;
			// // ... 還有一些指令沒有列舉出來。這個將來要想一個機制處理。
			// if (msg.author.id !== client.user.id && message.author.bot) return;
			// if (msg.author.id !== message.author.id) return;
            console.log(msg.content, msg.author.id, msg.client.user.id, message.author.id, message.client.user.id);
			if (
				message.content.startsWith('ai2 ') &&
				msg.author.id !== message.client.user.id
			) {
				conversationLog.push({
					role: 'user',
					content: message.content.slice(3),
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

async function _gpt35ResponseSimple(text, message) {
	let conversationLog = [
		{ role: 'user', content: text},
	];

	try {
		await message.channel.sendTyping();

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

async function _response(text, message, modal) {
	switch (modal) {
		case 'gpt3':
			return _gpt3Response(text, message);
		case 'gpt35':
			//return _gpt35Response(text, message);
            return _gpt35ResponseSimple(text, message);
		default:
			fmlog('error_msg', ['openai', ERROR_MSG_UNSUPPORT_MODAL, modal]);
			break;
	}
}

//////////////  Module Exports //////////////////
module.exports = {
	response: _response,
};
