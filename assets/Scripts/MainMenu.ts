import { _decorator, Component, Node,Button, director, game } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component 
{
    @property(Button)
    playButton : Button = null!;

    @property(Button)
    quitButton : Button = null!;

    @property(AudioManager)
    audioManager :AudioManager = null!;

    start() 
    {
        this.playButton.node.on(Button.EventType.CLICK, this.enterGame, this);
        this.quitButton.node.on(Button.EventType.CLICK,this.quitGame,this)
    }
    enterGame()
    {
        this.audioManager.playAudioClip(0);
        this.scheduleOnce(this.enter,1);
    }
    quitGame()
    {
        this.audioManager.playAudioClip(0);
        this.scheduleOnce(this.quit,1)
    }
    enter()
    {
        director.loadScene("Level01")
    }
    quit()
    {
        game.end();
    }
}


