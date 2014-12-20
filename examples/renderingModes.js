///<reference path="stage3d.d.ts"/>
var test;
(function (test) {
    var renderingModes;
    (function (renderingModes) {
        var stage3d;
        var context3d;
        var demoArray = [];
        var trianglesIB;
        //index buffers
        var linesIB;
        var pointsIB;
        var lineLoopIB;
        var lineStripIB;
        var triangleStripIB;
        var triangleFanIB;
        /**
         *  window.onload 入口
         */
        function main() {
            var canvas = document.getElementById("my-canvas");
            canvas.addEventListener("mousedown", function (e) { return drawNext(); });
            document.addEventListener("contextmenu", function (e) { return e.preventDefault(); });
            stage3d = new stageJS.Stage3D(canvas);
            stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, onCreated);
            stage3d.requestContext3D();
        }
        renderingModes.main = main;
        function onCreated(e) {
            context3d = stage3d.context3D;
            context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2, true);
            //init program
            var program = context3d.createProgram();
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
            var vertexBuffer = context3d.createVertexBuffer(5, 3);
            vertexBuffer.uploadFromVector([
                -0.5,
                -0.5,
                0.0,
                -0.25,
                0.5,
                0.0,
                0.0,
                -0.5,
                0.0,
                0.25,
                0.5,
                0.0,
                0.5,
                -0.5,
                0.0
            ], 0, 5);
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
        function drawNext() {
            if (demoArray.length <= 0)
                return;
            context3d.clear(0.0, 0.0, 0.0, 1.0);
            var s = demoArray.pop();
            switch (s) {
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
            var script = document.getElementById("intro");
            script.innerText = s + ", click canvas to draw next";
            console.log(script.innerText);
        }
    })(renderingModes = test.renderingModes || (test.renderingModes = {}));
})(test || (test = {}));
window.onload = test.renderingModes.main;
