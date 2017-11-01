class Hero extends KnightShow {
    public moveYX():boolean {
        let moved = super.moveYX();
        //同时移动 地图
        if(moved) {
            let cellMap: CellMap = this.getParentMap();
            cellMap.x -= this._moveX * this.footSize * Main.SCALE;
            cellMap.y -= this._moveY * this.footSize * Main.SCALE;
        }
        return moved;
    }
}