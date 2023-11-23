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
            player.playerId = index;
            player.chesses = playerClassArr[index].chesses;
            player.color = playerClassArr[index].color;
        });
    }

    renderCurPlayer(curPlayer) {
        const allPlayerTs = this.node.getComponentsInChildren(player)
        allPlayerTs.forEach(player => {
            player.setOriginColor();
            player.turn = false;

            if (player.playerId === curPlayer) {
                player.turn = true;
                player.setNewColor();
            }
        });
    }

    resetColor() {

    }

    update(deltaTime: number) {

    }
}


