class CellMap extends egret.Sprite {
    public static CELL_SIZE = 32;
    public static TRUNK_SIZE = 10;
    private seed: string = "i am seed";
    private trunkCache: Trunk[] = [];
    private renderedTrunkCache: Trunk[] = [];
    private cellCache: Cell[] = [];


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
        this.renderTrunks(tx, ty);
    }

    private static rate: number = 20;

    public static randomIdx(tx, ty, cx, cy, seed): boolean {
        let rnd = CellMap.randomByMd5(seed + "," + tx + "," + ty + "," + cx + "," + cy, 10000);
        return rnd < CellMap.rate;
    };

    public static randomByMd5(src: string, range: number): number {
        return parseInt(new MD5().hex_md5(src), 16) % range;
    }


    public addCell(x: number, y: number) {
        let cellDate = this.getCellDate(x, y);
        let cell: Cell;
        if (cellDate == 0) {
            cell = Cell.getByType("n");
        } else if (cellDate == 1) {
            let u = this.getCellDate(x, y - 1);
            let d = this.getCellDate(x, y + 1);
            let l = this.getCellDate(x - 1, y);
            let r = this.getCellDate(x + 1, y);
            let ul = this.getCellDate(x - 1, y - 1);
            let ur = this.getCellDate(x + 1, y - 1);
            let dl = this.getCellDate(x - 1, y + 1);
            let dr = this.getCellDate(x + 1, y + 1);

            cell = Cell.getBySur(u, d, l, r, ul, ur, dl, dr);

        }


        cell.x = x * CellMap.CELL_SIZE;
        cell.y = y * CellMap.CELL_SIZE;
        this.cellCache[x + "," + y] = cell;
        this.addChild(cell);
    }

    public getCellDate(x: number, y: number): number {
        let tx = Math.floor(x / CellMap.TRUNK_SIZE);
        let ty = Math.floor(y / CellMap.TRUNK_SIZE);
        let cx = x % CellMap.TRUNK_SIZE;
        let cy = y % CellMap.TRUNK_SIZE;
        if (cx < 0) {
            cx = CellMap.TRUNK_SIZE + cx;
        }
        if (cy < 0) {
            cy = CellMap.TRUNK_SIZE + cy;
        }

        let cachedTrunk = this.trunkCache[tx + "," + ty];
        return cachedTrunk.data[cy][cx];
    }

    public removeCell(x: number, y: number) {
        this.removeChild(this.cellCache[x + "," + y]);
    }

    /**
     * 渲染距离1,既以当前位置为中心 3x3 的范围
     * 为了渲染准确,地图数据加载范围多一个既 5x5
     * 为了生成地图数据准确(种子生成地图的唯一性),种子地图加载范围比数据多2格 7*7
     */
    public static RENDER_RANGE = 1;

    public renderTrunks(tx: number, ty: number) {
        let dataRange = CellMap.RENDER_RANGE + 1;
        //先生成地图数据,放到缓存
        for (let sy = ty - dataRange; sy <= ty + dataRange; sy++) {
            for (let sx = tx - dataRange; sx <= tx + dataRange; sx++) {
                this.genTrunkBySeeds(sx, sy);
            }
        }
        //然后再渲染
        for (let sy = ty - CellMap.RENDER_RANGE; sy <= ty + CellMap.RENDER_RANGE; sy++) {
            for (let sx = tx - CellMap.RENDER_RANGE; sx <= tx + CellMap.RENDER_RANGE; sx++) {
                //先放到缓存里
                this.renderTrunk(sx, sy);
            }
        }

        //移动地图到中心,后期会改为以人物为中心
        this.x = 300 - tx * CellMap.CELL_SIZE * CellMap.TRUNK_SIZE * Main.SCALE;
        this.y = 200 - ty * CellMap.CELL_SIZE * CellMap.TRUNK_SIZE * Main.SCALE;
        //回收外圈资源
        for (let sy = ty - CellMap.RENDER_RANGE - 1; sy <= ty + CellMap.RENDER_RANGE + 1; sy++) {
            for (let sx = tx - CellMap.RENDER_RANGE - 1; sx <= tx + CellMap.RENDER_RANGE + 1; sx++) {
                let renderedTrunk = this.renderedTrunkCache[sx + "," + sy];
                if ((Math.abs(sx - tx) > CellMap.RENDER_RANGE
                        || Math.abs(sy - ty) > CellMap.RENDER_RANGE)
                    && renderedTrunk) {

                    this.removeTrunk(renderedTrunk);
                }

            }
        }
    }

    private renderTrunk(cx: number, cy: number) {
        if (this.renderedTrunkCache[cx + "," + cy]) {
            return;
        }
        let cachedTrunk = this.trunkCache[cx + "," + cy];
        this.addTrunk(cachedTrunk);

    }

    public genTrunkBySeeds(cx: number, cy: number) {
        let cachedTrunk = this.trunkCache[cx + "," + cy];
        if (cachedTrunk) {
            return;
        }

        //获取种子地图
        let seedTrunks: Trunk[] = Trunk.getSeeds(cx, cy, this.seed);

        let seedPointArray: number[][] = [];

        //获取种子地图里的噪点数据
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


        let trunkCenter: Trunk = new Trunk();
        trunkCenter.x = cx;
        trunkCenter.y = cy;
        //根据噪点数据画椭圆(以seed随机)
        for (let seedPoint of seedPointArray) {
            //随机椭圆 需要生成3个随机数
            //第二个焦点相对本焦点的x
            let rx = CellMap.randomByMd5(this.seed + "," + seedPoint[0] + "," + seedPoint[1] + "," + "x", 20);
            seedPoint.push(seedPoint[0] + rx);
            //第二个焦点相对本焦点的y
            let ry = CellMap.randomByMd5(this.seed + "," + seedPoint[0] + "," + seedPoint[1] + "," + "y", 20);
            seedPoint.push(seedPoint[1] + ry);
            //半径
            let rr = CellMap.randomByMd5(this.seed + "," + seedPoint[0] + "," + seedPoint[1] + "," + "r", 10);
            let disF = Math.ceil(Math.sqrt(rx * rx + ry * ry));
            //随机半径至少大于两个焦点的距离
            rr = rr + disF;
            seedPoint.push(rr);
            //egret.log(seedPoint[0], seedPoint[1], seedPoint[2], seedPoint[3], seedPoint[4]);
        }

        //根据噪点椭圆生成地图数据
        for (let y = 0; y < CellMap.TRUNK_SIZE; y++) {
            for (let x = 0; x < CellMap.TRUNK_SIZE; x++) {
                for (let seedPoint of seedPointArray) {
                    let tx = cx * CellMap.TRUNK_SIZE + x;
                    let ty = cy * CellMap.TRUNK_SIZE + y;
                    let dis1 = CellMap.dis(tx, ty, seedPoint[0], seedPoint[1]);
                    let dis2 = CellMap.dis(tx, ty, seedPoint[2], seedPoint[3]);
                    if (dis1 + dis2 <= seedPoint[4]) {
                        trunkCenter.data[y][x] = 1;
                        break;
                    }
                }
            }
        }
        this.trunkCache[cx + "," + cy] = trunkCenter;
    }

    public static dis(x1: number, y1: number, x2: number, y2: number,): number {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.ceil(Math.sqrt(dx * dx + dy * dy));
    }

    public addTrunk(trunk: Trunk) {
        this.renderedTrunkCache[trunk.x + "," + trunk.y] = trunk;
        for (let y = 0; y < CellMap.TRUNK_SIZE; y++) {
            for (let x = 0; x < CellMap.TRUNK_SIZE; x++) {
                this.addCell(trunk.x * CellMap.TRUNK_SIZE + x,
                    trunk.y * CellMap.TRUNK_SIZE + y);
            }
        }

    }

    public removeTrunk(trunk: Trunk) {
        this.renderedTrunkCache[trunk.x + "," + trunk.y] = null;
        for (let y = 0; y < CellMap.TRUNK_SIZE; y++) {
            for (let x = 0; x < CellMap.TRUNK_SIZE; x++) {
                this.removeCell(trunk.x * CellMap.TRUNK_SIZE + x,
                    trunk.y * CellMap.TRUNK_SIZE + y);
            }
        }
    }
}

