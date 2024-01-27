import { chessesData } from "./Data/chess";
import { type ChessData } from "./Data/chess";
import DataControlPanel from "../scripts/DataControlPanel";

export class BlokusGame {
	board: Board;
	players: Player[];
	curPlayer: number;
	onPlayerChangeCallback: any;
	onBoardChangeCallback: any;
	thisInGameTs: any;
	playersSore: [];

	constructor(player1, player2, player3, player4) {
		this.board = new Board();
		this.players = [player1, player2, player3, player4];
		this.curPlayer = 0; //下棋者
		this.playersSore = [];
	}

	init() {
		//遊戲預加載的東東
		this.board.init();
		this.players.forEach((player) => player.init(this.curPlayer));

		DataControlPanel.init();
	}

	setPlayerTurn() {
		this.players.forEach((player) => {
			player.turn = player.index === this.curPlayer;
		});
	}

	setPlayerPassed() {
		this.players[this.curPlayer].setPassed();
	}

	//設置玩家選中棋子
	setPlayerChosedChess(chessIndex) {
		this.players[this.curPlayer].chosed = chessIndex;

		const chosedIndex: number = this.players[this.curPlayer].chosed;
		const chosedChess = this.players[this.curPlayer].chesses[chosedIndex];

		chosedChess.matrix = chosedChess.old_matrix;
		chosedChess.center = chosedChess.old_center;
		chosedChess.vector = chosedChess.setVector();
	}

	//設置可以放的位置
	setChosablePosition() {
		//重置可以放的位置
		this.board.resetChosablePosition();

		const chosedIndex: number = this.players[this.curPlayer].chosed;
		const chosedChess = this.players[this.curPlayer].chesses[chosedIndex];

		const posiion = this.board.getAvailablePosition(
			this.players[this.curPlayer].initPosition,
			chosedChess,
			this.curPlayer + 1
		);

		posiion.forEach(([x, y]) => {
			this.board._matrix[x][y] = 5;
		});

		return posiion;
	}

	//檢查點選到的棋盤block是不是可選的棋子
	checkClickBlock(x, y) {
		if (this.board._matrix[x][y] !== 5) return false;

		//紀錄玩家點選到的棋盤位置(可選的)
		this.board.chosed_block = [x, y];
		const cheses = this.players[this.curPlayer].chesses;
		const chosed: number = this.players[this.curPlayer].chosed;

		return cheses[chosed].vector;
	}

	//遊戲是否繼續 -> 判斷結束遊戲 或是 更換玩家
	isGameGoing() {
		//檢查遊戲是否結束
		if (this.isGameOver()) {
			console.log("遊戲結束");
			this.getPlayersScore();

			return true;
		}

		//如果玩家pass 或是 放完棋子 -> 更換玩家
		this.changeCurPlayer();

		//如果下一個玩家已經pass -> 更換玩家
		if (this.players[this.curPlayer].passed) {
			this.isGameGoing();
		}

		return false;
	}

	//設置確定要放的位置
	setConfirmPosition() {
		const cheses = this.players[this.curPlayer].chesses;
		const chosed: number = this.players[this.curPlayer].chosed;

		this.board.resetChosablePosition();

		cheses[chosed].isDone = true;
		this.board.setFinalPosition(this.curPlayer, cheses[chosed].vector);

		//放完清空選中的棋子
		this.players[this.curPlayer].chosed = null;
	}

	//換人下棋
	changeCurPlayer() {
		if (this.curPlayer >= this.players.length - 1) {
			this.curPlayer = 0;
		} else {
			this.curPlayer += 1;
		}

		this.board.resetChosablePosition(); //重置棋盤可以
		this.setPlayerTurn();
	}

	autoPlay() {
		const CanChosedChess = this.setCanChosedChess();
		const chosablePosition = this.autoChosedChess(CanChosedChess);

		//如果pass就不用往下做
		if (!chosablePosition) return;

		const chosedPosition = this.autoChosedPosition(chosablePosition);
		this.checkClickBlock(chosedPosition[0], chosedPosition[1]);
		this.setConfirmPosition();
	}

