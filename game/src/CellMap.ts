class CellMap extends egret.Sprite {
    public static CELL_SIZE = 32;
    public static TRUNK_SIZE = 10;
    private seed: string = "";

    constructor(seed: string) {
        super();
        this.seed = seed;
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
    }

    private onTouch(evt: egret.TouchEvent): void {
        let cx = Math.floor(evt.localX / CellMap.CELL_SIZE);
        let cy = Math.floor(evt.localY / CellMap.CELL_SIZE);
        egret.log(cx, cy);
    }

    private static rate: number = 100;

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
        this.addChild(cell);
    }

    public genTrunkSeeds(cx: number, cy: number) {
        let seedTrunks: Trunk[] = Trunk.getSeeds(cx, cy, this.seed);

        let seedPointArray:number[][] = [];

        for (let trunk of seedTrunks) {
            for (let y = 0; y < CellMap.TRUNK_SIZE; y++) {
                for (let x = 0; x < CellMap.TRUNK_SIZE; x++) {
                    let idx = 0;
                    idx = trunk.data[y][x];
                    if (idx == 1) {
                        egret.log(trunk.x * 10 + x, trunk.y * 10 + y);
                        seedPointArray.push([trunk.x * 10 + x, trunk.y * 10 + y]);
                    }
                }
            }
            this.addTrunk(trunk);
        }


        let trunkCenter:Trunk = new Trunk();

        for(let seedPoint of seedPointArray){
            //随机椭圆 需要生成3个随机数
            //第二个焦点相对本焦点的x
            let rx = CellMap.randomByMd5(this.seed + "," + seedPoint[0] + "," + seedPoint[1] + "," + "x",5);
            seedPoint.push(seedPoint[0] + rx);
            //第二个焦点相对本焦点的y
            let ry = CellMap.randomByMd5(this.seed + "," + seedPoint[0] + "," + seedPoint[1] + "," + "y",5);
            seedPoint.push(seedPoint[1] + ry);
            //半径
            let rr = CellMap.randomByMd5(this.seed + "," + seedPoint[0] + "," + seedPoint[1] + "," + "r",20);
            seedPoint.push(rr);
            egret.log(rx,ry,rr);
        }

        for (let y = 0; y < CellMap.TRUNK_SIZE; y++) {
            for (let x = 0; x < CellMap.TRUNK_SIZE; x++) {
                for(let seedPoint of seedPointArray){
                    let tx = cx * CellMap.TRUNK_SIZE + x;
                    let ty = cy * CellMap.TRUNK_SIZE + y;
                    let dis1 = CellMap.dis(tx,ty,seedPoint[0],seedPoint[1]);
                    let dis2 = CellMap.dis(tx,ty,seedPoint[2],seedPoint[3]);
                    if(dis1 + dis2 < seedPoint[4]){
                        trunkCenter.data[x][y] = 1;
                        continue;
                    }
                }
            }
        }
        trunkCenter.x = -2;
        trunkCenter.y = -2;
        this.addTrunk(trunkCenter);
    }
    public static dis(x1:number,y1:number,x2:number,y2:number,):number{
        let dx = x1-x2;
        let dy = y1-y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public addTrunk(trunk: Trunk) {
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
        result.push(this.getSeed(tx - 1, ty - 1, seed));
        result.push(this.getSeed(tx, ty - 1, seed));
        result.push(this.getSeed(tx + 1, ty - 1, seed));
        result.push(this.getSeed(tx - 1, ty, seed));
        result.push(this.getSeed(tx, ty, seed));
        result.push(this.getSeed(tx + 1, ty, seed));
        result.push(this.getSeed(tx - 1, ty + 1, seed));
        result.push(this.getSeed(tx, ty + 1, seed));
        result.push(this.getSeed(tx + 1, ty + 1, seed));
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