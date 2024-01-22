import {
	_decorator,
	Component,
	instantiate,
	Label,
	Prefab,
	Sprite,
	Vec3,
	Color,
	EventTouch,
	Node,
	UITransform,
} from "cc";
import { chess } from "./chess";
import { boardBlock } from "./boardBlock";

const { ccclass, property } = _decorator;

@ccclass("board")
export class board extends Component {
	@property(Prefab)
	board_block: Prefab;

	_block_size = 35;
	_bias: number;
	_render_matrix: Node[][];

	// chess = [
	// 	[-1, 0],
	// 	[0, 0],
	// 	[1, 0],
	// ];

	// center = [0, 0];

	// availablePosition = [0, 0];

	start() {
		this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
	}

	init(boardClass) {
		this._bias = boardClass._size / 2;
		this._render_matrix = Array.from(Array(boardClass._size), () =>
			new Array(boardClass._size).fill(0)
		);

		boardClass._matrix_vector.forEach((vector) => {
			const [x, y] = vector;
			const block = instantiate(this.board_block);
			block
				.getComponent(UITransform)
				.setContentSize(this._block_size, this._block_size);

			block.setPosition(
				new Vec3(
					(x - this._bias) * this._block_size + this._block_size / 2,
					(y - this._bias) * this._block_size + this._block_size / 2,
					0
				)
			);

			block.getComponent(boardBlock).x = x;
			block.getComponent(boardBlock).y = y;

			this._render_matrix[x][y] = block;

			//設置數據 (之後刪)
			const label = block.getChildByName("Label");
			label.getComponent(Label).string = `${x}${y}`;

			this.node.addChild(block);
		});
	}

	renderBoard(_matrix, _matrix_vector) {
		_matrix_vector.forEach(([x, y]) => {
			switch (_matrix[x][y]) {
				case 0:
					this._render_matrix[x][y].getComponent(Sprite).color = new Color(
						233,
						157,
						157
					);
					break;
				case 1:
					this._render_matrix[x][y].getComponent(Sprite).color = new Color(
						255,
						232,
						232
					);
					break;
				case 2:
					this._render_matrix[x][y].getComponent(Sprite).color = new Color(
						255,
						247,
						232
					);
					break;
				case 3:
					this._render_matrix[x][y].getComponent(Sprite).color = new Color(
						242,
						255,
						242
					);
					break;

				case 4:
					this._render_matrix[x][y].getComponent(Sprite).color = new Color(
						242,
						255,
						255
					);
					break;
				case 5:
					this._render_matrix[x][y].getComponent(Sprite).color = new Color(
						25,
						25,
						60
					);
					break;
			}
		});
	}

	renderPreViewBoard(X, Y, _chess_vector) {
		_chess_vector.forEach(([x, y]) => {
			this._render_matrix[X + x][Y + y].getComponent(Sprite).color = new Color(
				233,
				50,
				10
			);
		});
	}

	clickNode(event: EventTouch) {}

	//獲取可以放置的點
	// getAvailablePosition(initPlace, chessNode) {
	// 	const array = [];

	// 	const [x, y] = initPlace;

	// 	if (this._matrix[x][y] === 0) {
	// 		const places = this.findChessPosition(chessNode, initPlace);
	// 		if (places.length === 0) return array;
	// 		array.push(...places);
	// 		return array;
	// 	}
	// 	const allCorner = this.findAllCorner();
	// 	const availableCorner = this.findAvailableCorner(allCorner);

	// 	for (let i = 0; i < availableCorner.length; i++) {
	// 		const places = this.findChessPosition(chessNode, availableCorner[i]);
	// 		if (places.length === 0) continue;
	// 		array.push(...places);
	// 	}

	// 	return array;
	// }

	//渲染可以放置的點
	// renderChessPosition(places) {
	// 	if (places.length === 0) return;

	// 	for (let index = 0; index < places.length; index++) {
	// 		const [x, y] = places[index];

