import {
	_decorator,
	Component,
	Node,
	UITransform,
	Prefab,
	instantiate,
	Vec3,
	EventTouch,
	Sprite,
	resources,
	SpriteFrame,
	Color,
} from "cc";
const { ccclass, property } = _decorator;
import { chess } from "./chess";

@ccclass("chesses")
export class chesses extends Component {
	@property(Prefab)
	ChessBlock: Prefab;

	protected onLoad(): void {
		resources.preload("textures/Game/block/block1/spriteFrame", SpriteFrame);
		resources.preload("textures/Game/block/block2/spriteFrame", SpriteFrame);
		resources.preload("textures/Game/block/block3/spriteFrame", SpriteFrame);
		resources.preload("textures/Game/block/block4/spriteFrame", SpriteFrame);
	}

	start() {
		this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
	}

	clickNode(event: EventTouch) {}

	//創造一個chess
	createChess(array, center, size, playerIndex) {
		const node = new Node();

		const width = array.length;
		const height = array[0].length;
		let count = -1;

		node.addComponent(UITransform).setContentSize(width * size, height * size);
		node.addComponent(chess);

		for (let x = 0; x < array.length; x++) {
			for (let y = 0; y < array[x].length; y++) {
				if (!array[x][y]) continue;

				const [centerX, centerY] = center;
				const block = instantiate(this.ChessBlock);

				const url = `textures/Game/block/block${playerIndex + 1}/spriteFrame`;

				resources.load(url, SpriteFrame, (err: any, spriteFrame) => {
					block.getComponent(Sprite).spriteFrame = spriteFrame;
				});

				block.getComponent(UITransform).setContentSize(size, size);

				block.setPosition(
					new Vec3((x - centerX) * size, (y - centerY) * size, 0)
				);

				count += 1;

				//中心點格子加深
				if (x === centerX && y === centerY) {
					node.getComponent(chess).index = count;
				}

				node.addChild(block);
			}
		}

		node.name = "Chess";

		return node;
	}

	//放置每一個chess
	setChessPostion(chessData, chessSize, width, height, playerIndex) {
		this.node.removeAllChildren();

		const w = width / 2;
		const h = height / 2;

		for (let index = 0; index < chessData.length; index++) {
			const chessNode = this.createChess(
				chessData[index].matrix,
				chessData[index].center,
				chessSize,
				playerIndex
			);

			chessNode.setPosition(
				new Vec3(
					(chessData[index].position[0] - w) * chessSize,
					(chessData[index].position[1] - h) * chessSize,
					0
				)
			);

			chessNode.getComponent(chess)._index = index;

			if (chessData[index].isDone) chessNode.active = false;

			this.node.addChild(chessNode);
		}
	}
}
