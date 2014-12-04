///<reference path="stage3d.d.ts"/>
var test;
(function (test) {
    var render2Texture;
    (function (render2Texture) {
        var stage3d;
        var context3d;
        var bitmapdata;
        /**
         *  window.onload entry point
         */
        function main() {
            prepareImage(init);
        }
        render2Texture.main = main;
        function prepareImage(p_callBack) {
            bitmapdata = new Image();
            bitmapdata.src = "bear256.jpg";
            bitmapdata.onload = function (ev) { return p_callBack(); };
        }
        function init() {
            var canvas = document.getElementById("my-canvas");
            stage3d = new stageJS.Stage3D(canvas);
            stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, onCreated);
            stage3d.requestContext3D();
        }
        function onCreated(e) {
            context3d = stage3d.context3D;
            context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2, true);
            var program = context3d.createProgram();
            program.upload("shader-vs", "shader-fs"); // shaders are in html file
            context3d.setProgram(program);
            //initBuffers
            var vertexBuffer = context3d.createVertexBuffer(4, 5);
            vertexBuffer.uploadFromVector([
                -1,
                1,
                0,
                0,
                0,
                1,
                1,
                0,
                1,
                0,
                -1,
                -1,
                0,
                0,
                1,
                1,
                -1,
                0,
                1,
                1
            ], 0, 4);
            /*
             *  0-------1
             *  |       |
             *  |       |
             *  2-------3
             */
            context3d.setVertexBufferAt("va0", vertexBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_3);
            context3d.setVertexBufferAt("va1", vertexBuffer, 3, stageJS.Context3DVertexBufferFormat.FLOAT_2);
            var indexBuffer = context3d.createIndexBuffer(6);
            indexBuffer.uploadFromVector([
                0,
                1,
                2,
                2,
                1,
                3
            ], 0, 6);
            //init texture
            var texture = context3d.createTexture(bitmapdata.width, bitmapdata.height, stageJS.Context3DTextureFormat.BGRA, false);
            texture.uploadFromBitmapData(bitmapdata);
            context3d.setTextureAt("fs0", texture);
            //----------------------------------------------render to texture
            // Setup scene texture
            var sceneTexture = context3d.createTexture(512, 512, stageJS.Context3DTextureFormat.BGRA, true);
            // Render the scene to the scene texture
            context3d.setRenderToTexture(sceneTexture, true);
            context3d.clear(1.0, 0.0, 0.0, 1.0);
            context3d.drawTriangles(indexBuffer);
            context3d.setRenderToBackBuffer();
            //-----------------
            //init post effect shader
            //-----------------
            var redOnlyProgram = context3d.createProgram();
            redOnlyProgram.upload("shader-vs", "redOnly-shader-fs"); //vertex shader not change
            context3d.setProgram(redOnlyProgram);
            context3d.clear(0.0, 0.0, 0.0, 1.0);
            context3d.drawTriangles(indexBuffer);
            context3d.present();
        }
    })(render2Texture = test.render2Texture || (test.render2Texture = {}));
})(test || (test = {}));
window.onload = test.render2Texture.main;
