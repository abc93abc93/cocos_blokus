import { _decorator, Component, Node, UITransform, Prefab, instantiate, Vec3, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('chesses')
export class chesses extends Component {

    @property(Prefab)
    ChessBlock: Prefab;

    data = [
        {
            arr: [[1]],
            center: [0, 0],
            position: [],
        },
        {
            arr: [[1], [1]],
            center: [1, 0],
            position: [],
        }, {
            arr: [[1], [1], [1]],
            center: [1, 0],
            position: [],
        }, {
            arr: [[1], [1], [1], [1]],
            center: [1, 0],
            position: [],
        }
    ]

    start() {
        this.setChessPostion()
    }

    createChess(array, center, size) {
        const node = new Node();

        const width = array.length;
        const height = array[0].length;

        for (let x = 0; x < array.length; x++) {
            for (let y = 0; y < array[x].length; y++) {
                if (!array[x][y]) continue;

                const [centerX, centerY] = center;
                const block = instantiate(this.ChessBlock);

                block.setPosition(
                    new Vec3((x - centerX) * size, (y - centerY) * size, 0)
                );


                //設置數據 (之後刪)
                const label = block.getChildByName("Label");
                label.getComponent(Label).string = `${x}${y}`;

                node.addChild(block);
            }
        }

        node.addComponent(UITransform).setContentSize(width * size, height * size);

        return node
    }


    setChessPostion() {
    }


    update(deltaTime: number) {

    }
}


