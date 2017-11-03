class EnemyPool extends Pool{
    getInstance(type?:string): IPoolItem {
        return new Enemy(type);
    }

}