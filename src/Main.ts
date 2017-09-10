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

class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onAnyEvent, this);

        /// 添加帧动画显示脏矩形刷新区域
    }
    private onAnyEvent(event: egret.Event) {
        egret.log("====Change Direction====" + event);
    }
    private onAddToStage (event: egret.Event) {
        //添加显示文本
        var mainStage:Main=this;
        this.drawMap();
        //绘制一个透明度为1的绿色矩形，宽高为100*80

        //注册事件
        //spr1.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onTouch, this );
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTaps, this, true);
    }
    private onTouch( evt:egret.TouchEvent )
    {
        egret.log("点击了spr1");
    }
    private onTouchTap( evt:egret.TouchEvent )
    {
        egret.log("容器冒泡侦听---------");
    }
    private onTouchTaps( evt:egret.TouchEvent )
    {
        egret.log("容器捕获侦听");
    }
    private drawMap():void{
        var mapContainer:MapContainer = new MapContainer();
        this.addChild( mapContainer );
        mapContainer.init("resource/FirstZone.tmx");
    }
}


