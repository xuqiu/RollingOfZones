

class Main extends MainFrame {
    public static enemyArray:egret.Sprite[] = [];
    public static SCALE = 1;

    public constructor() {
        super();
    }
    

    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene(): void {
        this.drawMap();
        //添加显示文本
        this.drawText();
        this.drawKnight();
        this.drawEnemy();
        //
        egret.startTick(this.onTicker, this);
        //
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);

    }


    private onTouch(evt:egret.TouchEvent):void{
        this.knight.fire(evt.stageX, evt.stageY);
    }
    private cellMap: CellMap;
    private drawMap():void
    {
        this.cellMap = new CellMap("1234");

        this.cellMap.renderTrunks(0,0);
        this.addChild(this.cellMap);
        this.cellMap.x = 300;
        this.cellMap.y = 200;
        this.cellMap.scaleX = Main.SCALE;
        this.cellMap.scaleY = Main.SCALE;

        // const lineShape: egret.Shape = new egret.Shape();
        // lineShape.graphics.lineStyle(3, 0xccaadd);
        // for(let i = -10; i < 10; i++)
        // {
        //     lineShape.graphics.moveTo(0, 320*i);
        //     lineShape.graphics.lineTo(1000, 320*i);
        //     lineShape.graphics.moveTo(0, 320*i);
        //     lineShape.graphics.lineTo(-1000, 320*i);
        //     lineShape.graphics.moveTo(320*i, 0);
        //     lineShape.graphics.lineTo(320*i, 1000);
        //     lineShape.graphics.moveTo(320*i, 0);
        //     lineShape.graphics.lineTo(320*i, -1000);
        // }
        // lineShape.graphics.moveTo(0, 0);
        //cellMap.addChild(lineShape);

    }


    /**骨骼角色执行的当前动作索引**/
    /**存放骨骼动画的容器**/
    private knight;
    
    public enemy;

    /**创建骨骼模型**/
    private drawKnight():void
    {
        this.knight = new Knight("boss3a_png");
        this.knight.x = 30;
        this.knight.y = 30;
        this.cellMap.addChildAt(this.knight,999);



    }
    /**创建骨骼模型**/
    private drawEnemy():void
    {
        this.enemy = new Knight("boss4a_png");
        this.enemy.x = 200;
        this.enemy.y = 30;
        this.addChildAt(this.enemy,999);
        Main.enemyArray.push(this.enemy);
    }
    private _time:number;

    private onTicker(timeStamp:number) {

        if(!this._time) {
            this._time = timeStamp;
        }

        let now = timeStamp;
        let pass = now - this._time;
        this._time = now;




        dragonBones.WorldClock.clock.advanceTime(pass / 1000);

        if(this._up && this._left){
            this._txInfo.text = "↖";
            this.move(Direction.up_left);
        }else if(this._up && this._right){
            this._txInfo.text = "↗";
            this.move(Direction.up_right);
        }else if(this._down && this._left){
            this._txInfo.text = "↙";
            this.move(Direction.down_left);
        }else if(this._down && this._right){
            this._txInfo.text = "↘";
            this.move(Direction.down_right);
        }else if(this._up){
            this._txInfo.text = "↑";
            this.move(Direction.up);
        }else if(this._left){
            this._txInfo.text = "←";
            this.move(Direction.left);
        }else if(this._right){
            this._txInfo.text = "→";
            this.move(Direction.right);
        }else if(this._down){
            this._txInfo.text = "↓";
            this.move(Direction.down);
        }else{
            this.move(Direction.stop);
            this._txInfo.text = "stand";
        }

        return false;
    }
    public move(direction:Direction){
        //TODO 判断是地图移动还是人物移动
        this.knight.move(direction, true);
    }
    private mapContainer:MapContainer = new MapContainer();
    private drawTileMap():void{

        this.addChild( this.mapContainer );
        this.mapContainer.init("resource/maps/FirstZone.tmx");
    }

    /// 提示信息
    private _txInfo:egret.TextField;
    private drawText()
    {

        this._txInfo = new egret.TextField;
        this.addChild( this._txInfo );

        this._txInfo.size = 28;
        this._txInfo.x = 200;
        this._txInfo.y = 50;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
    }
}


