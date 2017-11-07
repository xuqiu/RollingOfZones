abstract class Pool<T extends IPoolItem>{
    //缓存池2维是为了区分类型
    private idlePool:T[][];
    public activePool:T[];
    private size:number = 500;//池子大小默认500
    public constructor(size?:number)
    {
        if(size){
            this.size = size;
        }
        this.activePool = [];
        this.idlePool = [];
    }
    public get(type?:any):T{
        let storeInstance;
        if(!type){
            type = 0;
        }
        if(!this.idlePool[type]){
            this.idlePool[type] = [];
        }else{
            storeInstance = this.idlePool[type].pop();
        }
        if(storeInstance){
            this.activePool.push(storeInstance);
            return storeInstance;
        }else if(this.activePool.length<this.size){
            let newInstance:T = this.getInstance(type);
            this.activePool.push(newInstance);
            return newInstance;
        } else{
            return null;
        }
    }
    public preserve(toPreserve:T):void{
        let type = toPreserve.getType();
        if(type){
            this.idlePool[type].push(toPreserve);
        }else{
            this.idlePool[0].push(toPreserve);
        }
        let idx = this.activePool.indexOf(toPreserve);
        this.activePool.splice(idx);
    }
    abstract getInstance(type?:string):T;
}
interface IPoolItem{
    getType():string;
}