///<reference path="stage3d.d.ts"/>
var test;
(function (test) {
    var bitmapDataTest;
    (function (bitmapDataTest) {
        var img;
        var img2;
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
            img.onload = function (ev) { return p_callBack(); };
            img2 = new Image();
            img2.src = "png.png";
            img2.onload = function (ev) { return p_callBack(); };
        }
        var imgCount = 2;
        function init() {
            if (--imgCount > 0)
                return;
            ;
            var b = new stageJS.BitmapData(300, 300, false, 0xff11ff17);
            b.copyPixels(img, { x: 60, y: 110, width: 100, height: 100 }, { x: 30, y: 50 });
            var b2 = new stageJS.BitmapData(img2.width, img2.height, true, 0xffff1122);
            b2.copyPixels(img2, { x: 0, y: 0, width: img2.width, height: img2.height }, { x: 0, y: 0 });
            var c = document.getElementById("my-canvas");
            var ctx = c.getContext("2d");
            ctx.putImageData(b.imageData, 0, 0);
            ctx.putImageData(b2.imageData, 300, 300);
        }
    })(bitmapDataTest = test.bitmapDataTest || (test.bitmapDataTest = {}));
})(test || (test = {}));
window.onload = test.bitmapDataTest.main;
