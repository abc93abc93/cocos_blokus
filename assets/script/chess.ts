import {
	_decorator,
	Component,
	Node,
	Prefab,
	instantiate,
	Vec3,
	EventTouch,
	Label,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("chess")
export class chess extends Component {
	@property(Prefab)
	block: Prefab;

	@property([String])
	matrix: string[] = [];

	@property(Number)
	center_X: Number = 0;

	@property(Number)
	center_Y: Number = 0;

	_index = null;
	_array = [];
	_array_vector = [];
	_center = [];
	_size = 20;

	movable = false;

	start() {
		this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
	}

	clickNode(event: EventTouch) {}

	init() {
		// this._array = this.matrix.map((string) =>
		// 	string.split("").map((el) => Number(el))
		// );
		// this._center = [Number(this.center_X), Number(this.center_Y)];
	}

	// setChessVector() {
	// 	const [centerX, centerY] = this._center;

	// 	for (let x = 0; x < this._array.length; x++) {
	// 		for (let y = 0; y < this._array[x].length; y++) {
	// 			if (this._array[x][y] === 0) continue;

	// 			this._array_vector.push([x - centerX, y - centerY]);
	// 		}
	// 	}
	// }

	// setChess() {
	// 	for (let x = 0; x < this._array.length; x++) {
	// 		for (let y = 0; y < this._array[x].length; y++) {
	// 			if (!this._array[x][y]) continue;

	// 			const [centerX, centerY] = this._center;
	// 			const block = instantiate(this.block);

	// 			block.setPosition(
	// 				new Vec3((x - centerX) * this._size, (y - centerY) * this._size, 0)
	// 			);

	// 			//設置數據 (之後刪)
	// 			const label = block.getChildByName("Label");
	// 			label.getComponent(Label).string = `${x}${y}`;

	// 			this.node.addChild(block);
	// 		}
	// 	}
	// }

	//   choseChess(event: EventTouch) {
	//     if (!this.movable) return

	//     this.chosed = true;
	//   }

	// moveChess(event: EventTouch) {
	// 	if (!this.movable) return;

	// 	this.UIloc = event.getUILocation();
	// 	this.node.setWorldPosition(this.UIloc.x, this.UIloc.y, 0);
	// }

	//   moveChessEnd(event: EventTouch) {
	//     if (!this.movable) return

	//     if (this.targetArr.length !== 0) {
	//       this.targetArr.forEach((posObj) => {
	//         const distance = Vec3.distance(new Vec3(this.UIloc.x, this.UIloc.y, 0), posObj.worldPosition);
	//         if (distance < 25) this.target = posObj;
	//       });
	//     }
	//     this.target ? this.setTargetPosition(this.target) : this.setDafaultPosition();
	//   }

	//   moveChessCancel(event: EventTouch) {
	//     if (!this.movable) return
	//     this.setDafaultPosition();
	//   }

	//   //移回預設位置
	//   setDafaultPosition() {
	//     this.node.setPosition(this.oringin_pos);
	//   }

	//   //移到目標位置
	//   setTargetPosition(posObj) {
	//     this.node.setWorldPosition(posObj.worldPosition);
	//     this.positionInBoard = posObj.positionInBoard;
	//     this.movable = false;
	//   }

	protected onDestroy(): void {
		// this.node.on(Node.EventType.TOUCH_START, this.choseChess, this);
		// this.node.on(Node.EventType.TOUCH_MOVE, this.moveChess, this);
		// this.node.on(Node.EventType.TOUCH_END, this.moveChessEnd, this)
		// this.node.on(Node.EventType.TOUCH_CANCEL, this.setDafaultPosition, this)
	}
}
