import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("openClose")
export class openClose extends Component {
	start() {
		this.node.on(Node.EventType.TOUCH_START, this.openClose, this);
	}

	openClose() {
		this.node.getChildByName("Chesses").active =
			!this.node.getChildByName("Chesses").active;
	}
}
