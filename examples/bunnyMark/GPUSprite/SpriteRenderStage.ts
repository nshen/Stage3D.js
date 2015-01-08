///<reference path="../_definitions.ts"/>
module GPUSprite
{
    export class SpriteRenderStage
    {

        private _stage3D:stageJS.Stage3D;
        private _context3D:stageJS.Context3D;
        private _rect:{x:number;y:number;width:number;height:number;};
        private _layers:SpriteRenderLayer[];
        private _modelViewMatrix:stageJS.geom.Matrix3D;


        public get position():{x:number;y:number;width:number;height:number;}
        {
            return this._rect;
        }

        public set position(rect:{x:number;y:number;width:number;height:number;})
        {
            this._rect = rect;
          //  this._stage3D.x = rect.x;
          //  this._stage3D.y = rect.y;
            this.configureBackBuffer(rect.width,rect.height);

            this._modelViewMatrix = new stageJS.geom.Matrix3D();
            this._modelViewMatrix.appendTranslation( -rect.width/2, -rect.height/2,0);
            this._modelViewMatrix.appendScale(2.0/rect.width , -2.0/rect.height,1); //y轴向下
            //this._orth.orthoLH(480,-400,1,1000);

        }

        //private _orth:stageJS.geom.PerspectiveMatrix3D = new stageJS.geom.PerspectiveMatrix3D();
        public get modelViewMatrix():stageJS.geom.Matrix3D
        {
           // return this._orth;
            return this._modelViewMatrix;
        }

        public constructor(stage3D:stageJS.Stage3D , context3D:stageJS.Context3D , rect:{x:number;y:number;width:number;height:number;})
        {
            this._stage3D = stage3D;
            this._context3D = context3D;
            this._layers = [];
            this.position = rect;
        }

        public addLayer(layer:SpriteRenderLayer):void
        {
            layer.parent = this;
            this._layers.push(layer);
        }

        public removeLayer(layer:SpriteRenderLayer):void
        {
            for(var i:number = 0; i < this._layers.length; i++)
            {
                if(this._layers[i] == layer)
                {
                    layer.parent = null;
                    this._layers.splice(i,1);
                }
            }
        }

        public draw():void
        {
            this._context3D.clear(1.0,1.0,1.0);
            for(var i:number = 0; i < this._layers.length; i++)
            {
                this._layers[i].draw();
            }
            this._context3D.present();
        }

        public drawDeferred():void
        {
            for(var i:number = 0; i < this._layers.length; i++)
            {
                this._layers[i].draw();
            }
        }

        public configureBackBuffer(width:number,height:number):void
        {
            this._context3D.configureBackBuffer(width,height,0,false);

        }

    }

}