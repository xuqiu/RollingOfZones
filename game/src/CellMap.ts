class CellMap extends egret.Sprite {
    public static CELL_SIZE = 32;
    public static TRUNK_SIZE = 10;
    private seed:string = "";
    constructor(seed:string) {
        super();
        this.seed=seed;
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
    }

    private onTouch(evt: egret.TouchEvent): void {
        let cx = Math.floor(evt.localX / CellMap.CELL_SIZE);
        let cy = Math.floor(evt.localY / CellMap.CELL_SIZE);
        egret.log(cx, cy);
    }

    private static rate:number = 100;
    public static randomIdx(tx, ty, cx, cy, seed):boolean {
        let rnd = parseInt(new MD5().hex_md5(seed + ","+tx+","+ty+","+cx+","+cy),16)%10000;
        return rnd<CellMap.rate;
    };


    public addCell(x: number, y: number, idx: number) {
        let cell: Cell = new Cell(idx);
        cell.x = x * CellMap.CELL_SIZE;
        cell.y = y * CellMap.CELL_SIZE;
        this.addChild(cell);
    }
    public genTrunk(x: number, y: number){
        let seedTrunks:Trunk[] = Trunk.getSeeds(x, y, this.seed);

        for(let trunk of seedTrunks){
            this.addTrunk(trunk);
        }
    }

    public addTrunk(trunk: Trunk) {
        for (let y = 0; y < CellMap.TRUNK_SIZE; y++) {
            for (let x = 0; x < CellMap.TRUNK_SIZE; x++) {
                let idx = 0;
                try {
                    idx = trunk.data[y][x];
                } catch (e) {
                }
                this.addCell(trunk.x * CellMap.TRUNK_SIZE + x,
                    trunk.y * CellMap.TRUNK_SIZE + y,
                    idx);
            }
        }

    }
}


class Cell extends egret.Bitmap {
    private imgRes: egret.SpriteSheet = RES.getRes("mapCells_json");
    private imgArray: egret.Texture[] = [this.imgRes.getTexture("red"), this.imgRes.getTexture("green")];

    constructor(idx: number) {
        super();
        this.texture = this.imgArray[idx];
    }
}

class Trunk {
    public x: number = 0;
    public y: number = 0;
    public data: number[][]=[
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
    ];


    public static getSeeds(tx: number, ty: number, seed:string): Trunk[] {
        let result:Trunk[]=[];
        result.push(this.getSeed(tx-1,ty-1, seed));
        result.push(this.getSeed(tx,ty-1, seed));
        result.push(this.getSeed(tx+1,ty-1, seed));
        result.push(this.getSeed(tx-1,ty, seed));
        result.push(this.getSeed(tx,ty, seed));
        result.push(this.getSeed(tx+1,ty, seed));
        result.push(this.getSeed(tx-1,ty+1, seed));
        result.push(this.getSeed(tx,ty+1, seed));
        result.push(this.getSeed(tx+1,ty+1, seed));
        return result;
    }
    public static getSeed(tx: number, ty: number, seed:string): Trunk {
        let trunk: Trunk = new Trunk();
        trunk.x = tx;
        trunk.y= ty;
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