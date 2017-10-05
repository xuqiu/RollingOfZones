class CellMap extends egret.Sprite {
    public static CELL_SIZE = 32;
    public static TRUNK_SIZE = 10;
    private seed: string = "asdfgh";
    private trunkCache:Trunk[] = [];
    private renderedTrunkCache:Trunk[] = [];
    private cellCache:Cell[] = [];
    private seedCache:Trunk[] = [];

    constructor(seed: string) {
        super();
        this.seed = seed;
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
    }

    private onTouch(evt: egret.TouchEvent): void {
        let cx = Math.floor(evt.localX / CellMap.CELL_SIZE);
        let cy = Math.floor(evt.localY / CellMap.CELL_SIZE);
        let tx = Math.floor(cx / CellMap.TRUNK_SIZE);
        let ty = Math.floor(cy / CellMap.TRUNK_SIZE);
        this.genTrunksWalk(tx, ty);
    }

    private static rate: number = 20;

    public static randomIdx(tx, ty, cx, cy, seed): boolean {
        let rnd = CellMap.randomByMd5(seed + "," + tx + "," + ty + "," + cx + "," + cy,10000);
        return rnd < CellMap.rate;
    };
    public static randomByMd5(src:string,range:number):number{
        return parseInt(new MD5().hex_md5(src), 16) % range;
    }


    public addCell(x: number, y: number, idx: number) {
        let cell: Cell = new Cell(idx);
        cell.x = x * CellMap.CELL_SIZE;
        cell.y = y * CellMap.CELL_SIZE;
        this.cellCache[x+","+y] = cell;
        this.addChild(cell);
    }
    public removeCell(x: number, y: number) {
        this.removeChild(this.cellCache[x+","+y]);
    }

    public static RENDER_RANGE=1;
    public genTrunksWalk(tx: number, ty: number) {
        for(let sy = ty-CellMap.RENDER_RANGE;sy<=ty+CellMap.RENDER_RANGE;sy++){
            for(let sx = tx-CellMap.RENDER_RANGE;sx<=tx+CellMap.RENDER_RANGE;sx++){
                this.genTrunkSeeds(sx,sy);
            }
        }
        this.x = 400 - tx*CellMap.CELL_SIZE*CellMap.TRUNK_SIZE*Main.SCALE;
        this.y = 300 - ty*CellMap.CELL_SIZE*CellMap.TRUNK_SIZE*Main.SCALE;
        //回收外圈资源
        for(let sy = ty-CellMap.RENDER_RANGE-1;sy<=ty+CellMap.RENDER_RANGE+1;sy++){
            for(let sx = tx-CellMap.RENDER_RANGE-1;sx<=tx+CellMap.RENDER_RANGE+1;sx++){
                let renderedTrunk = this.renderedTrunkCache[sx+","+sy];
                if((Math.abs(sx-tx)>CellMap.RENDER_RANGE
                    ||Math.abs(sy-ty)>CellMap.RENDER_RANGE)
                    &&renderedTrunk){

                    this.removeTrunk(renderedTrunk);
                }

            }
        }
    }

    public genTrunkSeeds(cx: number, cy: number) {
        if(this.renderedTrunkCache[cx+","+cy]){
            return;
        }
        let cachedTrunk = this.trunkCache[cx+","+cy];
        if(cachedTrunk){
            this.addTrunk(cachedTrunk);
            return;
        }
        let seedTrunks: Trunk[] = Trunk.getSeeds(cx, cy, this.seed);

        let seedPointArray:number[][] = [];

        for (let trunk of seedTrunks) {
            for (let y = 0; y < CellMap.TRUNK_SIZE; y++) {
                for (let x = 0; x < CellMap.TRUNK_SIZE; x++) {
                    let idx = 0;
                    idx = trunk.data[y][x];
                    if (idx == 1) {
                        seedPointArray.push([trunk.x * 10 + x, trunk.y * 10 + y]);
                    }
                }
            }
            //this.addTrunk(trunk);
        }


        let trunkCenter:Trunk = new Trunk();
        trunkCenter.x = cx;
        trunkCenter.y = cy;

        for(let seedPoint of seedPointArray){
            //随机椭圆 需要生成3个随机数
            //第二个焦点相对本焦点的x
            let rx = CellMap.randomByMd5(this.seed + "," + seedPoint[0] + "," + seedPoint[1] + "," + "x",20);
            seedPoint.push(seedPoint[0] + rx);
            //第二个焦点相对本焦点的y
            let ry = CellMap.randomByMd5(this.seed + "," + seedPoint[0] + "," + seedPoint[1] + "," + "y",20);
            seedPoint.push(seedPoint[1] + ry);
            //半径
            let rr = CellMap.randomByMd5(this.seed + "," + seedPoint[0] + "," + seedPoint[1] + "," + "r",10);
            let disF = Math.ceil(Math.sqrt(rx * rx + ry * ry));
            //随机半径至少大于两个焦点的距离
            rr = rr +disF;
            seedPoint.push(rr);
            egret.log(seedPoint[0],seedPoint[1],seedPoint[2],seedPoint[3],seedPoint[4]);
        }
        for (let y = 0; y < CellMap.TRUNK_SIZE; y++) {
            for (let x = 0; x < CellMap.TRUNK_SIZE; x++) {
                for(let seedPoint of seedPointArray){
                    let tx = cx * CellMap.TRUNK_SIZE + x;
                    let ty = cy * CellMap.TRUNK_SIZE + y;
                    let dis1 = CellMap.dis(tx,ty,seedPoint[0],seedPoint[1]);
                    let dis2 = CellMap.dis(tx,ty,seedPoint[2],seedPoint[3]);
                    if(dis1 + dis2 < seedPoint[4]){
                        trunkCenter.data[y][x] = 1;
                        break;
                    }
                }
            }
        }
        this.trunkCache[cx+","+cy]=trunkCenter;
        this.addTrunk(trunkCenter);
    }
    public static dis(x1:number,y1:number,x2:number,y2:number,):number{
        let dx = x1-x2;
        let dy = y1-y2;
        return Math.ceil(Math.sqrt(dx * dx + dy * dy));
    }

    public addTrunk(trunk: Trunk) {
        this.renderedTrunkCache[trunk.x+","+trunk.y]=trunk;
        for (let y = 0; y < CellMap.TRUNK_SIZE; y++) {
            for (let x = 0; x < CellMap.TRUNK_SIZE; x++) {
                let idx = 0;
                idx = trunk.data[y][x];

                this.addCell(trunk.x * CellMap.TRUNK_SIZE + x,
                    trunk.y * CellMap.TRUNK_SIZE + y,
                    idx);
            }
        }

    }
    public removeTrunk(trunk: Trunk) {
        this.renderedTrunkCache[trunk.x+","+trunk.y] = null;
        for (let y = 0; y < CellMap.TRUNK_SIZE; y++) {
            for (let x = 0; x < CellMap.TRUNK_SIZE; x++) {
                this.removeCell(trunk.x * CellMap.TRUNK_SIZE + x,
                    trunk.y * CellMap.TRUNK_SIZE + y);
            }
        }
    }
}


class Cell extends egret.Bitmap {
    private imgRes: egret.SpriteSheet = RES.getRes("grass_json");
    private imgArray: egret.Texture[] = [this.imgRes.getTexture("green"), this.imgRes.getTexture("rock")];

    constructor(idx: number) {
        super();
        this.texture = this.imgArray[idx];
    }
}

class Trunk {
    public x: number = 0;
    public y: number = 0;
    public data: number[][] = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];


    public static getSeeds(tx: number, ty: number, seed: string): Trunk[] {
        let result: Trunk[] = [];
        for(let sy = ty-3;sy<=ty+3;sy++){
            for(let sx = tx-2;sx<=tx+2;sx++){
                result.push(this.getSeed(sx, sy, seed));
            }
        }
        return result;
    }

    public static getSeed(tx: number, ty: number, seed: string): Trunk {
        let trunk: Trunk = new Trunk();
        trunk.x = tx;
        trunk.y = ty;
        for (let y = 0; y < CellMap.TRUNK_SIZE; y++) {
            for (let x = 0; x < CellMap.TRUNK_SIZE; x++) {
                if (CellMap.randomIdx(tx, ty, x, y, seed)) {
                    trunk.data[y][x] = 1;
                }

            }
        }
        return trunk;
    }
}