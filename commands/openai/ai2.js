'use strict';
const fmlog = require('@waynechang65/fml-consolelog').log;
const openai = require('../../lib/openai.js');

const ERROR_MSG_FORMAT_TITLE = '指令格式錯誤。';
const ERROR_MSG_DESCRIPT = '\n格式為：ai <想問的問題> \n例如：ai 妳叫什麼名字？';
const ERROR_MSG_FORMAT = ERROR_MSG_FORMAT_TITLE + ERROR_MSG_DESCRIPT;

module.exports = {
	name: 'ai2',
	async run(message, args) {
        const ask = message.content.slice(3);
        if (!ask) {
            fmlog('error_msg', ['ai', ERROR_MSG_FORMAT_TITLE, message.content]);
            message.reply(ERROR_MSG_FORMAT);
            return;
        }
        const resp = await openai.response(ask, message, 'gpt35');
        fmlog('sys_msg', [String(message.author.username) + '-' + ask, resp]);
        message.reply(resp);
	},
};