	//篩出可選棋子的陣列
	setCanChosedChess() {
		const canChosed = [];
		const chesses = this.players[this.curPlayer].chesses;
		//篩選出可以挑的棋子index
		for (let index = 0; index < chesses.length; index++) {
			if (chesses[index].isDone) continue;
			canChosed.push(index);
		}
		return canChosed;
	}

	//開始自動選
	autoChosedChess(CanChosedChessArr) {
		const index = Math.floor(Math.random() * CanChosedChessArr.length);
		const chosedChessIndex = CanChosedChessArr[index];

		//去設定他選到的棋子
		this.setPlayerChosedChess(chosedChessIndex);
		//獲取可以放置的位置
		const chosablePosition = this.setChosablePosition();
		//如果沒有可以放的位置就在選一次
		if (chosablePosition.length === 0) {
			//剔除目前的棋子index
			CanChosedChessArr.splice(index, 1);

			if (CanChosedChessArr.length === 0) {
				//表示都沒棋子可以放了要pass
				this.players[this.curPlayer].setPassed();
				return false;
			}
			return this.autoChosedChess(CanChosedChessArr);
		} else {
			return chosablePosition;
		}
	}

	autoChosedPosition(chosablePosition) {
		const index = Math.floor(Math.random() * chosablePosition.length);
		return chosablePosition[index];
	}

	//選中的棋子旋轉
	setChosedRotate(direc: "clockwise" | "counterclockwise") {
		const cheses = this.players[this.curPlayer].chesses;
		const chosedIndex = this.players[this.curPlayer].chosed;

		if (chosedIndex === null) return;

		cheses[chosedIndex].rotateMatrix(
			cheses[chosedIndex].matrix,
			cheses[chosedIndex].center,
			direc
		);
	}

	//選中的棋子翻轉
	setChosedFlip(direc: "vertical" | "horizon") {
		const cheses = this.players[this.curPlayer].chesses;
		const chosedIndex = this.players[this.curPlayer].chosed;

		if (chosedIndex === null) return;

		if (direc === "vertical") {
			cheses[chosedIndex].flipMatrix(
				cheses[chosedIndex].matrix,
				cheses[chosedIndex].center,
				"vertical"
			);
		} else {
			cheses[chosedIndex].flipMatrix(
				cheses[chosedIndex].matrix,
				cheses[chosedIndex].center,
				"horizon"
			);
		}
	}

	//判斷遊戲是否結束
	isGameOver() {
		//判斷標準 - 4個玩家都pass & 有玩家把棋子都放完
		const allPassed = this.players.every((player, index) => {
			return player.passed;
		});
		const noChess = this.players.some((player) =>
			player.chesses.every((chess) => chess.isDone === true)
		);

		return allPassed || noChess;
	}

	//取得玩家們最後分數
	getPlayersScore() {
		return this.players.map((player) => ({
			id: player.id,
			score: player.getScore(),
		}));
	}
}

export class Board {
	_matrix: number[][];
	_size: number;
	_matrix_vector: [number, number][];
	chosed_block: [number, number];

	constructor() {
		this._matrix = []; // 未放置0,玩家1, 玩家2, 玩家3, 玩家4, 可放置5
		this._size = 20;
		this._matrix_vector = [];
		this.chosed_block = [0, 0];
	}

	//初始化棋盤
	init() {
		this._matrix = this.setBoard();
		this._matrix_vector = this.setBoardVector();
	}

	//設置棋盤
	setBoard() {
		return Array.from(Array(this._size), () => new Array(this._size).fill(0));
	}

	//設置棋盤二維位置陣列
	setBoardVector() {
		const arr = [];
		for (let x = 0; x < this._size; x++) {
			for (let y = 0; y < this._size; y++) {
				arr.push([x, y]);
			}
		}
		return arr;
	}

	//獲取可以放置的點
	getAvailablePosition(initPlace, chessNode, playerIndex) {
		const array = [];

		const [x, y] = initPlace;

		if (this._matrix[x][y] === 0) {
			const places = this.findChessPosition(chessNode, initPlace);
			if (places.length === 0) return array;
			array.push(...places);
			return array;
		}

		const allCorner = this.findAllCorner(playerIndex);
		const availableCorner = this.findAvailableCorner(allCorner);

		for (let i = 0; i < availableCorner.length; i++) {
			const places = this.findChessPosition(chessNode, availableCorner[i]);
			if (places.length === 0) continue;
			array.push(...places);
		}

		return array;
	}

