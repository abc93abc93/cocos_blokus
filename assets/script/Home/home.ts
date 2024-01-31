import {
	_decorator,
	Component,
	Node,
	director,
	resources,
	SpriteFrame,
	Label,
} from "cc";
import { progressBar } from "./progressBar";
import { AudioControl } from ".././Audio/AudioControl";
import DataControlPanel from "../DataControlPanel";
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

	@property(Node)
	RankList: Node;

	@property(Node)
	EditBox: Node;

	@property(AudioControl)
	AudioControl: AudioControl = null;

	private player = null;
	private rankBoardList = null;

	protected async start() {
		DataControlPanel.init();
		this.player = DataControlPanel.Profiles;

		//取得使用者資料
		this.user.getChildByName("Name").getComponent(Label).string =
			this.player.nickname;
		this.user
			.getChildByName("score")
			.getChildByName("ScoreText")
			.getComponent(Label).string = await DataControlPanel.getPlayerScoreData();

		//取得排行榜資料
		this.rankBoardList = await DataControlPanel.getRankBoardData(10);

		this.RankList.children.forEach((row, index) => {
			row.getChildByName("Name").getComponent(Label).string =
				this.rankBoardList[index].name;
			row.getChildByName("Score").getComponent(Label).string =
				this.rankBoardList[index].record;
		});
	}

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
			async function (completedCount, totalCount, item) {
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

	protected async changeName() {
		const newName =
			this.EditBox.getChildByName("TEXT_LABEL").getComponent(Label).string;

		if (newName.trim() === "") {
			return;
		}
		await DataControlPanel.updatePlayerName(newName.trim());
		this.user.getChildByName("Name").getComponent(Label).string =
			newName.trim();
		DataControlPanel.saveProfilesData();
		await DataControlPanel.init();
		this.rankBoardList = await DataControlPanel.getRankBoardData(10);
		this.RankList.children.forEach((row, index) => {
			row.getChildByName("Name").getComponent(Label).string =
				this.rankBoardList[index].name;
			row.getChildByName("Score").getComponent(Label).string =
				this.rankBoardList[index].record;
		});
		this.AudioControl.playAudio("default-button");
		this.EditBox.parent.active = false;
	}
}
