///<reference path="_definitions.ts"/>
module stagl
{
    export var VERSION: number = 0.001; // :(

    export class Stage3D extends stagl.events.EventDispatcher
    {

        private _context3D: Context3D = null;
        private _canvas: HTMLCanvasElement;
        private _stageWidth: number = 0;
        private _stageHeight: number = 0;
 
        constructor(canvas:HTMLCanvasElement)
        {
            super();
            this._canvas = canvas;
            this._stageWidth = canvas.width;
            this._stageHeight = canvas.height;
        }

        /**
         * [read-only] The Context3D object associated with this Stage3D instance.
         */
        public get context3D(): Context3D
        {
            return this._context3D;
        }

        public get stageWidth(): number
        {
            return this._stageWidth;
        }

        public get stageHeight(): number
        {
            return this._stageHeight;
        }

        public requestContext3D():void
        {
            if (!this._canvas)
                return;

            if (this._context3D != null)
                return this.onCreateSuccess();
           

            if (this._canvas.addEventListener)
                this._canvas.addEventListener("webglcontextcreationerror", this.onCreationError, false);
            
            var names: string[] = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            Context3D.GL = null;
            for (var i = 0; i < names.length; i++)
            {
                try {

                    Context3D.GL = <WebGLRenderingContext> this._canvas.getContext(names[i]);
                } catch (e) { }

                if (Context3D.GL) break;
            }

            if (Context3D.GL == null)
                return this.onCreationError(null);


            this._context3D = new stagl.Context3D();
            return this.onCreateSuccess();
        }


        private onCreationError(e: Event = null): void
        {
            if (e != null)
            {
                if (this._canvas.removeEventListener)
                    this._canvas.removeEventListener("webglcontextcreationerror", this.onCreationError, false);  
            }
        
            this.dispatchEvent(new stagl.events.ErrorEvent()); //TODO: error message
        }

        private onCreateSuccess(): void
        {
            var e: stagl.events.Event = new stagl.events.Event(stagl.events.Event.CONTEXT3D_CREATE);
            e.target = this;
            this.dispatchEvent(e);
        }

    }

} 