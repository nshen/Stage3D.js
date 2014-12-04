///<reference path="reference.ts" />
module stagl
{
    //TODO:cube texture
    export class Texture
    {

        private _glTexture: WebGLTexture;
        private _streamingLevels: number;
        private _width:number;
        private _height:number;
        private _format:string;
        private _forRTT:boolean;

        private static _bindingTexture:WebGLTexture;
        private static __texUnit:number = 0;

        private _textureUnit:number;

        constructor(width:number,height:number,format:string,optimizeForRenderToTexture:boolean,streamingLevels:number)
        {
            this._glTexture = Context3D.GL.createTexture();
            this._streamingLevels = streamingLevels;

            this._textureUnit = Texture.__texUnit ++;

            //rtt needs these properties
            this._width = width;
            this._height = height;
            this._format = format;
            this._forRTT = optimizeForRenderToTexture;

            if(this._forRTT)
            {

                Context3D.GL.bindTexture(Context3D.GL.TEXTURE_2D, this._glTexture);
                Context3D.GL.texParameteri(Context3D.GL.TEXTURE_2D, Context3D.GL.TEXTURE_MAG_FILTER, Context3D.GL.LINEAR);
                Context3D.GL.texParameteri(Context3D.GL.TEXTURE_2D, Context3D.GL.TEXTURE_MIN_FILTER, Context3D.GL.LINEAR_MIPMAP_NEAREST);
               // Context3D.GL.generateMipmap(Context3D.GL.TEXTURE_2D);

                Context3D.GL.texImage2D(Context3D.GL.TEXTURE_2D,
                    0,
                    Context3D.GL.RGBA,
                    512,//this._width,
                    512,//this._height,
                    0,
                    Context3D.GL.RGBA,
                    Context3D.GL.UNSIGNED_BYTE,
                    null);

                if(Texture._bindingTexture)
                    Context3D.GL.bindTexture(Context3D.GL.TEXTURE_2D , Texture._bindingTexture);
                else
                    Context3D.GL.bindTexture(Context3D.GL.TEXTURE_2D, null);

                Context3D.GL.bindRenderbuffer(Context3D.GL.RENDERBUFFER, null);
                Context3D.GL.bindFramebuffer(Context3D.GL.FRAMEBUFFER, null);
            }
        }

        public __getGLTexture():WebGLTexture
        {
            return this._glTexture;
        }

        public get textureUnit():number
        {
            return this._textureUnit;
        }

        public uploadFromBitmapData(source:stagl.BitmapData, miplevel: number): void;
        public uploadFromBitmapData(source:HTMLImageElement, miplevel: number): void;
        public uploadFromBitmapData(source:any, miplevel: number /* uint */ = 0): void
        {
            if(this._forRTT)
                console.error("rtt texture");
            if(source instanceof stagl.BitmapData)
            {
                this.uploadFromImage(<stagl.BitmapData>source.imageData,miplevel);
            }else
            {
                this.uploadFromImage(source, miplevel);
            }
        }

        public uploadFromImage(source: any, miplevel: number /* uint */ = 0): void
        {
            //Context3D.GL.pixelStorei(Context3D.GL.UNPACK_FLIP_Y_WEBGL, 1); //uv原点在左下角，v朝上时时才需翻转
            Context3D.GL.activeTexture(Context3D.GL["TEXTURE"+this.textureUnit]);
            Context3D.GL.bindTexture(Context3D.GL.TEXTURE_2D, this._glTexture);

            Texture._bindingTexture = this._glTexture;

            //TODO: set filter mode API
            //Context3D.GL.texParameteri(Context3D.GL.TEXTURE_2D, Context3D.GL.TEXTURE_MAG_FILTER, Context3D.GL.LINEAR); //this is the default setting
            if (this._streamingLevels == 0)
            {
                Context3D.GL.texParameteri(Context3D.GL.TEXTURE_2D, Context3D.GL.TEXTURE_MIN_FILTER, Context3D.GL.LINEAR);
            } else {
                Context3D.GL.texParameteri(Context3D.GL.TEXTURE_2D, Context3D.GL.TEXTURE_MIN_FILTER, Context3D.GL.LINEAR_MIPMAP_LINEAR); //linnear生成mipmap,缩放也linear
                Context3D.GL.generateMipmap(Context3D.GL.TEXTURE_2D);
            }

            Context3D.GL.texImage2D(Context3D.GL.TEXTURE_2D,
                miplevel,
                Context3D.GL.RGBA,
                Context3D.GL.RGBA,
                Context3D.GL.UNSIGNED_BYTE,
                source);

            if (!Context3D.GL.isTexture(this._glTexture)) {
                throw new Error("Error:Texture is invalid");
            }
            //bind null 会不显示贴图 why?
            //Context3D.GL.bindTexture(Context3D.GL.TEXTURE_2D, null);
        }

        public dispose(): void
        {
            Context3D.GL.bindTexture(Context3D.GL.TEXTURE_2D, null);
            Texture._bindingTexture = null;
            Context3D.GL.deleteTexture(this._glTexture);
            this._glTexture = null;
            this._streamingLevels = 0;
        }
    }
}