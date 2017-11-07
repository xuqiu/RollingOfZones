/**
 * 子弹,武器的子节点
 */
class Bullet extends particle.GravityParticleSystem {
    //子弹缓存,1唯是粒子类型
    public static BULLET_POOL:Bullet[][]=[];
    private targetX:number;
    private targetY:number;
    private particle_png:string;
    private particle_type:string;

    /**
     * @param particle_png 粒子纹理
     * @param particle_type 粒子类型
     * @param targetX  射击位置,决定子弹图像初始角度和移动方向
     * @param targetY
     */
    constructor(particle_png:string, particle_type:string, targetX:number, targetY:number) {
        super(RES.getRes(particle_png), RES.getRes(particle_type));
        this.particle_png = particle_png;
        this.particle_type = particle_type;
        this.targetX = targetX;
        this.targetY = targetY;
    }

    public static getBullet(particle_png:string, particle_type:string, targetX:number, targetY:number):Bullet{
        let cachedBulletArray:Bullet[] = Bullet.BULLET_POOL[particle_type];
        if(cachedBulletArray == null){
            cachedBulletArray = [];
            Bullet.BULLET_POOL[particle_type] = cachedBulletArray;
        }
        let cachedBullet = cachedBulletArray.pop();
        if(cachedBullet == null) {
            cachedBullet = new Bullet(particle_png, particle_type, targetX, targetY);
            cachedBulletArray.push(cachedBullet);
        }else if (particle_png != cachedBullet.particle_png){
            cachedBullet.particle_png = particle_png;
            cachedBullet.changeTexture(RES.getRes(particle_png));
        }
        //重置位置
        cachedBullet.targetX = targetX;
        cachedBullet.targetY = targetY;
        cachedBullet.x = 0;
        cachedBullet.y = 0;
        cachedBullet.emitterX = 0;
        cachedBullet.emitterY = 0;
        cachedBullet.start();
        egret.log(Bullet.BULLET_POOL.length,Bullet.BULLET_POOL[particle_type].length);
        return cachedBullet;
    }

    private _moveX:number;
    private _moveY:number;

    private bulletTimer:egret.Timer = new egret.Timer(20, 50);
    public fire() {

        let rX = this.targetX - this.x;
        let rY = this.targetY - this.y;
        let ank = Math.sqrt(rX * rX + rY * rY);
        this._moveX = rX / ank;
        this._moveY = rY / ank;
        this.bulletTimer.addEventListener(egret.TimerEvent.TIMER, this.letBulletFly, this);
        this.bulletTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.reuse, this);
        this.bulletTimer.start();
    }

    private flySpeed:number = 10;//每一帧的移动距离
    public fly() {
        this.emitterX += this._moveX * this.flySpeed;
        this.emitterY += this._moveY * this.flySpeed;
    }

    public letBulletFly() {
        this.fly();
        if(this.checkHit()){
            this.reuse();
        }

    }

    private reuse() {
        this.stop(true);
        this.bulletTimer.reset();
        Bullet.BULLET_POOL[this.particle_type].push(this);
    }

    /**
     * 检测是否击中敌人
     */
    private fireRadio:number = 20;//伤害范围
    private checkHit():boolean {
        for(let enemy of Main.enemyPool.activePool){
            let dX = this.emitterX + this.x - enemy.x;
            let dY = this.emitterY + this.y - enemy.y;
            let d = Math.sqrt(dX * dX + dY * dY);
            if(d<this.fireRadio && !enemy.isDead()){
                egret.log("hit");
                enemy.gotHit();
                return true;
            }
        }
        return false;
    }
}