import { _decorator, Component, Node, EventTouch } from "cc";
const { ccclass, property } = _decorator;

@ccclass("boardBlock")
export class boardBlock extends Component {
	isClick = false;

	start() {
		this.node.on(Node.EventType.TOUCH_START, this.clickBlock, this);
	}

	clickBlock(event: EventTouch) {
		if (!this.isClick) return;

		console.log("click node", this.node.worldPosition, this.isClick);
	}

	getClick() {
		return this.isClick;
	}

	update(deltaTime: number) {
		this.getClick();
	}
}
