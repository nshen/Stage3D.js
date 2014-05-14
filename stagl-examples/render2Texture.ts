///<reference path="stagl.d.ts"/>

module test.render2Texture
{

    var stage3d: stagl.Stage3D;
    var context3d: stagl.Context3D;
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

    function onCreated(e: stagl.events.Event): void
    {
        context3d = stage3d.context3D;
        context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2, true);

        var program: stagl.Program3D = context3d.createProgram();
        program.upload("shader-vs", "shader-fs"); // shaders are in html file
        context3d.setProgram(program);

        //initBuffers
        var vertexBuffer:stagl.VertexBuffer3D = context3d.createVertexBuffer(4, 5);
        vertexBuffer.uploadFromVector([
            -1, 1, 0, 0, 0,   //xyz uv
            1, 1, 0, 1, 0,
            -1, -1, 0, 0, 1,
            1 , -1,0,1,1], 0, 4);

        /*
         *  0-------1
         *  |       |
         *  |       |
         *  2-------3
         */
        context3d.setVertexBufferAt("va0", vertexBuffer, 0, stagl.Context3DVertexBufferFormat.FLOAT_3);
        context3d.setVertexBufferAt("va1", vertexBuffer, 3, stagl.Context3DVertexBufferFormat.FLOAT_2);

        var indexBuffer:stagl.IndexBuffer3D = context3d.createIndexBuffer(6);
        indexBuffer.uploadFromVector([
            0,1,2,2,1,3
        ], 0, 6);

        //init texture
        var texture:stagl.Texture = context3d.createTexture(bitmapdata.width ,bitmapdata.height,stagl.Context3DTextureFormat.BGRA,false);
        texture.uploadFromBitmapData(bitmapdata);
        context3d.setTextureAt("fs0", texture);

        //----------------------------------------------render to texture
        // Setup scene texture
        var sceneTexture:stagl.Texture = context3d.createTexture(
            512,
            512,
            stagl.Context3DTextureFormat.BGRA,
            true
        );

        // Render the scene to the scene texture
        context3d.setRenderToTexture(sceneTexture, true);
        context3d.clear(1.0, 0.0, 0.0, 1.0);
        context3d.drawTriangles(indexBuffer);
        context3d.setRenderToBackBuffer();

        //-----------------
        //init post effect shader
        //-----------------

        var redOnlyProgram:stagl.Program3D = context3d.createProgram();
        redOnlyProgram.upload("shader-vs","redOnly-shader-fs"); //vertex shader not change
        context3d.setProgram(redOnlyProgram);

        context3d.clear(0.0, 0.0, 0.0, 1.0);
        context3d.drawTriangles(indexBuffer);
        context3d.present();

    }
  
}


window.onload = test.render2Texture.main;

