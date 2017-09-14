/**
 * 骑士,主人公 或者 NPC
 */
class Knight extends egret.Sprite {
    /**骨骼的实体数据**/
    private knightWalkDown;
    private knightWalkUp;
    private knightWalkLeft;
    private knightWalkRight;

    private currentMovement;
    
    private skin:string;

    constructor(skin:string){
        super();
        this.skin = skin;

        this.init();
    }

    private init():void{
        //读取一个骨骼数据,并创建实例显示到舞台
        var skeletonData = RES.getRes("knight_ske_json");
        var textureData = RES.getRes("knight_tex_json");
        var texture = RES.getRes(this.skin);

        var factory = new dragonBones.EgretFactory();
        factory.addDragonBonesData(factory.parseDragonBonesData(skeletonData));
        factory.addTextureAtlasData(new dragonBones.EgretTextureAtlas(texture, textureData));

        this.knightWalkDown = factory.buildArmature("walk-down");
        this.knightWalkLeft = factory.buildArmature("walk-left");
        this.knightWalkUp = factory.buildArmature("walk-up");
        this.knightWalkRight = factory.buildArmature("walk-right");
        dragonBones.WorldClock.clock.add(this.knightWalkDown);
        dragonBones.WorldClock.clock.add(this.knightWalkLeft);
        dragonBones.WorldClock.clock.add(this.knightWalkUp);
        dragonBones.WorldClock.clock.add(this.knightWalkRight);

        this.currentMovement = this.knightWalkDown;

        var armatureDisplay = this.currentMovement.getDisplay();
        this.addChild(armatureDisplay);
    }

    private _lastDirection:Direction;

    private _moveTimer:egret.Timer = new egret.Timer(20);
    private _moveX:number;
    private _moveY:number;
    private static FOOT_SIZE:number = 3;
    public move(direction:Direction, movePosition:boolean){

        if(direction == this._lastDirection){
            return;
        }
        this._moveX = 0;
        this._moveY = 0;
        this._lastDirection = direction;

        switch (direction) {

            case Direction.stop:
                //为了stop在第0帧,加这么一句 直接stopByFrame的话会有bug(触发后续的keyDown时动作停止)
                this.currentMovement.animation.gotoAndPlayByFrame(this.currentMovement.name,0);
                this.currentMovement.animation.stop(this.currentMovement.name);
                if(movePosition){
                    this._moveTimer.stop();
                }
                return;
                break;
            case Direction.up:
                this.currentMovement = this.knightWalkUp;
                this._moveY = -1;
                break;
            case Direction.down:
                this.currentMovement = this.knightWalkDown;
                this._moveY = 1;
                break;
            case Direction.right:
                this._moveX = 1;
                this.currentMovement = this.knightWalkRight;
                break;
            case Direction.up_right:
                this._moveX = 1/1.414;
                this._moveY = -1/1.414;
                this.currentMovement = this.knightWalkRight;
                break;
            case Direction.down_right:
                this._moveX = 1/1.414;
                this._moveY = 1/1.414;
                this.currentMovement = this.knightWalkRight;
                break;
            case Direction.left:
                this._moveX = -1;
                this.currentMovement = this.knightWalkLeft;
                break;
            case Direction.up_left:
                this._moveX = -1/1.414;
                this._moveY = -1/1.414;
                this.currentMovement = this.knightWalkLeft;
                break;
            case Direction.down_left:
                this._moveX = -1/1.414;
                this._moveY = 1/1.414;
                this.currentMovement = this.knightWalkLeft;
                break;
        }

        this.removeChildren();
        this.currentMovement.animation.play();
        var armatureDisplay = this.currentMovement.getDisplay();
        this.addChild(armatureDisplay);

        if(movePosition){

            this._moveTimer.addEventListener(egret.TimerEvent.TIMER, this.moveYX, this);
            this._moveTimer.start();
        }

    }
    private moveYX():void {
        this.x += this._moveX * Knight.FOOT_SIZE;
        this.y += this._moveY * Knight.FOOT_SIZE;
    }
}