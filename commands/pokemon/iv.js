'use strict';
const pokeiv = require('@waynechang65/pokeiv');
const n = pokeiv.NATURE;
const fmlog = require('@waynechang65/fml-consolelog').log;

pokeiv.setLanguage('tw');

module.exports = {
	name: 'iv,',
	async run(message, args) {
		//message.reply('Check iv!');
		let pokeNum;
		let aryMsg;
		try {
			aryMsg = message.content.trim().split(',');
			for (let i = 0; i < aryMsg.length; i++) aryMsg[i] = aryMsg[i].trim();
			pokeNum = parseInt(aryMsg[1].split('n')[1].trim());
		} catch (error) {
			fmlog('error_msg', ['iv,', '查詢語法錯誤！(編號前面要有n)', error.message]);
			return message.reply('**查詢語法錯誤！(編號前面要有n)**，請重新輸入。格式如下：\n' + 
			'iv, n寶可夢伽勒爾編號 等級 HP 攻 防 特攻 特防 速度，另外用+及-來表示性格加成。 \n' + 
			'例如： iv, n390, 100, 277, -167, 142, +222, 262, 152\n' + '**注意：努力值只能為0**');
		}
		let level = parseInt(aryMsg[2]);
		let nature = [];
		try {
			for (let i = 3; i < 3 + 6; i++) {
				if (aryMsg[i].includes('+')) {
					nature.push(n.POS);
					aryMsg[i] = aryMsg[i].split('+')[1];
				} else if (aryMsg[i].includes('-')) {
					nature.push(n.NEG);
					aryMsg[i] = aryMsg[i].split('-')[1];
				} else nature.push(n.normal);
			}
	
			let idx_unreasonable_nature = 0;
			for (let i = 0; i < 6; i++) {
				if (nature[i] === n.POS) idx_unreasonable_nature++;
				if (nature[i] === n.NEG) idx_unreasonable_nature--;
			}
			if (idx_unreasonable_nature){
				throw {'code': '301', 'msg': '性格加成不合理'};
			}
	
			let stats = [parseInt(aryMsg[3]), parseInt(aryMsg[4]), parseInt(aryMsg[5]),
				parseInt(aryMsg[6]), parseInt(aryMsg[7]), parseInt(aryMsg[8])
			];
			let evs = [0, 0, 0, 0, 0, 0]; // Default: evs all 0
	
			let ivs = await pokeiv.getIVs_galar(pokeNum, level, stats, evs, nature);
	
			let outText = await pokeiv.textOut_galar(pokeNum, ivs);
	
			fmlog('command_msg',
				[String(message.author.username), pokeiv.getPokeName_galar(pokeNum),
				message.content, String(ivs), '', '']);
	
			return message.reply(outText);
		} catch (error) {
			let err_msg = '**' + error.msg + '**' + '，格式如下：\n' + 
				'iv, n寶可夢伽勒爾編號 等級 HP 攻 防 特攻 特防 速度，另外用+及-來表示性格加成。 \n' + 
				'例如： iv, n390, 100, 277, -167, 142, +222, 262, 152\n' + '**注意：努力值只能為0**';
			if(error.code === undefined || error.msg === undefined) {
				err_msg = '**查詢語法錯誤！(資料不全)**，請重新輸入。格式如下：\n' + 
				'iv, n寶可夢伽勒爾編號 等級 HP 攻 防 特攻 特防 速度，另外用+及-來表示性格加成。 \n' + 
				'例如： iv, n390, 100, 277, -167, 142, +222, 262, 152\n' + '**注意：努力值只能為0**';
			}
	
			fmlog('error_msg', ['iv,', 'ErrorCode:' + error.code, error.msg]);
			return message.reply(err_msg);
		}
	},
};
