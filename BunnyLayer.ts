///<reference path="_definitions.ts"/>
module BunnyMark
{
    export class BunnyLayer
    {

        private _bunnies:BunnySprite[];
        private _spriteSheet:GPUSprite.SpriteSheet;
        public  _renderLayer : GPUSprite.SpriteRenderLayer;
        private _bunnySpriteID:number;

        private gravity:number = 0.5;
        private maxX:number;
        private minX:number;
        private maxY:number;
        private minY:number;

        public constructor(view:Rectangle)
        {
            this.maxX = view.width;
            this.minX = view.x;
            this.maxY = view.height;
            this.minY = view.y;
            this._bunnies = [];
        }

        public setPosition(view:Rectangle):void
        {
            this.maxX = view.width;
            this.minX = view.x;
            this.maxY = view.height;
            this.minY = view.y;
        }

        public createRenderLayer(context3D:stageJS.Context3D):GPUSprite.SpriteRenderLayer
        {
            this._spriteSheet = new GPUSprite.SpriteSheet(64,64);//2的次幂，图片26*37，比32大，所以用64

            //add bunny image to sprite sheet
            var bunnyBitmap:HTMLImageElement = ImageLoader.getInstance().get("assets/wabbit_alpha.png");
            var bunnyRect:{x:number;y:number;width:number;height:number} = {x:0 ,y:0,width:bunnyBitmap.width,height:bunnyBitmap.height};

            this._bunnySpriteID = this._spriteSheet.addSprite(bunnyBitmap,bunnyRect,{x:0,y:0});

            this._renderLayer = new GPUSprite.SpriteRenderLayer(context3D,this._spriteSheet);
            return this._renderLayer;
        }

        public addBunny(numBunnies:number):void
        {
            var currentBunnyCount:number = this._bunnies.length;
            var bunny:BunnySprite;
            var sprite:GPUSprite.Sprite;
            for(var i:number = currentBunnyCount; i< currentBunnyCount + numBunnies; i++)
            {
                sprite = this._renderLayer.createChild(this._bunnySpriteID);
                bunny = new BunnySprite(sprite);
                bunny.sprite.position = {x:0,y:0};
                bunny.speedX = 5//Math.random() * 5;
                bunny.speedY = 5//(Math.random() * 5) - 2.5;
                bunny.sprite.scaleX = bunny.sprite.scaleY = Math.random() + 0.3;
                bunny.sprite.rotation = 15 - Math.random() * 30;
                this._bunnies.push(bunny);

            }

        }

        public update(currentTime:number):void
        {
            var bunny:BunnySprite;
            for(var i:number = 0; i<this._bunnies.length; i++)
            {
                bunny = this._bunnies[i];
                bunny.sprite.position.x += bunny.speedX;
                bunny.sprite.position.y += bunny.speedY;
                bunny.speedY += this.gravity;
                bunny.sprite.alpha = 0.3 + 0.7 * bunny.sprite.position.y / this.maxY;
                if (bunny.sprite.position.x > this.maxX)
                {
                    bunny.speedX *= -1;
                    bunny.sprite.position.x = this.maxX;
                }
                else if (bunny.sprite.position.x < this.minX)
                {
                    bunny.speedX *= -1;
                    bunny.sprite.position.x = this.minX;
                }
                if (bunny.sprite.position.y > this.maxY)
                {
                    bunny.speedY *= -0.8;
                    bunny.sprite.position.y = this.maxY;
                    if (Math.random() > 0.5) bunny.speedY -= 3 + Math.random() * 4;
                }
                else if (bunny.sprite.position.y < this.minY)
                {
                    bunny.speedY = 0;
                    bunny.sprite.position.y = this.minY;
                }
            }
        }
    }
}