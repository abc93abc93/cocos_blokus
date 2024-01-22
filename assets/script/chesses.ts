import {
	_decorator,
	Component,
	Node,
	UITransform,
	Prefab,
	instantiate,
	Vec3,
	Label,
	EventTouch,
	Script,
} from "cc";
const { ccclass, property } = _decorator;
import { chess } from "./chess";

@ccclass("chesses")
export class chesses extends Component {
	@property(Prefab)
	ChessBlock: Prefab;

	start() {
		this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
	}

	clickNode(event: EventTouch) {}

	//創造一個chess
	createChess(array, center, size) {
		const node = new Node();

		const width = array.length;
		const height = array[0].length;

		for (let x = 0; x < array.length; x++) {
			for (let y = 0; y < array[x].length; y++) {
				if (!array[x][y]) continue;

				const [centerX, centerY] = center;
				const block = instantiate(this.ChessBlock);

				block.setPosition(
					new Vec3((x - centerX) * size, (y - centerY) * size, 0)
				);

				//設置數據 (之後刪)
				const label = block.getChildByName("Label");
				label.getComponent(Label).string = `${x}${y}`;

				node.addChild(block);
			}
		}

		node.addComponent(UITransform).setContentSize(width * size, height * size);
		node.addComponent(chess);
		node.name = "Chess";

		return node;
	}

	//放置每一個chess
	setChessPostion(chessData) {
		this.node.removeAllChildren();

		const w = 25 / 2;
		const h = 17 / 2;

		for (let index = 0; index < chessData.length; index++) {
			const chessNode = this.createChess(
				chessData[index].matrix,
				chessData[index].center,
				10
			);

			chessNode.setPosition(
				new Vec3(
					(chessData[index].position[0] - w) * 10,
					(chessData[index].position[1] - h) * 10,
					0
				)
			);

			chessNode.getComponent(chess)._index = index;

			if (chessData[index].isDone) chessNode.active = false;

			this.node.addChild(chessNode);
		}
	}

	update(deltaTime: number) {}
}
