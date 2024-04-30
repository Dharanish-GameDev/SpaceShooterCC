import { _decorator, Component, Node,Vec3,Prefab,instantiate, CCFloat } from 'cc';
import { InputManager } from './InputManager';
import { GameManager } from './GameManager';
import { SpaceShipMovement } from './SpaceShipMovement';
const { ccclass, property } = _decorator;

@ccclass('Shooting')
export class Shooting extends Component 
{
    @property(Prefab)
    projectile : Prefab = null!;

   
   private currentWaitTime : number = 0.25;

    @property(CCFloat) 
    shootWaitTime = 0.5;

    @property(SpaceShipMovement)
    spaceShipMovement;

    update(deltaTime: number) 
    {
        if(InputManager.Instance.isHoldingMouse)
        {
            if(this.spaceShipMovement.dead())return
            this.shootBullets(deltaTime);
        }
    }


    shootBullets(deltaTime: number)
    {
      if (this.currentWaitTime < 0) // shoots bullets after specified time
            {
                let parent = GameManager.Instance.canvasNode;
                let bullet = instantiate(this.projectile);                
                bullet.position= this.node.position;
                bullet.translate(new Vec3(0,2,0));
                bullet.parent = parent;
                this.currentWaitTime = this.shootWaitTime;
            }
            else 
            {
                this.currentWaitTime-= deltaTime;                
                if(GameManager.Instance.spaceShip.powerUpTime>0)this.currentWaitTime-= deltaTime*3
            } 
    }
}


