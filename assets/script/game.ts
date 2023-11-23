import { BlokusGame } from "./blokus";
import { Player, Board } from "./blokus";

import { _decorator, Component, Node, EventTouch, Sprite, Color } from "cc";
import { board } from "./board";
import { playerSection } from "./playerSection";
import { player } from "./player";
const { ccclass, property } = _decorator;

@ccclass("game")
export class game extends Component {

	@property(Node)
	Board: Node;

	@property(Node)
	PlayerSection: Node;
	blokusGame = null;

	onLoad() {
		//載入遊戲
		this.blokusGame = new BlokusGame(
			new Player(new Color(255, 232, 232), 0),
			new Player(new Color(255, 247, 232), 1),
			new Player(new Color(242, 255, 242), 2),
			new Player(new Color(242, 255, 255), 3),
		);
		this.blokusGame.init();
		this.initPlayersView(this.blokusGame.players);
		this.initBoardView(this.blokusGame.board);

		const that = this;
		// this.onBoardChange(this.blokusGame.board, that)
		this.onPlayerChange(this.blokusGame.curPlayer, that)
		this.blokusGame.bindPlayerChange(this.onPlayerChange, that);
	}

	start() {
		this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
	}

	//渲染玩家區塊 (DU)
	initPlayersView(playerClassArr) {
		const playerSectionTs = this.PlayerSection.getComponent(playerSection)
		playerSectionTs.init(playerClassArr);
	}

	//渲染棋盤
	initBoardView(boardClass) {
		const boardTs = this.Board.getComponent(board)
		boardTs.init(boardClass);
	}

	//換玩家
	handlerPlayerChange(playerDone, playerPassed) {
		this.blokusGame.changePlayer(playerDone, playerPassed)
	}

	//玩家
	onPlayerChange(curPlayer, that) {
		const playerSectionTs = that.PlayerSection.getComponent(playerSection);
		playerSectionTs.renderCurPlayer(curPlayer);
	}

	//棋盤
	onBoardChange(board, that) {
		const boardTs = that.Board.getComponent(board)
		boardTs.renderBoard(board);
	}

	//玩家輪流玩
	clickNode(event: EventTouch) {

		//換玩家條件 -> 玩家按passed & 玩家放完棋子
		// console.log(event.target.name);
		if (event.target.name === 'PassedBtn') {
			const playerTs = event.target.parent.getComponent(player);
			console.log(playerTs.passed);

			this.handlerPlayerChange(playerTs.done, playerTs.passed)
		}


	}

	update(deltaTime: number) { }
}
