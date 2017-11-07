class EnemyPool extends Pool<Enemy>{
    getInstance(type?: string): Enemy {
        return new Enemy(type);
    }
}