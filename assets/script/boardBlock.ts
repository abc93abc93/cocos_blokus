import { _decorator, Component, Node, EventTouch } from "cc";
const { ccclass, property } = _decorator;

@ccclass("boardBlock")
export class boardBlock extends Component {
	x: number;
	y: number;

	start() {
		this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
	}

	clickNode(event: EventTouch) {}
}
