///<reference path="../stagl.d.ts"/>

module test.drawTriangle
{

    var stage3d: stagl.Stage3D;
    var context3d: stagl.Context3D;


    /**
     *  window.onload Èë¿Ú 
     */
    export function main()
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


        var vertexBuffer: stagl.VertexBuffer3D = context3d.createVertexBuffer(3, 7);
        vertexBuffer.uploadFromVector([
            -1, -1, 0, 1, 0, 0, 1,   //xyz rgba
            1, -1, 0, 0, 1, 0, 1,
            0, 1, 0, 0, 0, 1, 1]
            , 0, 3);

        context3d.setVertexBufferAt("va0", vertexBuffer, 0, stagl.Context3DVertexBufferFormat.FLOAT_3); // pos
        context3d.setVertexBufferAt("va1", vertexBuffer, 3, stagl.Context3DVertexBufferFormat.FLOAT_4); // color


        var indexBuffer: stagl.IndexBuffer3D = context3d.createIndexBuffer(3);
        indexBuffer.uploadFromVector([0, 1, 2], 0, 3);

        context3d.clear(0.0, 0.0, 0.0, 1.0);
        context3d.drawTriangles(indexBuffer);
        context3d.present();

    }
  
}


window.onload = test.drawTriangle.main;