class CellUnit extends egret.Bitmap {
    private imgRes: egret.SpriteSheet = RES.getRes("grass_json");

    constructor(tex: string) {
        super();
        this.texture = this.imgRes.getTexture(tex);
    }
}

class Cell extends egret.Sprite {

    constructor(cu1: string, cu2: string, cu3: string, cu4: string) {
        super();
        let cellUnit1 = new CellUnit(cu1);
        this.addChild(cellUnit1);

        let cellUnit2 = new CellUnit(cu2);
        cellUnit2.x = 16;
        this.addChild(cellUnit2);
        let cellUnit3 = new CellUnit(cu3);
        cellUnit3.y = 16;
        this.addChild(cellUnit3);
        let cellUnit4 = new CellUnit(cu4);
        cellUnit4.x = 16;
        cellUnit4.y = 16;
        this.addChild(cellUnit4);
    }

    public static getByType(type: string): Cell {
        switch (type) {
            case "hs":
                return new Cell("hul", "hur", "hdl", "hdr");
            case "hd":
                return new Cell("n", "n", "hd", "hd");
            case "hds":
                return new Cell("hl", "hr", "hdl", "hdr");
            case "hdl":
                return new Cell("hl", "n", "hdl", "hd");
            case "hdr":
                return new Cell("n", "hr", "hd", "hdr");
            case "hu":
                return new Cell("hu", "hu", "n", "n");
            case "hus":
                return new Cell("hul", "hur", "hl", "hr");
            case "hul":
                return new Cell("hul", "hu", "hl", "n");
            case "hur":
                return new Cell("hu", "hur", "n", "hr");
            case "hl":
                return new Cell("hl", "n", "hl", "n");
            case "hr":
                return new Cell("n", "hr", "n", "hr");
            case "hls":
                return new Cell("hul", "hu", "hdl", "hd");
            case "hrs":
                return new Cell("hu", "hur", "hd", "hdr");
            case "hud":
                return new Cell("hu", "hu", "hd", "hd");
            case "hlr":
                return new Cell("hl", "hr", "hl", "hr");
            default:
                return new Cell("n", "n", "n", "n");
        }
    }

