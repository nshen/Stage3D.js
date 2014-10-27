///<reference path="stagl.d.ts"/>
var test;
(function (test) {
    (function (bitmapDataTest) {
        var img;

        /**
        *  window.onload entry point
        */
        function main() {
            prepareImage(init);
        }
        bitmapDataTest.main = main;

        function prepareImage(p_callBack) {
            img = new Image();
            img.src = "bear256.jpg";
            img.onload = function (ev) {
                return p_callBack();
            };
        }

        function init() {
            var b = new stagl.BitmapData(500, 500, true, 0xffff1117);

            // b.fillRect({x:0,y:0,width:500,height:500},0xffff7733);
            b.copyPixels(img, { x: 60, y: 110, width: 100, height: 100 }, { x: 30, y: 50 });

            var c = document.getElementById("my-canvas");
            var ctx = c.getContext("2d");
            ctx.putImageData(b.imageData, 0, 0);
        }
    })(test.bitmapDataTest || (test.bitmapDataTest = {}));
    var bitmapDataTest = test.bitmapDataTest;
})(test || (test = {}));

window.onload = test.bitmapDataTest.main;
