///<reference path="stage3d.d.ts"/>

module test.textureTriangle
{

    var stage3d:stageJS.Stage3D;
    var context3d:stageJS.Context3D;

    var bitmapdata: HTMLImageElement;
    /**
     *  window.onload entry point
     */
    export function main()
    {
        prepareImage(init);
    }

    function prepareImage(p_callBack:Function):void
    {
        bitmapdata = new Image();
        bitmapdata.src = "bear256.jpg";
        bitmapdata.onload = (ev:Event) => p_callBack();
    }

    function init():void
    {
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("my-canvas");

        stage3d = new stageJS.Stage3D(canvas);
        stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, onCreated);
        stage3d.requestContext3D();
    }

    function onCreated():void
    {
        context3d = stage3d.context3D;
        context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2, true);


        //-----------------
        //init shader
        //-----------------
        var program: stageJS.Program3D = context3d.createProgram();
        program.upload("shader-vs", "shader-fs"); // shader are in html file
        context3d.setProgram(program);

        //-----------------
        //init buffers
        //-----------------
        var vertexBuffer: stageJS.VertexBuffer3D = context3d.createVertexBuffer(3, 5);
        vertexBuffer.uploadFromVector([
            -1, 1, 0, 0, 0,   //xyz uv
            1, 1, 0, 1, 0,
            0, -1, 0, 0.5, 1], 0, 3);


        /**
         *    (-1,1) -----------(1,1)
         *            \       /
         *             \     /
         *              \   /
         *               \ /
         *             (0,-1)
         */
        context3d.setVertexBufferAt("va0", vertexBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_3);
        context3d.setVertexBufferAt("va1", vertexBuffer, 3, stageJS.Context3DVertexBufferFormat.FLOAT_2);

        var indexBuffer:stageJS.IndexBuffer3D = context3d.createIndexBuffer(3);
        indexBuffer.uploadFromVector([
            0, 1, 2
        ], 0, 3);

        //--------------
        // init texture
        //--------------
        var texture:stageJS.Texture = context3d.createTexture(bitmapdata.width ,bitmapdata.height,stageJS.Context3DTextureFormat.BGRA,false);
        texture.uploadFromBitmapData(bitmapdata,0);
        context3d.setTextureAt("fs0", texture);




        //--------------
        // draw it
        //---------------
        context3d.clear(1.0, 1.0, 1.0, 1.0);
        context3d.drawTriangles(indexBuffer);
        context3d.present();
    }

}

window.onload = test.textureTriangle.main;







