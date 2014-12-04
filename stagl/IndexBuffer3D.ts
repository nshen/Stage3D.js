///<reference path="reference.ts" />
module stagl
{
    export class IndexBuffer3D
    {
        public numIndices: number;
       // public buffer: WebGLBuffer;
        private _data: number[];
        private _glBuffer: WebGLBuffer;

        constructor(numIndices: number /* int */)
        {
            this.numIndices = numIndices;
            this._glBuffer = Context3D.GL.createBuffer();
            //Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, this._glBuffer);
        }

        get glBuffer(): WebGLBuffer
        {
            return this._glBuffer;
        }

        public uploadFromVector(data: number[] /* Vector.<uint> */, startOffset: number /* int */, count: number /* int */): void
        {

            this._data = data;


            if (startOffset != 0 || count != this.numIndices) {
                data = data.slice(startOffset, startOffset + count);
            }
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, this._glBuffer);
            Context3D.GL.bufferData(Context3D.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), Context3D.GL.STATIC_DRAW);
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, null);
        }

        public dispose(): void
        {
            Context3D.GL.deleteBuffer(this._glBuffer);
            this._glBuffer = null;
            this.numIndices = 0;
            this._data.length = 0;
        }
        //        public uploadFromArray(data: number[] /* Vector.<uint> */, startOffset: number /* int */, count: number /* int */): void
        //      {
        //        this.uploadFromVector
        //  }
    }
}