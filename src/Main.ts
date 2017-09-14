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
        this.drawMap();
        //添加显示文本
        this.drawText();
        this.createMotorcycleExp();
    }
    /**骨骼角色执行的当前动作索引**/
    /**存放骨骼动画的容器**/
    private knight;

    /**创建骨骼模型**/
    private createMotorcycleExp():void
    {
        this.knight = new Knight("knight001_tex_png");
        this.knight.x = 250;
        this.knight.y = 350;
        this.mapContainer.addChildAt(this.knight,999);

        egret.startTick(this.onTicker, this);

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


