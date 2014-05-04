///<reference path="_definitions.ts"/>

module stagl
{
    export class Context3D
    {
        static GL: WebGLRenderingContext; //set by Stage3D
        //enableErrorChecking

        private _clearBit: number;

        constructor()
        {
            Context3D.GL.enable(Context3D.GL.BLEND); //stage3d cant disable blend?
            Context3DBlendFactor.init();
        }

        public configureBackBuffer(width: number/* int */, height: number/* int */, antiAlias: number/* int */, enableDepthAndStencil:boolean = true): void
        {
            Context3D.GL.viewport(0, 0, width, height);

          
            //TODO: antiAlias , Stencil
            if (enableDepthAndStencil)
            {
                this._clearBit = Context3D.GL.COLOR_BUFFER_BIT | Context3D.GL.DEPTH_BUFFER_BIT | Context3D.GL.STENCIL_BUFFER_BIT;
                Context3D.GL.enable(Context3D.GL.DEPTH_TEST);
                Context3D.GL.enable(Context3D.GL.STENCIL_TEST);
            } else {
                this._clearBit = Context3D.GL.COLOR_BUFFER_BIT;
                Context3D.GL.disable(Context3D.GL.DEPTH_TEST);
                Context3D.GL.disable(Context3D.GL.STENCIL_TEST);
            }
    
        }

        public createVertexBuffer(numVertices: number /* int */, data32PerVertex: number /* int */): VertexBuffer3D
        {
            return new VertexBuffer3D(numVertices, data32PerVertex);
        }

        public createIndexBuffer(numIndices: number /* int */): IndexBuffer3D
        {
            return new IndexBuffer3D(numIndices);
        }

        /**
        * @width and @height are not need.
        * @format only support rgba
        * @optimizeForRenderToTexture not implement
        */
        public createTexture(streamingLevels: number/* int */ = 0): Texture
        {
            // public createTexture(width: number/* int */, height: number/* int */, format: string, optimizeForRenderToTexture: bool, streamingLevels: number/* int */ = 0): Texture
            return new Texture(streamingLevels);
        }

        public createProgram(): Program3D
        {
            return new Program3D();
        }

        /**
        * private  setVertexBufferAt
        */
        private _attributesToEnable:any[][] = new Array();
        /**
        *  @variable must predefined in glsl
        */
        public setVertexBufferAt(variable: string, buffer: VertexBuffer3D, bufferOffset: number/* int */ = 0, format: String = "float4"): void
        {

            //��setProgram֮ǰ���õ�setVertexBufferAt ������setProgramʱһ��set
            if (this._linkedProgram == null)
            {
                this._attributesToEnable.push([variable, buffer, bufferOffset, format]);
                return;
            }


            var location: number = Context3D.GL.getAttribLocation(this._linkedProgram.glProgram, variable);

            if (location < 0)
            {
                throw new Error("Fail to get the storage location of" + variable);             
                return;   
            }

            var size: number;
            switch (format)
            {
                case Context3DVertexBufferFormat.FLOAT_4:
                    size = 4;
                    break;
                case Context3DVertexBufferFormat.FLOAT_3:
                    size = 3;
                    break;
                case Context3DVertexBufferFormat.FLOAT_2:
                    size = 2;
                    break;
                case Context3DVertexBufferFormat.FLOAT_1:
                    size = 1;
                    break;
                case Context3DVertexBufferFormat.BYTES_4:
                    size = 4;
                    break;
            }

          
            Context3D.GL.bindBuffer(Context3D.GL.ARRAY_BUFFER, buffer.glBuffer);// Bind the buffer object to a target

            //http://blog.tojicode.com/2011/05/interleaved-array-basics.html
            Context3D.GL.vertexAttribPointer(location, size, Context3D.GL.FLOAT, false, (buffer.data32PerVertex * 4), (bufferOffset * 4));  //  * 4 bytes per value
            Context3D.GL.enableVertexAttribArray(location);
           // Context3D.GL.bindBuffer(Context3D.GL.ARRAY_BUFFER, null);
        }


