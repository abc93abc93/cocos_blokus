import { _decorator, Component, Node, EventTouch } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CheckBtn")
export class CheckBtn extends Component {
	start() {
		this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
	}

	clickNode(event: EventTouch) {}

	update(deltaTime: number) {}
}
