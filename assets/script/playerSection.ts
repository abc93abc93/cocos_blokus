import { _decorator, Component, Node, EventTouch } from 'cc';
import { player } from './player';
const { ccclass, property } = _decorator;

@ccclass('playerSection')
export class playerSection extends Component {

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.clickNode, this);
    }

    clickNode(event: EventTouch) { }

    init(playerClassArr) {
        const allPlayerTs = this.node.getComponentsInChildren(player)
        allPlayerTs.forEach((player, index) => {
            player.id = playerClassArr[index].id;
            player.index = playerClassArr[index].index;
            // player.chesses = playerClassArr[index].chesses;
            player.color = playerClassArr[index].color;
        });
        this.renderCurPlayer(playerClassArr);
    }

    renderCurPlayer(playerClassArr) {
        const allPlayerTs = this.node.getComponentsInChildren(player)
        allPlayerTs.forEach((player, index) => {
            player.setOriginColor();
            if (playerClassArr[index].turn) player.setNewColor();
        })
    }

    // resetColor() {

    // }

    update(deltaTime: number) {

    }
}


