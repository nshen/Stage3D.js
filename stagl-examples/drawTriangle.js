///<reference path="stagl.d.ts"/>
var test;
(function (test) {
    (function (drawTriangle) {
        var stage3d;
        var context3d;

        /**
        *  window.onload entry point
        */
        function main() {
            var canvas = document.getElementById("my-canvas");

            stage3d = new stagl.Stage3D(canvas);
            stage3d.addEventListener(stagl.events.Event.CONTEXT3D_CREATE, onCreated);
            stage3d.requestContext3D();
        }
        drawTriangle.main = main;

        function onCreated(e) {
            context3d = stage3d.context3D;
            context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2, true);

            var program = context3d.createProgram();
            program.upload("shader-vs", "shader-fs"); // shaders are in html file
            context3d.setProgram(program);

            var vertexBuffer = context3d.createVertexBuffer(3, 7);
            vertexBuffer.uploadFromVector([
                -1, -1, 0, 1, 0, 0, 1,
                1, -1, 0, 0, 1, 0, 1,
                0, 1, 0, 0, 0, 1, 1], 0, 3);

            context3d.setVertexBufferAt("va0", vertexBuffer, 0, stagl.Context3DVertexBufferFormat.FLOAT_3); // pos
            context3d.setVertexBufferAt("va1", vertexBuffer, 3, stagl.Context3DVertexBufferFormat.FLOAT_4); // color

            var indexBuffer = context3d.createIndexBuffer(3);
            indexBuffer.uploadFromVector([0, 1, 2], 0, 3);

            context3d.clear(0.0, 0.0, 0.0, 1.0);
            context3d.drawTriangles(indexBuffer);
            context3d.present();
        }
    })(test.drawTriangle || (test.drawTriangle = {}));
    var drawTriangle = test.drawTriangle;
})(test || (test = {}));

window.onload = test.drawTriangle.main;
