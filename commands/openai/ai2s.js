'use strict';
const fmlog = require('@waynechang65/fml-consolelog').log;
const openai = require('../../lib/openai.js');

const ERROR_MSG_FORMAT_TITLE = '指令格式錯誤。';
const ERROR_MSG_DESCRIPT = '\n格式為：ai2s <想問的問題> \n例如：ai2s 妳叫什麼名字？';
const ERROR_MSG_FORMAT = ERROR_MSG_FORMAT_TITLE + ERROR_MSG_DESCRIPT;

module.exports = {
	name: 'ai2s',
	async run(message, args) {
        const ask = message.content.slice(5);
        if (!ask) {
            fmlog('error_msg', ['ai2s', ERROR_MSG_FORMAT_TITLE, message.content]);
            message.reply(ERROR_MSG_FORMAT);
            return;
        }
        const resp = await openai.response(message, 'gpt35s');
        fmlog('sys_msg', [String(message.author.username) + '-' + ask, resp]);
        message.reply(resp);
	},
};
