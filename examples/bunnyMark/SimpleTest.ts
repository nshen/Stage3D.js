///<reference path="_definitions.ts"/>
module SimpleTest
{

//    var timer:BunnyMark.Timer = new BunnyMark.Timer();
    var stage3d: stageJS.Stage3D;
    var context3D: stageJS.Context3D;

    var _width:number = 480;
    var _height:number = 640;
    var _spriteStage:GPUSprite.SpriteRenderStage;

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

        var stageRect = {x:0,y:0,width:_width,height:_height};
        _spriteStage = new GPUSprite.SpriteRenderStage(stage3d,context3D,stageRect);

        _spriteSheet = new GPUSprite.SpriteSheet(64,64);//2的次幂，图片26*37，比32大，所以用64

        var bunnyBitmap:HTMLImageElement = BunnyMark.ImageLoader.getInstance().get("assets/wabbit_alpha.png");
        var bunnyRect:{x:number;y:number;width:number;height:number} = {x:0 ,y:0,width:bunnyBitmap.width,height:bunnyBitmap.height};
        var _bunnySpriteID:number = _spriteSheet.addSprite(bunnyBitmap,bunnyRect,{x:0,y:0});

        //--------debug
        var c:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("test-canvas");
        var ctx:CanvasRenderingContext2D = c.getContext("2d");
        ctx.putImageData(_spriteSheet._spriteSheet.imageData,0,0);
        ////////////////




        var view:BunnyMark.Rectangle = new BunnyMark.Rectangle(0,0,_width,_height);
        _bunnyLayer = new BunnyMark.BunnyLayer(view);
        _bunnyLayer.createRenderLayer(context3D);
        _spriteStage.addLayer(_bunnyLayer._renderLayer);
        _bunnyLayer.addBunny(100);


        requestAnimationFrame(onEnterFrame)
    }

    function debug():void
    {

        context3D.configureBackBuffer(stage3d.stageWidth,stage3d.stageHeight,2,true);




//        context3D.setProgramConstantsFromMatrix("vc0", this._parent.modelViewMatrix, true); //todo: vc0


        //--------------
        // init texture
        //--------------

        _spriteSheet = new GPUSprite.GPUSpriteSheet(64,64);//2的次幂，图片26*37，比32大，所以用64
        var bunnyBitmap:HTMLImageElement = BunnyMark.ImageLoader.getInstance().get("assets/wabbit_alpha.png");
        var bunnyRect:{x:number;y:number;width:number;height:number} = {x:0 ,y:0,width:bunnyBitmap.width,height:bunnyBitmap.height};
        var _bunnySpriteID:number = _spriteSheet.addSprite(bunnyBitmap,bunnyRect,{x:0,y:0});







//        var _renderLayer = new GPUSprite.GPUSpriteRenderLayer(context3D,_spriteSheet); //调用前 spritesheet必须装配好图片
//        _spriteStage.addLayer(_renderLayer);
//        var sprite:GPUSprite.GPUSprite = _renderLayer.createChild(_bunnySpriteID);
//        sprite.position = {x:0,y:0};
//        sprite.scaleX = sprite.scaleY = Math.random() + 0.3;






        var program: stageJS.Program3D = context3D.createProgram();
        program.upload("shader-vs", "shader-fs"); // shader are in html file

        _spriteSheet.uploadTexture(context3D);

        context3D.setProgram(program);
        context3D.setBlendFactors(stageJS.Context3DBlendFactor.ONE, stageJS.Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);







        //var modelViewMatrix:stageJS.geom.Matrix3D = new stageJS.geom.Matrix3D();
//        modelViewMatrix.appendTranslation( -_width/2, -_height/2,0);
//        modelViewMatrix.appendScale(2.0/_width , 2.0/_height,1);

        var modelViewMatrix:stageJS.geom.PerspectiveMatrix3D = new stageJS.geom.PerspectiveMatrix3D();
        modelViewMatrix.orthoRH(2,2,1,1000);
        context3D.setProgramConstantsFromMatrix("vc0", modelViewMatrix, true); //todo: vc0

        context3D.setTextureAt("fs0",_spriteSheet._texture);




        //-----------------
        //init buffers
        //-----------------
        var vertexBuffer: stageJS.VertexBuffer3D = context3D.createVertexBuffer(4, 3);
        vertexBuffer.uploadFromVector([
            -13, -18, 0,   //xyz uv
            -13,  18, 0,
            13, 18, 0,
            13, -18, 0], 0, 4);


        var _uvData:number[] = [];
        var childUVCoords:number[] = _spriteSheet.getUVCoords(_bunnySpriteID);
        _uvData.push(
            childUVCoords[0], childUVCoords[1],
            childUVCoords[2], childUVCoords[3],
            childUVCoords[4], childUVCoords[5],
            childUVCoords[6], childUVCoords[7]);


        var uvBuffer:stageJS.VertexBuffer3D = context3D.createVertexBuffer(_uvData.length/2,2);
        uvBuffer.uploadFromVector(_uvData, 0, _uvData.length/2);

        context3D.setVertexBufferAt("va0", vertexBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_3);
        context3D.setVertexBufferAt("va1", uvBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);

        indexBuffer = context3D.createIndexBuffer(6);
        indexBuffer.uploadFromVector([
            0, 1, 2,0,2,3
        ], 0, 6);




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
        requestAnimationFrame(onEnterFrame);
        //--------------
        // draw it
        //---------------
//        context3D.clear(1.0, 1.0, 1.0, 1.0);
//        context3D.drawTriangles(indexBuffer);
//        context3D.present();


        context3D.clear(0,1,0,1);
        _bunnyLayer.update(11);
        _spriteStage.drawDeferred();
        context3D.present();
    }



}


//window.onload = (e:Event) =>{
//    BunnyMark.ImageLoader.getInstance().add("assets/wabbit_alpha.png");
//
//    BunnyMark.ImageLoader.getInstance().downloadAll(SimpleTest.main);
//};

