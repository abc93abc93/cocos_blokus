import {
	_decorator,
	Component,
	Node,
	EventTouch,
	instantiate,
	Vec3,
	UITransform,
	Sprite,
	Color,
	tween,
} from "cc";
import { chess } from "./chess";
import { board } from "./board";
import { chesses } from "./chesses";
const { ccclass, property } = _decorator;

@ccclass("player")
export class player extends Component {
	id = null;
	index = null;
	color = null;
	chesses = []; //render node
	chosed = null;

	start() {
		this.setChess();
		this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
	}

	setNewColor() {
		this.node.getComponent(Sprite).color = new Color(255, 255, 255);
	}

	setOriginColor() {
		this.node.getComponent(Sprite).color = this.color;
	}

	setChess() {
		const chessboard = this.node.getChildByName("Chesses");
		const chessboardTs = chessboard.getComponent(chesses);
		chessboardTs.setChessPostion(this.chesses);
	}

	setChoesdChess(chosedChessIndex) {
		const chessboard = this.node.getChildByName("Chesses");
		const choseChessNode = chessboard.children[chosedChessIndex];
		let node = instantiate(choseChessNode);
		const choesdChess = this.node.getChildByName("ChosedChess");
		choesdChess.removeAllChildren();
		node.setPosition(new Vec3(0, 0, 0));
		choesdChess.addChild(node);
	}

	clearChoesdChess() {
		const choesdChess = this.node.getChildByName("ChosedChess");
		choesdChess.removeAllChildren();
	}

	rotateChoesdChess() {
		const choesdChess = this.node.getChildByName("ChosedChess");
		const Chess = choesdChess.getChildByName("Chess");

		tween(Chess)
			.to(1, { angle: Chess.angle - 90 }, { easing: "quartOut" })
			.start();
	}

	flipChoesdChess() {
		const choesdChess = this.node.getChildByName("ChosedChess");
		const Chess = choesdChess.getChildByName("Chess");
		tween(Chess)
			.to(1, { scale: new Vec3(-Chess.scale.x, 1, 1) }, { easing: "quartOut" })
			.start();
	}

	clickNode(event: EventTouch) {
		// if (event.target.name === 'PassedBtn') {
		// 	this.passed = true
		// };
		// if (!this.turn) {
		// 	event.propagationStopped = true;
		// }
	}
}
// choseChess(event: EventTouch) {
// 	const target = this.node.getChildByName(event.target.name);
// }

// 		if (target && this.chosed_node) {
// 		this.chosed_chess.destroyAllChildren();
// 		const newNode = this.cloneNode(target);
// 		this.chosed_chess.addChild(newNode);
// 		this.movable_chess = newNode;

// 		this.chosed_node.active = true;
// 		target.active = false;
// 		this.chosed_node = target;
// 	} else if (target) {
// 		const newNode = this.cloneNode(target);
// 		this.chosed_chess.addChild(newNode);
// 		this.movable_chess = newNode;

// 		target.active = false;
// 		this.chosed_node = target;
// 	} else {
// 		this.resetNode();
// 	}

// 	if (this.movable_chess) {
// 		this.board.getComponent(board).resetRenderChessPosition();

// 		this.board
// 			.getComponent(board)
// 			.handlerAvailablePosition(this.movable_chess);
// 	} else {
// 		this.board.getComponent(board).resetRenderChessPosition();
// 	}
// }

// cloneNode(node) {
// 	let chosedNode = instantiate(node);
// 	chosedNode.getComponentsInChildren(UITransform).map((block) => {
// 		block.setContentSize(25, 25);
// 	});
// 	chosedNode.setPosition(new Vec3(0, 0, 0));
// 	chosedNode.getComponent(chess).movable = true;

// 	return chosedNode;
// }

// resetNode() {
// 	this.chosed_chess.destroyAllChildren();

// 	this.movable_chess = null;

// 	if (this.chosed_node) this.chosed_node.active = true;
// 	this.chosed_node = null;
// }

// update(deltaTime: number) { }
