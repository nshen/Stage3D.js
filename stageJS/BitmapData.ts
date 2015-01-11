///<reference path="reference.ts"/>
module stageJS
{
    export class BitmapData
    {

        public transparent:boolean;

        private _rect:{x:number;y:number;width:number;height:number};
        private _transparent;
        private _canvas:HTMLCanvasElement;
        private _context:CanvasRenderingContext2D;
        //private _imageData:ImageData;

        public constructor(width:number, height:number, transparent:boolean = true, fillColor:number = 0xFFFFFFFF)
        {
            this._transparent = transparent;
            this._canvas = <HTMLCanvasElement> document.createElement("canvas");
            this._canvas.width = width;
            this._canvas.height = height;
            this._context = this._canvas.getContext("2d");
            this._rect = {x:0,y:0,width:width,height:height};

            if(!transparent)
                this.fillRect(this._rect,fillColor);
        }

        public static fromImageElement(img:HTMLImageElement):stageJS.BitmapData
        {
            var bmd:stageJS.BitmapData = new BitmapData(img.width,img.height);
            bmd._context.drawImage(<HTMLElement>img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
            return bmd;
        }

        public get width():number
        {
            return this._canvas.width;
        }
        public get height():number
        {
            return this._canvas.height;
        }

        public get canvas():HTMLCanvasElement
        {
            return this._canvas;
        }

        public get imageData():ImageData
        {
            return this._context.getImageData(0,0,this._canvas.width,this._canvas.height);
        }

        public get rect():{x:number;y:number;width:number;height:number}
        {
            return this._rect;
        }

        public copyPixels(sourceBitmapData:BitmapData, sourceRect:{x:number;y:number;width:number;height:number}, destPoint:{x:number;y:number}):void;
        public copyPixels(sourceBitmapData:HTMLImageElement, sourceRect:{x:number;y:number;width:number;height:number}, destPoint:{x:number;y:number}):void;
        public copyPixels(sourceBitmapData:any, sourceRect:{x:number;y:number;width:number;height:number}, destPoint:{x:number;y:number}):void
        {
            if(sourceBitmapData instanceof BitmapData)
                this._context.drawImage(sourceBitmapData.canvas, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destPoint.x, destPoint.y, sourceRect.width, sourceRect.height);
            else
            {
                this._context.drawImage(<HTMLElement>sourceBitmapData, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destPoint.x, destPoint.y, sourceRect.width, sourceRect.height);
            }
        }
        public draw(source:BitmapData /*,matrix:Matrix = null*/):void;
        public draw(source:HTMLImageElement /*,matrix:Matrix = null*/):void;
        public draw(source:any /*,matrix:Matrix = null*/):void //todo:draw matrix
        {
            if(source instanceof  BitmapData)
             this._context.drawImage(source.canvas, 0, 0);
            else
             this._context.drawImage(source,0,0);
        }

        public fillRect(rect:{x:number;y:number;width:number;height:number}, color:number):void
        {
             this._context.fillStyle = this.hexToRGBACSS(color);
             this._context.fillRect(rect.x, rect.y, rect.width, rect.height);
        }


        /**
         * convert decimal value to Hex
         */
        private hexToRGBACSS(d:number):string
        {
            var r:number = (d & 0x00ff0000) >>> 16;
            var g:number = (d & 0x0000ff00) >>> 8;
            var b:number = d &  0x000000ff;

            if(this._transparent)
                var a:number = ((d & 0xff000000) >>> 24)/255 ;
            else
                var a:number = 1;

            return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; //"rgba(0, 0, 200, 0.5)";
        }
    }
}