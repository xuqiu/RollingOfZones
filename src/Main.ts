//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends MainFrame {

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
        this.drawText();
        this.createMotorcycleExp();
    }
    /**骨骼角色执行的当前动作索引**/
    /**存放骨骼动画的容器**/
    private knight;
    /**骨骼的实体数据**/
    private knightWalkDown;
    private knightWalkUp;
    private knightWalkLeft;
    private knightWalkRight;
    private currentMovement;
    /**创建骨骼模型**/
    private createMotorcycleExp():void
    {
        this.knight = new egret.Sprite();

        this.addChild(this.knight);
        this.knight.x = 250;
        this.knight.y = 350;

        this.initMovements();

        //启动骨骼动画播放
        this.currentMovement.animation.play();

        var armatureDisplay = this.currentMovement.getDisplay();
        this.knight.addChild(armatureDisplay);


        egret.startTick(this.onTicker, this);

    }

    private initMovements():void{
        //读取一个骨骼数据,并创建实例显示到舞台
        var skeletonData = RES.getRes("knight_ske_json");
        var textureData = RES.getRes("knight_tex_json");
        var texture = RES.getRes("knight001_tex_png");

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
    }

    private _time:number;

    private onTicker(timeStamp:number) {

        if(!this._time) {
            this._time = timeStamp;
        }

        var now = timeStamp;
        var pass = now - this._time;
        this._time = now;




        dragonBones.WorldClock.clock.advanceTime(pass / 1000);

        if(this._up && this._left){
            this._txInfo.text = "↖";
            this.move(Direction.left);
        }else if(this._up && this._right){
            this._txInfo.text = "↗";
            this.move(Direction.right);
        }else if(this._down && this._left){
            this._txInfo.text = "↙";
            this.move(Direction.left);
        }else if(this._down && this._right){
            this._txInfo.text = "↘";
            this.move(Direction.right);
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
            this.move(Direction.none);
            this._txInfo.text = "stand";
        }

        return false;
    }
    private _lastDirection:Direction;
    private move(direction:Direction){
        if(direction == this._lastDirection){
            return;
        }
        this._lastDirection = direction;

        switch (direction) {

            case Direction.none:
                //为了stop在第0帧,加这么一句 直接stopByFrame的话会有bug(触发后续的keyDown时动作停止)
                this.currentMovement.animation.gotoAndPlayByFrame(this.currentMovement.name,0);
                this.currentMovement.animation.stop(this.currentMovement.name);
                return;
                break;
            case Direction.up:
                this.currentMovement = this.knightWalkUp;
                break;
            case Direction.down:
                this.currentMovement = this.knightWalkDown;
                break;
            case Direction.right:
                this.currentMovement = this.knightWalkRight;
                break;
            case Direction.left:
                this.currentMovement = this.knightWalkLeft;
                break;
        }

        this.knight.removeChildren();
        this.currentMovement.animation.play();
        var armatureDisplay = this.currentMovement.getDisplay();
        this.knight.addChild(armatureDisplay);

    }
    private drawMap():void{
        var mapContainer:MapContainer = new MapContainer();
        this.addChild( mapContainer );
        mapContainer.init("resource/maps/FirstZone.tmx");
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


