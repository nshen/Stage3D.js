///<reference path="_definitions.ts"/>
module BunnyMark
{
    export class PriateLayer
    {

        private maxX:number;
        private minX:number;
        private maxY:number;
        private minY:number;

        private _spriteSheet:GPUSprite.GPUSpriteSheet;
        private pirateHalfWidth:number;
        private pirateHalfHeight:number;
        private pirate:GPUSprite.GPUSprite;

        public constructor(view:{x:number;y:number;w:number;h:number})
        {
            this.maxX = view.w;
            this.minX = view.x;
            this.maxY = view.h;
            this.minY = view.y;
        }

        public createRenderLayer(context3D:staglContext3D) : GPUSprite.GPUSpriteRenderLayer
        {
            this._spriteSheet = new GPUSprite.GPUSpriteSheet(256,256);
            //add pirate image to sprite sheet
            var pirateBitmap:HTMLImageElement = AssetManager.getInstance().getAsset("assets/pirate.png");
            //adjust for different anchor point of GPUSprite vs DisplayList
            this.pirateHalfWidth = pirateBitmap.width/2;
            this.pirateHalfHeight = pirateBitmap.height/2;

            this._pirateSpriteID = this._spriteSheet.addSprite(pirateBitmap, {x:0,y:0,w:pirateBitmap.width,h:pirateBitmap.height}, {x:0,y:0});

            // Create new render layer
            this._renderLayer = new GPUSprite.GPUSpriteRenderLayer(context3D, this._spriteSheet);

            return this._renderLayer;
        }
        public setPosition(view:{x:number;y:number;width:number;height:number}):void
        {
            this.maxX = view.width;
            this.minX = view.x;
            this.maxY = view.height;
            this.minY = view.y;
        }

        public addPirate():void
        {
            this.pirate = this._renderLayer.createChild(this._pirateSpriteID);
            this.pirate.position = {x:(maxX - pirateHalfWidth) * (0.5), y:(maxY - pirateHalfHeight + 70)};
        }

        public update(currentTime:number) : void
        {
            this.pirate.position.x = (this.maxX - (this.pirateHalfWidth)) * (0.5 + 0.5 * Math.sin(currentTime / 3000));
            this.pirate.position.y = (this.maxY - (this.pirateHalfHeight) + 70 - 30 * Math.sin(currentTime / 100));
        }

    }
}