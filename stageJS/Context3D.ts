///<reference path="reference.ts"/>

module stageJS
{
    export class Context3D
    {
        static GL: WebGLRenderingContext; //set by Stage3D
        //todo:enableErrorChecking https://www.khronos.org/webgl/wiki/Debugging

        private _clearBit: number;
        private _bendDisabled:boolean = true;
        private _depthDisabled:boolean = true;
        constructor()
        {
            Context3DBlendFactor.init();
        }

        public configureBackBuffer(width: number/* int */, height: number/* int */, antiAlias: number/* int */, enableDepthAndStencil:boolean = true): void
        {
            Context3D.GL.viewport(0, 0, width, height);
            this._depthDisabled = enableDepthAndStencil;
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
        * @format only support Context3DTextureFormat.BGRA
        * @optimizeForRenderToTexture not implement
        */
        public createTexture(width: number/* int */, height: number/* int */, format: string, optimizeForRenderToTexture: boolean, streamingLevels: number/* int */ = 0): Texture
        {
            return new Texture(width,height,format,optimizeForRenderToTexture,streamingLevels);
        }

        private _rttFramebuffer:WebGLFramebuffer;
        public setRenderToTexture(texture:Texture, enableDepthAndStencil:boolean = false, antiAlias:number = 0, surfaceSelector:number /*int*/ = 0, colorOutputIndex:number/*int*/ = 0):void
        {
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

            //TODO: antiAlias surfaceSelector colorOutputIndex
            if(!this._rttFramebuffer)
            {
                this._rttFramebuffer = Context3D.GL.createFramebuffer();
                Context3D.GL.bindFramebuffer(Context3D.GL.FRAMEBUFFER , this._rttFramebuffer);

                var renderbuffer:WebGLRenderbuffer = Context3D.GL.createRenderbuffer();
                Context3D.GL.bindRenderbuffer(Context3D.GL.RENDERBUFFER , renderbuffer);
                Context3D.GL.renderbufferStorage(Context3D.GL.RENDERBUFFER , Context3D.GL.DEPTH_COMPONENT16 ,512,512); //force 512

                Context3D.GL.framebufferRenderbuffer(Context3D.GL.FRAMEBUFFER, Context3D.GL.DEPTH_ATTACHMENT, Context3D.GL.RENDERBUFFER, renderbuffer);
                Context3D.GL.framebufferTexture2D(Context3D.GL.FRAMEBUFFER, Context3D.GL.COLOR_ATTACHMENT0, Context3D.GL.TEXTURE_2D, texture.__getGLTexture(), 0);
            }
            Context3D.GL.bindFramebuffer(Context3D.GL.FRAMEBUFFER , this._rttFramebuffer);

        }

        public setRenderToBackBuffer():void
        {
            Context3D.GL.bindFramebuffer(Context3D.GL.FRAMEBUFFER, null);
        }

        public createProgram(): Program3D
        {
            return new Program3D();
        }

        /**
        *  @variable must predefined in glsl
        */
        public setVertexBufferAt(variable: string, buffer: VertexBuffer3D, bufferOffset: number/* int */ = 0, format: String = "float4"): void
        {

            var size:number = 0;
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

            if(size <= 0 ) throw new Error("vertexBuffer format error");

            //We need glProgram to enable vertex attribute , so we cache it , when setProgram() be callled  we enable them all.
            this._vaCache[variable] = { size:size,
                                        buffer:buffer.glBuffer,
                                        stride:buffer.data32PerVertex * 4,
                                        offset:bufferOffset * 4}; //* 4 bytes per value(Float32Array.BYTES_PER_ELEMENT)
            //http://blog.tojicode.com/2011/05/interleaved-array-basics.html

            if(this._linkedProgram)
                this.enableVA(variable);

        }

        /**
        *  @variable must predefined in glsl
        */
        public setProgramConstantsFromVector(variable: string, data: number[] /* Vector.<Number> */): void
        {
            if (data.length > 4) throw new Error("data length > 4");

            this._vcCache[variable] = data;
            if(this._linkedProgram)
                this.enableVC(variable);
        }

        /**
        *  @variable must predefined in glsl
        */
        public setProgramConstantsFromMatrix(variable: string, matrix:geom.Matrix3D, transposedMatrix: boolean = false): void
        {
            if(transposedMatrix)
                matrix.transpose();

            this._vcMCache[variable] = matrix.rawData;
            if(this._linkedProgram)
                this.enableVCM(variable);
        }

        public setTextureAt(sampler: string, texture: Texture): void
        {
            this._texCache[sampler] = texture;

            if (this._linkedProgram )
                this.enableTex(sampler);

        }


        private _linkedProgram: Program3D = null;
        public setProgram(program: Program3D): void
        {
            if(program == null ||  program == this._linkedProgram)
                return;

            this._linkedProgram = program;

            Context3D.GL.linkProgram(program.glProgram);

            if (!Context3D.GL.getProgramParameter(program.glProgram, Context3D.GL.LINK_STATUS))
            {
                throw new Error(Context3D.GL.getProgramInfoLog(program.glProgram));
                program.dispose();
            }
            Context3D.GL.useProgram(program.glProgram);

            var k:string;
            for (k in this._vaCache)
                this.enableVA(k);

            for(k in this._vcCache)
                this.enableVC(k);

            for(k in this._vcMCache)
                this.enableVCM(k);

            for(k in this._texCache)
                this.enableTex(k);

        }

        public clear(red: number = 0.0, green: number = 0.0, blue: number = 0.0, alpha: number = 1.0, depth: number = 1.0, stencil: number/*uint*/ = 0, mask: number /* uint */ = 0xffffffff): void
        {
             
            Context3D.GL.clearColor(red, green, blue, alpha); 
            Context3D.GL.clearDepth(depth);// TODO:dont need to call this every time
            Context3D.GL.clearStencil(stencil);//stencil buffer

            Context3D.GL.clear(this._clearBit);
        }

        public setCulling(triangleFaceToCull: string): void
        {
            Context3D.GL.frontFace(Context3D.GL.CW);
            switch (triangleFaceToCull) {
                case Context3DTriangleFace.NONE:
                    Context3D.GL.disable(Context3D.GL.CULL_FACE);
                    break;
                case Context3DTriangleFace.BACK:
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
            if(this._depthDisabled)
            {
                Context3D.GL.enable(Context3D.GL.DEPTH_TEST);
                this._bendDisabled = false;
            }

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
            if(this._bendDisabled)
            {
                Context3D.GL.enable(Context3D.GL.BLEND); //stage3d cant disable blend?
                this._bendDisabled = false;
            }
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

        private _vaCache:{} = {};
        private enableVA(keyInCache:string):void
        {
            var location:number = Context3D.GL.getAttribLocation(this._linkedProgram.glProgram, keyInCache);
            if (location < 0){
                throw new Error("Fail to get the storage location of" + keyInCache);}
            var va:{size:number;buffer:WebGLBuffer;stride:number;offset:number} = this._vaCache[keyInCache];

            Context3D.GL.bindBuffer(Context3D.GL.ARRAY_BUFFER, va.buffer);// Bind the buffer object to a target
            Context3D.GL.vertexAttribPointer(location, va.size, Context3D.GL.FLOAT, false, va.stride, va.offset);
            Context3D.GL.enableVertexAttribArray(location);
            // Context3D.GL.bindBuffer(Context3D.GL.ARRAY_BUFFER, null);
        }


        private _vcCache:{} = {}; // {variable:array}
        private enableVC(keyInCache:string):void
        {
            var index: WebGLUniformLocation = Context3D.GL.getUniformLocation(this._linkedProgram.glProgram, keyInCache);
            if (!index)
                throw new Error("Fail to get uniform " + keyInCache);

            var vc:number[] = this._vcCache[keyInCache];
            Context3D.GL["uniform" + vc.length + "fv"](index, vc);
        }

        private _vcMCache:{} = {};
        private enableVCM(keyInCache:string):void
        {
            var index: WebGLUniformLocation = Context3D.GL.getUniformLocation(this._linkedProgram.glProgram, keyInCache);
            if(!index)
                throw new Error("Fail to get uniform " + keyInCache);

            Context3D.GL.uniformMatrix4fv(index, false, this._vcMCache[keyInCache]); // bug:the second parameter must be false
        }

        private _texCache:{} = {};//{sampler:Texture}
        private enableTex(keyInCache):void
        {
            var tex:Texture = this._texCache[keyInCache];
            Context3D.GL.activeTexture(Context3D.GL["TEXTURE"+tex.textureUnit]);
            var l: WebGLUniformLocation = Context3D.GL.getUniformLocation(this._linkedProgram.glProgram, keyInCache);
            Context3D.GL.uniform1i(l, tex.textureUnit); // TODO:multiple textures
        }
    }
}