/**
 * 子弹,武器的子节点
 */
class Bullet extends particle.GravityParticleSystem {
    private targetX:number;
    private targetY:number;

    /**
     * @param particle_png 粒子纹理
     * @param particle_json 粒子属性
     * @param targetX  射击位置,决定子弹图像初始角度和移动方向
     * @param targetY
     */
    constructor(particle_png:string, particle_json:string, targetX:number, targetY:number) {
        super(RES.getRes(particle_png), RES.getRes(particle_json));
        this.targetX = targetX;
        this.targetY = targetY;
        this.x = 0;
        this.y = 0;
        this.start();
    }

    private _moveX:number;
    private _moveY:number;

    public initFly() {
        var rX = this.targetX - this.x;
        var rY = this.targetY - this.y;
        var ank = Math.sqrt(rX * rX + rY * rY);
        this._moveX = rX / ank;
        this._moveY = rY / ank;
    }

    private flySpeed:number = 20;//每一帧的移动距离
    public fly() {
        this.emitterX += this._moveX * this.flySpeed;
        this.emitterY += this._moveY * this.flySpeed;
    }

    public letBulletFly(evt:egret.TimerEvent) {
        this.fly();
        this.checkHit();

    }

    public letBulletDie(evt:egret.TimerEvent) {
        this.stop();
    }

    /**
     * 检测是否击中敌人
     */
    private fireRadio:number = 20;//伤害范围
    private checkHit() {

        var enemy:egret.Sprite = Main.enemyArray[0];
        var dX = this.emitterX + this.x - enemy.x;
        var dY = this.emitterY + this.y - enemy.y;
        var d = Math.sqrt(dX * dX + dY * dY);
        if(d<this.fireRadio){
            egret.log("hit");
        }
        
    }
}