import { _decorator, Component, Node, Prefab, EventTouch } from "cc";
const { ccclass, property } = _decorator;

@ccclass("chess")
export class chess extends Component {
	index = null;
	_index = null;

	start() {
		this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
	}

	clickNode(event: EventTouch) {}
}
