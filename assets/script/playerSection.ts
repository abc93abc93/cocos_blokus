import { _decorator, Component, Node, EventTouch } from "cc";
import { player } from "./player";
const { ccclass, property } = _decorator;

@ccclass("playerSection")
export class playerSection extends Component {
	start() {
		this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
	}

	clickNode(event: EventTouch) {}

	init(playerClassArr) {
		this.serPlayerData(playerClassArr);
		this.renderCurPlayer(playerClassArr);
	}

	serPlayerData(playerClassArr) {
		const allPlayerTs = this.node.getComponentsInChildren(player);
		allPlayerTs.forEach((player, index) => {
			player.id = playerClassArr[index].id;
			player.index = playerClassArr[index].index;
			player.chesses = playerClassArr[index].chesses;
			player.color = playerClassArr[index].color;
		});
	}

	renderCurPlayer(playerClassArr) {
		const allPlayerTs = this.node.getComponentsInChildren(player);
		allPlayerTs.forEach((player, index) => {
			player.setOriginColor();
			if (playerClassArr[index].turn) player.setNewColor();
		});
	}

	renderCurPlayerChoesdChess(curPlayerIndex, chosedChessIndex) {
		const allPlayerTs = this.node.getComponentsInChildren(player);
		allPlayerTs[curPlayerIndex].setChoesdChess(chosedChessIndex);
	}

	clearCurPlayerChoesdChess(curPlayerIndex) {
		const allPlayerTs = this.node.getComponentsInChildren(player);
		allPlayerTs[curPlayerIndex].clearChoesdChess();
	}

	renderCurPlayerChess(curPlayerIndex) {
		const allPlayerTs = this.node.getComponentsInChildren(player);
		allPlayerTs[curPlayerIndex].setChess();
	}

	rotateCurPlayerChoesdChess(curPlayerIndex, chosedChessIndex) {
		const allPlayerTs = this.node.getComponentsInChildren(player);
		allPlayerTs[curPlayerIndex].rotateChoesdChess();
	}

	flipCurPlayerChoesdChess(curPlayerIndex, chosedChessIndex) {
		const allPlayerTs = this.node.getComponentsInChildren(player);
		allPlayerTs[curPlayerIndex].flipChoesdChess();
	}

	// resetColor() {

	// }

	update(deltaTime: number) {}
}
