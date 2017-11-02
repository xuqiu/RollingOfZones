class AI{
    private static aiMap;
    public static get(name:string):AI{
        if(!AI.aiMap){
            AI.aiMap={
                "straight":new StraightAI() //耿直的AI,不会寻路
            };
        }
        return AI.aiMap[name];
    }
    public run(owner:Enemy):void{

    }
}