        private _constantsToEnable: any[][] = new Array();
        /**
        *  @variable must predefined in glsl
        */
        public setProgramConstantsFromVector(variable: string, data: number[] /* Vector.<Number> */): void
        {
            if (data.length > 4) throw new Error("data length > 4");

            if (this._linkedProgram == null) {
                this._constantsToEnable.push([variable, data]);
                return;
            }
            var index: WebGLUniformLocation = Context3D.GL.getUniformLocation(this._linkedProgram.glProgram, variable);

            if (index == null) {
                throw new Error("Fail to get uniform " + variable);
                return;
            }

            Context3D.GL["uniform" + data.length + "fv"](index, data);
            /*
            switch (data.length)
            {
                case 1:
                    Context3D.GL.uniform1fv(index, data);
                    break;
                case 2:
                    Context3D.GL.uniform2fv(index, data);
                    break;
                case 3:
                    Context3D.GL.uniform3fv(index, data);
                    break;
                case 4:
                    Context3D.GL.uniform4fv(index, data);
            }
           */
        }


        //programType: String, firstRegister: int, matrix: Matrix3D, transposedMatrix: Boolean = false): void
        /**
        *  @variable must predefined in glsl
        */
        public setProgramConstantsFromMatrix(variable: string, matrix:geom.Matrix3D, transposedMatrix: boolean = false): void
        {
            if (this._linkedProgram == null)
            {
                this._constantsToEnable.push([variable, matrix, transposedMatrix]);
                return;
            }

            var index: WebGLUniformLocation = Context3D.GL.getUniformLocation(this._linkedProgram.glProgram, variable);
            if (transposedMatrix)
                matrix.transpose();

            Context3D.GL.uniformMatrix4fv(index, false, matrix.rawData); // bug:��2��������Ϊtrue
        }

        public setTextureAt(sampler: string, texture: Texture): void
        {
            if (this._linkedProgram == null) {
                console.log("err")
            }
            //Context3D.GL.activeTexture(Context3D.GL.TEXTURE0);
            var l: WebGLUniformLocation = Context3D.GL.getUniformLocation(this._linkedProgram.glProgram, sampler);
            Context3D.GL.uniform1i(l, 0); // TODO:���texture
        }



        private _linkedProgram: Program3D;
        public setProgram(program: Program3D): void
        {
            Context3D.GL.linkProgram(program.glProgram);

            if (!Context3D.GL.getProgramParameter(program.glProgram, Context3D.GL.LINK_STATUS))
            {
                program.dispose();
                throw new Error("Unable to initialize the shader program.");
            }

            Context3D.GL.useProgram(program.glProgram);
            this._linkedProgram = program;
            
            //��setProgram֮ǰ�Ѿ�setVertexBufferAt��buffer����
            var arr: any[];
            while (this._attributesToEnable.length > 0)
            {
                arr = this._attributesToEnable.pop();
                this.setVertexBufferAt(arr[0], arr[1], arr[2], arr[3]);
            }
            while (this._constantsToEnable.length > 0)
            {
                arr = this._constantsToEnable.pop();
                if (arr.length == 2 || arr[1].length == 4) {
                    this.setProgramConstantsFromVector(arr[0], arr[1]);
                } else {
                    this.setProgramConstantsFromMatrix(arr[0], arr[1], arr[2]);
                }

            }

        }

        public clear(red: number = 0.0, green: number = 0.0, blue: number = 0.0, alpha: number = 1.0, depth: number = 1.0, stencil: number/*uint*/ = 0, mask: number /* uint */ = 0xffffffff): void
        {
             
            Context3D.GL.clearColor(red, green, blue, alpha); 
            Context3D.GL.clearDepth(depth);// TODO:dont need to call this every time
            Context3D.GL.clearStencil(stencil);//stencil buffer ����

            Context3D.GL.clear(this._clearBit);
        }


        public setCulling(triangleFaceToCull: string): void
        {
            Context3D.GL.frontFace(Context3D.GL.CW);//˳ʱ��Ϊ����
            switch (triangleFaceToCull) {
                case Context3DTriangleFace.NONE:
                    Context3D.GL.disable(Context3D.GL.CULL_FACE);
                    break;
                case Context3DTriangleFace.BACK: //�ü����棬Ҳ������ʱ�벻��ʾ
                    Context3D.GL.enable(Context3D.GL.CULL_FACE)
                    Context3D.GL.cullFace(Context3D.GL.BACK);
                    break;
                case Context3DTriangleFace.FRONT:
                    Context3D.GL.enable(Context3D.GL.CULL_FACE)
                    Context3D.GL.cullFace(Context3D.GL.FRONT);
                    break;
                case Context3DTriangleFace.FRONT_AND_BACK:
                    Context3D.GL.enable(Context3D.GL.CULL_FACE)
                    Context3D.GL.cullFace(Context3D.GL.FRONT_AND_BACK);
                    break;
            }
        }


