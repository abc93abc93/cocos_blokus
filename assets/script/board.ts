import { _decorator, Color, Component, instantiate, Node, Prefab, Sprite, UITransform, Vec3 } from 'cc';
import { chess } from './chess';
const { ccclass, property } = _decorator;

type placedPosition = { x: number, y: number }[]

@ccclass('board')
export class board extends Component {

  @property(Prefab)
  board_block: Prefab;

  @property(Node)
  chess: Node;

  @property(Node)
  block2: Node;


  board = [];
  UIboard = [];
  _board_size = 20;
  chesses = [];
  choosed_chess = null;
  placedPositions: placedPosition = [];

  //player
  color = '';
  corner = [0, 0];
  validPosition = [];


  protected onLoad(): void {
    this.setBoardData();
    this.setBoard();

    this.chesses.push(this.chess, this.block2)
  }

  start() {
    this.checkValidPosition()
  }

  // M
  setBoardData() {
    for (let i = 0; i < this._board_size; i++) {
      let arr = [];
      for (let x = 0; x < this._board_size; x++) {
        arr.push(0);
      }
      this.board.push(arr)
    }
  }

  // V
  setBoard() {

    for (let x = 0 - (this.board.length / 2); x < (this.board.length / 2); x++) {
      let arr = [];
      for (let y = 0 - (this.board.length / 2); y < (this.board.length / 2); y++) {
        const boardBlock = instantiate(this.board_block);
        const size = boardBlock.getComponent(UITransform).contentSize.x
        boardBlock.setPosition(new Vec3(x * size, y * size, 0))
        const boardBlockWordPosition = boardBlock.getWorldPosition();
        const boardWorldPosition = this.node.getWorldPosition();
        arr.push({
          boardBlock: boardBlock,
          worldPosition: boardWorldPosition.add(boardBlockWordPosition)
        });
        this.node.addChild(boardBlock);
      }
      this.UIboard.push(arr)
    }
  }

  chessMove() {

    this.chesses.forEach((chesses) => {

      //如果有點到棋子把它設為點到的棋子
      if (!this.choosed_chess) {
        if (chesses.getComponent(chess).movable === false) return
        if (chesses.getComponent(chess).chosed === true) {

          this.choosed_chess = chesses;
          this.choosed_chess.getComponent(chess).drag = true;
        }
      }

      //選的棋子不能動了那就是放到位置上了
      if (this.choosed_chess && this.choosed_chess.getComponent(chess).movable === false) {
        this.setValidPosition(this.choosed_chess.getComponent(chess).positionInBoard, this.choosed_chess.getComponent(chess).corner)
        this.checkValidPosition();
        this.choosed_chess = null;
      }

      //如果當前棋子被選了但他不能拖拉則重設
      if (
        this.choosed_chess &&
        chesses !== this.choosed_chess &&
        chesses.getComponent(chess).chosed === true &&
        chesses.getComponent(chess).drag === false
      ) {
        this.choosed_chess.getComponent(chess).chosed = false;
        this.choosed_chess.getComponent(chess).drag = false;
        this.choosed_chess = chesses;
        this.choosed_chess.getComponent(chess).drag = true;
      }
    })
  }

  checkChess(chess, position: [number, number][]) {

    const chessMatrix = chess.getComponent(chess).array
    const chessCenter = chess.getComponent(chess).center


    for (let board_x = 0; board_x < this.board.length; board_x++) {
      for (let board_y = 0; board_y < this.board[board_x].length; board_y++) {

        //放置超出線(大方向)
        if (board_x + chessMatrix.length > this._board_size || board_y + chessMatrix[0].length > this._board_size) {
          continue
        }

        //放上這個位置的chess在board上的位置
        const arr = [];
        const arr2 = [];
        const centerInBoard = { x: 0, y: 0 };

        for (let x = 0; x < chessMatrix.length; x++) {
          for (let y = 0; y < chessMatrix[x].length; y++) {

            arr2.push([board_x + x, board_y + y])
            if (this.board[board_x + x][board_y + y] !== 0) continue;

            if (chessMatrix[x][y] === 1) {
              arr.push([board_x + x, board_y + y])

              if (x === chessCenter.x && y === chessCenter.y) {
                centerInBoard.x = board_x + x;
                centerInBoard.y = board_y + y;
              }
            }

          }
        }


        //確定放的位置有可以放置的點
        const confirmPosition = arr.some(([x, y]) => {
          return position.some(([a, b]) => x === a && y === b)
        })

        const confirmPosition2 = arr2.every(([a, b]) => this.board[a][b] === 0)

        if (!confirmPosition) continue;
        if (!confirmPosition2) continue;

        this.placedPositions.push(centerInBoard)

      }
    }
  }

  setValidPosition(position, conerArr) {

    this.board[position[0]][position[1]] = 1;

    conerArr.forEach(([x, y]) => {
      if (x + position[0] >= 0 && x + position[0] <= 20 && y + position[1] >= 0 && y + position[1] <= 20) {
        this.validPosition.push([x + position[0], y + position[1]])
      }
    })
  }

  checkValidPosition() {
    const x = this.corner[0];
    const y = this.corner[1]

    if (!this.board[x][y]) this.validPosition.push([x, y]);



    //篩掉可放位置裡已被佔的位置
    this.validPosition = this.validPosition.filter((el) => this.board[el[0], el[1]] !== 1);
  }
  // arr.forEach(([x, y]) => {
  //   board[x][y] = 1;
  // })

  setPlacedPositionColor(places: placedPosition): void {
    places.forEach(({ x, y }) => {
      this.UIboard[x][y].boardBlock.getComponent(Sprite).color = new Color(255, 255, 255)
    })
  }

  resetPlacedPositionColor(places: placedPosition): void {
    places.forEach(({ x, y }) => {
      this.UIboard[x][y].boardBlock.getComponent(Sprite).color = new Color(126, 126, 126)
    })

  }

  getUIPlacedPosition(placedPosition: placedPosition) {

    return placedPosition.map(({ x, y }) => {
      return {
        positionInBoard: [x, y],
        worldPosition: this.UIboard[x][y].worldPosition
      }
    })
  }

  update(deltaTime: number) {

    // console.log(this.validPosition);

    let choosed_chess = null;

    if (!this.choosed_chess || choosed_chess !== this.choosed_chess) {
      choosed_chess = this.choosed_chess;
      this.resetPlacedPositionColor(this.placedPositions)
      this.placedPositions = [];
    }

    this.chessMove();

    if (choosed_chess && this.placedPositions.length === 0) {
      this.checkChess(choosed_chess, this.validPosition);
      this.setPlacedPositionColor(this.placedPositions)
      choosed_chess.getComponent(chess).targetArr = this.getUIPlacedPosition(this.placedPositions);
    }


  }
}
