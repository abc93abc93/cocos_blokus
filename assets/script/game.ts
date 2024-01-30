import { BlokusGame, Player } from "./blokus";
import {
	_decorator,
	Component,
	Node,
	EventTouch,
	Color,
	Vec3,
	UITransform,
	Label,
	director,
	BlockInputEvents,
} from "cc";
import { board } from "./board";
import { playerSection } from "./playerSection";
import { player } from "./player";
import { chess } from "./chess";
import { boardBlock } from "./boardBlock";
import { AudioControl } from "./Audio/AudioControl";
import DataControlPanel from "./DataControlPanel";
import randomNames from "./Data/computer";

const { ccclass, property } = _decorator;

@ccclass("game")
export class game extends Component {
	@property(AudioControl)
	AudioControl: AudioControl = null;

	@property(Node)
	Board: Node;

	@property(Node)
	PlayerSection: Node;

	@property(Node)
	CheckBtn: Node;

	@property(Node)
	Popup: Node;

	@property(Node)
	sound: Node;

	@property(Node)
	silence: Node;

	@property(Node)
	FixPop: Node;

	blokusGame = null;
	blockInputEvents = null;

	//棋子選轉
	chess_rotate = false;
	chess_flip = false;
	isMusic = true;

	//
	changeTimer = null;

	private player = null;

	async onLoad() {
		await DataControlPanel.init();
		console.log(DataControlPanel.Profiles);

		// await DataControlPanel.reloadProfilesData();
		this.player = DataControlPanel.Profiles;

		//載入遊戲
		this.blokusGame = new BlokusGame(
			new Player(this.player.nickname, 0, new Color(255, 232, 232), [0, 0]),
			new Player(randomNames[0], 1, new Color(255, 247, 232), [0, 19]),
			new Player(randomNames[1], 2, new Color(242, 255, 242), [19, 19]),
			new Player(randomNames[2], 3, new Color(242, 255, 255), [19, 0])
		);
		this.blokusGame.init();
		this.initBoardView(this.blokusGame.board); //棋盤要比player先載入不然會出事
		this.initPlayersView(this.blokusGame.players);
		this.blokusGame.players[1].isComputer = true;
		this.blokusGame.players[2].isComputer = true;
		this.blokusGame.players[3].isComputer = true;
	}

	start() {
		this.player = DataControlPanel.Profiles;

		this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);

		//設置禁用點擊config
		this.blockInputEvents = this.Popup.getComponent(BlockInputEvents);
		if (!this.blockInputEvents) {
			this.blockInputEvents = this.Popup.addComponent(BlockInputEvents);
		}

		this.blockInputEvents = true;

