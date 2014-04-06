///<reference path="_definitions.ts"/>
module stagl
{
    export class VertexBuffer3D
    {
        private _numVertices: number; // int
        private _data32PerVertex: number; //int
        private _glBuffer: WebGLBuffer;

        private _data: number[];

        constructor(numVertices: number, data32PerVertex: number)
        {

            this._numVertices = numVertices;
            this._data32PerVertex = data32PerVertex;

            this._glBuffer = Context3D.GL.createBuffer();
            if (!this._glBuffer)
                throw new Error("Failed to create buffer");

           // Context3D.GL.bindBuffer(Context3D.GL.ARRAY_BUFFER, this._glBuffer);

        }

        get glBuffer(): WebGLBuffer
        {
            return this._glBuffer;
        }

        get data32PerVertex(): number
        {
            return this._data32PerVertex
        }

        public uploadFromVector(data: number[], startVertex: number/* int */, numVertices: number/* int */): void
        {
            this._data = data;

            if (startVertex != 0 || numVertices != this._numVertices) {
                data = data.slice(startVertex * this._data32PerVertex, (numVertices * this._data32PerVertex));
            }

            Context3D.GL.bindBuffer(Context3D.GL.ARRAY_BUFFER, this._glBuffer);
            Context3D.GL.bufferData(Context3D.GL.ARRAY_BUFFER, new Float32Array(data), Context3D.GL.STATIC_DRAW);
            Context3D.GL.bindBuffer(Context3D.GL.ARRAY_BUFFER, null);
        }

        public dispose(): void
        {
            Context3D.GL.deleteBuffer(this._glBuffer);
            this._glBuffer = null;
            this._data.length = 0;
            this._numVertices = 0;
            this._data32PerVertex = 0;
        }
    } 

}

