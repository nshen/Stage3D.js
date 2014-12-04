///<reference path="stage3d.d.ts"/>

module test.bitmapDataTest
{


    var img:HTMLImageElement;

    /**
     *  window.onload entry point
     */
    export function main()
    {
        prepareImage(init);

    }

    function prepareImage(p_callBack:Function):void
    {
        img = new Image();
        img.src = "bear256.jpg";
        img.onload = (ev:Event) => p_callBack();
    }

    function init():void
    {

        var b:stageJS.BitmapData = new stageJS.BitmapData(500 ,500,true,0xffff1117);
       // b.fillRect({x:0,y:0,width:500,height:500},0xffff7733);
        b.copyPixels(img,{x:60,y:110,width:100,height:100},{x:30,y:50});


        var c:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("my-canvas");
        var ctx:CanvasRenderingContext2D = c.getContext("2d");
        ctx.putImageData(b.imageData,0,0);
    }


}


window.onload = test.bitmapDataTest.main;

