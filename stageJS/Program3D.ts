///<reference path="reference.ts"/>

module stageJS
{
    export class Program3D {

        private _glProgram:WebGLProgram;

        private _vShader: WebGLShader;
        private _fShader: WebGLShader;
        private _tokenizer:stageJS.utils.AGALTokenizer;
        private _agalParser:stageJS.utils.AGLSLParser;

        constructor()
        {
            this._glProgram = Context3D.GL.createProgram();
        }
 

        get glProgram(): WebGLProgram
        {
            return this._glProgram;
        }

        public dispose(): void
        {
            if (this._vShader)
            {
                Context3D.GL.detachShader(this._glProgram, this._vShader);
                Context3D.GL.deleteShader(this._vShader);
                this._vShader = null;
            }

            if (this._fShader)
            {
                Context3D.GL.detachShader(this._glProgram, this._fShader);
                Context3D.GL.deleteShader(this._fShader);
                this._fShader = null;
            }
            Context3D.GL.deleteProgram(this._glProgram);
            this._glProgram = null;
        }


        public uploadAGAL(vertexProgram:utils.ByteArray, fragmentProgram:utils.ByteArray):void
        {
            if(!this._tokenizer)
            {
                this._tokenizer = new stageJS.utils.AGALTokenizer();
                this._agalParser = new stageJS.utils.AGLSLParser();
            }
            var v_glsl:string = this._agalParser.parse(this._tokenizer.decribeAGALByteArray(vertexProgram));
            var f_glsl:string = this._agalParser.parse(this._tokenizer.decribeAGALByteArray(fragmentProgram));

            console.log("\n------- vertex shader : -------\n\n" + v_glsl +"\n-------fragment shader: -------\n\n" + f_glsl);
            this._vShader = this.createShader(v_glsl, Context3D.GL.VERTEX_SHADER);
            this._fShader = this.createShader(f_glsl, Context3D.GL.FRAGMENT_SHADER);

            if (!this._fShader || !this._vShader)
                throw new Error("loadShader error");

            Context3D.GL.attachShader(this._glProgram, this._vShader);
            Context3D.GL.attachShader(this._glProgram, this._fShader);
        }

        public upload(vertexProgramId: string = "shader-vs", fragmentProgramId: string = "shader-fs"): void
        {


            this._vShader = this.createShader(this.loadGLSL(vertexProgramId), Context3D.GL.VERTEX_SHADER);
            this._fShader = this.createShader(this.loadGLSL(fragmentProgramId), Context3D.GL.FRAGMENT_SHADER);

            if (!this._fShader || !this._vShader)
                throw new Error("loadShader error");

            Context3D.GL.attachShader(this._glProgram, this._vShader);
            Context3D.GL.attachShader(this._glProgram, this._fShader);

        }

        private createShader(glsl:string , type:number):WebGLShader
        {
            var shader: WebGLShader = Context3D.GL.createShader(type);
            Context3D.GL.shaderSource(shader, glsl);
            Context3D.GL.compileShader(shader);
            // Check the result of compilation
            if (!Context3D.GL.getShaderParameter(shader, Context3D.GL.COMPILE_STATUS))
            {
                throw new Error(Context3D.GL.getShaderInfoLog(shader));
                Context3D.GL.deleteShader(shader);
            }
            return shader;
        }
        /*
         * load glsl shader from html file by document.getElementById
         */
        private loadGLSL(elementId: string): string
        {
            var script: HTMLObjectElement = <HTMLObjectElement>document.getElementById(elementId);
            if (!script)
                throw new Error("cant find elementId: " + elementId);
            return script.innerHTML;
        }


    }
} 