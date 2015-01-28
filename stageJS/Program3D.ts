///<reference path="reference.ts"/>

module stageJS
{
    export class Program3D {

        private _glProgram:WebGLProgram;

        private _vShader: WebGLShader;
        private _fShader: WebGLShader;

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


        public upload(vertexProgramId: string = "shader-vs", fragmentProgramId: string = "shader-fs"): void
        {
            this._vShader = this.loadShader(vertexProgramId, Context3D.GL.VERTEX_SHADER);
            this._fShader = this.loadShader(fragmentProgramId, Context3D.GL.FRAGMENT_SHADER);

            if (!this._fShader || !this._vShader)
                throw new Error("loadShader error");

            Context3D.GL.attachShader(this._glProgram, this._vShader);
            Context3D.GL.attachShader(this._glProgram, this._fShader);

            Context3D.GL.linkProgram(this._glProgram);

            if (!Context3D.GL.getProgramParameter(this._glProgram, Context3D.GL.LINK_STATUS))
            {
                throw new Error(Context3D.GL.getProgramInfoLog(this._glProgram));
                this.dispose();
            }

        }

        /*
         * load shader from html file by document.getElementById
         */
        private loadShader(elementId: string, type: number): WebGLShader {
            var script: HTMLObjectElement = <HTMLObjectElement>document.getElementById(elementId);
            if (!script)
                throw new Error("cant find elementId: " + elementId);
            var shader: WebGLShader = Context3D.GL.createShader(type);
            Context3D.GL.shaderSource(shader, script.innerHTML);
            Context3D.GL.compileShader(shader);
            // Check the result of compilation
            if (!Context3D.GL.getShaderParameter(shader, Context3D.GL.COMPILE_STATUS))
            {
                throw new Error(Context3D.GL.getShaderInfoLog(shader));
                Context3D.GL.deleteShader(shader);
            }
            return shader;
        }

        /**
        *   delete .......
        */
//        public getShader2(elementId: string): WebGLShader {
//            var script: HTMLObjectElement = <HTMLObjectElement>document.getElementById(elementId);
//            if (!script)
//                return null;
//
//            var str = "";
//            var k = script.firstChild;
//            while (k) {
//                if (k.nodeType == 3) {
//                    str += k.textContent;
//                }
//                k = k.nextSibling;
//            }
//
//            var shader: WebGLShader;
//            if (script.type == "x-shader/x-fragment") {
//                shader = Context3D.GL.createShader(Context3D.GL.FRAGMENT_SHADER);
//            } else if (script.type == "x-shader/x-vertex") {
//                shader = Context3D.GL.createShader(Context3D.GL.VERTEX_SHADER);
//            } else {
//                return null;
//            }
//            Context3D.GL.shaderSource(shader, str);
//            Context3D.GL.compileShader(shader);
//
//            if (!Context3D.GL.getShaderParameter(shader, Context3D.GL.COMPILE_STATUS)) {
//                console.log("error getShader() :" + Context3D.GL.getShaderInfoLog(shader));
//                return null;
//            }
//            return shader;
//        }

    }
} 