import { _decorator, Component } from "cc";
import { AudioControl } from ".././Audio/AudioControl";
const { ccclass, property } = _decorator;

@ccclass("openClose")
export class openClose extends Component {
	@property(AudioControl)
	AudioControl: AudioControl = null;

	openClose() {
		this.AudioControl.playAudio("default-button");
		this.node.active = !this.node.active;
	}
}
