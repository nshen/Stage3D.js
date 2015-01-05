/// <reference path="stage3d.d.ts"/>
/// <reference path="lib/jquery.d.ts" />
/// <reference path="lib/Stage3dObjParser.ts" />
/// <reference path="lib/OrbitCamera.ts" />

module test.loadObj {
    var stage3d:stageJS.Stage3D;
    var context3d:stageJS.Context3D;

    var mvpMatrix:stageJS.geom.Matrix3D = new stageJS.geom.Matrix3D();
    var modelMatrix:stageJS.geom.Matrix3D = new stageJS.geom.Matrix3D();
    var camera:lib.OrbitCamera = new lib.OrbitCamera(); //camera matrix
    //var nMatrix:stageJS.geom.Matrix3D = new stageJS.geom.Matrix3D(); // The normal matrix
    var projectionMatrix:stageJS.geom.PerspectiveMatrix3D = new stageJS.geom.PerspectiveMatrix3D(); // The projection matrix

    var loadCount:number;
    var bitmapdata:HTMLImageElement;
    var objStr:string;

    /**
     *  window.onload entry point
     */
    export function main() {

        loadModelAndTexture(init);
    }

    function loadModelAndTexture(p_callBack:Function):void {
        loadCount = 2;
        bitmapdata = new Image();
        bitmapdata.src = "model/spaceship_texture.jpg";
        bitmapdata.onload = (ev:Event) => {
            loadCount--;
            if (loadCount <= 0)init();
        };

        $.get('model/spaceship.obj', (data) => {
            objStr = data;
            loadCount--;
            if (loadCount <= 0)init();
        });
    }

    function init():void {
        //init stage3d
        var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("my-canvas");
        document.addEventListener("contextmenu", (e:Event)=> e.preventDefault());

        addCanvasListener(canvas);

        stage3d = new stageJS.Stage3D(canvas);
        stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, onCreated);
        stage3d.requestContext3D();
    }


    var myMesh:lib.Stage3dObjParser;

    function onCreated(e:stageJS.events.Event):void {
        context3d = stage3d.context3D;
        context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2, true);

        //-------------
        // init shader
        //-------------
        var program:stageJS.Program3D = context3d.createProgram();
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
        var texture:stageJS.Texture = context3d.createTexture(bitmapdata.width, bitmapdata.height, stageJS.Context3DTextureFormat.BGRA, false);
        texture.uploadFromBitmapData(bitmapdata, 0);
        context3d.setTextureAt("fs0", texture);

        //pMatrix.perspectiveFieldOfViewLH(45 * Math.PI / 180 , stage3d.stageWidth / stage3d.stageHeight, 1, 50);
        //pMatrix.perspectiveLH(4, 4, 1, 1000); //近裁剪面的宽高
        projectionMatrix.perspectiveFieldOfViewLH(45, stage3d.stageWidth / stage3d.stageHeight, 1, 1000);
        context3d.setProgramConstantsFromMatrix("pMatrix",projectionMatrix);
        context3d.setProgramConstantsFromMatrix("mMatrix",modelMatrix);
        camera.z = -4;

        //var camM:stageJS.geom.PerspectiveMatrix3D = new stageJS.geom.PerspectiveMatrix3D();
        //camM.lookAtLH(
        //    new stageJS.geom.Vector3D(0,0,-4),
        //    new stageJS.geom.Vector3D(0,0,0),
        //    new stageJS.geom.Vector3D(0,1,0)
        //);
        //context3d.setProgramConstantsFromMatrix("vMatrix",camM);

        requestAnimationFrame(onEnterFrame);

    }


    var dragging:boolean = false;
    var __mouseX:number = 0;
    var __mouseY:number = 0;
    function addCanvasListener(canvas:HTMLCanvasElement):void
    {
        canvas.onmousedown = (ev:MouseEvent)=>{
            dragging = true;
            __mouseX = ev.clientX;
            __mouseY = ev.clientY;
        }

        canvas.onmouseup = (ev:MouseEvent)=> {
            dragging = false;
        }

        canvas.onmousemove = (ev:MouseEvent)=>{
            var lastX:number = __mouseX;
            var lastY:number = __mouseY;
            __mouseX = ev.clientX;
            __mouseY = ev.clientY;
            if(!dragging)
                return;
            var dx = __mouseX - lastX;
            var dy = __mouseY - lastY;

            rotateY += dx ;
            rotateX += dy;
            camera.rotateY = rotateY;
            camera.rotateX = rotateX;

        }

        //window.onkeydown =(ev)=>{
        //
        //}
        //
        //window.onkeyup = (ev)=>{
        //}
    }



    var rotateY:number = 0;
    var rotateX:number = 0;
    function onEnterFrame():void
    {

        /*
            mvpMatrix.identity();
            mvpMatrix.append(modelMatrix);
            mvpMatrix.append(vv);
            mvpMatrix.append(projectionMatrix);
            context3d.setProgramConstantsFromMatrix("mvpMatrix",mvpMatrix);
        */

        context3d.setProgramConstantsFromMatrix("vMatrix",camera.getViewMatrix());

        context3d.clear();


        context3d.drawTriangles(myMesh.indexBuffer, 0, myMesh.indexBufferCount);
        context3d.present();
        requestAnimationFrame(onEnterFrame);
    }
}
window.onload = test.loadObj.main;