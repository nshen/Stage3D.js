///<reference path="../_definitions.ts"/>
var GPUSprite;
(function (_GPUSprite) {
    var GPUSprite = (function () {
        // GPUSprites are typically constructed by calling GPUSpriteRenderLayer.createChild()
        function GPUSprite() {
            this._parent = null;
            this._spriteId = 0;
            this._childId = 0;
            //            this._pos = new Point();
            this._scaleX = 1.0;
            this._scaleY = 1.0;
            this._rotation = 0;
            this._alpha = 1.0;
            this._visible = true;
        }
        Object.defineProperty(GPUSprite.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (isVisible) {
                this._visible = isVisible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUSprite.prototype, "alpha", {
            get: function () {
                return this._alpha;
            },
            set: function (a) {
                this._alpha = a;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUSprite.prototype, "position", {
            get: function () {
                return this._pos;
            },
            set: function (pt) {
                this._pos = pt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUSprite.prototype, "scaleX", {
            get: function () {
                return this._scaleX;
            },
            set: function (val) {
                this._scaleX = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUSprite.prototype, "scaleY", {
            get: function () {
                return this._scaleY;
            },
            set: function (val) {
                this._scaleY = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUSprite.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (val) {
                this._rotation = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUSprite.prototype, "rect", {
            get: function () {
                return this._parent._spriteSheet.getRect(this._spriteId);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUSprite.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUSprite.prototype, "spriteId", {
            get: function () {
                return this._spriteId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUSprite.prototype, "childId", {
            get: function () {
                return this._childId;
            },
            enumerable: true,
            configurable: true
        });
        return GPUSprite;
    })();
    _GPUSprite.GPUSprite = GPUSprite;
})(GPUSprite || (GPUSprite = {}));
