///<reference path="stage3d.d.ts"/>
/// <reference path="lib/jquery.d.ts" />
/// <reference path="lib/Stage3dObjParser.ts" />
module test.loadObj {
    var stage3d:stageJS.Stage3D;
    var context3d:stageJS.Context3D;

    //var mvMatrix:stageJS.geom.Matrix3D = new stageJS.geom.Matrix3D(); // The Model-View matrix
    //var nMatrix:stageJS.geom.Matrix3D = new stageJS.geom.Matrix3D(); // The normal matrix
    //var pMatrix:stageJS.geom.PerspectiveMatrix3D = new stageJS.geom.PerspectiveMatrix3D(); // The projection matrix

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

        //--------------
        // draw it
        //---------------
        context3d.clear(1.0, 1.0, 1.0, 1.0);
        context3d.drawTriangles(myMesh.indexBuffer, 0, myMesh.indexBufferCount);
        context3d.present();

    }


}
window.onload = test.loadObj.main;