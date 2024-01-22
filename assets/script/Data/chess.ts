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
		position: [3, 15],
	},
	/** block2 */
	{
		matrix: [[1]],
		center: [0, 0],
		position: [7, 15],
	},
	/** block3 */
	{
		matrix: [[1], [1]],
		center: [0, 0],
		position: [10, 15],
	},
	/** block4 */
	{
		matrix: [[1], [1], [1]],
		center: [1, 0],
		position: [15, 15],
	},
	/** block5 */
	{
		matrix: [[1], [1], [1], [1]],
		center: [1, 0],
		position: [20, 15],
	},
	/** block6 */
	{
		matrix: [
			[0, 1, 1],
			[1, 1, 1],
		],
		center: [1, 1],
		position: [2, 10],
	},
	/** block7 */
	{
		matrix: [
			[0, 1, 0],
			[1, 1, 1],
			[0, 1, 0],
		],
		center: [1, 1],
		position: [6, 11],
	},
	/** block8 */
	{
		matrix: [
			[0, 1, 1],
			[1, 1, 0],
		],
		center: [0, 1],
		position: [11, 11],
	},
	/** block9 */
	{
		matrix: [
			[0, 1, 1],
			[0, 1, 0],
			[1, 1, 0],
		],
		center: [1, 1],
		position: [15, 11],
	},
	/** block10 */
	{
		matrix: [[1], [1], [1], [1], [1]],
		center: [2, 0],
		position: [21, 11],
	},
	/** block11 */
	{
		matrix: [
			[0, 0, 0, 1],
			[1, 1, 1, 1],
		],
		center: [1, 2],
		position: [3, 6],
	},
	/** block12 */
	{
		matrix: [
			[0, 0, 1, 1],
			[1, 1, 1, 0],
		],
		center: [1, 2],
		position: [9, 6],
	},
	/** block13 */
	{
		matrix: [
			[1, 1, 0],
			[0, 1, 1],
			[0, 1, 0],
		],
		center: [1, 1],
		position: [14, 7],
	},
	/** block14 */
	{
		matrix: [
			[0, 1, 0],
			[1, 1, 1],
		],
		center: [1, 1],
		position: [18, 6],
	},
	/** block15 */
	{
		matrix: [
			[1, 0, 0],
			[1, 1, 0],
			[0, 1, 1],
		],
		center: [1, 1],
		position: [22, 7],
	},
	/** block16 */
	{
		matrix: [
			[1, 1],
			[1, 1],
		],
		center: [1, 0],
		position: [2, 1],
	},
	/** block17 */
	{
		matrix: [
			[1, 0, 1],
			[1, 1, 1],
		],
		center: [1, 1],
		position: [7, 1],
	},
	/** block18 */
	{
		matrix: [
			[0, 1, 0],
			[0, 1, 0],
			[1, 1, 1],
		],
		center: [1, 1],
		position: [11, 2],
	},
	/** block19 */
	{
		matrix: [
			[0, 0, 1],
			[1, 1, 1],
		],
		center: [1, 1],
		position: [15, 1],
	},
	/** block20 */
	{
		matrix: [
			[1, 0, 0],
			[1, 0, 0],
			[1, 1, 1],
		],
		center: [1, 0],
		position: [20, 2],
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
		position: [23, 2],
	},
];
