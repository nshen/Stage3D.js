///<reference path="_definitions.ts"/>
module SimpleTest
{

//    var timer:BunnyMark.Timer = new BunnyMark.Timer();
    var stage3d: stageJS.Stage3D;
    var context3D: stageJS.Context3D;

    var _spriteStage:GPUSprite.SpriteRenderStage;
    var _spriteRenderLayer:GPUSprite.SpriteRenderLayer;
    var _spriteSheet:GPUSprite.SpriteSheet;
    var indexBuffer:stageJS.IndexBuffer3D;




    /**
     *  window.onload entry point
     */
    export function main()
    {
        BunnyMark.ImageLoader.getInstance().add("assets/wabbit_alpha.png");
        BunnyMark.ImageLoader.getInstance().downloadAll(SimpleTest.init);
    }


    export function init()
    {
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("my-canvas");

        stage3d = new stageJS.Stage3D(canvas);
        stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, onContext3DCreate);
        stage3d.requestContext3D();
    }

    var _bunnyLayer:BunnyMark.BunnyLayer;
    function onContext3DCreate(e: stageJS.events.Event): void
    {
        context3D = stage3d.context3D;

//        debug();
//
//        return;


        /*
        //### 1.spritesheet

        _spriteSheet = new GPUSprite.SpriteSheet(64,64);//2的次幂，图片26*37，比32大，所以用64

        var bunnyBitmap:HTMLImageElement = BunnyMark.ImageLoader.getInstance().get("assets/wabbit_alpha.png");
        var bunnyRect:{x:number;y:number;width:number;height:number} = {x:0 ,y:0,width:bunnyBitmap.width,height:bunnyBitmap.height};
        var _bunnySpriteID:number = _spriteSheet.addSprite(bunnyBitmap,bunnyRect,{x:0,y:0});

        //--------debug
        var c:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("test-canvas");
        var ctx:CanvasRenderingContext2D = c.getContext("2d");
        ctx.putImageData(_spriteSheet._spriteSheet.imageData,0,0);
        ////////////////

        //### 2. renderLayer
        _spriteRenderLayer = new GPUSprite.SpriteRenderLayer(context3D,_spriteSheet);
        var sp:GPUSprite.Sprite = _spriteRenderLayer.createChild(_bunnySpriteID);

        sp.position = {x:0,y:0};



        //### 3. RenderStage
        var stageRect = {x:0,y:0,width:stage3d.stageWidth,height:stage3d.stageHeight};
        _spriteStage = new GPUSprite.SpriteRenderStage(stage3d,context3D,stageRect);
        _spriteStage.addLayer(_spriteRenderLayer);

*/

        var stageRect = {x:0,y:0,width:stage3d.stageWidth,height:stage3d.stageHeight};
        _spriteStage = new GPUSprite.SpriteRenderStage(stage3d,context3D,stageRect);

        var view:BunnyMark.Rectangle = new BunnyMark.Rectangle(0,0,stage3d.stageWidth,stage3d.stageHeight);
        _bunnyLayer = new BunnyMark.BunnyLayer(view);
        _bunnyLayer.createRenderLayer(context3D);
        _spriteStage.addLayer(_bunnyLayer._renderLayer);
        _bunnyLayer.addBunny(100);


        requestAnimationFrame(onEnterFrame)
    }


    function getSpriteSheetID():number
    {
        //add bunny image to sprite sheet
        var bunnyBitmap:HTMLImageElement = BunnyMark.ImageLoader.getInstance().get("assets/wabbit_alpha.png");
        console.log("bunnyBitmap",bunnyBitmap.width,bunnyBitmap.height);
        var bunnyRect:{x:number;y:number;width:number;height:number} = {x:0 ,y:0,width:bunnyBitmap.width,height:bunnyBitmap.height};
        return _spriteSheet.addSprite(bunnyBitmap,bunnyRect,{x:0,y:0});


        var c:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("test-canvas");
        var ctx:CanvasRenderingContext2D = c.getContext("2d");
        ctx.putImageData(_spriteSheet._spriteSheet.imageData,0,0);
    }




    function onEnterFrame():void
    {

        //--------------
        // draw it
        //---------------
//        context3D.clear(1.0, 1.0, 1.0, 1.0);
//        context3D.drawTriangles(indexBuffer);
//        context3D.present();


        context3D.clear(1,0,0,1);
       _bunnyLayer.update();
       _spriteStage.drawDeferred();
        context3D.present();


       // context3D.clear(0,1,0,1);
       // _spriteRenderLayer.draw();
       // context3D.present();
         requestAnimationFrame(onEnterFrame);
    }



}


//window.onload = (e:Event) =>{
//    BunnyMark.ImageLoader.getInstance().add("assets/wabbit_alpha.png");
//
//    BunnyMark.ImageLoader.getInstance().downloadAll(SimpleTest.main);
//};

