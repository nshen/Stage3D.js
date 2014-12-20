///<reference path="stage3d.d.ts"/>

module test.drawSquare {


    var stage3d: stageJS.Stage3D;
    var context3d: stageJS.Context3D;
    var img: HTMLImageElement;

     /**
     *  window.onload 入口
     */
    export function main()
    {
        prepareImage(init);

    }

    function prepareImage(p_callBack:Function):void
    {
        img = new Image();
        img.src = "bear256.jpg";
        img.onload = (ev:Event) => p_callBack();
    }

    function init():void
    {
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("my-canvas");

        stage3d = new stageJS.Stage3D(canvas);
        stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, contextCreated);
        stage3d.requestContext3D();
    }

    function contextCreated(e: stageJS.events.Event): void
    {
        console.log("contexted3d created!");

        context3d = stage3d.context3D;
        context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2);

        console.log("--------- init program ----------");
        var program: stageJS.Program3D = context3d.createProgram();
        program.upload("shader-vs", "shader-fs"); // shaders are in html file
        context3d.setProgram(program);

        console.log("---------init texture----------- ");
        var texture:stageJS.Texture = context3d.createTexture(img.width ,img.height,stageJS.Context3DTextureFormat.BGRA,false);
        texture.uploadFromImage(img,0);
        context3d.setTextureAt("fs0", texture);

        console.log("----- init buffers ------");
        /*
         * Creates the buffers that contain the geometry of the square
         *
         *   #0 (-0.5,0.5) +--------------+  (0.5,0.5)  #2
         *                 |              |
         *                 |              |
         *                 |      .(0,0)  |
         *                 |              |
         *                 |              |
         *   #1(-0.5,-0.5) +--------------+  (0.5,-0.5) #3
         */
        var vertexBuffer: stageJS.VertexBuffer3D = context3d.createVertexBuffer(4, 5);
        vertexBuffer.uploadFromVector([
                -0.5, 0.5, 0.0,  0.0 , 0.0,	// #0 (x y z u v)
                -0.5, -0.5, 0.0, 0.0 , 1.0,	// #1
                0.5, 0.5, 0.0,  1.0 , 0.0,	// #2
                0.5, -0.5, 0.0, 1.0 , 1.0  ]// #3
            , 0, 4);

        context3d.setVertexBufferAt("va0", vertexBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_3);
        context3d.setVertexBufferAt("va1",vertexBuffer,3,stageJS.Context3DVertexBufferFormat.FLOAT_2);

        var indexBuffer: stageJS.IndexBuffer3D = context3d.createIndexBuffer(6);
        indexBuffer.uploadFromVector([0,1,3,0,3,2], 0, 6);


        console.log("----------- draw ------------");
        context3d.clear(1.0, 0.0, 0.0, 1.0);
        context3d.drawTriangles(indexBuffer);
        context3d.present();
    }


    
}

window.onload = test.drawSquare.main;