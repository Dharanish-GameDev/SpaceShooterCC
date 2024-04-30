import { __private, _decorator, Component, Event, EventMouse, EventTouch, input, Input, Node, Vec2,View } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InputManager')
export class InputManager extends Component {
    
    public static Instance : InputManager;



//#region Variables

    @property 
    isHoldingMouse = false;  // Holding Mouse or Not
    
    isFirstClicked : boolean = false;

    private currentMousePos : Vec2 = new Vec2();
    
    private previousMousePos : Vec2 = new Vec2();
    
    deltaMouse : Vec2 = new Vec2(); // Change in Mouse Pos

//#endregion


//#region Lifecycle Methods


    protected onLoad(): void
    {
        InputManager.Instance=this;
    }
    
    start() 
    {
        this.currentMousePos = Vec2.ZERO;
        this.deltaMouse = Vec2.ZERO;
        this.previousMousePos = Vec2.ZERO;       
    }

    update(deltaTime: number) {
        
        // touch input callback registrations
        input.on(Input.EventType.TOUCH_START,this.onTouchDown,this);      
        input.on(Input.EventType.TOUCH_END,this.onTouchUp,this); 
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

        // mouse input callback registrations
        input.on(Input.EventType.MOUSE_DOWN,this.onMouseDown,this);        
        input.on(Input.EventType.MOUSE_UP,this.onMouseUp,this); 
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

        // calculate change in mouse position
        this.deltaMouse= new Vec2(this.currentMousePos.x-this.previousMousePos.x,this.currentMousePos.y-this.previousMousePos.y); 
        this.deltaMouse.normalize();  
        this.previousMousePos=this.currentMousePos;

    }

//#endregion



//#region  Input callbacks

    onTouchDown(event: EventTouch)
    {       
        if(event.touch.getID() ==0)
        this.isHoldingMouse = true;
        this.isFirstClicked = true;
    }

    onTouchUp(event:EventTouch)
    {
        if(event.touch.getID() ==0)       
        this.isHoldingMouse = false;        
    }
    onTouchMove(event : EventTouch)
    {        
        if(event.touch.getID() ==0)   
        this.currentMousePos= event.getLocation(); // Getting Current Mouse Position
    }


    onMouseMove(event : EventMouse)
    {
        this.currentMousePos= event.getLocation(); // Getting Current Mouse Position
    }
    onMouseDown(event: EventMouse)
    {
        if(event.getButton()==0)
        {
            this.isHoldingMouse=true;
            this.isFirstClicked = true;
        }
    }
    onMouseUp(event:EventMouse)
    {
        if(event.getButton()==0)
        {
            this.isHoldingMouse = false;
        }        
    }
//#endregion

}


