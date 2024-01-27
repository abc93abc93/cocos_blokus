// export default {
//     /** 翻轉地板 */
//     breakStair: 'breakStair',
//     /** 彈跳階梯 */
//     jumpStair: 'jumpStair',
//     /** 天花板陷阱 */
//     topTrap: 'topTrap',
//     /** 死掉 */
//     die: 'die',

// }

const audioList = {
	/** 翻轉按鈕 */
	"button-vertical": "button-vertical",
	/** pass按鈕 */
	"button-giveup": "button-giveup",
	/** 天花板陷阱 */
	topTrap: "topTrap",
	/** 死掉 */
	die: "die",
	/** 一般階梯 */
	normalStair: "normalStair",
	/** 陷阱階梯 */
	trapStair: "trapStair",
	/** 左右階梯 */
	moveStair: "moveStair",
	/** 大廳音樂 */
	gameLobby: "gameLobby",
	/** 按鈕音效 */
	button: "button",
	/** 遊戲音樂 */
	gameDefault: "gameDefault",
};

export default audioList;
export type AudioList = typeof audioList;
