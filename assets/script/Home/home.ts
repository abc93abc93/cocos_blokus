import { _decorator, Component, Node, director } from "cc";
import { progressBar } from "./progressBar";
const { ccclass, property } = _decorator;

@ccclass("home")
export class home extends Component {
	@property(Node)
	progressBar: Node;

	start() {}

	homeToGame() {
		let progressBarTs = this.progressBar.getComponent(progressBar);

		director.preloadScene(
			"game",
			function (completedCount, totalCount, item) {
				progressBarTs.num = completedCount / totalCount;
				progressBarTs.show();
			},
			function () {
				progressBarTs.hide();
				//加载场景
				director.loadScene("game");
			}
		);
	}

	update(deltaTime: number) {}
}