    public static getByCorner(ul, ur, dl, dr): Cell {
        return new Cell(ul == 0 ? "hul1" : "n", ur == 0 ? "hur1" : "n", dl == 0 ? "hdl1" : "n", dr == 0 ? "hdr1" : "n");
    }

    public static getBySur(u: number, d: number, l: number, r: number, ul: number, ur: number, dl: number, dr: number) {
        let cul;
        let cur;
        let cdl;
        let cdr;
        if (l == 0 && ul == 0 && u == 0) {
            cul = "hul";
        }else if (l == 0 && ul == 0 && u == 1) {
            cul = "hl";
        }else if (l == 0 && ul == 1 && u == 0) {
            cul = "hul";
        }else if (l == 0 && ul == 1 && u == 1) {
            cul = "hl";
        }else if (l == 1 && ul == 0 && u == 0) {
            cul = "hu";
        }else if (l == 1 && ul == 0 && u == 1) {
            cul = "hul1";
        }else if (l == 1 && ul == 1 && u == 0) {
            cul = "hu";
        }else if (l == 1 && ul == 1 && u == 1) {
            cul = "n";
        }
        if (r == 0 && ur == 0 && u == 0) {
            cur = "hur";
        }else if (r == 0 && ur == 0 && u == 1) {
            cur = "hr";
        }else if (r == 0 && ur == 1 && u == 0) {
            cur = "hur";
        }else if (r == 0 && ur == 1 && u == 1) {
            cur = "hr";
        }else if (r == 1 && ur == 0 && u == 0) {
            cur = "hu";
        }else if (r == 1 && ur == 0 && u == 1) {
            cur = "hur1";
        }else if (r == 1 && ur == 1 && u == 0) {
            cur = "hu";
        }else if (r == 1 && ur == 1 && u == 1) {
            cur = "n";
        }

        if (l == 0 && dl == 0 && d == 0) {
            cdl = "hdl";
        }else if (l == 0 && dl == 0 && d == 1) {
            cdl = "hl";
        }else if (l == 0 && dl == 1 && d == 0) {
            cdl = "hdl";
        }else if (l == 0 && dl == 1 && d == 1) {
            cdl = "hl";
        }else if (l == 1 && dl == 0 && d == 0) {
            cdl = "hd";
        }else if (l == 1 && dl == 0 && d == 1) {
            cdl = "hdl1";
        }else if (l == 1 && dl == 1 && d == 0) {
            cdl = "hd";
        }else if (l == 1 && dl == 1 && d == 1) {
            cdl = "n";
        }
        if (r == 0 && dr == 0 && d == 0) {
            cdr = "hdr";
        }else if (r == 0 && dr == 0 && d == 1) {
            cdr = "hr";
        }else if (r == 0 && dr == 1 && d == 0) {
            cdr = "hdr";
        }else if (r == 0 && dr == 1 && d == 1) {
            cdr = "hr";
        }else if (r == 1 && dr == 0 && d == 0) {
            cdr = "hd";
        }else if (r == 1 && dr == 0 && d == 1) {
            cdr = "hdr1";
        }else if (r == 1 && dr == 1 && d == 0) {
            cdr = "hd";
        }else if (r == 1 && dr == 1 && d == 1) {
            cdr = "n";
        }
        return new Cell(cul, cur, cdl, cdr);
    }
}


class Trunk {
    //缓存种子
    private static seedCache: Trunk[] = [];
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
        let seedRange = 2;
        for (let sy = ty - seedRange; sy <= ty + seedRange; sy++) {
            for (let sx = tx - seedRange; sx <= tx + seedRange; sx++) {
                let cachedSeedTrunk = Trunk.seedCache[sx + "," + sy];
                if (!cachedSeedTrunk) {
                    cachedSeedTrunk = this.getSeed(sx, sy, seed);
                    Trunk.seedCache[sx + "," + sy] = cachedSeedTrunk;
                }
                result.push(cachedSeedTrunk);
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