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
        const skeletonData = RES.getRes("knight_ske_json");
        const textureData = RES.getRes("knight_tex_json");
        const texture = RES.getRes(this.skin);

        const factory = new dragonBones.EgretFactory();
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

        let armatureDisplay = this.currentMovement.getDisplay();
        this.addChild(armatureDisplay);
        //锚点移到脚上
        this.anchorOffsetY = 10;
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
    private _lastPointDirect:Direction;
    private _moveTimer:egret.Timer = new egret.Timer(20);
    protected _moveX:number;
    protected _moveY:number;
    public movePoint(point:egret.Point) {
        //没用要移动的点表示停止移动
        if (!point) {
            //为了stop在第0帧,加这么一句 直接stopByFrame的话会有bug(触发后续的keyDown时动作停止)
            this.currentMovement.animation.gotoAndPlayByFrame(this.currentMovement.name, 0);
            this.currentMovement.animation.stop(this.currentMovement.name);
            this._moveTimer.stop();
            this._lastPointDirect = null;
            return;
        }
        let rx = point.x - this.x;
        let ry = point.y - this.y;
        let pDis = CellMap.dis(point.x, point.y, this.x, this.y);
        this._moveX = rx / pDis;
        this._moveY = ry / pDis;

        //行走动画
        let moveDirection: Direction;
        if (ry > 0 && ry > Math.abs(rx)) {
            this.currentMovement = this.knightWalkDown;
            moveDirection = Direction.down;
        } else if (ry < 0 && Math.abs(ry) > Math.abs(rx)) {
            this.currentMovement = this.knightWalkUp;
            moveDirection = Direction.up;
        } else if (rx < 0) {
            this.currentMovement = this.knightWalkLeft;
            moveDirection = Direction.left;
        } else if (rx > 0) {
            this.currentMovement = this.knightWalkRight;
            moveDirection = Direction.right;
        }
        if (moveDirection != this._lastPointDirect) {
            this._lastPointDirect = moveDirection;
            this.removeChildren();
            this.currentMovement.animation.play();
            const armatureDisplay = this.currentMovement.getDisplay();
            this.addChild(armatureDisplay);
        }

        //移动位置
        this._moveTimer.addEventListener(egret.TimerEvent.TIMER, this.moveYX, this);
        this._moveTimer.start();
    }
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
        const armatureDisplay = this.currentMovement.getDisplay();
        this.addChild(armatureDisplay);

        if (movePosition) {

            this._moveTimer.addEventListener(egret.TimerEvent.TIMER, this.moveYX, this);
            this._moveTimer.start();
        }

    }

    protected footSize:number = 6;
    protected collideSize:number = 10;

    //移动位置
    public moveYX():boolean {
        //目标位置
        let tx = this.x + this._moveX * this.footSize;
        let ty = this.y + this._moveY * this.footSize;
        //碰撞位置,用于碰撞检测
        //todo 现在是直线碰撞,后面改成方形碰撞,既判断移动方向的两个点
        let txf = this.x + (this._moveX == 0 ? 0 : this._moveX > 0 ? 1 : -1) * this.collideSize;
        let tyf = this.y + (this._moveY == 0 ? 0 : this._moveY > 0 ? 1 : -1) * this.collideSize;
        //地形碰撞检测
        let cellMap:CellMap = this.getParentMap();
        //当前和目标位置地形不同
        let cXY = cellMap.getCellXY(this.x,this.y);
        let tXY = cellMap.getCellXY(txf,tyf);
        if(cellMap.getCellDate(cXY.x,cXY.y)!=cellMap.getCellDate(tXY.x,tXY.y)){
            return false;
        }
        //还要判断下落脚点,防止因地形原因卡上高地
        tXY = cellMap.getCellXY(tx,ty);
        if(cellMap.getCellDate(cXY.x,cXY.y)!=cellMap.getCellDate(tXY.x,tXY.y)){
            return false;
        }

        //todo 物件碰撞检测

        //判断是否走出trunk,走出的话触发生成地图
        let ctXY = cellMap.getTrunkXY(this.x,this.y);
        let ttXY = cellMap.getTrunkXY(tx,ty);
        if(!ctXY.equals(ttXY)){
            cellMap.renderTrunks(ttXY.x, ttXY.y);
        }

        //移动
        this.x = tx;
        this.y = ty;

        return true;
    }
    protected getParentMap():CellMap{
        return <CellMap>(this.parent);
    }

    //endregion
    //region 战斗相关
    public fire(x:number, y:number) {
        //TODO 获取武器
        //TODO 能量检测,频率检测
        let bullet:Bullet = Bullet.getBullet("energy_png", "energy_json", x, y);
        bullet.x = this.x;
        bullet.y = this.y;
        this.parent.addChild(bullet);
        bullet.fire();
    }



    

    //endregion
}