/**
 $.get('/folder/file.bla', function(data) {
  var fileContents = data;
});



    OBJ file format parser for Stage3d - version 2.31
    gratefully adapted from work by Alejandro Santander

    A one-file, zero dependencies solution!
    Just drop into your project and enjoy.

    This class only does ONE thing:
    it turns an OBJ file into Stage3d buffers.

    example:

    [Embed (source = "mesh.obj", mimeType = "application/octet-stream")]
    private myObjData:Class;

    ... set up your transforms, texture, vertex and fragment <normal> programs ...

    var myMesh:Stage3dObjParser = new Stage3dObjParser(myObjData);
    context3D.setVertexBufferAt(0, myMesh.positionsBuffer, 0, Context3DVertexBufferFormat.FLOAT_3);
    context3D.setVertexBufferAt(1, myMesh.uvBuffer, 0, Context3DVertexBufferFormat.FLOAT_2);
    context3D.drawTriangles(myMesh.indexBuffer, 0, myMesh.indexBufferCount);

    [Some older exporters (eg 3dsmax9) format things differently: zxy instead of xyz:]
    [var myMesh:Stage3dObjParser = new Stage3dObjParser(myObjData, 1, true);]
    [Also, some exporters flip the U texture coordinate:]
    [var myMesh:Stage3dObjParser = new Stage3dObjParser(myObjData, 1, true, true);]

    Note: no quads allowed!
    If your model isn't working, check that you
    have triangulated your mesh so each polygon uses
    exactly three vertexes - no more and no less.

    No groups or sub-models - one mesh per file.
    No .mat material files are used - geometry only.
 */
