

class Main extends MainFrame {
    public static enemyArray:egret.Sprite[] = [];

    public constructor() {
        super();
    }
    

    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene(): void {
        //this.drawMap();
        //添加显示文本
        // this.drawText();
        //this.drawKnight();
        this.drawEnemy();
        //
        // egret.startTick(this.onTicker, this);
        //
        // this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);



        let spriteSheet: egret.SpriteSheet = RES.getRes("mapCells_json");
        let bmp = new egret.Bitmap();
        bmp.texture = spriteSheet.getTexture("sand");
        bmp.x = 200;




        let cellMap:CellMap = new CellMap();
        cellMap.addChild(bmp);
        this.addChild(cellMap);
        cellMap.x = 100;

        const myShape: egret.Shape = new egret.Shape();

        myShape.graphics.beginFill(0xff0000, 1);
        myShape.graphics.drawRect(100,100,5,5);
        myShape.graphics.endFill();


        this.addChild(myShape);

    }


    private onTouch(evt:egret.TouchEvent):void{
        this.knight.fire(evt.stageX, evt.stageY);
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
        this.addChildAt(this.knight,999);



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
    private drawMap():void{

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


