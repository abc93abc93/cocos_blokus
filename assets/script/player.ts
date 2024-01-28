import {
	_decorator,
	Component,
	Node,
	EventTouch,
	instantiate,
	Vec3,
	Sprite,
	Color,
	tween,
	resources,
	SpriteFrame,
} from "cc";
import { chesses } from "./chesses";
import { chess } from "./chess";
const { ccclass, property } = _decorator;

@ccclass("player")
export class player extends Component {
	id = null;
	index = null;
	color = null;
	chesses = []; //render node
	chosed = null;

	protected onLoad(): void {
		resources.preload("textures/Game/status/none/spriteFrame", SpriteFrame);
		resources.preload("textures/Game/status/play/spriteFrame", SpriteFrame);
		resources.preload("textures/Game/status/pass/spriteFrame", SpriteFrame);
	}

	start() {
		this.setChess();
		this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
	}

	setNewColor() {
		resources.load(
			"textures/Game/status/play/spriteFrame",
			SpriteFrame,
			(err: any, spriteFrame) => {
				this.node.getChildByName("Status").getComponent(Sprite).spriteFrame =
					spriteFrame;
			}
		);
	}

	setOriginColor() {
		resources.load(
			"textures/Game/status/none/spriteFrame",
			SpriteFrame,
			(err: any, spriteFrame) => {
				this.node.getChildByName("Status").getComponent(Sprite).spriteFrame =
					spriteFrame;
			}
		);
	}

	setPassed() {
		resources.load(
			"textures/Game/status/pass/spriteFrame",
			SpriteFrame,
			(err: any, spriteFrame) => {
				this.node.getChildByName("Status").getComponent(Sprite).spriteFrame =
					spriteFrame;
			}
		);
	}

	//玩家自己設置棋子&位置
	setChess() {
		const chessboard = this.node.getChildByName("Chesses");
		const chessboardTs = chessboard.getComponent(chesses);

		//在設置棋子時給棋子陣列跟棋子size
		if (this.index === 0) {
			//0 設為正在遊玩玩家 (寫死待優化)
			chessboardTs.setChessPostion(this.chesses, 10, 20, 22, this.index);
		} else {
			chessboardTs.setChessPostion(this.chesses, 5, 20, 24, this.index);
		}
	}

	setChoesdChess(chosedChessIndex) {
		const chessboard = this.node.getChildByName("Chesses");
		const choseChessNode = chessboard.children[chosedChessIndex];

		let node = instantiate(choseChessNode);

		node.setScale(new Vec3(2, 2, 0));
		const choesdChess = this.node.getChildByName("ChosedChess");
		choesdChess.removeAllChildren();
		node.setPosition(new Vec3(0, -15, 0));

		//中心點格子加深
		const ts = choseChessNode.getComponent(chess); //取點到的棋子的ts (因為複製過去ts的值會重置)
		const darkNode = node
			.getComponentsInChildren(Sprite)
			.find((block, index) => ts.index === index);
		darkNode.color = new Color(200, 200, 200);

		choesdChess.addChild(node);
	}

	clearChoesdChess() {
		const choesdChess = this.node.getChildByName("ChosedChess");
		choesdChess.removeAllChildren();
	}

	rotateChoesdChess(direc: "clockwise" | "counterclockwise", cb) {
		const choesdChess = this.node.getChildByName("ChosedChess");
		const Chess = choesdChess.getChildByName("Chess");
		if (direc === "clockwise") {
			tween(Chess)
				.to(1, { angle: Chess.angle - 90 }, { easing: "quartOut" })
				.call(() => {
					cb();
				})
				.start();
		} else {
			tween(Chess)
				.to(1, { angle: Chess.angle + 90 }, { easing: "quartOut" })
				.call(() => {
					cb();
				})
				.start();
		}
	}

	flipChoesdChess(direc: "vertical" | "horizon", cb) {
		const choesdChess = this.node.getChildByName("ChosedChess");
		const Chess = choesdChess.getChildByName("Chess");
		let direction = direc;

		if (Math.abs(Chess.angle / 90) % 2 !== 0) {
			if (direc === "horizon") {
				direction = "vertical";
			} else {
				direction = "horizon";
			}
		}

		if (direction === "horizon") {
			tween(Chess)
				.to(
					1,
					{
						scale: new Vec3(-Chess.scale.x, Chess.scale.y, 1),
					},
					{ easing: "quartOut" }
				)
				.call(() => {
					cb();
				})
				.start();
		} else {
			tween(Chess)
				.to(
					1,
					{
						scale: new Vec3(Chess.scale.x, -Chess.scale.y, 1),
					},
					{ easing: "quartOut" }
				)
				.call(() => {
					cb();
				})
				.start();
		}
	}

	clickNode(event: EventTouch) {}
}