	//從可放置的角落點找到所選取block可放置的點
	findChessPosition(chessNode, point) {
		const points = [];

		chessNode.vector.forEach((element, index) => {
			const [pointX, pointY] = point;
			const [x, y] = element;

			const biasX = pointX - x;
			const biasY = pointY - y;

			const chessPoint = chessNode.vector.every((element) => {
				const [elementX, elementY] = element;

				if (
					elementX + biasX >= 0 &&
					elementX + biasX < this._matrix.length &&
					elementY + biasY >= 0 &&
					elementY + biasY < this._matrix.length
				) {
					if (this._matrix[elementX + biasX][elementY + biasY] === 0) {
						if (elementX + biasX + 1 < this._matrix.length) {
							if (this._matrix[elementX + biasX + 1][elementY + biasY] !== 0)
								return false;
						}

						if (elementX + biasX - 1 >= 0) {
							if (this._matrix[elementX + biasX + -1][elementY + biasY] !== 0)
								return false;
						}

						if (elementY + biasY + 1 < this._matrix.length) {
							if (this._matrix[elementX + biasX][elementY + biasY + 1] !== 0)
								return false;
						}

						if (elementY + biasY - 1 >= 0) {
							if (this._matrix[elementX + biasX][elementY + biasY - 1] !== 0)
								return false;
						}
						return true;
					}
					return false;
				}
				return false;
			});

			if (chessPoint) {
				points.push([biasX, biasY]);
			}
		});

		return points;
	}

	//先找到有放置的斜對角
	findAllCorner(playerIndex) {
		const position = [];

		this._matrix_vector.forEach((vector) => {
			const [x, y] = vector;

			if (this._matrix[x][y] === playerIndex) {
				if (y - 1 >= 0 && x - 1 >= 0 && this._matrix[x - 1][y - 1] === 0) {
					position.push([x - 1, y - 1]);
				}

				if (
					y - 1 >= 0 &&
					x + 1 < this._matrix.length &&
					this._matrix[x + 1][y - 1] === 0
				) {
					position.push([x + 1, y - 1]);
				}

				if (
					x - 1 >= 0 &&
					y + 1 < this._matrix[x].length &&
					this._matrix[x - 1][y + 1] === 0
				) {
					position.push([x - 1, y + 1]);
				}

				if (
					x + 1 < this._matrix.length &&
					y + 1 < this._matrix[x].length &&
					this._matrix[x + 1][y + 1] === 0
				) {
					position.push([x + 1, y + 1]);
				}
			}
		});
		return position;
	}

	//再看斜對角中適合放的位置
	findAvailableCorner(array) {
		const position = {};

		for (let index = 0; index < array.length; index++) {
			const [x, y] = array[index];

			if (x - 1 >= 0 && this._matrix[x - 1][y] !== 0) continue;
			if (y - 1 >= 0 && this._matrix[x][y - 1] !== 0) continue;
			if (x + 1 < this._matrix.length && this._matrix[x + 1][y] !== 0) continue;
			if (y + 1 <= this._matrix.length && this._matrix[x][y + 1] !== 0)
				continue;

			position[`${[x, y]}`] = [x, y];
		}

		return Object.values(position);
	}

	//重置棋盤可選取位置
	resetChosablePosition() {
		this._matrix_vector.forEach(([x, y]) => {
			if (this._matrix[x][y] === 5) this._matrix[x][y] = 0;
		});
	}

	//放上玩家確定選取位置
	setFinalPosition(player_index, chosed_chess_vector) {
		const [X, Y] = this.chosed_block;
		chosed_chess_vector.forEach(([x, y]) => {
			this._matrix[X + x][Y + y] = player_index + 1;
		});
	}
}

export class Player {
	id: string;
	index: number;
	chesses: Chess[];
	initPosition = [];
	chosed: null;
	color: string;
	done: boolean;
	turn: boolean;
	passed: boolean;
	isComputer: boolean;

	constructor(id, index, color, initPosition) {
		this.id = id;
		this.index = index;

		this.chesses = []; // 玩家有21個棋子
		this.initPosition = initPosition; //初始位置座標
		this.chosed = null; //被選中的棋子index

		this.color = color; //代表的棋子顏色
		this.done = false; //是否放完棋子
		this.turn = false; //是否輪到玩家
		this.passed = false; //玩家是否投降

		this.isComputer = false;
	}

