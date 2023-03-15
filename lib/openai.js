'use strict';
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function _generateResponse(text) {
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
//     console.log(await _generateResponse('台灣現在天氣如何？'));
// })();

//////////////  Module Exports //////////////////
module.exports = {
    response: _generateResponse
};