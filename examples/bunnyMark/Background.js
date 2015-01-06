///<reference path="_definitions.ts"/>
var BunnyMark;
(function (BunnyMark) {
    var Background = (function () {
        function Background(ctx3D, w, h) {
            //haxe variable
            this.cols = 8;
            this.rows = 12;
            this._timer = new BunnyMark.Timer();
            this.context3D = ctx3D;
            this._width = w;
            this._height = h;
            this.texBM = BunnyMark.ImageLoader.getInstance().get("assets/grass.png");
            this.tex = this.context3D.createTexture(this.texBM.width, this.texBM.height, stageJS.Context3DTextureFormat.BGRA, false);
            this.tex.uploadFromBitmapData(this.texBM, 0);
            this.buildMesh();
            //build shaders
            this.shader_program = this.context3D.createProgram();
            this.shader_program.upload("shader-vs", "shader-fs");
            this.context3D.setProgram(this.shader_program);
            //create projection matrix
            this._modelViewMatrix = new stageJS.geom.Matrix3D();
            this._modelViewMatrix.appendTranslation(-(this._width) / 2, -(this._height) / 2, 0);
            this._modelViewMatrix.appendScale(2.0 / (this._width - 50), -2.0 / (this._height - 50), 1);
            //set everything
            this.context3D.setTextureAt("fs0", this.tex);
            this.context3D.setVertexBufferAt("va0", this.vb, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);
            this.context3D.setVertexBufferAt("va1", this.uvb, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);
            this.context3D.setProgramConstantsFromMatrix("vc0", this._modelViewMatrix, true);
        }
        Background.prototype.buildMesh = function () {
            var uw = this._width / this.texBM.width;
            var uh = this._height / this.texBM.height;
            var kx, ky;
            var ci, ci2, ri;
            this.vertices = [];
            this.uvt = [];
            this.indices = [];
            var i;
            var j;
            for (j = 0; j <= this.rows; j++) {
                ri = j * (this.cols + 1) * 2;
                ky = j / this.rows;
                for (i = 0; i <= this.cols; i++) {
                    ci = ri + i * 2;
                    kx = i / this.cols;
                    this.vertices[ci] = this._width * kx;
                    this.vertices[ci + 1] = this._height * ky;
                    this.uvt[ci] = uw * kx;
                    this.uvt[ci + 1] = uh * ky;
                }
            }
            for (j = 0; j < this.rows; j++) {
                ri = j * (this.cols + 1);
                for (i = 0; i < this.cols; i++) {
                    ci = i + ri;
                    ci2 = ci + this.cols + 1;
                    this.indices.push(ci);
                    this.indices.push(ci + 1);
                    this.indices.push(ci2);
                    this.indices.push(ci + 1);
                    this.indices.push(ci2 + 1);
                    this.indices.push(ci2);
                }
            }
            //now create the buffers
            this.numIndices = this.indices.length;
            this.numTriangles = this.numIndices / 3;
            this.numVertices = this.vertices.length / 2;
            this.vb = this.context3D.createVertexBuffer(this.numVertices, 2);
            this.uvb = this.context3D.createVertexBuffer(this.numVertices, 2);
            this.ib = this.context3D.createIndexBuffer(this.numIndices);
            this.vb.uploadFromVector(this.vertices, 0, this.numVertices);
            this.ib.uploadFromVector(this.indices, 0, this.numIndices);
            this.uvb.uploadFromVector(this.uvt, 0, this.numVertices);
        };
        Background.prototype.render = function () {
            if (this._width == 0 || this._height == 0)
                return;
            var t = this._timer.getTimer() / 1000.0;
            var sw = this._width;
            var sh = this._height;
            var kx, ky;
            var ci, ri;
            this.context3D.setBlendFactors(stageJS.Context3DBlendFactor.ONE, stageJS.Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
            this.context3D.setTextureAt("fs0", this.tex);
            this.context3D.setProgram(this.shader_program);
            this.context3D.setVertexBufferAt("va0", this.vb, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);
            this.context3D.setVertexBufferAt("va1", this.uvb, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);
            this.context3D.setProgramConstantsFromMatrix("vc0", this._modelViewMatrix, true);
            var i = 0;
            for (var j = 0; j <= this.rows; j++) {
                ri = j * (this.cols + 1) * 2;
                for (i = 0; i <= this.cols; i++) {
                    ci = ri + i * 2;
                    kx = i / this.cols + Math.cos(t + i) * 0.02;
                    ky = j / this.rows + Math.sin(t + j + i) * 0.02;
                    this.vertices[ci] = sw * kx;
                    this.vertices[ci + 1] = sh * ky;
                }
            }
            this.context3D.setBlendFactors(stageJS.Context3DBlendFactor.ONE, stageJS.Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
            this.vb.uploadFromVector(this.vertices, 0, this.numVertices);
            this.context3D.drawTriangles(this.ib, 0, this.numTriangles);
        };
        return Background;
    })();
    BunnyMark.Background = Background;
})(BunnyMark || (BunnyMark = {}));
