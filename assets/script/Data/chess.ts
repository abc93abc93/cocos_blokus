export type ChessData = {
	/** 二維陣列表示 */
	matrix: number[][];
	/** 棋子代表中心點的位置 */
	center: [number, number];
	/** 在畫面上的位子 */
	position: [number, number];
};

export const chessesData: ChessData[] = [
	/** block1 */
	{
		matrix: [
			[1, 1],
			[0, 1],
		],
		center: [0, 1],
		position: [3, 19],
	},
	/** block2 */
	{
		matrix: [[1]],
		center: [0, 0],
		position: [7, 19],
	},
	/** block3 */
	{
		matrix: [[1], [1]],
		center: [0, 0],
		position: [10, 19],
	},
	/** block4 */
	{
		matrix: [[1], [1], [1]],
		center: [1, 0],
		position: [15, 19],
	},
	//第二排
	/** block6 */
	{
		matrix: [
			[0, 1, 1],
			[1, 1, 1],
		],
		center: [1, 1],
		position: [3, 14],
	},
	/** block7 */
	{
		matrix: [
			[0, 1, 0],
			[1, 1, 1],
			[0, 1, 0],
		],
		center: [1, 1],
		position: [7, 15],
	},
	/** block8 */
	{
		matrix: [
			[0, 1, 1],
			[1, 1, 0],
		],
		center: [0, 1],
		position: [11, 15],
	},
	/** block9 */
	{
		matrix: [
			[0, 1, 1],
			[0, 1, 0],
			[1, 1, 0],
		],
		center: [1, 1],
		position: [15, 15],
	},
	//第三排
	/** block11 */
	{
		matrix: [
			[0, 0, 0, 1],
			[1, 1, 1, 1],
		],
		center: [1, 2],
		position: [3, 10],
	},
	/** block12 */
	{
		matrix: [
			[0, 0, 1, 1],
			[1, 1, 1, 0],
		],
		center: [1, 2],
		position: [6, 10],
	},
	/** block13 */
	{
		matrix: [
			[1, 1, 0],
			[0, 1, 1],
			[0, 1, 0],
		],
		center: [1, 1],
		position: [10, 10],
	},
	/** block20 */
	{
		matrix: [
			[1, 0, 0],
			[1, 0, 0],
			[1, 1, 1],
		],
		center: [1, 0],
		position: [14, 9],
	},
	/** block14 */
	{
		matrix: [
			[0, 1, 0],
			[1, 1, 1],
		],
		center: [1, 1],
		position: [18, 10],
	},
	//第四排
	/** block16 */
	{
		matrix: [
			[1, 1],
			[1, 1],
		],
		center: [1, 0],
		position: [3, 4],
	},
	/** block17 */
	{
		matrix: [
			[1, 0, 1],
			[1, 1, 1],
		],
		center: [1, 1],
		position: [7, 5],
	},
	/** block10 */
	{
		matrix: [[1], [1], [1], [1], [1]],
		center: [2, 0],
		position: [11, 5],
	},
	/** block19 */
	{
		matrix: [
			[0, 0, 1],
			[1, 1, 1],
		],
		center: [1, 1],
		position: [16, 5],
	},
	//第五排
	/** block5 */
	{
		matrix: [[1], [1], [1], [1]],
		center: [1, 0],
		position: [3, 1],
	},
	/** block18 */
	{
		matrix: [
			[0, 1, 0],
			[0, 1, 0],
			[1, 1, 1],
		],
		center: [1, 1],
		position: [8, 1],
	},
	/** block15 */
	{
		matrix: [
			[1, 0, 0],
			[1, 1, 0],
			[0, 1, 1],
		],
		center: [1, 1],
		position: [12, 1],
	},
	/** block21 */
	{
		matrix: [
			[1, 0],
			[1, 0],
			[1, 1],
			[1, 0],
		],
		center: [2, 0],
		position: [17, 0],
	},
];