///<reference path="../stage3d.d.ts"/>
var lib;
(function (lib) {
    var Stage3dObjParser = (function () {
        function Stage3dObjParser(objfile, acontext, scale, dataIsZxy, textureFlip) {
            if (scale === void 0) { scale = 1; }
            if (dataIsZxy === void 0) { dataIsZxy = false; }
            if (textureFlip === void 0) { textureFlip = false; }
            // older versions of 3dsmax use an invalid vertex order:
            this._vertexDataIsZxy = false;
            // some exporters mirror the UV texture coordinates
            this._mirrorUv = false;
            // OBJ files do not contain vertex colors
            // but many shaders will require this data
            // if false, the buffer is filled with pure white
            this._randomVertexColors = true;
            // constants used in parsing OBJ data
            this.LINE_FEED = String.fromCharCode(10);
            this.SPACE = String.fromCharCode(32);
            this.SLASH = "/";
            this.VERTEX = "v";
            this.NORMAL = "vn";
            this.UV = "vt";
            this.INDEX_DATA = "f";
            this._faceIndex = 0;
            this._vertexDataIsZxy = dataIsZxy;
            this._mirrorUv = textureFlip;
            this._rawColorsBuffer = [];
            this._rawIndexBuffer = [];
            this._rawPositionsBuffer = [];
            this._rawUvBuffer = [];
            this._rawNormalsBuffer = [];
            this._scale = scale;
            this._context3d = acontext;
            // Get <string> data.
            var definition = objfile;
            // Init raw data containers.
            this._vertices = [];
            this._normals = [];
            this._uvs = [];
            // Split data in to lines and parse all lines.
            var lines = definition.split(this.LINE_FEED);
            var loop = lines.length;
            for (var i = 0; i < loop; ++i)
                this.parseLine(lines[i]);
        }
        Stage3dObjParser.prototype.parseLine = function (line) {
            // Split line into words.
            var words = line.split(this.SPACE);
            // Prepare the data of the line.
            if (words.length > 0)
                var data = words.slice(1);
            else
                return;
            // Check first word and delegate remainder to proper parser.
            var firstWord = words[0];
            switch (firstWord) {
                case this.VERTEX:
                    this.parseVertex(data);
                    break;
                case this.NORMAL:
                    this.parseNormal(data);
                    break;
                case this.UV:
                    this.parseUV(data);
                    break;
                case this.INDEX_DATA:
                    this.parseIndex(data);
                    break;
            }
        };
        Stage3dObjParser.prototype.parseVertex = function (data) {
            if ((data[0] == '') || (data[0] == ' '))
                data = data.slice(1); // delete blanks
            if (this._vertexDataIsZxy) {
                //if (!_vertices.length) console.log('zxy parseVertex: '
                // + data[1] + ',' + data[2] + ',' + data[0]);
                this._vertices.push(Number(data[1]) * this._scale);
                this._vertices.push(Number(data[2]) * this._scale);
                this._vertices.push(Number(data[0]) * this._scale);
            }
            else {
                //if (!_vertices.length) console.log('parseVertex: ' + data);
                var loop = data.length;
                if (loop > 3)
                    loop = 3;
                for (var i = 0; i < loop; ++i) {
                    var element = data[i];
                    this._vertices.push(Number(element) * this._scale);
                }
            }
        };
        Stage3dObjParser.prototype.parseNormal = function (data) {
            if ((data[0] == '') || (data[0] == ' '))
                data = data.slice(1); // delete blanks
            //if (!_normals.length) console.log('parseNormal:' + data);
            var loop = data.length;
            if (loop > 3)
                loop = 3;
            for (var i = 0; i < loop; ++i) {
                var element = data[i];
                if (element != null)
                    this._normals.push(Number(element));
            }
        };
        Stage3dObjParser.prototype.parseUV = function (data) {
            if ((data[0] == '') || (data[0] == ' '))
                data = data.slice(1); // delete blanks
            //if (!_uvs.length) console.log('parseUV:' + data);
            var loop = data.length;
            if (loop > 2)
                loop = 2;
            for (var i = 0; i < loop; ++i) {
                var element = data[i];
                this._uvs.push(Number(element));
            }
        };
        Stage3dObjParser.prototype.parseIndex = function (data) {
            //if (!_rawIndexBuffer.length) console.log('parseIndex:' + data);
            var triplet;
            var subdata;
            var vertexIndex;
            var uvIndex;
            var normalIndex;
            var index;
            // Process elements.
            var i;
            var loop = data.length;
            var starthere = 0;
            while ((data[starthere] == '') || (data[starthere] == ' '))
                starthere++;
            loop = starthere + 3;
            for (i = starthere; i < loop; ++i) {
                triplet = data[i];
                subdata = triplet.split(this.SLASH);
                //obj文件的 face索引从1开始
                vertexIndex = (subdata[0]) - 1;
                uvIndex = (subdata[1]) - 1;
                normalIndex = (subdata[2]) - 1;
                // sanity check
                if (vertexIndex < 0)
                    vertexIndex = 0;
                if (uvIndex < 0)
                    uvIndex = 0;
                if (normalIndex < 0)
                    normalIndex = 0;
                // Extract from parse raw data to mesh raw data.
                // Vertex (x,y,z)
                index = 3 * vertexIndex;
                this._rawPositionsBuffer.push(this._vertices[index + 0], this._vertices[index + 1], this._vertices[index + 2]);
                // Color (vertex r,g,b,a)
                if (this._randomVertexColors)
                    this._rawColorsBuffer.push(Math.random(), Math.random(), Math.random(), 1);
                else
                    this._rawColorsBuffer.push(1, 1, 1, 1); // pure white
                // Normals (nx,ny,nz) - *if* included in the file
                if (this._normals.length) {
                    index = 3 * normalIndex;
                    this._rawNormalsBuffer.push(this._normals[index + 0], this._normals[index + 1], this._normals[index + 2]);
                }
                // Texture coordinates (u,v)
                index = 2 * uvIndex;
                if (this._mirrorUv)
                    this._rawUvBuffer.push(this._uvs[index + 0], 1 - this._uvs[index + 1]);
                else
                    this._rawUvBuffer.push(1 - this._uvs[index + 0], 1 - this._uvs[index + 1]);
            }
            // Create index buffer - one entry for each polygon
            this._rawIndexBuffer.push(this._faceIndex + 0, this._faceIndex + 1, this._faceIndex + 2);
            this._faceIndex += 3;
        };
        Object.defineProperty(Stage3dObjParser.prototype, "colorsBuffer", {
            // These functions return Stage3d buffers
            // (uploading them first if required)
            get: function () {
                if (!this._colorsBuffer)
                    this.updateColorsBuffer();
                return this._colorsBuffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage3dObjParser.prototype, "positionsBuffer", {
            get: function () {
                if (!this._positionsBuffer)
                    this.updateVertexBuffer();
                return this._positionsBuffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage3dObjParser.prototype, "indexBuffer", {
            get: function () {
                if (!this._indexBuffer)
                    this.updateIndexBuffer();
                return this._indexBuffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage3dObjParser.prototype, "indexBufferCount", {
            get: function () {
                return this._rawIndexBuffer.length / 3;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage3dObjParser.prototype, "uvBuffer", {
            get: function () {
                if (!this._uvBuffer)
                    this.updateUvBuffer();
                return this._uvBuffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage3dObjParser.prototype, "normalsBuffer", {
            get: function () {
                if (!this._normalsBuffer)
                    this.updateNormalsBuffer();
                return this._normalsBuffer;
            },
            enumerable: true,
            configurable: true
        });
        // convert RAW buffers to Stage3d compatible buffers
        // uploads them to the context3D first
        Stage3dObjParser.prototype.updateColorsBuffer = function () {
            if (this._rawColorsBuffer.length == 0)
                throw new Error("Raw Color buffer is empty");
            var colorsCount = this._rawColorsBuffer.length / 4; // 4=rgba
            this._colorsBuffer = this._context3d.createVertexBuffer(colorsCount, 4);
            this._colorsBuffer.uploadFromVector(this._rawColorsBuffer, 0, colorsCount);
        };
        Stage3dObjParser.prototype.updateNormalsBuffer = function () {
            // generate normals manually
            // if the data file did not include them
            if (this._rawNormalsBuffer.length == 0)
                this.forceNormals();
            if (this._rawNormalsBuffer.length == 0)
                throw new Error("Raw Normal buffer is empty");
            var normalsCount = this._rawNormalsBuffer.length / 3;
            this._normalsBuffer = this._context3d.createVertexBuffer(normalsCount, 3);
            this._normalsBuffer.uploadFromVector(this._rawNormalsBuffer, 0, normalsCount);
        };
        Stage3dObjParser.prototype.updateVertexBuffer = function () {
            if (this._rawPositionsBuffer.length == 0)
                throw new Error("Raw Vertex buffer is empty");
            var vertexCount = this._rawPositionsBuffer.length / 3;
            this._positionsBuffer = this._context3d.createVertexBuffer(vertexCount, 3);
            this._positionsBuffer.uploadFromVector(this._rawPositionsBuffer, 0, vertexCount);
        };
        Stage3dObjParser.prototype.updateUvBuffer = function () {
            if (this._rawUvBuffer.length == 0)
                throw new Error("Raw UV buffer is empty");
            var uvsCount = this._rawUvBuffer.length / 2;
            this._uvBuffer = this._context3d.createVertexBuffer(uvsCount, 2);
            this._uvBuffer.uploadFromVector(this._rawUvBuffer, 0, uvsCount);
        };
        Stage3dObjParser.prototype.updateIndexBuffer = function () {
            if (this._rawIndexBuffer.length == 0)
                throw new Error("Raw Index buffer is empty");
            this._indexBuffer = this._context3d.createIndexBuffer(this._rawIndexBuffer.length);
            this._indexBuffer.uploadFromVector(this._rawIndexBuffer, 0, this._rawIndexBuffer.length);
        };
        Stage3dObjParser.prototype.restoreNormals = function () {
            this._rawNormalsBuffer = this._cachedRawNormalsBuffer.concat();
        };
        Stage3dObjParser.prototype.get3PointNormal = function (p0, p1, p2) {
            // calculate the normal from three vectors
            var p0p1 = p1.subtract(p0);
            var p0p2 = p2.subtract(p0);
            var normal = p0p1.crossProduct(p0p2);
            normal.normalize();
            return normal;
        };
        Stage3dObjParser.prototype.forceNormals = function () {
            // useful for when the OBJ file doesn't have normal data
            // we can calculate it manually by calling this function
            this._cachedRawNormalsBuffer = this._rawNormalsBuffer.concat();
            var i, index;
            // Translate vertices to vector3d array.
            var loop = this._rawPositionsBuffer.length / 3;
            var vertices = [];
            var vertex;
            for (i = 0; i < loop; ++i) {
                index = 3 * i;
                vertex = new stageJS.geom.Vector3D(this._rawPositionsBuffer[index], this._rawPositionsBuffer[index + 1], this._rawPositionsBuffer[index + 2]);
                vertices.push(vertex);
            }
            // Calculate normals.
            loop = vertices.length;
            var p0, p1, p2, normal;
            this._rawNormalsBuffer = [];
            for (i = 0; i < loop; i += 3) {
                p0 = vertices[i];
                p1 = vertices[i + 1];
                p2 = vertices[i + 2];
                normal = this.get3PointNormal(p0, p1, p2);
                this._rawNormalsBuffer.push(normal.x, normal.y, normal.z);
                this._rawNormalsBuffer.push(normal.x, normal.y, normal.z);
                this._rawNormalsBuffer.push(normal.x, normal.y, normal.z);
            }
        };
        // utility function that outputs all buffer data
        // to the debug window - good for compiling OBJ to
        // pure as3 source code for faster inits
        Stage3dObjParser.prototype.dataDumpTrace = function () {
            console.log(this.dataDumpString());
        };
        // turns all mesh data into AS3 source code
        Stage3dObjParser.prototype.dataDumpString = function () {
            var str;
            str = "// Stage3d Model Data begins\n\n";
            str += "private _Index:Vector.<number> ";
            str += "= []([";
            str += this._rawIndexBuffer.toString();
            str += "]);\n\n";
            str += "private _Positions:Vector.<number> ";
            str += "= []([";
            str += this._rawPositionsBuffer.toString();
            str += "]);\n\n";
            str += "private _UVs:number[] = ";
            str += "[]([";
            str += this._rawUvBuffer.toString();
            str += "]);\n\n";
            str += "private _Normals:number[] = ";
            str += "[]([";
            str += this._rawNormalsBuffer.toString();
            str += "]);\n\n";
            str += "private _Colors:number[] = ";
            str += "[]([";
            str += this._rawColorsBuffer.toString();
            str += "]);\n\n";
            str += "// Stage3d Model Data ends\n";
            return str;
        };
        return Stage3dObjParser;
    })();
    lib.Stage3dObjParser = Stage3dObjParser; // end class
})(lib || (lib = {})); // end package
