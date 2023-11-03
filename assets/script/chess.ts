import { _decorator, Component, Node, Prefab, instantiate, Vec3, Sprite, Color, EventTouch, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('chess')
export class chess extends Component {

  @property(Prefab)
  block: Prefab;

  @property([String])
  matrix: string[] = [];

  @property(Number)
  center_X: Number = 0;

  @property(Number)
  center_Y: Number = 0;

  array = [];
  center = { x: 0, y: 0 }
  border = [];
  oringin_pos = null;
  UIloc = null;
  chosed = false;
  dragable = true;
  drag = false;
  targetArr = [];
  target = null;
  positionInBoard = [];

  movable = true;

  corner = [];

  protected onLoad(): void {
    this.init();
  }

  start() {

    this.setChess();
    this.node.on(Node.EventType.TOUCH_START, this.choseChess, this)
    this.node.on(Node.EventType.TOUCH_MOVE, this.moveChess, this)
    this.node.on(Node.EventType.TOUCH_END, this.moveChessEnd, this)
    this.node.on(Node.EventType.TOUCH_CANCEL, this.moveChessCancel, this)

  }

  init() {
    this.array = this.matrix.map((string) => string.split('').map((el) => Number(el)));
    this.center = { x: Number(this.center_X), y: Number(this.center_Y) }
    this.oringin_pos = this.node.getPosition();

    this.getBorder();
    this.getCorner();
  }


  setChess() {
    for (let x = 0; x < this.array.length; x++) {
      for (let y = 0; y < this.array[x].length; y++) {
        if (!this.array[x][y]) continue;
        const boardBlock = instantiate(this.block);
        const size = boardBlock.getComponent(UITransform).contentSize.x
        boardBlock.setPosition(new Vec3((x - this.center.x) * size, (y - this.center.y) * size, 0))
        this.node.addChild(boardBlock);
      }
    }
  }

  choseChess(event: EventTouch) {
    if (!this.movable) return

    this.chosed = true;
  }

  moveChess(event: EventTouch) {
    if (!this.movable) return

    this.UIloc = event.getUILocation();
    this.node.setWorldPosition(this.UIloc.x, this.UIloc.y, 0);
  }

  moveChessEnd(event: EventTouch) {
    if (!this.movable) return

    if (this.targetArr.length !== 0) {
      this.targetArr.forEach((posObj) => {
        const distance = Vec3.distance(new Vec3(this.UIloc.x, this.UIloc.y, 0), posObj.worldPosition);
        if (distance < 25) this.target = posObj;
      });
    }
    this.target ? this.setTargetPosition(this.target) : this.setDafaultPosition();
  }

  moveChessCancel(event: EventTouch) {
    if (!this.movable) return
    this.setDafaultPosition();
  }

  //移回預設位置
  setDafaultPosition() {
    this.node.setPosition(this.oringin_pos);
  }

  //移到目標位置
  setTargetPosition(posObj) {
    this.node.setWorldPosition(posObj.worldPosition);
    this.positionInBoard = posObj.positionInBoard;
    this.movable = false;
  }


  getCorner() {
    for (let x = 0; x < this.array.length; x++) {
      for (let y = 0; y < this.array[x].length; y++) {
        if (this.array[x][y] === 0) continue

        if (x - 1 < 0 || y - 1 < 0) {
          this.corner.push([x - 1, y - 1])
        }

        if (x - 1 < 0 || y + 1 >= this.array[x].length) {
          this.corner.push([x - 1, y + 1])
        }

        if (x + 1 >= this.array.length || y + 1 >= this.array[x].length) { this.corner.push([x + 1, y + 1]) }

        if (x + 1 >= this.array.length || y - 1 < 0) {
          this.corner.push([x + 1, y - 1])
        }
      }
    }

    this.corner = this.corner.filter((el) => !this.border.some((b) => b[0] === el[0] && b[1] === el[1]))
  }

  getBorder() {
    for (let x = 0; x < this.array.length; x++) {
      for (let y = 0; y < this.array[x].length; y++) {
        if (this.array[x][y] === 0) continue

        if (x - 1 < 0) {
          this.border.push([x - 1, y])
        }

        if (x + 1 >= this.array.length) {
          this.border.push([x + 1, y])
        }

        if (y + 1 >= this.array[x].length) {
          this.border.push([x, y + 1])
        }

        if (y - 1 < 0) {
          this.border.push([x, y - 1])
        }
      }
    }
  }

  protected onDestroy(): void {
    this.node.on(Node.EventType.TOUCH_START, this.choseChess, this)
    this.node.on(Node.EventType.TOUCH_MOVE, this.moveChess, this)
    this.node.on(Node.EventType.TOUCH_END, this.moveChessEnd, this)
    this.node.on(Node.EventType.TOUCH_CANCEL, this.setDafaultPosition, this)
  }
}


