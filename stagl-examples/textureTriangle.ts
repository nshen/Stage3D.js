///<reference path="stagl.d.ts"/>

module test.textureTriangle
{

    var stage3d:stagl.Stage3D;
    var context3d:stagl.Context3D;

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

        stage3d = new stagl.Stage3D(canvas);
        stage3d.addEventListener(stagl.events.Event.CONTEXT3D_CREATE, onCreated);
        stage3d.requestContext3D();
    }

    function onCreated():void
    {
        context3d = stage3d.context3D;
        context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2, true);


        //-----------------
        //init shader
        //-----------------
        var program: stagl.Program3D = context3d.createProgram();
        program.upload("shader-vs", "shader-fs"); // shader are in html file
        context3d.setProgram(program);

        //-----------------
        //init buffers
        //-----------------
        var vertexBuffer: stagl.VertexBuffer3D = context3d.createVertexBuffer(3, 5);
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
        context3d.setVertexBufferAt("va0", vertexBuffer, 0, stagl.Context3DVertexBufferFormat.FLOAT_3);
        context3d.setVertexBufferAt("va1", vertexBuffer, 3, stagl.Context3DVertexBufferFormat.FLOAT_2);

        var indexBuffer:stagl.IndexBuffer3D = context3d.createIndexBuffer(3);
        indexBuffer.uploadFromVector([
            0, 1, 2
        ], 0, 3);

        //--------------
        // init texture
        //--------------
        var texture:stagl.Texture = context3d.createTexture();
        texture.uploadFromBitmapData(bitmapdata);
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







