///<reference path="stage3d.d.ts"/>

module test.bitmapDataTest
{


    var img:HTMLImageElement;
    var img2:HTMLImageElement;

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

        img2 = new Image();
        img2.src = "png.png";
        img2.onload = (ev:Event) => p_callBack();
    }


    var imgCount:number = 2;
    function init():void
    {
        if( --imgCount > 0)
            return;;

        var b:stageJS.BitmapData = new stageJS.BitmapData(300 ,300,false,0xff11ff17);
        b.copyPixels(img,{x:60,y:110,width:100,height:100},{x:30,y:50});

        var b2:stageJS.BitmapData = new stageJS.BitmapData(img2.width,img2.height,true,0xffff1122);
        b2.copyPixels(img2,{x:0,y:0,width:img2.width,height:img2.height},{x:0,y:0});

        var c:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("my-canvas");
        var ctx:CanvasRenderingContext2D = c.getContext("2d");
        ctx.putImageData(b.imageData,0,0);
        ctx.putImageData(b2.imageData,300,300);
    }


}


window.onload = test.bitmapDataTest.main;

