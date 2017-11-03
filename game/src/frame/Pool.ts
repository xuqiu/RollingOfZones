abstract class Pool{
    //缓存池2维是为了区分类型
    private idlePool:IPoolItem[][];
    public activePool:IPoolItem[];
    private size:number = 500;//池子大小默认500
    public constructor(size?:number)
    {
        if(size){
            this.size = size;
        }
        this.activePool = [];
        this.idlePool = [];
    }
    public get(type?:string):IPoolItem{
        let storeInstance;
        if(type){
            storeInstance = this.idlePool[type].pop();
        }else{
            storeInstance = this.idlePool[0].pop();
        }
        if(storeInstance){
            this.activePool.push(storeInstance);
            return storeInstance;
        }else if(this.activePool.length<this.size){
            let newInstance = this.getInstance(type);
            this.activePool.push(newInstance);
            return newInstance;
        } else{
            return null;
        }
    }
    public preserve(toPreserve:IPoolItem):void{
        let type = toPreserve.getType();
        if(type){
            this.idlePool[type].push(toPreserve);
        }else{
            this.idlePool[0].push(toPreserve);
        }
        let idx = this.activePool.indexOf(toPreserve);
        this.activePool.splice(idx);
    }
    abstract getInstance(type?:string):IPoolItem;
}
interface IPoolItem{
    getType():string;
}