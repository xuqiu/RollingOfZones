class Knight extends KnightShow {
    protected  _name:string;
    protected _hp:number;
    protected _hpMAX:number;
    protected _ap:number;
    private healthBar:HealthBar;
    constructor(skin:string) {
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
        if(!this.healthBar){
            this.healthBar = new HealthBar();
            this.healthBar.y = - this.height/2 -10;
            this.addChildAt(this.healthBar,999);
        }
        this.healthBar.setValue(this._hp/this._hpMAX)

    }
    //被击中
    public gotHit(){
        this._hp -= 20;
        if(this._hp < 0){
            this._hp = 0;
            this.dead();
        }
        this.drawBar();
        super.gotHit();
    }
}