///<reference path="_definitions.ts"/>
module BunnyMark
{

    var stage3d: stageJS.Stage3D;
    var context3D: stageJS.Context3D;

    var _width:number = 480;
    var _height:number = 640;

    var _spriteStage:GPUSprite.GPUSpriteRenderStage;

    var numBunnies:number = 100;

    var _bunnyLayer:BunnyLayer;

    var timer:Timer = new Timer();
//    var bg:Background;

    /**
     *  window.onload entry point
     */
    export function main()
    {

        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("my-canvas");

        stage3d = new stageJS.Stage3D(canvas);
        stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, onContext3DCreate);
        stage3d.requestContext3D();
    }

    function onContext3DCreate(e: stageJS.events.Event): void
    {
        context3D = stage3d.context3D;
        initSpriteEngine();
    }

    function initSpriteEngine()
    {
        var stageRect = {x:0,y:0,width:_width,height:_height};
        _spriteStage = new GPUSprite.GPUSpriteRenderStage(stage3d,context3D,stageRect);
        _spriteStage.configureBackBuffer(_width,_height);

        var view:Rectangle = new Rectangle(0,0,_width,_height);
        _bunnyLayer = new BunnyLayer(view);
        _bunnyLayer.createRenderLayer(context3D);
        _spriteStage.addLayer(_bunnyLayer._renderLayer);
        _bunnyLayer.addBunny(numBunnies);

//        bg = new Background(context3D,_width,_height);
//        bg.render();
//        context3D.present();
//        wrapper();
        requestAnimationFrame(onEnterFrame)

//        var img:HTMLImageElement = AssetManager.getInstance().getAsset("assets/grass.png");
//        document.body.appendChild();
//        var bitmapdata:stageJS.BitmapData = new stageJS.BitmapData(img.width,img.height,true);
//        bitmapdata.copyPixels(img,{x:img.x,y:img.y,width:img.width,height:img.height},{x:110,y:0});
//        bitmapdata.draw();
    }

    function doAllTheTime()
    {
        context3D.clear(0,0,0,0);
//        bg.render();
        context3D.present();
    }
    function wrapper() {
        doAllTheTime();
        setTimeout(wrapper, 1000);
    }


    function onEnterFrame():void
    {
        requestAnimationFrame(onEnterFrame);
        context3D.clear(0,1,0,1);
//        bg.render();
        _bunnyLayer.update(timer.getTimer());
        _spriteStage.drawDeferred();
        context3D.present();
    }



}


//window.onload = (e:Event) =>{
//    BunnyMark.ImageLoader.getInstance().add("assets/grass.png");
//    BunnyMark.ImageLoader.getInstance().add("assets/pirate.png");
//    BunnyMark.ImageLoader.getInstance().add("assets/wabbit_alpha.png");
//
//    BunnyMark.ImageLoader.getInstance().downloadAll(BunnyMark.main);
//};

