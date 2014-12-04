///<reference path="stage3d.d.ts"/>

module test.renderingModes
{

    var stage3d: stageJS.Stage3D;
    var context3d: stageJS.Context3D;

    var demoArray: string[] = [];
    var trianglesIB: stageJS.IndexBuffer3D;

    //index buffers
    var linesIB: stageJS.IndexBuffer3D;
    var pointsIB: stageJS.IndexBuffer3D;
    var lineLoopIB: stageJS.IndexBuffer3D;
    var lineStripIB: stageJS.IndexBuffer3D;
    var triangleStripIB: stageJS.IndexBuffer3D;
    var triangleFanIB: stageJS.IndexBuffer3D;


    /**
     *  window.onload 入口
     */
    export function main()
    {
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("my-canvas");
        canvas.addEventListener("mousedown",(e:MouseEvent)=> drawNext());
        document.addEventListener("contextmenu",(e:Event)=> e.preventDefault());

        stage3d = new stageJS.Stage3D(canvas);
        stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, onCreated);
        stage3d.requestContext3D();
    }





    function onCreated(e: stageJS.events.Event): void
    {
        context3d = stage3d.context3D;
        context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2, true);

        //init program
        var program: stageJS.Program3D = context3d.createProgram();
        program.upload("shader-vs", "shader-fs"); // shaders are in html file
        context3d.setProgram(program);


        //init buffers

        /*
        * Creates the buffers that contain the geometry of the trapezoid
        *
        *      #1 (-0.25,0.5)  +--------------+  (0.25,0.5)  #3
        *                     /                \
        *                    /                  \
        *                   /          .(0,0)    \ 
        *                  /                      \ 
        *                 /                        \
        * #0(-0.5,-0.5)  +------------+-------------+  (0.5,-0.5) #4
        *                             #2(0,-0.5)
        */
        var vertexBuffer: stageJS.VertexBuffer3D = context3d.createVertexBuffer(5, 3);
        vertexBuffer.uploadFromVector([
            -0.5, -0.5, 0.0, 	 //Vertex 0
            -0.25, 0.5, 0.0, 	 //Vertex 1
            0.0, -0.5, 0.0,  //Vertex 2
            0.25, 0.5, 0.0,  	 //Vertex 3
            0.5, -0.5, 0.0	 //Vertex 4
        ]
            , 0, 5);

        context3d.setVertexBufferAt("va0", vertexBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_3); // pos


        trianglesIB = context3d.createIndexBuffer(6);
        trianglesIB.uploadFromVector([0, 1, 2, 2, 3, 4], 0, 6);

        linesIB = context3d.createIndexBuffer(8);
        linesIB.uploadFromVector([1, 3, 0, 4, 1, 2, 2, 3], 0, 8);

        pointsIB = context3d.createIndexBuffer(3);
        pointsIB.uploadFromVector([1, 2, 3], 0, 3);

        lineLoopIB = context3d.createIndexBuffer(5);
        lineLoopIB.uploadFromVector([2, 3, 4, 1, 0], 0, 5);

        lineStripIB = context3d.createIndexBuffer(5);
        lineStripIB.uploadFromVector([2, 3, 4, 1, 0], 0, 5);

        triangleStripIB = context3d.createIndexBuffer(5);
        triangleStripIB.uploadFromVector([0, 1, 2, 3, 4], 0, 5);

        triangleFanIB = context3d.createIndexBuffer(5);
        triangleFanIB.uploadFromVector([0, 1, 2, 3, 4], 0, 5);

      
        demoArray.push("drawLines()");
        demoArray.push("drawPoints()");
        demoArray.push("drawLineLoop()");
        demoArray.push("drawLinestrip()");
        demoArray.push("drawTriangleStrip()");
        demoArray.push("drawTriangleFan()");
        demoArray.push("drawTriangles()");

        drawNext();

    }


    function drawNext(): void
    {
        
        if (demoArray.length <= 0)
            return;

        context3d.clear(0.0, 0.0, 0.0, 1.0);

        var s: string = demoArray.pop();
        switch(s)
        {
            case "drawTriangles()":
                context3d.drawTriangles(trianglesIB);
                break;
            case "drawLines()":
                context3d.drawLines(linesIB);
                break;
            case "drawPoints()":
                context3d.drawPoints(pointsIB);
                break;
            case "drawLineLoop()":
                context3d.drawLineLoop(lineLoopIB);
                break;
            case "drawLinestrip()":
                context3d.drawLineStrip(lineStripIB);
                break;
            case "drawTriangleStrip()":
                context3d.drawTriangleStrip(triangleStripIB);
                break;
            case "drawTriangleFan()":
                context3d.drawTriangleFan(triangleFanIB);
                break;
        }

        context3d.present();

        demoArray.unshift(s);


       
        var script: HTMLObjectElement = <HTMLObjectElement>document.getElementById("intro");
        script.innerText = s + ", click canvas to draw next";
        console.log(script.innerText);
 
    }

}


window.onload = test.renderingModes.main;