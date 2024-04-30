import { _decorator, Canvas, CanvasComponent, CCFloat, clamp, Component, debug, director, Input, input, instantiate, Node, ParticleSystem2D, Prefab, UITransform, Vec3,Sprite, Color } from 'cc';
import { InputManager } from './InputManager';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Movement')

export class SpaceShipMovement extends Component 
{
    public static Instance : SpaceShipMovement;

    @property(CCFloat)
    horSpeed = 10;
    
    @property(CCFloat)
    vertSpeed = 7;

    //@property(GameManager)
    gameManager : GameManager = null!;
    
    private isDead:boolean = false;
    public haveShield:boolean=false;
    public powerUpTime:number=0;
    @property(Node)
    sheild : Node = null!;

    @property(Node)
    powerUpThrust : Node = null!;

    @property(Node)
    normalThrust : Node = null!;

    @property(Color)
    alphaZero :Color = null!;

    @property(Color)
    fullAlpha : Color = null!;

protected onLoad(): void {
    SpaceShipMovement.Instance = this;
}

    protected start(): void 
    {
     this.powerUpTime=-1;
     this.gameManager = GameManager.Instance;    
    }

    protected update(dt: number): void 
    {
        this.handleMovement(dt);
        if(this.powerUpTime >= 0)
        {
            this.powerUpTime-=dt; 
            if(this.powerUpTime<=0)
            {
                this.powerUpThrust.getComponent(Sprite).color = this.alphaZero
                this.normalThrust.getComponent(Sprite).color = this.fullAlpha
            }
        }
    }
    handleMovement(deltaTime: number)
    {
        if(InputManager.Instance.isHoldingMouse)
        {
            if(this.isDead) return
            this.node.translate(new Vec3(InputManager.Instance.deltaMouse.x*deltaTime*100*this.horSpeed,
                InputManager.Instance.deltaMouse.y*deltaTime*100*this.vertSpeed,
                0)
                .multiplyScalar(this.powerUpTime>0?2:1)
                );

            this.node.position= new Vec3(clamp(this.node.position.x,this.gameManager.horMin.position.x,this.gameManager.horMax.position.x),
                clamp(this.node.position.y,this.gameManager.vertMin.position.y,this.gameManager.vertMax.position.y),
                this.node.position.z);
        }
    }

    dead()
    {
        return this.isDead;
    }

    setDead()
    {
        this.isDead = true;
        this.node.setScale(0,0,0);
        let explosion = instantiate(GameManager.Instance.explosionVFX);
        explosion.parent = GameManager.Instance.canvasNode;
        explosion.position = this.node.position;
    }
    givePowerUp()
    {
        this.powerUpTime = 4;
        this.powerUpThrust.getComponent(Sprite).color = this.fullAlpha
        this.normalThrust.getComponent(Sprite).color = this.alphaZero
    }

    private isRemoveShieldScheduled:boolean=false;
    isShielded()
    {
        return this.haveShield;
    }
    giveShield()
    {
        if(this.isRemoveShieldScheduled)
            this.unschedule(this.removeShield);
        this.haveShield = true;
        this.sheild.setScale(1,1);
        this.scheduleOnce(this.removeShield,3)
    }
    useShield()
    {   
       if(!this.isRemoveShieldScheduled){
        this.scheduleOnce(this.removeShield, 0.05); 
        this.isRemoveShieldScheduled=true;  }    
    }
    removeShield()
    {
        this.haveShield = false;
        this.sheild.setScale(0,0)
        this.isRemoveShieldScheduled = false;
    }
}


