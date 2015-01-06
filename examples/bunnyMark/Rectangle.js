///<reference path="_definitions.ts"/>
var BunnyMark;
(function (BunnyMark) {
    var Rectangle = (function () {
        function Rectangle(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        }
        return Rectangle;
    })();
    BunnyMark.Rectangle = Rectangle;
})(BunnyMark || (BunnyMark = {}));
