import { _decorator, Component, Node,CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Explosion')
export class Explosion extends Component 
{
    private destructionTime:number = 2;

    update(deltaTime: number) {
        this.destructionTime-=deltaTime
        if(this.destructionTime<= 0) this.node.destroy()
    }
}


