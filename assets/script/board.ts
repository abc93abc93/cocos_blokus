import {
	_decorator,
	Component,
	instantiate,
	Label,
	Prefab,
	Sprite,
	Vec3,
	Color,
	UITransform,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("board")
export class board extends Component {
	@property(Prefab)
	board_block: Prefab;

	_n = 20;
	_bias = this._n / 2;
	_matrix = Array.from(Array(this._n), () => new Array(this._n).fill(0));
	_matrix_vector = [];
	_block_size = 25;
	_render_matrix = Array.from(Array(this._n), () =>
		new Array(this._n).fill(null)
	);

	chess = [
		[-1, 0],
		[0, 0],
		[1, 0],
	];

	center = [0, 0];

	availablePosition = [0, 0];

	onLoad() {
		this.setBoardVector();
		this.setBoard();
	}

	start() {
		this._matrix[0][0] = 1;
		const position = this.getAvailablePosition([0, 0], this.chess);
		console.log("position", position);

		this.renderChessPosition(position);
	}

	setBoardVector() {
		for (let x = 0; x < this._n; x++) {
			for (let y = 0; y < this._n; y++) {
				this._matrix_vector.push([x, y]);
			}
		}
	}

	setBoard() {
		this._matrix_vector.forEach((vector) => {
			const [x, y] = vector;
			const block = instantiate(this.board_block);

			block.setPosition(
				new Vec3(
					(x - this._bias) * this._block_size,
					(y - this._bias) * this._block_size,
					0
				)
			);

			this._render_matrix[x][y] = block;

			//設置數據 (之後刪)
			const label = block.getChildByName("Label");
			label.getComponent(Label).string = `${x}${y}`;

			this.node.addChild(block);
		});
	}

	getAvailablePosition(initPlace, chess) {
		const array = [];

		const [x, y] = initPlace;

		if (this._matrix[x][y] === 0) {
			const places = this.findChessPosition(chess, initPlace);
			if (places.length === 0) return array;
			array.push(...places);
			return array;
		}
		const allCorner = this.findAllCorner();
		const availableCorner = this.findAvailableCorner(allCorner);

		for (let i = 0; i < availableCorner.length; i++) {
			const places = this.findChessPosition(chess, availableCorner[i]);
			if (places.length === 0) continue;
			array.push(...places);
		}

		return array;
	}

	renderChessPosition(places) {
		if (places.length === 0) return;
		for (let index = 0; index < places.length; index++) {
			const [x, y] = places[index];

			console.log(x, y, this._render_matrix[x][y].getComponent(Sprite));

			this._render_matrix[x][y].getComponent(Sprite).color = new Color(
				255,
				255,
				35
			);
		}
	}

	//從可放置的角落點找到所選取block可放置的點
	findChessPosition(chess, point) {
		const points = [];

		chess.forEach((element) => {
			const [pointX, pointY] = point;
			const [x, y] = element;

			const biasX = pointX - x;
			const biasY = pointY - y;

			const chessPoint = chess.every((element) => {
				const [elementX, elementY] = element;

				if (
					elementX + biasX >= 0 &&
					elementX + biasX <= this._matrix.length &&
					elementY + biasY >= 0 &&
					elementY + biasY <= this._matrix.length
				) {
					if (this._matrix[elementX + biasX][elementY + biasY] === 0)
						return true;
					return false;
				}
				return false;
			});

			if (chessPoint) {
				points.push([this.center[0] + biasX, this.center[1] + biasY]);
			}
		});

		return points;
	}

	//先找到有放置的斜對角
	findAllCorner() {
		const position = [];

		this._matrix_vector.forEach((vector) => {
			const [x, y] = vector;

			if (this._matrix[x][y] === 1) {
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
			if (x + 1 <= this._matrix.length && this._matrix[x + 1][y] !== 0)
				continue;
			if (y + 1 <= this._matrix.length && this._matrix[x][y + 1] !== 0)
				continue;

			position[`${[x, y]}`] = [x, y];
		}

		return Object.values(position);
	}

	update(deltaTime: number) {}
}
