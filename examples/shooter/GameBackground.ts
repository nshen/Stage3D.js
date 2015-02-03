// Stage3D Shoot-em-up Tutorial Part 2
// by Christer Kaitila - www.mcfunkypants.com

// GameBackground.as
// A very simple batch of background stars that scroll

///<reference path="reference.ts"/>
module shooter
{

    export class GameBackground extends EntityManager
    {
        // how fast the stars move
        public bgSpeed:number = -1;
        // the sprite sheet image
        public bgSpritesPerRow:number = 1;
        public bgSpritesPerCol:number = 1;

        // since the image is larger than the screen we have some extra pixels to play with
        public yParallaxAmount:number = 128; // v6
        public yOffset:number = 0;

        public bgSourceImage:string = "assets/stars.gif";

        constructor(view:GPUSprite.Rectangle)
        {
            // run the init functions of the EntityManager class
            super(view);
        }

        public createBatch(context3D:stageJS.Context3D) : GPUSprite.SpriteRenderLayer
        {
            var bgsourceBitmap:HTMLImageElement = lib.ImageLoader.getInstance().get(this.bgSourceImage);

            // create a spritesheet with single giant sprite
            this._spriteSheet = new GPUSprite.SpriteSheet(stageJS.BitmapData.fromImageElement(bgsourceBitmap), this.bgSpritesPerRow, this.bgSpritesPerCol);

            // Create new render batch
            this._batch = new GPUSprite.SpriteRenderLayer(context3D, this._spriteSheet);

            return this._batch;
        }

        public setPosition(view:GPUSprite.Rectangle):void
        {
            // allow moving fully offscreen before looping around
            this.maxX = 256+512+512+512+512;
            this.minX = -256;
            this.maxY = view.height;
            this.minY = view.y;
            this.yParallaxAmount = 128; // v6
            this.yOffset = (this.maxY / 2) + (-1 * this.yParallaxAmount * 0.5); // v6

        }

        // for this test, create random entities that move
        // from right to left with random speeds and scales
        public initBackground():void
        {
            // we need three 512x512 sprites
            var anEntity1:Entity = this.respawn(0);
            anEntity1.sprite.position.x = 256;
            anEntity1.sprite.position.y = this.maxY / 2;
            anEntity1.speedX =  this.bgSpeed;

            var anEntity2:Entity = this.respawn(0);
            anEntity2.sprite.position.x = 256+512;
            anEntity2.sprite.position.y = this.maxY / 2;
            anEntity2.speedX = this.bgSpeed;

            var anEntity3:Entity = this.respawn(0);
            anEntity3.sprite.position.x = 256+512+512;
            anEntity3.sprite.position.y = this.maxY / 2;
            anEntity3.speedX = this.bgSpeed;

            var anEntity4:Entity = this.respawn(0)
            anEntity4.sprite.position.x = 256+512+512+512;
            anEntity4.sprite.position.y = this.maxY / 2;
            anEntity4.speedX = this.bgSpeed;

            var anEntity5:Entity = this.respawn(0)
            anEntity5.sprite.position.x = 256+512+512+512+512;
            anEntity5.sprite.position.y = this.maxY / 2;
            anEntity5.speedX = this.bgSpeed;

            // upper row
            var anEntity1a:Entity = this.respawn(0)
            anEntity1a.sprite.position.x = 256;
            anEntity1a.sprite.position.y = this.maxY / 2 + 512;
            anEntity1a.speedX = this.bgSpeed;
            var anEntity2a:Entity = this.respawn(0)
            anEntity2a.sprite.position.x = 256+512;
            anEntity2a.sprite.position.y = this.maxY / 2 + 512;
            anEntity2a.speedX = this.bgSpeed;
            var anEntity3a:Entity = this.respawn(0)
            anEntity3a.sprite.position.x = 256+512+512;
            anEntity3a.sprite.position.y = this.maxY / 2 + 512;
            anEntity3a.speedX = this.bgSpeed;
            var anEntity4a:Entity = this.respawn(0)
            anEntity4a.sprite.position.x = 256+512+512+512;
            anEntity4a.sprite.position.y = this.maxY / 2 + 512;
            anEntity4a.speedX = this.bgSpeed;
            var anEntity5a:Entity = this.respawn(0)
            anEntity5a.sprite.position.x = 256+512+512+512+512;
            anEntity5a.sprite.position.y = this.maxY / 2 + 512;
            anEntity5a.speedX = this.bgSpeed;

            // lower row
            var anEntity1b:Entity = this.respawn(0)
            anEntity1b.sprite.position.x = 256;
            anEntity1b.sprite.position.y = this.maxY / 2 - 512;
            anEntity1b.speedX = this.bgSpeed;
            var anEntity2b:Entity = this.respawn(0)
            anEntity2b.sprite.position.x = 256+512;
            anEntity2b.sprite.position.y = this.maxY / 2 - 512;
            anEntity2b.speedX = this.bgSpeed;
            var anEntity3b:Entity = this.respawn(0)
            anEntity3b.sprite.position.x = 256+512+512;
            anEntity3b.sprite.position.y = this.maxY / 2 - 512;
            anEntity3b.speedX = this.bgSpeed;
            var anEntity4b:Entity = this.respawn(0)
            anEntity4b.sprite.position.x = 256+512+512+512;
            anEntity4b.sprite.position.y = this.maxY / 2 - 512;
            anEntity4b.speedX = this.bgSpeed;
            var anEntity5b:Entity = this.respawn(0)
            anEntity5b.sprite.position.x = 256+512+512+512+512;
            anEntity5b.sprite.position.y = this.maxY / 2 - 512;
            anEntity5b.speedX = this.bgSpeed;

            //this.yParallaxAmount = (512 - this.maxY) / 2;
            //this.yOffset = this.maxY / 2;
        }

        // scroll slightly up or down to give more parallax
        public yParallax(OffsetPercent:number = 0) : void
        {
            //console.log(OffsetPercent);
            this.yOffset = (this.maxY * 0.5) - this.yParallaxAmount * (OffsetPercent );
        }

        // called every frame: used to update the scrolling background
        public update(currentTime:number) : void
        {
            var anEntity:Entity;

            // handle all other entities
            for(var i:number=0; i<this._entityPool.length;i++)
            {
                anEntity = this._entityPool[i];
                if (anEntity.active)
                {
                    anEntity.sprite.position.x += anEntity.speedX;
                    anEntity.sprite.position.y = this.yOffset;

                    // upper row // v6
                    if (i > 9) anEntity.sprite.position.y += 512;
                    // lower row // v6
                    else if (i > 4) anEntity.sprite.position.y -= 512;

                    if (anEntity.sprite.position.x >= this.maxX)
                    {
                        anEntity.sprite.position.x = this.minX;
                    }
                    else if (anEntity.sprite.position.x <= this.minX)
                    {
                        anEntity.sprite.position.x = this.maxX;
                    }
                }
            }
        }
    } // end class
} // end package