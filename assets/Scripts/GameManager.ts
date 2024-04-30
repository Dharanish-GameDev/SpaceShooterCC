import { _decorator, CCBoolean, Component, Node,CCFloat,RichText,Vec3,instantiate,randomRangeInt,Prefab,Label,Button, director, clamp, CCInteger } from 'cc';
import { SpaceShipMovement } from './SpaceShipMovement';
import { InputManager } from './InputManager';
import { SpawnEnemies } from './SpawnEnemies';
import { AudioManager } from './AudioManager';
import { CameraShake } from './CameraShake';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component 
{
    public static Instance : GameManager;

    @property(Node)
    canvasNode : Node = null!;
    @property(Node)
    projectileDestructionPoint : Node = null!;

    @property(Node)
    asteroidDestructionPoint : Node = null!;

    @property(SpaceShipMovement)
    spaceShip : SpaceShipMovement=null!;
    private currentCoins = 0;

    @property(Button)
    buttons : Button[] = []


    //Boundaries
    @property(Node)
    horMax : Node = null!;    
    @property(Node)
    horMin : Node = null!;
    @property(Node)
    vertMax : Node = null!;    
    @property(Node)
    vertMin : Node = null!;

    @property(CCBoolean)
    isDead : boolean = false;

    @property(CCFloat)
    totalPoints = 100;
    private actualPoint;
    //References
    @property(Node)
    startText : Node = null!;

    @property(SpawnEnemies)
    enemySpawnner:SpawnEnemies=null!;
    @property(RichText)
    scoreText:RichText=null!;


    @property(Prefab)
    coinPrefab:Prefab=null!;
    
    @property(Prefab)
    shieldPrefab:Prefab=null!;
    
    @property(Prefab)
    upgradePrefab:Prefab=null!;

    @property(Label)
    winLoseText :Label = null!;

    @property(Prefab)
    explosionVFX : Prefab = null!;

    @property(CameraShake)
    cameraShake : CameraShake = null!;

    @property(String)
    nextSceneName: string = '';

    private gamestate:GameState = GameState.WaitToStart;

    protected onLoad(): void 
    {
        GameManager.Instance = this;
    }
    start() 
    {
       this.gamestate = GameState.WaitToStart;
       this.winLoseText.string = ""
       this.buttons[0].node.on(Button.EventType.CLICK, this.home, this);
       this.buttons[1].node.on(Button.EventType.CLICK, this.nextLevel, this);
       this.buttons[2].node.on(Button.EventType.CLICK, this.reloadLevel, this);
       this.buttons.forEach(element => 
        {
        element.node.active = false
        });
    }

    update(deltaTime: number) 
    {
        switch(this.gamestate)
        {
            case GameState.WaitToStart:
            if(InputManager.Instance.isFirstClicked)
            {
                this.gamestate = GameState.GameStart;
            }
            break;

            case GameState.GameStart:
                
            this.startText.destroy()
            this.enemySpawnner.startSpawning()
            this.gamestate = GameState.GameRunning

            break;

            case GameState.GameRunning :
            this.actualPoint= clamp(this.currentCoins,0,this.totalPoints);
            this.scoreText.string=this.actualPoint.toString()+"/"+this.totalPoints.toString();
            if(this.spaceShip.dead())
            {
                AudioManager.Instance.playAudioClip(2);
                this.gamestate=GameState.GameLose;
                this.enemySpawnner.stopSpawning();
            }
            if(this.currentCoins>=this.totalPoints)
            {
                AudioManager.Instance.playAudioClip(3);
                this.gamestate=GameState.GameWin;
                this.enemySpawnner.stopSpawning();
            }
            break;

            case GameState.GameWin:
            this.winLoseText.string = "WINNER FOUND!"
            for (let index = 0; index < this.buttons.length; index++) 
            {
                if(index!=2)
                 this.buttons[index].node.active = true;
            }
            break;

            case GameState.GameLose:
            this.winLoseText.string = "TRY HARDER!"
            for (let index = 0; index < this.buttons.length; index++) 
            {
                if(index!=1)
                 this.buttons[index].node.active = true;
            }
            break;

        }
        this.checkAndSpawnCollectable();
    }

    destroyPlayer()
    {
        if(this.spaceShip.isShielded())  this.spaceShip.useShield();
        else this.spaceShip.setDead();
    }

    addPoints(value:number)
    {
        this.currentCoins += value;
    }

    toSpawn:boolean=false;
    spawnPos:Vec3=null;
    spawnCollectable(pos:Vec3)
    {
        this.toSpawn = true;
        this.spawnPos = pos;
        let explosion = instantiate(this.explosionVFX);
        explosion.parent = this.canvasNode;
        explosion.position = this.spawnPos;
    }
    checkAndSpawnCollectable()
    {
        if(this.toSpawn)
        {   
            let ran=randomRangeInt(0,10);
            var collectable;
            if(ran<3)
            {    
                collectable = instantiate(this.shieldPrefab);
            }
            else if(ran<5)
            {    
                collectable=instantiate(this.upgradePrefab);
            }
            else if(ran<8)
            {    
                collectable=instantiate(this.coinPrefab);
            }

            if(collectable!=null)
            {
                collectable.parent=this.canvasNode;
                collectable.position=this.spawnPos;
                this.toSpawn = false;            
            }
            else
            {
                this.toSpawn = false;
            }
        }

    }
giveShield()
{
    this.spaceShip.giveShield();
}
 givePowerUp()
{
    this.spaceShip.givePowerUp();
}
h()
{
    director.loadScene("MainMenu")
}
n()
{
    director.loadScene(this.nextSceneName);
}
r()
{
    director.loadScene(director.getScene().name.toString())
}
home()
{
    AudioManager.Instance.playAudioClip(4);
    this.scheduleOnce(this.h,1);
}
nextLevel()
{
    AudioManager.Instance.playAudioClip(4);
    this.scheduleOnce(this.n,1);
}
reloadLevel()
{
    AudioManager.Instance.playAudioClip(4);
    this.scheduleOnce(this.r,1);
}
}
export enum GameState
{
    WaitToStart,GameStart,GameRunning,GameWin,GameLose
}
