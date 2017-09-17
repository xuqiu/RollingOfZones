/**
 * 骑士,主人公 或者 NPC
 */
class Knight extends egret.Sprite {

    private skin:string;

    constructor(skin:string) {
        super();
        this.skin = skin;

        this.init();
    }

    //初始化
    private init():void {
        // this.scaleX = 2;
        // this.scaleY = 2;
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

    //region 移动相关

    /**移动动画资源*/
    private knightWalkDown;
    private knightWalkUp;
    private knightWalkLeft;
    private knightWalkRight;
    private currentMovement;

    //移动相关变量
    private _lastDirection:Direction;
    private _moveTimer:egret.Timer = new egret.Timer(20);
    private _moveX:number;
    private _moveY:number;
    //移动动画及位置控制
    public move(direction:Direction, movePosition:boolean) {

        if (direction == this._lastDirection) {
            return;
        }
        this._moveX = 0;
        this._moveY = 0;
        this._lastDirection = direction;

        switch (direction) {

            case Direction.stop:
                //为了stop在第0帧,加这么一句 直接stopByFrame的话会有bug(触发后续的keyDown时动作停止)
                this.currentMovement.animation.gotoAndPlayByFrame(this.currentMovement.name, 0);
                this.currentMovement.animation.stop(this.currentMovement.name);
                if (movePosition) {
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
                this._moveX = 1 / 1.414;
                this._moveY = -1 / 1.414;
                this.currentMovement = this.knightWalkRight;
                break;
            case Direction.down_right:
                this._moveX = 1 / 1.414;
                this._moveY = 1 / 1.414;
                this.currentMovement = this.knightWalkRight;
                break;
            case Direction.left:
                this._moveX = -1;
                this.currentMovement = this.knightWalkLeft;
                break;
            case Direction.up_left:
                this._moveX = -1 / 1.414;
                this._moveY = -1 / 1.414;
                this.currentMovement = this.knightWalkLeft;
                break;
            case Direction.down_left:
                this._moveX = -1 / 1.414;
                this._moveY = 1 / 1.414;
                this.currentMovement = this.knightWalkLeft;
                break;
        }

        this.removeChildren();
        this.currentMovement.animation.play();
        var armatureDisplay = this.currentMovement.getDisplay();
        this.addChild(armatureDisplay);

        if (movePosition) {

            this._moveTimer.addEventListener(egret.TimerEvent.TIMER, this.moveYX, this);
            this._moveTimer.start();
        }

    }

    private static FOOT_SIZE:number = 6;
    //移动位置
    private moveYX():void {
        this.x += this._moveX * Knight.FOOT_SIZE;
        this.y += this._moveY * Knight.FOOT_SIZE;
    }

    //endregion
    //region 战斗相关
    public fire(x:number, y:number) {
        //TODO 获取武器
        //TODO 能量检测,频率检测
        var bullet:Bullet = new Bullet("energy_png", "energy_json", x, y);
        bullet.x = this.x;
        bullet.y = this.y;
        bullet.initFly();

        this.parent.addChild(bullet);

        var bulletTimer:egret.Timer = new egret.Timer(20, 20);
        bulletTimer.addEventListener(egret.TimerEvent.TIMER, bullet.letBulletFly, bullet);
        bulletTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, bullet.letBulletDie, bullet);
        bulletTimer.start();
    }



    

    //endregion
}