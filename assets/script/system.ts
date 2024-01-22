import { _decorator, Component, Node, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass("home")
export class home extends Component {
	start() {}

	homeToGame() {
		director.loadScene("Game");
	}

	update(deltaTime: number) {}
}
