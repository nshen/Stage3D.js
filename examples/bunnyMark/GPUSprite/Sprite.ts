///<reference path="../_definitions.ts"/>
module GPUSprite
{
    export class Sprite
    {
        public _parent : GPUSpriteRenderLayer; //internal
        public _spriteId : number;//internal
        public _childId : number;//internal

        private _pos : {x:number;y:number};
        private _visible : boolean;
        private _scaleX : number;
        private _scaleY : number;
        private _rotation : number;
        private _alpha : number;


        public get visible() : boolean
        {
            return this._visible;
        }

        public set visible(isVisible:boolean)
        {
            this._visible = isVisible;
        }

        public get alpha():number
        {
            return this._alpha;
        }

        public set alpha(a:number)
        {
            this._alpha = a;
        }

        public get position() : {x:number;y:number}
        {
            return this._pos;
        }

        public set position(pt:{x:number;y:number})
        {
            this._pos = pt;
        }

        public get scaleX() : number
        {
            return this._scaleX;
        }

        public set scaleX(val:number)
        {
            this._scaleX = val;
        }

        public get scaleY() : number
        {
            return this._scaleY;
        }

        public set scaleY(val:number)
        {
            this._scaleY = val;
        }

        public get rotation() : number
        {
            return this._rotation;
        }

        public set rotation(val:number)
        {
            this._rotation = val;
        }

        public get rect() : {x:number;y:number;width:number;height:number;}
        {
            return this._parent._spriteSheet.getRect(this._spriteId);
        }

        public get parent() : GPUSpriteRenderLayer
        {
            return this._parent;
        }

        public get spriteId() : number
        {
            return this._spriteId;
        }

        public get childId() : number
        {
            return this._childId;
        }

        // GPUSprites are typically constructed by calling GPUSpriteRenderLayer.createChild()
        public constructor()
        {
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
    }
}