	// 		this._render_matrix[x][y].getComponent(Sprite).color = new Color(
	// 			255,
	// 			255,
	// 			35
	// 		);

	// 		this._render_matrix[x][y].getComponent(boardBlock).isClick = true;
	// 	}
	// }

	// resetRenderChessPosition() {
	// 	for (let index = 0; index < this._matrix_vector.length; index++) {
	// 		const [x, y] = this._matrix_vector[index];

	// 		if (this._matrix[x][y] === 0) {
	// 			this._render_matrix[x][y].getComponent(Sprite).color = new Color(
	// 				255,
	// 				255,
	// 				255
	// 			);
	// 			this._render_matrix[x][y].getComponent(boardBlock).isClick = false;
	// 		}
	// 	}
	// }

	//從可放置的角落點找到所選取block可放置的點
	// findChessPosition(chessNode, point) {
	// 	const points = [];
	// 	const chessTs = chessNode.getComponent(chess);

	// 	chessTs._array_vector.forEach((element, index) => {
	// 		const [pointX, pointY] = point;
	// 		const [x, y] = element;

	// 		const biasX = pointX - x;
	// 		const biasY = pointY - y;

	// 		const chessPoint = chessTs._array_vector.every((element) => {
	// 			const [elementX, elementY] = element;

	// 			if (
	// 				elementX + biasX >= 0 &&
	// 				elementX + biasX <= this._matrix.length &&
	// 				elementY + biasY >= 0 &&
	// 				elementY + biasY <= this._matrix.length
	// 			) {
	// 				if (this._matrix[elementX + biasX][elementY + biasY] === 0)
	// 					return true;
	// 				return false;
	// 			}
	// 			return false;
	// 		});

	// 		if (chessPoint) {
	// 			points.push([biasX, biasY]);
	// 		}
	// 	});

	// 	return points;
	// }

	//先找到有放置的斜對角
	// findAllCorner() {
	// 	const position = [];

	// 	this._matrix_vector.forEach((vector) => {
	// 		const [x, y] = vector;

	// 		if (this._matrix[x][y] === 1) {
	// 			if (y - 1 >= 0 && x - 1 >= 0 && this._matrix[x - 1][y - 1] === 0) {
	// 				position.push([x - 1, y - 1]);
	// 			}

	// 			if (
	// 				y - 1 >= 0 &&
	// 				x + 1 < this._matrix.length &&
	// 				this._matrix[x + 1][y - 1] === 0
	// 			) {
	// 				position.push([x + 1, y - 1]);
	// 			}

	// 			if (
	// 				x - 1 >= 0 &&
	// 				y + 1 < this._matrix[x].length &&
	// 				this._matrix[x - 1][y + 1] === 0
	// 			) {
	// 				position.push([x - 1, y + 1]);
	// 			}

	// 			if (
	// 				x + 1 < this._matrix.length &&
	// 				y + 1 < this._matrix[x].length &&
	// 				this._matrix[x + 1][y + 1] === 0
	// 			) {
	// 				position.push([x + 1, y + 1]);
	// 			}
	// 		}
	// 	});
	// 	return position;
	// }

	//再看斜對角中適合放的位置
	// findAvailableCorner(array) {
	// 	const position = {};

	// 	for (let index = 0; index < array.length; index++) {
	// 		const [x, y] = array[index];

	// 		if (x - 1 >= 0 && this._matrix[x - 1][y] !== 0) continue;
	// 		if (y - 1 >= 0 && this._matrix[x][y - 1] !== 0) continue;
	// 		if (x + 1 <= this._matrix.length && this._matrix[x + 1][y] !== 0)
	// 			continue;
	// 		if (y + 1 <= this._matrix.length && this._matrix[x][y + 1] !== 0)
	// 			continue;

	// 		position[`${[x, y]}`] = [x, y];
	// 	}

	// 	return Object.values(position);
	// }

	update(deltaTime: number) {}
}
