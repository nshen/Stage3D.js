///<reference path="../_definitions.ts"/>
module GPUSprite
{
    export class GPUSpriteSheet
    {
        public _texture:stageJS.Texture;

        public _spriteSheet:stageJS.BitmapData;
        private _uvCoords:number[];
        private _rects:{x:number;y:number;width:number;height:number}[];

        public constructor(width:number , height:number)
        {
            this._spriteSheet = new stageJS.BitmapData(width,height,true,0xffff1117);
            this._uvCoords = [];
            this._rects = [];
        }

        // Very simplistic for now...assume client will manage the packing of the sprite sheet bitmap
        // Returns sprite ID
        public addSprite(srcBits:stageJS.BitmapData, srcRect:{x:number;y:number;width:number;height:number}, destPt:{x:number;y:number}) : number;
        public addSprite(srcBits:HTMLImageElement, srcRect:{x:number;y:number;width:number;height:number}, destPt:{x:number;y:number}) : number;
        public addSprite(srcBits:any, srcRect:{x:number;y:number;width:number;height:number}, destPt:{x:number;y:number}) : number
        {
            this._spriteSheet.copyPixels(srcBits, srcRect, destPt);

//            var destRect : Rectangle = new Rectangle();
//            destRect.left = destPt.x;
//            destRect.top = destPt.y;
//            destRect.right = destRect.left + srcRect.width;
//            destRect.bottom = destRect.top + srcRect.height;
//
//            _rects.push(destRect);
            this._rects.push({x:destPt.x,
                              y:destPt.y,
                              width:srcRect.width,
                              height:srcRect.height});


            /**
             * 2 3
             * 1 4
             */
            this._uvCoords.push(
                    destPt.x/this._spriteSheet.width, destPt.y/this._spriteSheet.height + srcRect.height/this._spriteSheet.height,
                    destPt.x/this._spriteSheet.width, destPt.y/this._spriteSheet.height,
                    destPt.x/this._spriteSheet.width + srcRect.width/this._spriteSheet.width, destPt.y/this._spriteSheet.height,
                    destPt.x/this._spriteSheet.width + srcRect.width/this._spriteSheet.width, destPt.y/this._spriteSheet.height + srcRect.height/this._spriteSheet.height);

            return this._rects.length - 1;
        }

        public removeSprite(spriteId:number) : void
        {
            if ( spriteId < this._uvCoords.length ) {
                this._uvCoords = this._uvCoords.splice(spriteId * 8, 8);
                this._rects.splice(spriteId, 1);
            }
        }

        public get numSprites() : number
        {
            return this._rects.length;
        }

        public getUVCoords(spriteId:number) : number[]
        {
            var startIdx:number = spriteId * 8;
            return this._uvCoords.slice(startIdx, startIdx + 8);

        }

        public getRect(spriteId:number) : {x:number;y:number;width:number;height:number}
        {
            return this._rects[spriteId];
        }

        public uploadTexture(context3D:stageJS.Context3D) : void
        {
            if ( this._texture == null ) {
                this._texture = context3D.createTexture(this._spriteSheet.width, this._spriteSheet.height, stageJS.Context3DTextureFormat.BGRA, false);
            }

            this._texture.uploadFromBitmapData(this._spriteSheet,0);

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
        }
    }
}