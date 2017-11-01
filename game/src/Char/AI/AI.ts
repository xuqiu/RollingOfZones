class AI{
    private static aiMap={
        "straight":new StraightAI() //耿直的AI,不会寻路
    };
    public static get(name:string):AI{
        return AI.aiMap[name];
    }
    public run(owner:Enemy):void{

    }
}