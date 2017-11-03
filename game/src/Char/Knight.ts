class Knight extends KnightShow {
    protected  _name:string;
    protected _hp:number;
    protected _hpMAX:number;
    protected _ap:number;
    protected _dead:boolean;
    private healthBar:HealthBar;
    constructor(skin?:string) {
        super(skin);
    }
    public setData(data:any[]){
        this._name=data["name"];
        this._hp=data["hp"];
        this._hpMAX=data["hpMAX"];
        this._ap=data["ap"];
        this.drawBar();
    }
    private drawBar(){
        if(this._dead){
            return;
        }
        if(!this.healthBar){
            this.healthBar = new HealthBar();
            this.healthBar.y = - this.height/2 -10;
            this.addChildAt(this.healthBar,999);
        }
        this.healthBar.setValue(this._hp/this._hpMAX)

    }
    //被击中
    public gotHit(){
        this._hp -= 100;
        if(this._hp < 0){
            this._hp = 0;
            this.dead();
        }
        this.drawBar();
        super.gotHit();
    }
    //region 基本行为
    //死亡
    public dead() {
        //死一次就够了
        if(this._dead){
            return;
        }
        this._dead=true;
        if (this.healthBar){
            this.removeChild(this.healthBar);
            this.healthBar = null;
        }
        super.dead();
    }
}