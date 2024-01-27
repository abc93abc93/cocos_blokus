import {
	_decorator,
	AssetManager,
	AudioClip,
	AudioSource,
	Component,
} from "cc";
import { AudioList } from "./AudioList";
const { ccclass, property } = _decorator;

@ccclass("AudioControl")
export class AudioControl extends Component {
	@property({ type: [AudioSource] })
	audioSources: AudioSource[] = [];

	start() {}

	update() {}

	playAudio(audioName: keyof AudioList) {
		// 在陣列中尋找匹配的音效名稱
		const audioSource = this.audioSources.find(
			(source) => source.node.name === audioName
		);
		console.warn(audioSource);
		if (audioSource) {
			audioSource.play();
		} else {
			console.warn("Audio source not found for: ", audioName);
		}
	}

	stopAudio(audioName: keyof AudioList) {
		// 在陣列中尋找匹配的音效名稱
		const audioSource = this.audioSources.find(
			(source) => source.node.name === audioName
		);
		console.warn(audioSource);
		if (audioSource) {
			audioSource.stop();
		} else {
			console.warn("Audio source not found for: ", audioName);
		}
	}
}
