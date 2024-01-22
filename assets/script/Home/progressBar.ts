import { _decorator, Component, Label, Node, ProgressBar } from "cc";
const { ccclass, property } = _decorator;

@ccclass("progressBar")
export class progressBar extends Component {
	num = 0; //進度數據
	isShow = false; //顯示

	start() {}

	show() {
		this.isShow = true;
		this.node.active = true;
	}
	hide() {
		this.isShow = false;
		this.node.active = false;
	}
	update(deltaTime: number) {
		let progressBar = this.node.getComponent(ProgressBar);
		progressBar.progress = this.num;
		this.node.getChildByName("Num").getComponent(Label).string =
			Math.trunc(this.num * 100) + "%";
	}
}
