///<reference path="../stagl.d.ts"/>

module test.drawSquare {


    var stage3d: stagl.Stage3D;
    var context3d: stagl.Context3D;

     /**
     *  window.onload Èë¿Ú 
     */
    export function main()
    {
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("my-canvas");

        stage3d = new stagl.Stage3D(canvas);
        stage3d.addEventListener(stagl.events.Event.CONTEXT3D_CREATE, contextCreated);
        stage3d.requestContext3D();
    }

    function contextCreated(e: stagl.events.Event): void {
        console.log("contexted3d created!");

        context3d = stage3d.context3D;
        context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2);


        console.log("--------- init program ----------");

        var program: stagl.Program3D = context3d.createProgram();
        program.upload("shader-vs", "shader-fs"); // shaders are in html file
        context3d.setProgram(program);


        console.log("----- init buffers ------");

        /*
        * Creates the buffers that contain the geometry of the square
        *
        *   #0 (-0.5,0.5) +--------------+  (0.5,0.5)  #3
        *                 |              |
        *                 |              |
        *                 |      .(0,0)  |
        *                 |              |
        *                 |              |
        *   #1(-0.5,-0.5) +--------------+  (0.5,-0.5) #2
        */
        var vertexBuffer: stagl.VertexBuffer3D = context3d.createVertexBuffer(4, 3);
        vertexBuffer.uploadFromVector([
            -0.5, 0.5, 0.0, 	//Vertex 0
            -0.5, -0.5, 0.0, 	//Vertex 1
            0.5, -0.5, 0.0, 	//Vertex 2
            0.5, 0.5, 0.0]   	//Vertex 3
            , 0, 4);

        context3d.setVertexBufferAt("va0", vertexBuffer, 0, stagl.Context3DVertexBufferFormat.FLOAT_3);

        var indexBuffer: stagl.IndexBuffer3D = context3d.createIndexBuffer(6);
        indexBuffer.uploadFromVector([3, 2, 1, 3, 1, 0], 0, 6);



        console.log("----------- draw ------------");
        context3d.clear(1.0, 0.0, 0.0, 1.0);
        context3d.drawTriangles(indexBuffer);
        context3d.present();
    }


    
}

window.onload = test.drawSquare.main;