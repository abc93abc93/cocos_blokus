import { _decorator, Component, sys, js, Label, Node, size } from "cc";
import GameConfig from "../configs/GameConfig";
import ApiServer from "./util/apiServer";
const { apiServer } = ApiServer; // 暫時沒使用這功能
import { client } from "./util/tRPC_Server";

const { ccclass, property } = _decorator;
const { initSettings, settings } = GameConfig;

const profilesKey = "profiles";

interface Profiles {
	uid: string;
	nickname: string;
	level: number;
	point: number;
}

class DataControlPanel {
	private _profiles: Profiles = null;

	async init() {
		//! (for dev 測試) 清除暫存 profile 資料
		console.log("sys.localStorage", sys.localStorage.getItem(profilesKey));
		// sys.localStorage.removeItem(profilesKey);
		console.log("sys.localStorage", sys.localStorage.getItem(profilesKey));

		console.log("➫ 遊戲紀錄初始化 (本地資料)");
		const initProfiles = sys.localStorage.getItem(profilesKey);
		if (initProfiles) console.log(initProfiles);
		console.log("== == == == ==");
		// 遊戲啟動時 若沒取到基礎資料
		if (!initProfiles) {
			console.log("基礎資料 ➫ 無");
			// 在初始化使用者管理器時，檢查是否需要線上初始化使用者資料
			if (initSettings.isGoOnline) {
				try {
					await this.registerUserOnline();
				} catch (error) {
					console.log("初始化異常", error);
				}
			} else {
				this.initUserLocally();
			}
		} else {
			this.reloadProfilesData();
		}
	}

	get Profiles(): Profiles {
		return { ...this._profiles };
	}

	set Profiles({
		uid,
		level,
		nickname,
	}: {
		uid?: string;
		level?: number;
		nickname?: string;
	}) {
		console.log("➫ set Profiles : ", uid, level, nickname);
		if (uid) this._profiles.uid = uid;
		if (level) this._profiles.level = level;
		if (nickname) this._profiles.nickname = nickname;
		// console.log("➫ Profiles update: ", this._profiles);
	}

	// 在線上初始化使用者資料
	private async registerUserOnline() {
		// 透過網路連接，創建新的使用者資料
		// 這裡可以包括與伺服器溝通，創建新帳號，取得使用者資料等等
		const accInfo = await client.users.generateAccount.query();
		//TODO 製作彈窗顯示錯誤
		if (!accInfo) return console.log("client.users.generateAccount 失敗");
		// console.log("➫ User data created online:", accInfo);
		this._profiles = this.generateProfileData({
			uid: accInfo.userId,
			nickname: accInfo.name,
		});
		this.saveProfilesData();
	}

	// 本地初始化使用者資料
	private initUserLocally() {
		// 從本地資料中加載使用者資料
		// 可能是從本地存儲或者預設資料中取得
		this._profiles = this.generateProfileData();
		// console.log("➫ User data loaded locally:", this._profiles);
		this.saveProfilesData();
	}

	/** 生成使用者資料 */
	generateProfileData(data: { uid: string; nickname: string } | null = null) {
		const { uid, nickname } = data ?? {};

		const profiles: Profiles = {
			uid: uid ?? this.generateDateNowUID(),
			nickname: nickname ?? "",
			level: 0,
			point: 0,
		};
		// console.log("➫ generateProfileData", profiles);

		return profiles;
	}

	/** (localStorage) 儲存本地資料 */
	saveProfilesData() {
		const jsonStr = JSON.stringify(this._profiles);
		sys.localStorage.setItem(profilesKey, jsonStr);
		// console.log("➫  this.profiles 保存成功", jsonStr);
	}

	/** 更新最新線上資料 */
	async reloadProfilesData() {
		const jsonStr = sys.localStorage.getItem(profilesKey);
		this._profiles = JSON.parse(jsonStr) as Profiles;
		// console.log("➫  this._profiles 刷新本地資料", this._profiles);
		//線上更新 session & 本地更新
		if (initSettings.isGoOnline) {
			try {
				const accInfo = await client.users.get.query({
					userId: this._profiles.uid,
				});
				// console.log("重新更新使用者資料 成功", accInfo);
				if (accInfo.userId) this.Profiles = { uid: accInfo.userId };
				if (accInfo.name) this.Profiles = { nickname: accInfo.name };
				// console.log("更新本地資料 ", this.Profiles);
				this.saveProfilesData();
			} catch (error) {
				console.log("重新更新使用者資料 失敗", error);
			}
		}
	}

	/** 生成隨機英文(大,小)+數字 */
	generateRandomUID(length: number) {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const charactersLength = characters.length;

		const uid = Array.from({ length: length }, () =>
			characters.charAt(Math.floor(Math.random() * charactersLength))
		).join("");

		return uid;
	}

	/** 生成 時間戳型 UID */
	generateDateNowUID() {
		return String(Date.now());
	}

	//取得玩家分數資料
	async getPlayerScoreData() {
		try {
			const playerScoreData = await client.scoreboard.getScore.query({
				userId: this.Profiles.uid,
			});

			return playerScoreData.record;
		} catch (error) {
			// console.log("重新更新使用者資料 失敗", error);
		}
	}

	//取得排行榜資料
	async getRankBoardData(size) {
		try {
			const rankBoardData = await client.scoreboard.get.query({
				size: size,
				order_by: "DESC",
			});

			return rankBoardData.list;
		} catch (error) {
			// console.log("重新更新使用者資料 失敗", error);
		}
	}

	//更新玩家分數
	async updatePlayerScore(score) {
		try {
			const oldScore = await this.getPlayerScoreData();
			const updateScore = await client.scoreboard.update.mutate({
				userId: this.Profiles.uid,
				score: String(Number(score) + Number(oldScore)),
			});

			const { success } = updateScore;
		} catch (error) {
			// console.log("重新更新使用者資料 失敗", error);
		}
	}

	//更新玩家名稱
	async updatePlayerName(name) {
		try {
			const updateName = await client.users.update.mutate({
				userId: this.Profiles.uid,
				name: name,
			});

			const { success } = updateName;
		} catch (error) {
			// console.log("重新更新使用者資料 失敗", error);
		}
	}
}
export default new DataControlPanel();
