import { _decorator, Component, Node, AudioClip, AudioSourceComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {

    public static Instance : AudioManager;
    @property({ type: AudioClip })
    audioClip: AudioClip[] = [];

    private audioSource: AudioSourceComponent = null;

    protected onLoad(): void {
        AudioManager.Instance = this;
    }
    start() {
        this.audioSource = this.getComponent(AudioSourceComponent);
        
        if (!this.audioSource) {
            console.error('AudioSourceComponent not found on AudioManager node.');
        }
    }

    playAudioClip(index : number) {
        if (this.audioSource && this.audioClip) 
        {
            this.audioSource.clip = this.audioClip[index];
            this.audioSource.play();
        } else {
            console.error('AudioSourceComponent or AudioClip not set on AudioManager.');
        }
    }
}
