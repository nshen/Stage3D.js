///<reference path="_definitions.ts"/>
module BunnyMark
{

    export class BunnySprite
    {
        private _speedX:number;
        private _speedY:number;
        private _gpuSprite:GPUSprite.Sprite;
        //wrapper class for GPUSprite to add additional information, in this case the speedX/Y values
        constructor(gs)
        {
            this._gpuSprite = gs;
            this._speedX = 0;
            this._speedY = 0;
        }

        public get speedX():number
        {
            return this._speedX;
        }

        public set speedX(sx:number)
        {
            this._speedX = sx;
        }

        public get speedY():number
        {
            return this._speedY;
        }

        public set speedY(sy:number)
        {
            this._speedY = sy;
        }

        public get sprite():GPUSprite.Sprite
        {
            return this._gpuSprite;
        }

        public set sprite(gs:GPUSprite.Sprite)
        {
            this._gpuSprite = gs;
        }
    }
}