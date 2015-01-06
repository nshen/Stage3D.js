///<reference path="_definitions.ts"/>
var BunnyMark;
(function (BunnyMark) {
    var BunnySprite = (function () {
        //wrapper class for GPUSprite to add additional information, in this case the speedX/Y values
        function BunnySprite(gs) {
            this._gpuSprite = gs;
            this._speedX = 0;
            this._speedY = 0;
        }
        Object.defineProperty(BunnySprite.prototype, "speedX", {
            get: function () {
                return this._speedX;
            },
            set: function (sx) {
                this._speedX = sx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BunnySprite.prototype, "speedY", {
            get: function () {
                return this._speedY;
            },
            set: function (sy) {
                this._speedY = sy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BunnySprite.prototype, "sprite", {
            get: function () {
                return this._gpuSprite;
            },
            set: function (gs) {
                this._gpuSprite = gs;
            },
            enumerable: true,
            configurable: true
        });
        return BunnySprite;
    })();
    BunnyMark.BunnySprite = BunnySprite;
})(BunnyMark || (BunnyMark = {}));
