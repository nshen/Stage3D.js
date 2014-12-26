///<reference path="stage3d.d.ts"/>
/// <reference path="lib/jquery.d.ts" />
/// <reference path="lib/Stage3dObjParser.ts" />
/// <reference path="lib/OrbitCamera.ts" />
var test;
(function (test) {
    var loadObj;
    (function (loadObj) {
        var stage3d;
        var context3d;
        var mvpMatrix = new stageJS.geom.Matrix3D();
        var modelMatrix = new stageJS.geom.Matrix3D();
        var camera = new lib.OrbitCamera(); //camera matrix
        //var nMatrix:stageJS.geom.Matrix3D = new stageJS.geom.Matrix3D(); // The normal matrix
        var projectionMatrix = new stageJS.geom.PerspectiveMatrix3D(); // The projection matrix
        var loadCount;
        var bitmapdata;
        var objStr;
        /**
         *  window.onload entry point
         */
        function main() {
            loadModelAndTexture(init);
        }
        loadObj.main = main;
        function loadModelAndTexture(p_callBack) {
            loadCount = 2;
            bitmapdata = new Image();
            bitmapdata.src = "model/spaceship_texture.jpg";
            bitmapdata.onload = function (ev) {
                loadCount--;
                if (loadCount <= 0)
                    init();
            };
            $.get('model/spaceship.obj', function (data) {
                objStr = data;
                loadCount--;
                if (loadCount <= 0)
                    init();
            });
        }
        function init() {
            //init stage3d
            var canvas = document.getElementById("my-canvas");
            document.addEventListener("contextmenu", function (e) { return e.preventDefault(); });
            addCanvasListener(canvas);
            stage3d = new stageJS.Stage3D(canvas);
            stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, onCreated);
            stage3d.requestContext3D();
        }
        var myMesh;
        function onCreated(e) {
            context3d = stage3d.context3D;
            context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2, true);
            //-------------
            // init shader
            //-------------
            var program = context3d.createProgram();
            program.upload("shader-vs", "shader-fs"); // shaders are in html file
            context3d.setProgram(program);
            //--------------
            // init buffers
            //--------------
            myMesh = new lib.Stage3dObjParser(objStr, context3d, 1, true, true);
            context3d.setVertexBufferAt("va0", myMesh.positionsBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_3);
            context3d.setVertexBufferAt("va1", myMesh.uvBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);
            //--------------
            // init texture
            //--------------
            var texture = context3d.createTexture(bitmapdata.width, bitmapdata.height, stageJS.Context3DTextureFormat.BGRA, false);
            texture.uploadFromBitmapData(bitmapdata, 0);
            context3d.setTextureAt("fs0", texture);
            //pMatrix.perspectiveFieldOfViewLH(45 * Math.PI / 180 , stage3d.stageWidth / stage3d.stageHeight, 1, 50);
            //pMatrix.perspectiveLH(4, 4, 1, 1000); //近裁剪面的宽高
            projectionMatrix.perspectiveFieldOfViewRH(45, stage3d.stageWidth / stage3d.stageHeight, 1, 1000);
            modelMatrix.appendTranslation(0, 0, -4);
            //camera.z = -4
            requestAnimationFrame(onEnterFrame);
        }
        var dragging = false;
        var __mouseX = 0;
        var __mouseY = 0;
        function addCanvasListener(canvas) {
            canvas.onmousedown = function (ev) {
                dragging = true;
                __mouseX = ev.clientX;
                __mouseY = ev.clientY;
            };
            canvas.onmouseup = function (ev) {
                dragging = false;
            };
            canvas.onmousemove = function (ev) {
                var lastX = __mouseX;
                var lastY = __mouseY;
                __mouseX = ev.clientX;
                __mouseY = ev.clientY;
                if (!dragging)
                    return;
                var dx = __mouseX - lastX;
                var dy = __mouseY - lastY;
                rotateY += dx;
                rotateX += dy;
                camera.rotateY = rotateY;
                camera.rotateX = rotateX;
            };
            //window.onkeydown =(ev)=>{
            //
            //}
            //
            //window.onkeyup = (ev)=>{
            //}
        }
        var rotateY = 0;
        var rotateX = 0;
        function onEnterFrame() {
            //modelMatrix.prependRotation(1,stageJS.geom.Vector3D.Y_AXIS);
            //modelMatrix.prependRotation(2,stageJS.geom.Vector3D.X_AXIS);
            //camera.posZ = xx-=0.01;
            //camera.rotateY = xx++;
            //
            mvpMatrix.identity();
            mvpMatrix.append(modelMatrix);
            //mvpMatrix.append(camera.getViewMatrix());
            mvpMatrix.append(projectionMatrix);
            //context3d.setProgramConstantsFromMatrix("uMVMatrix",mvMatrix);
            context3d.setProgramConstantsFromMatrix("mvpMatrix", mvpMatrix);
            context3d.clear();
            //mvMatrix.identity();
            //mvMatrix.appendRotation(angle,stageJS.geom.Vector3D.Y_AXIS);
            //mvMatrix.appendTranslation(0,0,10);
            //mvMatrix.transpose();
            //pMatrix.transpose();
            context3d.drawTriangles(myMesh.indexBuffer, 0, myMesh.indexBufferCount);
            context3d.present();
            requestAnimationFrame(onEnterFrame);
        }
    })(loadObj = test.loadObj || (test.loadObj = {}));
})(test || (test = {}));
window.onload = test.loadObj.main;