		//載入音效
		// this.AudioControl.playAudio("game-music");
	}

	//渲染玩家區塊 (DU)
	initPlayersView(playerClassArr) {
		const playerSectionTs = this.PlayerSection.getComponent(playerSection);
		playerSectionTs.init(playerClassArr);
	}

	//渲染棋盤
	initBoardView(boardClass) {
		const boardTs = this.Board.getComponent(board);
		boardTs.init(boardClass);
	}

	//旋轉棋子
	handlerPlayerRotate(direc: "clockwise" | "counterclockwise") {
		if (this.chess_flip || this.chess_rotate) return;

		this.chess_rotate = true;

		this.AudioControl.playAudio("transform-button");
		//棋子旋轉
		this.blokusGame.setChosedRotate(direc);
		//棋盤篩選可以放的位置
		this.blokusGame.setChosablePosition();

		const playerSectionTs = this.PlayerSection.getComponent(playerSection);
		playerSectionTs.rotateCurPlayerChoesdChess(
			this.blokusGame.curPlayer,
			direc,
			() => {
				this.chess_rotate = false;
			}
		);

		//渲染到畫面上給玩家看
		const boardTs = this.Board.getComponent(board);
		boardTs.renderBoard(
			this.blokusGame.board._matrix,
			this.blokusGame.board._matrix_vector
		);
	}

	//翻轉棋子
	handlerPlayerFlip(direc: "vertical" | "horizon") {
		if (this.chess_flip || this.chess_rotate) return;
		this.chess_flip = true;

		this.AudioControl.playAudio("transform-button");
		//棋子翻轉
		this.blokusGame.setChosedFlip(direc);
		//棋盤篩選可以放的位置
		this.blokusGame.setChosablePosition();

		//前端自己翻轉的
		const playerSectionTs = this.PlayerSection.getComponent(playerSection);
		playerSectionTs.flipCurPlayerChoesdChess(
			this.blokusGame.curPlayer,
			this.blokusGame.players[this.blokusGame.curPlayer].chosed,
			direc,
			() => {
				this.chess_flip = false;
			}
		);

		//渲染到畫面上給玩家看
		const boardTs = this.Board.getComponent(board);
		boardTs.renderBoard(
			this.blokusGame.board._matrix,
			this.blokusGame.board._matrix_vector
		);
	}

	//處理選中的棋子
	handlerChessChosed(chessIndex) {
		this.AudioControl.playAudio("pick-chess");
		this.blokusGame.setPlayerChosedChess(chessIndex);
		//棋盤篩選可以放的位置
		this.blokusGame.setChosablePosition();

		//渲染目前選中的棋子
		const playerSectionTs = this.PlayerSection.getComponent(playerSection);
		const chosedIndex =
			this.blokusGame.players[this.blokusGame.curPlayer].chosed;
		playerSectionTs.renderCurPlayerChoesdChess(
			this.blokusGame.curPlayer,
			this.blokusGame.players[this.blokusGame.curPlayer].chosed,
			this.blokusGame.players[this.blokusGame.curPlayer].chesses[chosedIndex]
				.vector,
			this.blokusGame.players[this.blokusGame.curPlayer].chesses[chosedIndex]
				.center
		);

		//渲染到畫面上給玩家看
		const boardTs = this.Board.getComponent(board);
		boardTs.renderBoard(
			this.blokusGame.board._matrix,
			this.blokusGame.board._matrix_vector
		);
	}

	//Passed換玩家
	handlerPlayerPassed() {
		this.blokusGame.setPlayerPassed();
		this.AudioControl.playAudio("giveup-button");

		this.handlerPlayerchange();
	}

	//放完換玩家
	handlerPlayerchange() {
		const gameOver = this.blokusGame.isGameGoing();

		if (gameOver) {
			this.setGameOverScores();
		}

		const playerSectionTs = this.PlayerSection.getComponent(playerSection);
		playerSectionTs.renderCurPlayer(this.blokusGame.players);

		const boardTs = this.Board.getComponent(board);
		boardTs.renderBoard(
			this.blokusGame.board._matrix,
			this.blokusGame.board._matrix_vector
		);

		if (!this.blokusGame.players[this.blokusGame.curPlayer].passed) {
			this.AudioControl.playAudio("put-chess");
		}

		//如果玩家是電腦
		if (
			this.blokusGame.players[this.blokusGame.curPlayer].isComputer &&
			!this.blokusGame.players[this.blokusGame.curPlayer].passed
		) {
			this.blokusGame.autoPlay();

			//重渲染電腦的棋子
			playerSectionTs.renderCurPlayerChess(this.blokusGame.curPlayer);

			if (this.changeTimer) clearTimeout(this.changeTimer);

			const randomTime = Math.floor(Math.random() * 1000 + 1000);
			//可能要優化會卡
			this.changeTimer = setTimeout(() => {
				this.handlerPlayerchange();
			}, randomTime);
		}
	}

	//取得分數渲染到畫面上
	setGameOverScores() {
		const scores = this.blokusGame.getPlayersScore(); //四個人的分數

		//只存玩家一人的分數
		DataControlPanel.updatePlayerScore(scores[0].score);

		//禁用遊戲畫面的點擊
		this.blockInputEvents = true;

		this.Popup.active = true;
		const socresUI = this.Popup.children.filter(
			(child) => child.name === "Player"
		);

		for (let index = 0; index < 4; index++) {
			const label = socresUI[index].getComponentsInChildren(Label);
			label[0].string = `${scores[index].id}`;
			label[1].string = `${scores[index].score}`;
		}
	}

	//玩家輪流玩
	clickNode(event: EventTouch) {
		//當玩家選到棋子
		if (event.target.name === "Chess") {
			this.CheckBtn.active = false;

			const playerIndex = event.target.parent.parent.getComponent(player).index;
			if (playerIndex !== this.blokusGame.curPlayer) return;

			//選中的棋子傳到後面
			this.handlerChessChosed(event.target.getComponent(chess)._index);
		}

		//玩家選棋盤格子的座標
		if (event.target.name === "BoardBlock") {
			const x = event.target.getComponent(boardBlock).x;
			const y = event.target.getComponent(boardBlock).y;

			//判斷選到的是不是可放置的位置
			const check = this.blokusGame.checkClickBlock(x, y);

			if (check) {
				//渲染到畫面上給玩家看
				const boardTs = this.Board.getComponent(board);
				boardTs.renderBoard(
					this.blokusGame.board._matrix,
					this.blokusGame.board._matrix_vector
				);

				//選染預覽畫面
				boardTs.renderPreViewBoard(x, y, check, this.blokusGame.board._matrix);

				//跳出確定按鍵
				const width = this.Board.getComponent(UITransform).contentSize.width;
				const pos = event.target.getPosition();
				const posX = pos.x + 30 >= width / 2 ? pos.x - 30 : pos.x + 30;
				const posY = pos.y + 30 >= width / 2 ? pos.y - 30 : pos.y + 30;
				this.CheckBtn.setPosition(new Vec3(posX, posY, pos.z));
				this.CheckBtn.setSiblingIndex(999);
				this.CheckBtn.active = true;
			}
		}

		//當玩家點選確定按鈕
		if (event.target.name === "CheckBtn") {
			//設定資料位置
			this.blokusGame.setConfirmPosition();
			//隱藏確認按鈕
			this.CheckBtn.active = false;

			//重整棋子區
			const playerSectionTs = this.PlayerSection.getComponent(playerSection);
			playerSectionTs.renderCurPlayerChess(this.blokusGame.curPlayer);
			playerSectionTs.clearCurPlayerChoesdChess(this.blokusGame.curPlayer);

			//選染
			const boardTs = this.Board.getComponent(board);
			boardTs.renderBoard(
				this.blokusGame.board._matrix,
				this.blokusGame.board._matrix_vector
			);

			//更換玩家
			this.handlerPlayerchange();
		}
	}

	/** 玩家單人玩 **/
	//換玩家條件 -> 玩家按passed
	clickPassed(event) {
		const playerIndex = event.target.parent.getComponent(player).index;

		if (
			playerIndex !== this.blokusGame.curPlayer ||
			this.blokusGame.players[this.blokusGame.curPlayer].passed
		) {
			return;
		}

		this.handlerPlayerPassed();
	}

	//按下順旋轉按鈕
	clickClockwise(event) {
		const playerIndex = event.target.parent.getComponent(player).index;
		this.CheckBtn.active = false;

		if (
			playerIndex !== this.blokusGame.curPlayer ||
			(this.blokusGame.players[this.blokusGame.curPlayer].chosed === null &&
				this.blokusGame.players[this.blokusGame.curPlayer].chosed !== 0)
		) {
			return;
		}
		this.handlerPlayerRotate("clockwise");
	}

	//按下逆旋轉按鈕
	clickCounterClockwise(event) {
		const playerIndex = event.target.parent.getComponent(player).index;
		this.CheckBtn.active = false;

		if (
			playerIndex !== this.blokusGame.curPlayer ||
			(this.blokusGame.players[this.blokusGame.curPlayer].chosed === null &&
				this.blokusGame.players[this.blokusGame.curPlayer].chosed !== 0)
		) {
			return;
		}
		this.handlerPlayerRotate("counterclockwise");
	}

	//按下垂直翻轉按鈕
	clickVertical(event) {
		const playerIndex = event.target.parent.getComponent(player).index;
		this.CheckBtn.active = false;

		if (
			playerIndex !== this.blokusGame.curPlayer ||
			(this.blokusGame.players[this.blokusGame.curPlayer].chosed === null &&
				this.blokusGame.players[this.blokusGame.curPlayer].chosed !== 0)
		) {
			return;
		}

		this.handlerPlayerFlip("vertical");
	}

	//按下水平翻轉按鈕
	clickHorizon(event) {
		const playerIndex = event.target.parent.getComponent(player).index;
		this.CheckBtn.active = false;

		if (
			playerIndex !== this.blokusGame.curPlayer ||
			(this.blokusGame.players[this.blokusGame.curPlayer].chosed === null &&
				this.blokusGame.players[this.blokusGame.curPlayer].chosed !== 0)
		) {
			return;
		}

		this.handlerPlayerFlip("horizon");
	}

	//回主畫面
	toHome() {
		this.blockInputEvents = false;
		this.AudioControl.playAudio("default-button");
		director.loadScene("home");
	}

	//再來一場
	reStart() {
		this.blockInputEvents = false;
		this.AudioControl.playAudio("default-button");
		director.loadScene("game");
	}

	//音樂切換
	setMusic() {
		this.AudioControl.playAudio("default-button");

		if (this.isMusic) {
			this.silence.active = true;
			this.sound.active = false;
			this.AudioControl.turnOffAudio("game-music");
			this.isMusic = !this.isMusic;
		} else {
			this.silence.active = false;
			this.sound.active = true;
			this.AudioControl.turnOnAudio("game-music");
			this.isMusic = !this.isMusic;
		}
	}
}
