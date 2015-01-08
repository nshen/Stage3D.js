///<reference path="../_definitions.ts"/>
module GPUSprite
{
    export class SpriteRenderLayer
    {

        public _spriteSheet:SpriteSheet;
        private _vertexData:number[];
        private _indexData:number[];
        private _uvData:number[];

        private _context3D:stageJS.Context3D;
        private _parent:SpriteRenderStage;
        private _children:GPUSprite.Sprite[];

        private _indexBuffer:stageJS.IndexBuffer3D;
        private _vertexBuffer:stageJS.VertexBuffer3D;
        private _uvBuffer:stageJS.VertexBuffer3D;
        private _shaderProgram:stageJS.Program3D;
        private _updateVBOs:boolean;

        public constructor(context3D:stageJS.Context3D , spriteSheet:SpriteSheet)
        {
            this._context3D = context3D;
            this._spriteSheet = spriteSheet;

            this._vertexData = [];
            this._indexData = [];
            this._uvData = [];

            this._children = [];
            this._updateVBOs = true;

            this.setupShaders();
            this.updateTexture();
        }


        public get parent() : SpriteRenderStage
        {
            return this._parent;
        }

        public set parent(parentStage:SpriteRenderStage)
        {
            this._parent = parentStage;
        }

        public get numChildren():number
        {
            return this._children.length;
        }

        public createChild(spriteId:number):GPUSprite.Sprite
        {
            var sprite:GPUSprite.Sprite = new GPUSprite.Sprite();
            this.addChild(sprite,spriteId);
            return sprite;
        }

        public addChild(sprite:GPUSprite.Sprite , spriteId:number):void
        {
            sprite._parent = this;
            sprite._spriteId = spriteId;

            //add to list of children
            sprite._childId = this._children.length;
            this._children.push(sprite);

            //add vertex data required to draw child
            var childVertexFirstIndex:number = (sprite._childId * 12) / 3;
            this._vertexData.push(0, 0, 1, 0, 0,1, 0, 0,1, 0, 0,1); // placeholders
            this._indexData.push(childVertexFirstIndex,childVertexFirstIndex+1,childVertexFirstIndex+2,childVertexFirstIndex,childVertexFirstIndex+2,childVertexFirstIndex+3);

            var childUVCoords:number[] = this._spriteSheet.getUVCoords(spriteId);
            this._uvData.push(
                childUVCoords[0], childUVCoords[1],
                childUVCoords[2], childUVCoords[3],
                childUVCoords[4], childUVCoords[5],
                childUVCoords[6], childUVCoords[7]);

            this._updateVBOs = true;
        }

        public removeChild(child:GPUSprite.Sprite):void
        {
            var childId:number = child._childId;
            if((child._parent == this) && childId < this._children.length)
            {
                child._parent = null;
                this._children.splice(childId,1);

                // Update child id (index into array of children) for remaining children
                var idx:number;
                for ( idx = childId; idx < this._children.length; idx++ ) {
                    this._children[idx]._childId = idx;
                }

                // Realign vertex data with updated list of children
                var vertexIdx:number = childId * 12;
                var indexIdx:number= childId * 6;
                this._vertexData.splice(vertexIdx, 12);
                this._indexData.splice(indexIdx, 6);
                this._uvData.splice(vertexIdx, 8);

                this._updateVBOs = true;

            }
        }

