/**
 * 子弹,武器的子节点
 */
class Bullet extends egret.Sprite {
    private particle_png:string;
    private particle_json:string;
    private targetX:number;
    private targetY:number;

    /**
     * @param particle_png 粒子纹理
     * @param particle_json 粒子属性
     * @param targetX  射击位置,决定子弹图像初始角度和移动方向
     * @param targetY
     */
    constructor(particle_png:string, particle_json:string, targetX:number, targetY:number){
        super();
        this.particle_png = particle_png;
        this.particle_json = particle_json;
        this.targetX = targetX;
        this.targetY = targetY;


        this.init();
    }
    //初始化
    private init():void{
        var particleSystem = new particle.GravityParticleSystem(RES.getRes(this.particle_png), RES.getRes(this.particle_json));
        particleSystem.x = 0;
        particleSystem.y = 0;
        particleSystem.start();
        this.addChild(particleSystem);
    }
    private _moveX:number;
    private _moveY:number;
    public initFly(){
        var rX = this.targetX - this.x;
        var rY = this.targetY - this.y;
        var ank = Math.sqrt(rX*rX +rY*rY);
        this._moveX = rX / ank;
        this._moveY = rY / ank;
        this.moveYX();
    }
    private speed:number = 20;//每一帧的移动距离
    public moveYX(){
        this.x += this._moveX * this.speed;
        this.y += this._moveY * this.speed;
    }
}