	init(curPlayer) {
		this.setTurn(curPlayer);
		this.setChesses();
	}

	//設置玩家棋子資料
	setChesses() {
		this.chesses = chessesData.map((chess) => {
			const { matrix, center, position } = chess;
			return new Chess({ matrix, center, position });
		});
	}

	//輪替
	setTurn(player) {
		this.turn = this.index === player;
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

	//計算分數
	getScore() {
		let score = 0;

		for (let index = 0; index < this.chesses.length; index++) {
			if (this.chesses[index].isDone) continue;
			score -= this.chesses[index].vector.length;
		}

		const allDone = this.chesses.every((chess) => chess.isDone === true);
		if (allDone) {
			score += 15;
		}

		//最後一個棋子如果是一格則額外加五分 //待判斷

		return score;
	}
}

export class Chess {
	old_matrix: number[][];
	old_center: [number, number];
	matrix: number[][];
	center: [number, number];
	position: [number, number];
	vector: number[][];
	isDone: boolean;

	constructor({ matrix, center, position }: ChessData) {
		this.old_matrix = matrix;
		this.old_center = center;
		this.matrix = matrix;
		this.center = center;
		this.position = position;
		this.vector = this.setVector();
		this.isDone = false;
	}

	//設置向量位置資料
	setVector() {
		const [centerX, centerY] = this.center;
		const arr = [];
		for (let x = 0; x < this.matrix.length; x++) {
			for (let y = 0; y < this.matrix[x].length; y++) {
				if (this.matrix[x][y] === 0) continue;

				arr.push([x - centerX, y - centerY]);
			}
		}

		return arr;
	}

	//rotate
	rotateMatrix(matrix, centers, direc) {
		const m = matrix.length;
		const n = matrix[0].length;

		// 創建一個新的矩陣，用來存放旋轉後的結果
		const rotatedMatrix = new Array(n).fill(0).map(() => new Array(m).fill(0));

		// 進行矩陣旋轉
		if (direc === "clockwise") {
			for (let i = 0; i < m; i++) {
				for (let j = 0; j < n; j++) {
					rotatedMatrix[j][m - 1 - i] = matrix[i][j];
				}
			}

			this.matrix = rotatedMatrix;
			this.center = [centers[1], m - 1 - centers[0]];
			this.vector = this.setVector();
		} else {
			for (let i = 0; i < m; i++) {
				for (let j = 0; j < n; j++) {
					rotatedMatrix[n - 1 - j][i] = matrix[i][j];
				}
			}

			// 更新对象的矩阵、中心点和向量属性
			this.matrix = rotatedMatrix;
			this.center = [n - 1 - centers[1], centers[0]];
			this.vector = this.setVector();
		}
	}

	//flip
	flipMatrix(matrix, center, direction) {
		const m = matrix.length;
		const n = matrix[0].length;

		// 創建一個新的矩陣，用來存放翻轉後的結果
		const flippedMatrix = new Array(m).fill(0).map(() => new Array(n).fill(0));

		// 計算翻轉後的中心點位置
		const flippedCenter = {
			row: center[0],
			col: center[1],
		};

		// 水平翻轉
		if (direction === "vertical") {
			for (let i = 0; i < m; i++) {
				for (let j = 0; j < n; j++) {
					flippedMatrix[i][j] = matrix[i][n - 1 - j];
				}
			}
			// 更新中心點位置
			flippedCenter.col = n - 1 - center[1];
		}
		// 垂直翻轉
		else if (direction === "horizon") {
			for (let i = 0; i < m; i++) {
				for (let j = 0; j < n; j++) {
					flippedMatrix[i][j] = matrix[m - 1 - i][j];
				}
			}
			// 更新中心點位置
			flippedCenter.row = m - 1 - center[0];
		} else {
			console.error(
				'Invalid direction. Please use "horizontal" or "vertical".'
			);
			return null;
		}

		this.matrix = flippedMatrix;
		this.center = [flippedCenter.row, flippedCenter.col];
		this.vector = this.setVector();
	}
}
