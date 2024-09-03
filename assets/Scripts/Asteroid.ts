import { _decorator,IPhysics2DContact,Contact2DType,PhysicsSystem2D, Component, RigidBody2D, Vec2, Collider2D, randomRangeInt  } from 'cc';
import { GameManager } from './GameManager';
import { SpaceShipMovement } from './SpaceShipMovement';
const { ccclass, property } = _decorator;

@ccclass('Asteroid')
export class Asteroid extends Component {

    @property

    autoDestroyTime : number =3.5;
    @property
    moveTowards:boolean=false;
    @property
    speed:number = 5;

    private collider:Collider2D=null;
    private rg : RigidBody2D = null;
    private destroyed : boolean = false;
    private curLifeTime = 0;
    private randomXDir= 0;


    //#region Engine lifecycle
    start() {

        this.curLifeTime=0;
        this.rg=this.node.getComponent(RigidBody2D);
        this.collider=this.node.getComponent(Collider2D);
       
       //register for contact callback
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);            
        }
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }  
        
        // gives a random direction
        if(this.moveTowards)
        {  
            this.randomXDir=randomRangeInt(-10,11)*0.1;
        }
        
    }
   //#endregion
 
    update(deltaTime: number) {
        
        this.curLifeTime+=deltaTime;
        
        if(this.node.position.y <= GameManager.Instance.asteroidDestructionPoint.position.y)
            this.destroyed=true;

        if(this.destroyed && this.node.isValid)
            this.node.destroy()

        if(this.rg!=null && this.node.isValid)
        {
            this.rg.linearVelocity=new Vec2(this.randomXDir*this.speed,-this.speed);
        }
    }

    // contact begin callback
    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
           
        if(otherCollider.tag == 2  && selfCollider.tag ==1) //2 represents player tag
        {   
            var asteroid =this.node.getComponent(Asteroid);
            if(asteroid==null) return;
            this.destroyed = true;
            if(SpaceShipMovement.Instance.haveShield)
            {
                SpaceShipMovement.Instance.removeShield();
                return;
            }
            if(GameManager.Instance.isDead) return;
            if(GameManager.Instance.cameraShake)
            GameManager.Instance.cameraShake.startShake(0.2,5);
            GameManager.Instance.destroyPlayer();
        }
    }

    //#region  getters and setters
    destroyAsteroid()
    {
        this.destroyed=true;
    }
    isDestroyed()
    {
        return this.destroyed;
    }
    //#endregion
}


