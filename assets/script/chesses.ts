import {
	_decorator,
	Component,
	Node,
	EventTouch,
	instantiate,
	Vec3,
	UITransform,
} from "cc";
import { chess } from "./chess";
const { ccclass, property } = _decorator;

@ccclass("chesses")
export class chesses extends Component {
	@property(Node)
	chosed_chess: Node;

	chosed_node = null;
	movable_chess = null;

	start() {
		this.node.on(Node.EventType.TOUCH_START, this.choseChess, this);
	}

	choseChess(event: EventTouch) {
		const target = this.node.getChildByName(event.target.name);

		if (target && this.chosed_node) {
			this.chosed_chess.destroyAllChildren();
			const newNode = this.cloneNode(target);
			this.chosed_chess.addChild(newNode);
			this.movable_chess = newNode;

			this.chosed_node.active = true;
			target.active = false;
			this.chosed_node = target;
		} else if (target) {
			const newNode = this.cloneNode(target);
			this.chosed_chess.addChild(newNode);
			this.movable_chess = newNode;

			target.active = false;
			this.chosed_node = target;
		} else {
			this.resetNode();
		}
	}

	cloneNode(node) {
		let chosedNode = instantiate(node);
		chosedNode.getComponentsInChildren(UITransform).map((block) => {
			block.setContentSize(25, 25);
		});
		chosedNode.setPosition(new Vec3(0, 0, 0));
		chosedNode.getComponent(chess).movable = true;

		return chosedNode;
	}

	resetNode() {
		this.chosed_chess.destroyAllChildren();
		this.movable_chess = null;

		this.chosed_node.active = true;
		this.chosed_node = null;
	}

	update(deltaTime: number) {}
}