        public draw():void
        {
            var nChildren:number = this._children.length;
            if(nChildren == 0)return;

            // Update vertex data with current position of children
            for ( var i:number = 0; i < nChildren; i++ ) {
                this.updateChildVertexData(this._children[i]);
            }

            this._context3D.setProgram(this._shaderProgram);
            this._context3D.setBlendFactors(stageJS.Context3DBlendFactor.ONE, stageJS.Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
            this._context3D.setProgramConstantsFromMatrix("vc0", this._parent.modelViewMatrix, false); //todo: vc0
            this._context3D.setTextureAt("fs0", this._spriteSheet._texture);//todo: 0 ->"fs0"

            if ( this._updateVBOs )
            {
                this._vertexBuffer = this._context3D.createVertexBuffer(this._vertexData.length/3, 3);
                this._indexBuffer = this._context3D.createIndexBuffer(this._indexData.length);
                this._uvBuffer = this._context3D.createVertexBuffer(this._uvData.length/2, 2);
                this._indexBuffer.uploadFromVector(this._indexData, 0, this._indexData.length); // indices won't change
                this._uvBuffer.uploadFromVector(this._uvData, 0, this._uvData.length / 2); // child UVs won't change
                this._updateVBOs = false;
            }


            this._vertexBuffer.uploadFromVector(this._vertexData, 0, this._vertexData.length / 3);
            this._context3D.setVertexBufferAt("va0", this._vertexBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_3);//todo:0 - "va0"
            this._context3D.setVertexBufferAt("va1", this._uvBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);//todo:1 -"va1"

            this._context3D.drawTriangles(this._indexBuffer);//, 0,  nChildren * 2
        }

        private setupShaders() : void
        {
//            var vertexShaderAssembler:AGALMiniAssembler = new AGALMiniAssembler();
//            vertexShaderAssembler.assemble( Context3DProgramType.VERTEX,
//                    "dp4 op.x, va0, vc0 \n"+ // transform from stream 0 to output clipspace
//                    "dp4 op.y, va0, vc1 \n"+
//                    //"dp4 op.z, va0, vc2 \n"+
//                    "mov op.z, vc2.z    \n"+
//                    "mov op.w, vc3.w    \n"+
//                    "mov v0, va1.xy     \n"+ // copy texcoord from stream 1 to fragment program
//                    "mov v0.z, va0.z \n"     // copy alpha from stream 0 to fragment program
//            );
//
//            var fragmentShaderAssembler:AGALMiniAssembler = new AGALMiniAssembler();
//            fragmentShaderAssembler.assemble( Context3DProgramType.FRAGMENT,
//                    "tex ft0, v0, fs0 <2d,clamp,linear,mipnearest> \n"+
//                    "mul ft0, ft0, v0.zzzz\n" +
//                    "mov oc, ft0 \n"
//            );

            this._shaderProgram = this._context3D.createProgram();
//            this._shaderProgram.upload( vertexShaderAssembler.agalcode, fragmentShaderAssembler.agalcode );
            this._shaderProgram.upload("shader-vs", "shader-fs");
        }

        private updateTexture() : void
        {
            this._spriteSheet.uploadTexture(this._context3D);
        }

        private updateChildVertexData(sprite:GPUSprite.Sprite) : void
        {
            var childVertexIdx:number = sprite._childId * 12;

            if ( sprite.visible ) {
                var x:number = sprite.position.x;
                var y:number = sprite.position.y;
                var rect:{x:number;y:number;width:number;height:number} = sprite.rect;
                var sinT:number = Math.sin(sprite.rotation);
                var cosT:number = Math.cos(sprite.rotation);
                var alpha:number = sprite.alpha;

                var scaledWidth:number = rect.width * sprite.scaleX;
                var scaledHeight:number = rect.height * sprite.scaleY;
                var centerX:number = scaledWidth * 0.5;
                var centerY:number = scaledHeight * 0.5;

                this._vertexData[childVertexIdx] = x - (cosT * centerX) - (sinT * (scaledHeight - centerY));
                this._vertexData[childVertexIdx+1] = y - (sinT * centerX) + (cosT * (scaledHeight - centerY));
                this._vertexData[childVertexIdx+2] = alpha;

                this._vertexData[childVertexIdx+3] = x - (cosT * centerX) + (sinT * centerY);
                this._vertexData[childVertexIdx+4] = y - (sinT * centerX) - (cosT * centerY);
                this._vertexData[childVertexIdx+5] = alpha;

                this._vertexData[childVertexIdx+6] = x + (cosT * (scaledWidth - centerX)) + (sinT * centerY);
                this._vertexData[childVertexIdx+7] = y + (sinT * (scaledWidth - centerX)) - (cosT * centerY);
                this._vertexData[childVertexIdx+8] = alpha;

                this._vertexData[childVertexIdx+9] = x + (cosT * (scaledWidth - centerX)) - (sinT * (scaledHeight - centerY));
                this._vertexData[childVertexIdx+10] = y + (sinT * (scaledWidth - centerX)) + (cosT * (scaledHeight - centerY));
                this._vertexData[childVertexIdx+11] = alpha;

            }
            else {
                for (var i:number = 0; i < 12; i++ ) {
                    this._vertexData[childVertexIdx+i] = 0;
                }
            }
        }
    }

}