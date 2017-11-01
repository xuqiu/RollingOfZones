class StraightAI extends AI{

    public run(owner:Enemy):void{
        owner.movePoint(Main.HERO.getPoint());
    }
}