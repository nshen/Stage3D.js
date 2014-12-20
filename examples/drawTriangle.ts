///<reference path="stage3d.d.ts"/>

module test.drawTriangle
{

    var stage3d: stageJS.Stage3D;
    var context3d: stageJS.Context3D;


    /**
     *  window.onload entry point
     */
    export function main()
    {
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("my-canvas");

        stage3d = new stageJS.Stage3D(canvas);
        stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, onCreated);
        stage3d.requestContext3D();
    }

    function onCreated(e: stageJS.events.Event): void
    {
        context3d = stage3d.context3D;
        context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2, true);

        var program: stageJS.Program3D = context3d.createProgram();
        program.upload("shader-vs", "shader-fs"); // shaders are in html file
        context3d.setProgram(program);

        
        var vertexBuffer: stageJS.VertexBuffer3D = context3d.createVertexBuffer(3, 7);
        vertexBuffer.uploadFromVector([
            -1, -1, 0, 1, 0, 0, 1,   //xyz rgba
            1, -1, 0, 0, 1, 0, 1,
            0, 1, 0, 0, 0, 1, 1]
            , 0, 3);

        context3d.setVertexBufferAt("va0", vertexBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_3); // pos
        context3d.setVertexBufferAt("va1", vertexBuffer, 3, stageJS.Context3DVertexBufferFormat.FLOAT_4); // color


        var indexBuffer: stageJS.IndexBuffer3D = context3d.createIndexBuffer(3);
        indexBuffer.uploadFromVector([0, 1, 2], 0, 3);

        context3d.clear(0.0, 0.0, 0.0, 1.0);
        context3d.drawTriangles(indexBuffer);
        context3d.present();

    }

    function setProgramConstantsFromVector(programType:string, firstRegister:number/*int*/, data:number[]/*Vector.<Number>*/, numRegisters:number/*int*/ ):void;
    function setProgramConstantsFromVector(variable: string, data: number[] /* Vector.<Number> */): void;
    function setProgramConstantsFromVector(programTypeOrVariable:string,firstRegisterOrData:any,data?: number[] , numRegisters:number = -1): void
    {
        if(firstRegisterOrData && typeof(firstRegisterOrData) == "number")
        {
            console.log(1 ," --- ", programTypeOrVariable,firstRegisterOrData,data,numRegisters);
        }else
        {
            console.log(2," --- ",programTypeOrVariable,firstRegisterOrData);
        }
    }

    setProgramConstantsFromVector("sss",1,[12,3,4],1);
    setProgramConstantsFromVector("va0",[12,2,2,2,2,2,2,2]);
}


window.onload = test.drawTriangle.main;

