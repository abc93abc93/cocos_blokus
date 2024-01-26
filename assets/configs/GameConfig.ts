interface GameSettings {
	/** 指定目標伺服器 */
	targetUrl: string;

	// 其他連結可放置此處
}

interface InitSettings {
	/** 是否需要線上初始化使用者資料 */
	isGoOnline: boolean;
}

interface ApiServerSettings {
	/** ws網址 */
	wsUrl: string;
	/** 請求網址 */
	apiUrl: string;
	/** 平台名稱 */
	Platform: string;
	/** 金鑰 */
	Secret: string;
}

interface GameConfig {
	/** 遊戲名稱 */
	gameName: string;
	/** 版本 */
	version: string;
	/** 基礎設定 */
	settings: GameSettings;
	/** 初始化 */
	initSettings: InitSettings;
	/** API Server 設定 */
	apiServer: ApiServerSettings;
}

const gameConfig: GameConfig = {
	gameName: "Blokus",
	version: "0.0.1", // 測試從 0.0.1 正式上線從1.0.0
	settings: {
		targetUrl: "https://parazeni.com/",
	},
	initSettings: {
		isGoOnline: true,
	},
	apiServer: {
		wsUrl: "ws://x.app/trpc",
		apiUrl: "https://game-trpc.parazeni.app/trpc",
		// apiUrl: "https://game-trpc.zeabur.app/trpc",
		Platform: "blokus",
		Secret: "c6d87d81f6b62b88",
	},
};

/** @type {GameConfig} */
export default gameConfig;
