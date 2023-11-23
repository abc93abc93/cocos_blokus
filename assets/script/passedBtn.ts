import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('passedBtn')
export class passedBtn extends Component {
    start() {
        this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
    }

    clickNode() {

    }

    update(deltaTime: number) {

    }
}


