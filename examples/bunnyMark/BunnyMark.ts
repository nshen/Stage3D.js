///<reference path="_definitions.ts"/>
module BunnyMark
{

//    var timer:BunnyMark.Timer = new BunnyMark.Timer();
    var stage3d: stageJS.Stage3D;
    var context3D: stageJS.Context3D;

    var _spriteStage:GPUSprite.SpriteRenderStage;
    var _spriteRenderLayer:GPUSprite.SpriteRenderLayer;
    var _spriteSheet:GPUSprite.SpriteSheet;
    var indexBuffer:stageJS.IndexBuffer3D;

    var numBunnies:number = 200;
    var incBunnies:number = 200;

    declare var Stats:any;
    declare var $:any;
    declare var swfobject:any;
    var stats;

    var counter:HTMLElement;

    /**
     *  window.onload entry point
     */
    export function main()
    {
        BunnyMark.ImageLoader.getInstance().add("assets/wabbit_alpha.png");
        BunnyMark.ImageLoader.getInstance().downloadAll(BunnyMark.init);
    }


    export function init()
    {
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("my-canvas");
        canvas.onmousedown = (ev:MouseEvent)=>{
          if( _bunnyLayer)
          {
              _bunnyLayer.addBunny(incBunnies);
              numBunnies += incBunnies;
              $("#counter").html("<b>Bunnies:"+numBunnies+"</b>");
          }

        };

        $("#counter").html("<b>Bunnies:200</b>");
        ///////////////////////////////////////////
        stats = new Stats();
        stats.setMode( 0 );
        // align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild( stats.domElement );
        ///////////////////////////////////////////

        //var el = document.getElementById("swf");
        //swfobject.embedSWF("BunnyMarkMoleHill.swf", el, 480, 640, 13);
        swfobject.embedSWF("BunnyMarkMoleHill.swf", "swf", "480", "640", "9.0.0", "expressInstall.swf",{},{wmode:"direct"},{});

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
        _bunnyLayer.addBunny(incBunnies);




        requestAnimationFrame(onEnterFrame)
    }




    function onEnterFrame():void
    {


        stats.begin();

        context3D.clear(0.5,0.5,0.5,1);
       _bunnyLayer.update();
       _spriteStage.drawDeferred();
        context3D.present();

        stats.end();

        requestAnimationFrame(onEnterFrame);
    }



}


//window.onload = (e:Event) =>{
//    BunnyMark.ImageLoader.getInstance().add("assets/wabbit_alpha.png");
//
//    BunnyMark.ImageLoader.getInstance().downloadAll(SimpleTest.main);
//};

