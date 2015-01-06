///<reference path="../_definitions.ts"/>
var GPUSprite;
(function (GPUSprite) {
    var GPUSpriteSheet = (function () {
        function GPUSpriteSheet(width, height) {
            this._spriteSheet = new stageJS.BitmapData(width, height, true, 0xffff1117);
            this._uvCoords = [];
            this._rects = [];
        }
        GPUSpriteSheet.prototype.addSprite = function (srcBits, srcRect, destPt) {
            this._spriteSheet.copyPixels(srcBits, srcRect, destPt);
            //            var destRect : Rectangle = new Rectangle();
            //            destRect.left = destPt.x;
            //            destRect.top = destPt.y;
            //            destRect.right = destRect.left + srcRect.width;
            //            destRect.bottom = destRect.top + srcRect.height;
            //
            //            _rects.push(destRect);
            this._rects.push({ x: destPt.x, y: destPt.y, width: srcRect.width, height: srcRect.height });
            /**
             * 2 3
             * 1 4
             */
            this._uvCoords.push(destPt.x / this._spriteSheet.width, destPt.y / this._spriteSheet.height + srcRect.height / this._spriteSheet.height, destPt.x / this._spriteSheet.width, destPt.y / this._spriteSheet.height, destPt.x / this._spriteSheet.width + srcRect.width / this._spriteSheet.width, destPt.y / this._spriteSheet.height, destPt.x / this._spriteSheet.width + srcRect.width / this._spriteSheet.width, destPt.y / this._spriteSheet.height + srcRect.height / this._spriteSheet.height);
            return this._rects.length - 1;
        };
        GPUSpriteSheet.prototype.removeSprite = function (spriteId) {
            if (spriteId < this._uvCoords.length) {
                this._uvCoords = this._uvCoords.splice(spriteId * 8, 8);
                this._rects.splice(spriteId, 1);
            }
        };
        Object.defineProperty(GPUSpriteSheet.prototype, "numSprites", {
            get: function () {
                return this._rects.length;
            },
            enumerable: true,
            configurable: true
        });
        GPUSpriteSheet.prototype.getUVCoords = function (spriteId) {
            var startIdx = spriteId * 8;
            return this._uvCoords.slice(startIdx, startIdx + 8);
        };
        GPUSpriteSheet.prototype.getRect = function (spriteId) {
            return this._rects[spriteId];
        };
        GPUSpriteSheet.prototype.uploadTexture = function (context3D) {
            if (this._texture == null) {
                this._texture = context3D.createTexture(this._spriteSheet.width, this._spriteSheet.height, stageJS.Context3DTextureFormat.BGRA, false);
            }
            this._texture.uploadFromBitmapData(this._spriteSheet, 0);
            // Courtesy of Starling: let's generate mipmaps
            //            var currentWidth:int = _spriteSheet.width >> 1;
            //            var currentHeight:int = _spriteSheet.height >> 1;
            //            var level:int = 1;
            //            var canvas:BitmapData = new BitmapData(currentWidth, currentHeight, true, 0);
            //            var transform:Matrix = new Matrix(.5, 0, 0, .5);
            //
            //            while ( currentWidth >= 1 || currentHeight >= 1 ) {
            //                canvas.fillRect(new Rectangle(0, 0, Math.max(currentWidth,1), Math.max(currentHeight,1)), 0);
            //                canvas.draw(_spriteSheet, transform, null, null, null, true);
            //                _texture.uploadFromBitmapData(canvas, level++);
            //                transform.scale(0.5, 0.5);
            //                currentWidth = currentWidth >> 1;
            //                currentHeight = currentHeight >> 1;
            //            }
        };
        return GPUSpriteSheet;
    })();
    GPUSprite.GPUSpriteSheet = GPUSpriteSheet;
})(GPUSprite || (GPUSprite = {}));
