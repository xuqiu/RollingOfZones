/**
 * Created by yinzhennan on 2017/9/10.
 */
class MapContainer extends egret.Sprite {
    private cellSize:number = 32;

    public init(mapUrl:string) {
        this.x = 0;
        this.y = 0;
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.move, this);
        var self:egret.Sprite = this;
        var urlLoader:egret.URLLoader = new egret.URLLoader();
        urlLoader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        urlLoader.addEventListener(egret.Event.COMPLETE, function (event:egret.Event):void {
            var data:any = egret.XML.parse(event.target.data);
            var tmxTileMap:tiled.TMXTilemap = new tiled.TMXTilemap(2000, 2000, data, mapUrl);
            tmxTileMap.render();
            self.addChild(tmxTileMap);
        }, mapUrl);
        urlLoader.load(new egret.URLRequest(mapUrl));
    }

    public move(evt:egret.TouchEvent) {
        var direction:Direction = this.getDirection(evt.stageX, evt.stageY);
        egret.log(this.width);
        egret.log(this.x);
        egret.log(this.stage.stageWidth);
        switch (direction) {
            case Direction.up:
                if (this.y >= 0)
                    return false; //防止地图溢出
                this.y = this.y + this.cellSize;
                break;
            case Direction.down:
                if (this.height + this.y <= this.stage.stageHeight)
                    return false; //防止地图溢出
                this.y = this.y - this.cellSize;
                break;
            case Direction.right:
                if(this.width + this.x < this.stage.stageWidth)
                    return false;//防止地图溢出
                this.x = this.x - this.cellSize;
                break;
            case Direction.left:
                if(this.x >= 0)
                    return false;//防止地图溢出
                this.x = this.x + this.cellSize;
                break;

        }
    }

    private getDirection(x, y):Direction {
        var centerX = 400;
        var centerY = 300;
        var tapX = x - centerX;
        var tapY = y - centerY;
        if (Math.abs(tapX) > Math.abs(tapY)) {
            if (tapX > 0) {
                return Direction.right;
            } else {
                return Direction.left;
            }
        } else {
            if (tapY > 0) {
                return Direction.down;
            } else {
                return Direction.up;
            }
        }
    }
}