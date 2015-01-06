///<reference path="_definitions.ts"/>
var BunnyMark;
(function (BunnyMark) {
    var BunnyLayer = (function () {
        function BunnyLayer(view) {
            this.gravity = 0.5;
            this.maxX = view.width;
            this.minX = view.x;
            this.maxY = view.height;
            this.minY = view.y;
            this._bunnies = [];
        }
        BunnyLayer.prototype.setPosition = function (view) {
            this.maxX = view.width;
            this.minX = view.x;
            this.maxY = view.height;
            this.minY = view.y;
        };
        BunnyLayer.prototype.createRenderLayer = function (context3D) {
            this._spriteSheet = new GPUSprite.GPUSpriteSheet(64, 64); //2的次幂，图片26*37，比32大，所以用64
            //add bunny image to sprite sheet
            var bunnyBitmap = BunnyMark.ImageLoader.getInstance().get("assets/wabbit_alpha.png");
            var bunnyRect = { x: 0, y: 0, width: bunnyBitmap.width, height: bunnyBitmap.height };
            this._bunnySpriteID = this._spriteSheet.addSprite(bunnyBitmap, bunnyRect, { x: 0, y: 0 });
            this._renderLayer = new GPUSprite.GPUSpriteRenderLayer(context3D, this._spriteSheet);
            return this._renderLayer;
        };
        BunnyLayer.prototype.addBunny = function (numBunnies) {
            var currentBunnyCount = this._bunnies.length;
            var bunny;
            var sprite;
            for (var i = currentBunnyCount; i < currentBunnyCount + numBunnies; i++) {
                sprite = this._renderLayer.createChild(this._bunnySpriteID);
                bunny = new BunnyMark.BunnySprite(sprite);
                bunny.sprite.position = { x: 0, y: 0 };
                bunny.speedX = 5; //Math.random() * 5;
                bunny.speedY = 5; //(Math.random() * 5) - 2.5;
                bunny.sprite.scaleX = bunny.sprite.scaleY = Math.random() + 0.3;
                bunny.sprite.rotation = 15 - Math.random() * 30;
                this._bunnies.push(bunny);
            }
        };
        BunnyLayer.prototype.update = function (currentTime) {
            var bunny;
            for (var i = 0; i < this._bunnies.length; i++) {
                bunny = this._bunnies[i];
                bunny.sprite.position.x += bunny.speedX;
                bunny.sprite.position.y += bunny.speedY;
                bunny.speedY += this.gravity;
                bunny.sprite.alpha = 0.3 + 0.7 * bunny.sprite.position.y / this.maxY;
                if (bunny.sprite.position.x > this.maxX) {
                    bunny.speedX *= -1;
                    bunny.sprite.position.x = this.maxX;
                }
                else if (bunny.sprite.position.x < this.minX) {
                    bunny.speedX *= -1;
                    bunny.sprite.position.x = this.minX;
                }
                if (bunny.sprite.position.y > this.maxY) {
                    bunny.speedY *= -0.8;
                    bunny.sprite.position.y = this.maxY;
                    if (Math.random() > 0.5)
                        bunny.speedY -= 3 + Math.random() * 4;
                }
                else if (bunny.sprite.position.y < this.minY) {
                    bunny.speedY = 0;
                    bunny.sprite.position.y = this.minY;
                }
            }
        };
        return BunnyLayer;
    })();
    BunnyMark.BunnyLayer = BunnyLayer;
})(BunnyMark || (BunnyMark = {}));
