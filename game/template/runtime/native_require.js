
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/tween/tween.js",
	"libs/modules/res/res.js",
	"libs/modules/dragonBones/dragonBones.js",
	"libs/modules/tiled/tiled.js",
	"libs/modules/particle/particle.js",
	"polyfill/promise.js",
	"bin-debug/Char/KnightShow.js",
	"bin-debug/Char/AI/AI.js",
	"bin-debug/Char/Knight.js",
	"bin-debug/frame/MainFrame.js",
	"bin-debug/Char/UI/HealthBar.js",
	"bin-debug/Char/Hero.js",
	"bin-debug/Bullet.js",
	"bin-debug/Char/AI/StraightAI.js",
	"bin-debug/CellMap.js",
	"bin-debug/Constant/Direction.js",
	"bin-debug/Char/Enemy.js",
	"bin-debug/frame/MD5.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	"bin-debug/MapContainer.js",
	"bin-debug/Weapon.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        var result = egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "showAll",
		contentWidth: 800,
		contentHeight: 600,
		showPaintRect: true,
		showFPS: true,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.5",
		showLog: true,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel("/system/fonts/DroidSansFallback.ttf", 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};