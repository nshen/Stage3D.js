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


        constructor(view:GPUSprite.Rectangle)
        {
            // run the init functions of the EntityManager class
            super(view);
        }

        public createBatch(context3D:stageJS.Context3D) : GPUSprite.SpriteRenderLayer
        {
            var bgsourceBitmap:HTMLImageElement = lib.ImageLoader.getInstance().get("assets/stars.gif");

            // create a spritesheet with single giant sprite
            this._spriteSheet = new GPUSprite.SpriteSheet(stageJS.BitmapData.fromImageElement(bgsourceBitmap), this.bgSpritesPerRow, this.bgSpritesPerCol);

            // Create new render batch
            this._batch = new GPUSprite.SpriteRenderLayer(context3D, this._spriteSheet);

            return this._batch;
        }

        public setPosition(view:GPUSprite.Rectangle):void
        {
            // allow moving fully offscreen before looping around
            this.maxX = 256+512+512;
            this.minX = -256;
            this.maxY = view.height;
            this.minY = view.y;
        }

        // for this test, create random entities that move
        // from right to left with random speeds and scales
        public initBackground():void
        {
            console.log("Init background...");
            // we need three 512x512 sprites
            var anEntity1:Entity = this.respawn(0)
            anEntity1.sprite.position.x = 256;
            anEntity1.sprite.position.y = this.maxY / 2;
            anEntity1.speedX =  this.bgSpeed;

            var anEntity2:Entity = this.respawn(0)
            anEntity2.sprite.position.x = 256+512;
            anEntity2.sprite.position.y = this.maxY / 2;
            anEntity2.speedX = this.bgSpeed;

            var anEntity3:Entity = this.respawn(0)
            anEntity3.sprite.position.x = 256+512+512;
            anEntity3.sprite.position.y = this.maxY / 2;
            anEntity3.speedX = this.bgSpeed;
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