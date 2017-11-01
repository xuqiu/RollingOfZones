class Enemy extends KnightShow {
    private _aiTimer:egret.Timer = new egret.Timer(100);
    private _AI:AI;
    constructor(skin:string) {
        super(skin);
        this._aiTimer.addEventListener(egret.TimerEvent.TIMER, this.runAi, this);
        this._aiTimer.start();
    }
    //每100秒执行一次AI脚本
    private _aiRunning = false;
    private runAi(){
        if(this._aiRunning){
            return;
        }
        this._aiRunning = true;
        if(this._AI){
            this._AI.run(this);
        }
        this._aiRunning = false;
    }
    public setAI(ai:AI){
        this._AI=ai;
    }

    public dead(){
        this._aiTimer.stop();
        super.dead();
    }
}