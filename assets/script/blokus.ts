export class BlokusGame {
	board: Board;
	players: Player[];
	curPlayer: number;
	onPlayerChangeCallback: any;
	onBoardChangeCallback: any;
	thisInGameTs: any;

	constructor(player1, player2, player3, player4) {
		this.board = new Board();
		this.players = [player1, player2, player3, player4];
		this.curPlayer = 0; //下棋者
		// this.onPlayerChangeCallback = null;
		// this.onBoardChangeCallback = null;
		// this.thisInGameTs = null;
	}

	init() {
		//遊戲預加載的東東
		this.board.init();
		this.players.forEach((player) => player.init(this.curPlayer));
	}

	// bindPlayerChange(callback, that) {
	// 	this.onPlayerChangeCallback = callback;
	// 	this.thisInGameTs = that
	// }

	setPlayerTurn() {
		this.players.forEach((player) => {
			player.turn = player.index === this.curPlayer;
		})
	}

	setPlayerPassed() {
		this.players[this.curPlayer].setPassed();
	}

	//遊戲是否繼續 -> 判斷結束遊戲 或是 更換玩家
	isGameGoing() {

		//檢查遊戲是否結束
		if (this.isGameOver()) {
			console.log('遊戲結束');
			return
		}

		//如果玩家pass 或是 放完棋子 -> 更換玩家
		if (this.players[this.curPlayer].passed || this.players[this.curPlayer].done) {
			this.changeCurPlayer();

			//如果下一個玩家已經pass -> 更換玩家
			if (this.players[this.curPlayer].passed) {
				this.changeCurPlayer();
			}


		}
	}

	//換人下棋
	changeCurPlayer() {
		if (this.curPlayer >= this.players.length - 1) {
			this.curPlayer = 0
		} else {
			this.curPlayer += 1;
		}

		this.setPlayerTurn();
	}


	// bindBoardChange(callback, that) {
	// 	this.onBoardChangeCallback = callback;
	// 	this.thisInGameTs = that
	// }


	//判斷遊戲是否結束
	isGameOver() {
		//判斷標準 - 4個玩家都pass & 有玩家把棋子都放完
		const allPassed = this.players.every((player) => player.passed);
		const noChess = this.players.some((player) => player.chesses.length === 0);

		return allPassed || noChess
	}
}

export class Board {
	_matrix: number[][];
	_size: number;
	_matrix_vector: [number, number][]

	constructor() {
		this._matrix = []; // 未放置0, 放置1, 可放置2(?), 預放置3(?)
		this._size = 20;
		this._matrix_vector = [];
	}

	//初始化棋盤
	init() {
		this._matrix = this.setBoard();
		this._matrix_vector = this.setBoardVector();
	}

	//設置棋盤
	setBoard() {
		return Array.from(Array(this._size), () => new Array(this._size).fill(0))
	}

	//設置棋盤二維位置陣列
	setBoardVector() {
		const arr = []
		for (let x = 0; x < this._size; x++) {
			for (let y = 0; y < this._size; y++) {
				arr.push([x, y]);
			}
		}
		return arr
	}

	//找到可以放置的地方
	//放置棋子
}

export class Player {
	id: string;
	index: number;
	chesses: Chess[];;
	availablePosition = [];
	chosed: null;
	color: string;
	done: boolean;
	turn: boolean;
	passed: boolean;

	constructor(id, index, color) {

		this.id = id;
		this.index = index;

		this.chesses = [new Chess([[0]])]; // 玩家有21個棋子
		this.availablePosition = []; //初始位置座標 & 能放的位置
		this.chosed = null; //被選中的棋子

		this.color = color; //代表的棋子顏色
		this.done = false; //是否放完棋子
		this.turn = false; //是否輪到玩家
		this.passed = false; //玩家是否投降
	}

	//
	init(curPlayer) {
		this.setTurn(curPlayer);

	}



	//輪替
	setTurn(player) {
		this.turn = (this.index === player)
	}

	//重置
	resetDone() {
		this.done = false;
	}

	//放完棋子了
	setDone() {
		this.done = true;
	}

	//投降
	setPassed() {
		this.passed = true;
	}
}


export class Chess {
	matrix: [];

	constructor(matrix) {
		this.matrix = matrix;
	}
}
