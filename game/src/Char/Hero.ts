class Hero extends Knight {
    public moveYX():boolean[] {
        let moved = super.moveYX();
        //同时移动 地图
        let cellMap: CellMap = this.getParentMap();
        if(moved[0]) {

            cellMap.x -= this._moveX * this.footSize * Main.SCALE;
        }
        if(moved[1]) {
            cellMap.y -= this._moveY * this.footSize * Main.SCALE;
        }
        return moved;
    }
}