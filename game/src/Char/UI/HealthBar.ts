class HealthBar extends egret.Sprite{
    private bloodSprite = new egret.Sprite;
    constructor() {
        super();

        this.init();
    }
    public setValue(value:number){
        this.bloodSprite.scaleX = value;
    }
    private init(){
        const barShape: egret.Shape = new egret.Shape();
        barShape.graphics.lineStyle(0.5, 0x000000);
        barShape.graphics.drawRect(- 20,0,40,5);

        const bloodShape: egret.Shape = new egret.Shape();
        bloodShape.graphics.beginFill(0xFF0000,1);
        bloodShape.graphics.lineStyle(1, 0xFF0000);
        bloodShape.graphics.drawRect(0,0,39,4);
        bloodShape.graphics.endFill();
        this.bloodSprite.addChildAt(bloodShape,9);
        this.bloodSprite.x=-20;
        this.bloodSprite.scaleX=0.03;
        this.addChildAt(this.bloodSprite,9);
        this.addChildAt(barShape,99);
    }
}