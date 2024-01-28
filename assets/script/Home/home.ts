import {
	_decorator,
	Component,
	Node,
	director,
	resources,
	SpriteFrame,
} from "cc";
import { progressBar } from "./progressBar";
import { AudioControl } from ".././Audio/AudioControl";
const { ccclass, property } = _decorator;

@ccclass("home")
export class home extends Component {
	@property(Node)
	progressBar: Node;

	@property(Node)
	playerBtn: Node;

	@property(Node)
	rankBtn: Node;

	@property(Node)
	user: Node;

	@property(AudioControl)
	AudioControl: AudioControl = null;

	start() {}

	homeToGame() {
		//隱藏節點
		this.playerBtn.active = false;
		this.rankBtn.active = false;
		this.user.active = false;

		//顯示進度條節點
		this.progressBar.active = true;

		let progressBarTs = this.progressBar.getComponent(progressBar);
		this.AudioControl.playAudio("default-button");
		director.preloadScene(
			"game",
			function (completedCount, totalCount, item) {
				progressBarTs.num = completedCount / totalCount;
				progressBarTs.show();

				resources.preload(
					"textures/Game/block/block1/spriteFrame",
					SpriteFrame
				);
				resources.preload(
					"textures/Game/block/block2/spriteFrame",
					SpriteFrame
				);
				resources.preload(
					"textures/Game/block/block3/spriteFrame",
					SpriteFrame
				);
				resources.preload(
					"textures/Game/block/block4/spriteFrame",
					SpriteFrame
				);

				resources.preload("textures/Game/status/none/spriteFrame", SpriteFrame);
				resources.preload("textures/Game/status/play/spriteFrame", SpriteFrame);
				resources.preload("textures/Game/status/pass/spriteFrame", SpriteFrame);
			},
			function () {
				progressBarTs.hide();
				//加载场景
				director.loadScene("game");
			}
		);
	}
}
