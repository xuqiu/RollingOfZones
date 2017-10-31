class StraightAI extends AI{
    public static instance:StraightAI = new StraightAI();
    public run(owner:Enemy):void{
        owner.movePoint(Main.HERO.getPoint());
    }
}