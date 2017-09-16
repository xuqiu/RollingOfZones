/**
 * 支持键盘事件的主场景
 */
abstract class MainFrame extends egret.DisplayObjectContainer {


    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        document.addEventListener("keydown",(e) => { this.onKeyDown(e);});
        document.addEventListener("keyup",(e) => { this.onKeyUp(e);});
    }

    private onAddToStage() {


        //加载资源
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete():void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.loadGroup("All");
    }
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if(event.groupName == "All"){
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            this.createGameScene();
        }
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }
    
    abstract createGameScene();

    //键盘方向键
    protected _up:boolean = false;
    protected _down:boolean = false;
    protected _left:boolean = false;
    protected _right:boolean = false;
    private onKeyDown(e):void{
        if(e.keyCode == 87){
            this._up = true;
        }else if(e.keyCode == 83){
            this._down = true;
        }else if(e.keyCode == 65){
            this._left = true;
        }else if(e.keyCode == 68){
            this._right = true;
        }
    }
    private onKeyUp(e):void{
        if(e.keyCode == 87){
            this._up = false;
        }else if(e.keyCode == 83){
            this._down = false;
        }else if(e.keyCode == 65){
            this._left = false;
        }else if(e.keyCode == 68){
            this._right = false;
        }
    }

}