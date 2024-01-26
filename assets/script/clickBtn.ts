import {
	_decorator,
	Component,
	Node,
	resources,
	Sprite,
	SpriteFrame,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("clickBtn")
export class clickBtn extends Component {
	start() {
		this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
		this.node.on(Node.EventType.TOUCH_END, this.clickNodeEnd, this);
	}

	clickNode() {}

	clickNodeEnd() {}
}
