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
	resources,
	SpriteFrame,
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

	protected onLoad(): void {
		resources.preload("textures/Game/block/block/spriteFrame", SpriteFrame);
		resources.preload("textures/Game/block/block1/spriteFrame", SpriteFrame);
		resources.preload("textures/Game/block/block2/spriteFrame", SpriteFrame);
		resources.preload("textures/Game/block/block3/spriteFrame", SpriteFrame);
		resources.preload("textures/Game/block/block4/spriteFrame", SpriteFrame);
		resources.preload("textures/Game/block/block5/spriteFrame", SpriteFrame);
	}

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

			this.node.addChild(block);
		});
	}

	renderBoard(_matrix, _matrix_vector) {
		_matrix_vector.forEach(([x, y]) => {
			switch (_matrix[x][y]) {
				case 0:
					resources.load(
						"textures/Game/block/block/spriteFrame",
						SpriteFrame,
						(err: any, spriteFrame) => {
							this._render_matrix[x][y].getComponent(Sprite).spriteFrame =
								spriteFrame;
						}
					);
					break;
				case 1:
					resources.load(
						"textures/Game/block/block1/spriteFrame",
						SpriteFrame,
						(err: any, spriteFrame) => {
							this._render_matrix[x][y].getComponent(Sprite).spriteFrame =
								spriteFrame;
						}
					);
					break;
				case 2:
					resources.load(
						"textures/Game/block/block2/spriteFrame",
						SpriteFrame,
						(err: any, spriteFrame) => {
							this._render_matrix[x][y].getComponent(Sprite).spriteFrame =
								spriteFrame;
						}
					);
					break;
				case 3:
					resources.load(
						"textures/Game/block/block3/spriteFrame",
						SpriteFrame,
						(err: any, spriteFrame) => {
							this._render_matrix[x][y].getComponent(Sprite).spriteFrame =
								spriteFrame;
						}
					);
					break;

				case 4:
					resources.load(
						"textures/Game/block/block4/spriteFrame",
						SpriteFrame,
						(err: any, spriteFrame) => {
							this._render_matrix[x][y].getComponent(Sprite).spriteFrame =
								spriteFrame;
						}
					);
					break;
				case 5:
					resources.load(
						"textures/Game/block/block6/spriteFrame",
						SpriteFrame,
						(err: any, spriteFrame) => {
							this._render_matrix[x][y].getComponent(Sprite).spriteFrame =
								spriteFrame;
						}
					);
					break;
			}
		});
	}

	renderPreViewBoard(X, Y, _chess_vector) {
		resources.load(
			"textures/Game/block/block5/spriteFrame",
			SpriteFrame,
			(err: any, spriteFrame) => {
				_chess_vector.forEach(([x, y]) => {
					this._render_matrix[X + x][Y + y].getComponent(Sprite).spriteFrame =
						spriteFrame;
				});
			}
		);
	}

	clickNode(event: EventTouch) {}
}
