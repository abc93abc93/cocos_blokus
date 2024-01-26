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
import { boardBlock } from "./boardBlock";

const { ccclass, property } = _decorator;

@ccclass("board")
export class board extends Component {
	@property(Prefab)
	board_block: Prefab;

	_block_size = 35;
	_bias: number;
	_render_matrix: Node[][];

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
}