        public setDepthTest(depthMask: boolean, passCompareMode: string): void
        {
            // Context3D.GL.enable(Context3D.GL.DEPTH_TEST); need this ?
            Context3D.GL.depthMask(depthMask);

            switch (passCompareMode) {
                case Context3DCompareMode.LESS:
                    Context3D.GL.depthFunc(Context3D.GL.LESS); //default
                    break;
                case Context3DCompareMode.NEVER:
                    Context3D.GL.depthFunc(Context3D.GL.NEVER);
                    break;
                case Context3DCompareMode.EQUAL:
                    Context3D.GL.depthFunc(Context3D.GL.EQUAL);
                    break;
                case Context3DCompareMode.GREATER:
                    Context3D.GL.depthFunc(Context3D.GL.GREATER);
                    break;
                case Context3DCompareMode.NOT_EQUAL:
                    Context3D.GL.depthFunc(Context3D.GL.NOTEQUAL);
                    break;
                case Context3DCompareMode.ALWAYS:
                    Context3D.GL.depthFunc(Context3D.GL.ALWAYS);
                    break;
                case Context3DCompareMode.LESS_EQUAL:
                    Context3D.GL.depthFunc(Context3D.GL.LEQUAL);
                    break;
                case Context3DCompareMode.GREATER_EQUAL:
                    Context3D.GL.depthFunc(Context3D.GL.GEQUAL);
                    break;
            }
        }

        public setBlendFactors(sourceFactor: number, destinationFactor: number): void
        {
            Context3D.GL.blendFunc(sourceFactor, destinationFactor);
        }


        public drawTriangles(indexBuffer: IndexBuffer3D, firstIndex: number /* int */ = 0, numTriangles: number/* int */ = -1): void
        {
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.TRIANGLES, numTriangles < 0 ? indexBuffer.numIndices : numTriangles * 3, Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        }

        /*
         *  [Webgl only]
         *   For instance indices = [1,3,0,4,1,2]; will draw 3 lines :
         *   from vertex number 1 to vertex number 3, from vertex number 0 to vertex number 4, from vertex number 1 to vertex number 2
         */
        public drawLines(indexBuffer: IndexBuffer3D, firstIndex: number /* int */ = 0, numLines: number/* int */ = -1): void
        {
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.LINES, numLines < 0 ? indexBuffer.numIndices : numLines * 2, Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        }

        /*
         * [Webgl only]
         *  For instance indices = [1,2,3] ; will only render vertices number 1, number 2, and number 3 
         */
        public drawPoints(indexBuffer: IndexBuffer3D, firstIndex: number /* int */ = 0, numPoints: number/* int */ = -1): void
        {
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.POINTS, numPoints < 0 ? indexBuffer.numIndices : numPoints , Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        }

        /**
         * [Webgl only]
         * draws a closed loop connecting the vertices defined in the indexBuffer to the next one
         */
        public drawLineLoop(indexBuffer: IndexBuffer3D, firstIndex: number /* int */ = 0, numPoints: number/* int */ = -1): void
        {
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.LINE_LOOP, numPoints < 0 ? indexBuffer.numIndices : numPoints, Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        }

        /**
         * [Webgl only]
         * It is similar to drawLineLoop(). The difference here is that WebGL does not connect the last vertex to the first one (not a closed loop).
         */
        public drawLineStrip(indexBuffer: IndexBuffer3D, firstIndex: number /* int */ = 0, numPoints: number/* int */ = -1): void
        {
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.LINE_STRIP, numPoints < 0 ? indexBuffer.numIndices : numPoints, Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        }

        /**
        * [Webgl only]
        *  indices = [0, 1, 2, 3, 4];, then we will generate the triangles:(0, 1, 2), (1, 2, 3), and(2, 3, 4).
        */
        public drawTriangleStrip(indexBuffer:IndexBuffer3D):void
        {
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.TRIANGLE_STRIP, indexBuffer.numIndices, Context3D.GL.UNSIGNED_SHORT, 0);
        }

        /**
         * [Webgl only]
         * creates triangles in a similar way to drawTriangleStrip(). 
         * However, the first vertex defined in the indexBuffer is taken as the origin of the fan(the only shared vertex among consecutive triangles).
         * In our example, indices = [0, 1, 2, 3, 4]; will create the triangles: (0, 1, 2) and(0, 3, 4).
         */
        public drawTriangleFan(indexBuffer:IndexBuffer3D): void
        {
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.TRIANGLE_FAN, indexBuffer.numIndices, Context3D.GL.UNSIGNED_SHORT, 0);
        }

        /**
        *   In webgl we dont need to call present , browser will do this for us.
        */
        public present(): void
        {

        }

    }
}