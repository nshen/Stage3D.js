/**
<<<<<<< HEAD
 $.get('/folder/file.bla', function(data) {
  var fileContents = data;
});
=======
>>>>>>> examples



    OBJ file format parser for Stage3d - version 2.31
    gratefully adapted from work by Alejandro Santander

    A one-file, zero dependencies solution!
    Just drop into your project and enjoy.

    This class only does ONE thing:
    it turns an OBJ file into Stage3d buffers.

    example:


     $.get('model/spaceship.obj', (data) => {
            var myMesh:Stage3dObjParser = new Stage3dObjParser(data);
            context3D.setVertexBufferAt(0, myMesh.positionsBuffer, 0, Context3DVertexBufferFormat.FLOAT_3);
            context3D.setVertexBufferAt(1, myMesh.uvBuffer, 0, Context3DVertexBufferFormat.FLOAT_2);
            context3D.drawTriangles(myMesh.indexBuffer, 0, myMesh.indexBufferCount);
    });
 
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
module lib
{

    export class Stage3dObjParser
    {
        // older versions of 3dsmax use an invalid vertex order:
        private _vertexDataIsZxy:boolean = false;
        // some exporters mirror the UV texture coordinates
        private _mirrorUv:boolean = false;
        // OBJ files do not contain vertex colors
        // but many shaders will require this data
        // if false, the buffer is filled with pure white
        private _randomVertexColors:boolean = true;
        
        // constants used in parsing OBJ data
        private LINE_FEED:string = String.fromCharCode(10);
        private SPACE:string = String.fromCharCode(32);
        private SLASH:string = "/";
        private VERTEX:string = "v";
        private NORMAL:string = "vn";
        private UV:string = "vt";
        private INDEX_DATA:string = "f";
        
        // temporary vars used during parsing OBJ data
        private _scale:number;
        private _faceIndex:number = 0;
        private _vertices:number[] ;
        private _normals:number[] ;
        private _uvs:number[] ;
        private _cachedRawNormalsBuffer:number[] ;
        
        // the raw data that is used to create Stage3d buffers
        /* protected */ public _rawIndexBuffer:number[] ;
        /* protected */ public _rawPositionsBuffer:number[] ;
        /* protected */ public _rawUvBuffer:number[] ;
        /* protected */ public _rawNormalsBuffer:number[] ;
        /* protected */ public _rawColorsBuffer:number[] ;

        // the final buffers in Stage3d-ready format
        /* protected */ public _indexBuffer:stageJS.IndexBuffer3D;
        /* protected */ public _positionsBuffer:stageJS.VertexBuffer3D;
        /* protected */ public _uvBuffer:stageJS.VertexBuffer3D;
        /* protected */ public _normalsBuffer:stageJS.VertexBuffer3D;
        /* protected */ public _colorsBuffer:stageJS.VertexBuffer3D;

        // the context3D that we want to upload the buffers to
        private _context3d:stageJS.Context3D;


        constructor(objfile:string,
                    acontext:stageJS.Context3D, scale:number = 1,
                    dataIsZxy:boolean = false, textureFlip:boolean = false)
        {
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
            var definition:string = objfile;

            // Init raw data containers.
            this._vertices = [];
            this._normals = [];
            this._uvs = [];

            // Split data in to lines and parse all lines.
            var lines:string[] = definition.split(this.LINE_FEED);
            var loop:number = lines.length;
            for(var i:number = 0; i < loop; ++i)
                this.parseLine(lines[i]);
        }


        private parseLine(line:string):void
        {
            // Split line into words.
            var words:any[] = line.split(this.SPACE);

            // Prepare the data of the line.
            if (words.length > 0)
                var data:any[] = words.slice(1);
            else
                return;

            // Check first word and delegate remainder to proper parser.
            var firstWord:string = words[0];
            switch (firstWord)
            {
                case this.VERTEX: //v
                    this.parseVertex(data);
                    break;
                case this.NORMAL: //vn
                    this.parseNormal(data);
                    break;
                case this.UV: //vt
                    this.parseUV(data);
                    break;
                case this.INDEX_DATA: //f
                    this.parseIndex(data);
                    break;
            }
        }

        private parseVertex(data:string[]):void
        {
            if ((data[0] == '') || (data[0] == ' '))
                data = data.slice(1); // delete blanks
            if (this._vertexDataIsZxy)
            {
                //if (!_vertices.length) console.log('zxy parseVertex: '
                // + data[1] + ',' + data[2] + ',' + data[0]);
                this._vertices.push(Number(data[1]) * this._scale);
                this._vertices.push(Number(data[2]) * this._scale);
                this._vertices.push(Number(data[0]) * this._scale);
            }
            else // normal operation: x,y,z
            {
                //if (!_vertices.length) console.log('parseVertex: ' + data);
                var loop:number = data.length;
                if (loop > 3) loop = 3;
                for (var i:number = 0; i < loop; ++i)
                {
                    var element:string = data[i];
                    this._vertices.push(Number(element) * this._scale);
                }
            }
        }

        private parseNormal(data:string[]):void
        {
            if ((data[0] == '') || (data[0] == ' '))
                data = data.slice(1); // delete blanks
            //if (!_normals.length) console.log('parseNormal:' + data);
            var loop:number = data.length;
            if (loop > 3) loop = 3;
            for (var i:number = 0; i < loop; ++i)
            {
                var element:string = data[i];
                if (element != null) // handle 3dsmax extra spaces
                    this._normals.push(Number(element));
            }
        }

        private parseUV(data:string[]):void
        {
            if ((data[0] == '') || (data[0] == ' '))
                data = data.slice(1); // delete blanks
            //if (!_uvs.length) console.log('parseUV:' + data);
            var loop:number = data.length;
            if (loop > 2) loop = 2;
            for (var i:number = 0; i < loop; ++i)
            {
                var element:string = data[i];
                this._uvs.push(Number(element));
            }
        }

        private parseIndex(data:string[]):void
        {
            //if (!_rawIndexBuffer.length) console.log('parseIndex:' + data);
            var triplet:string;
            var subdata:any[];
            var vertexIndex:number;
            var uvIndex:number;
            var normalIndex:number;
            var index:number;

            // Process elements.
            var i:number;
            var loop:number = data.length;
            var starthere:number = 0;
            while ((data[starthere] == '') || (data[starthere] == ' '))
                starthere++; // ignore blanks

            loop = starthere + 3;

            // loop through each element and grab values stored earlier
            // elements <vertexIndex> come/uvIndex/normalIndex
            for(i = starthere; i < loop; ++i)
            {
                triplet = data[i];
                subdata = triplet.split(this.SLASH);
                //obj文件的 face索引从1开始
                vertexIndex = <number>(subdata[0]) - 1;
                uvIndex     = <number>(subdata[1]) - 1;
                normalIndex = <number>(subdata[2]) - 1;

                // sanity check
                if(vertexIndex < 0) vertexIndex = 0;
                if(uvIndex < 0) uvIndex = 0;
                if(normalIndex < 0) normalIndex = 0;

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
                if (this._normals.length)
                {
                    index = 3 * normalIndex;
                    this._rawNormalsBuffer.push(this._normals[index + 0], this._normals[index + 1], this._normals[index + 2]);
                }

                // Texture coordinates (u,v)
                index = 2 * uvIndex;
                if (this._mirrorUv)
                    this._rawUvBuffer.push(this._uvs[index+0], 1 - this._uvs[index+1]);
                else
                    this._rawUvBuffer.push(1 - this._uvs[index+0],1 - this._uvs[index+1]);
            }

            // Create index buffer - one entry for each polygon
            this._rawIndexBuffer.push(this._faceIndex+0,this._faceIndex+1,this._faceIndex+2);
            this._faceIndex += 3;

        }

        // These functions return Stage3d buffers
        // (uploading them first if required)

        public get colorsBuffer():stageJS.VertexBuffer3D
        {
            if(!this._colorsBuffer)
                this.updateColorsBuffer();
            return this._colorsBuffer;
        }

        public get positionsBuffer():stageJS.VertexBuffer3D
        {
            if(!this._positionsBuffer)
                this.updateVertexBuffer();
            return this._positionsBuffer;
        }

        public get indexBuffer():stageJS.IndexBuffer3D
        {
            if(!this._indexBuffer)
                this.updateIndexBuffer();
            return this._indexBuffer;
        }

        public get indexBufferCount():number
        {
            return this._rawIndexBuffer.length / 3;
        }

        public get uvBuffer():stageJS.VertexBuffer3D
        {
            if(!this._uvBuffer)
                this.updateUvBuffer();
            return this._uvBuffer;
        }

        public get normalsBuffer():stageJS.VertexBuffer3D
        {
            if(!this._normalsBuffer)
                this.updateNormalsBuffer();
            return this._normalsBuffer;
        }

        // convert RAW buffers to Stage3d compatible buffers
        // uploads them to the context3D first

        public updateColorsBuffer():void
        {
            if(this._rawColorsBuffer.length == 0)
                throw new Error("Raw Color buffer is empty");
            var colorsCount:number = this._rawColorsBuffer.length/4; // 4=rgba
            this._colorsBuffer = this._context3d.createVertexBuffer(colorsCount, 4);
            this._colorsBuffer.uploadFromVector(this._rawColorsBuffer, 0, colorsCount);
        }

        public updateNormalsBuffer():void
        {
            // generate normals manually
            // if the data file did not include them
            if (this._rawNormalsBuffer.length == 0)
                this.forceNormals();
            if(this._rawNormalsBuffer.length == 0)
                throw new Error("Raw Normal buffer is empty");
            var normalsCount:number = this._rawNormalsBuffer.length/3;
            this._normalsBuffer = this._context3d.createVertexBuffer(normalsCount, 3);
            this._normalsBuffer.uploadFromVector(this._rawNormalsBuffer, 0, normalsCount);
        }

        public updateVertexBuffer():void
        {
            if(this._rawPositionsBuffer.length == 0)
                throw new Error("Raw Vertex buffer is empty");
            var vertexCount:number = this._rawPositionsBuffer.length/3;
            this._positionsBuffer = this._context3d.createVertexBuffer(vertexCount, 3);
            this._positionsBuffer.uploadFromVector(this._rawPositionsBuffer, 0, vertexCount);
        }

        public updateUvBuffer():void
        {
            if(this._rawUvBuffer.length == 0)
                throw new Error("Raw UV buffer is empty");
            var uvsCount:number = this._rawUvBuffer.length/2;
            this._uvBuffer = this._context3d.createVertexBuffer(uvsCount, 2);
            this._uvBuffer.uploadFromVector(this._rawUvBuffer, 0, uvsCount);
        }

        public updateIndexBuffer():void
        {
            if(this._rawIndexBuffer.length == 0)
                throw new Error("Raw Index buffer is empty");
            this._indexBuffer = this._context3d.createIndexBuffer(this._rawIndexBuffer.length);
            this._indexBuffer.uploadFromVector(this._rawIndexBuffer, 0, this._rawIndexBuffer.length);
        }

        public restoreNormals():void
        {	// utility function
            this._rawNormalsBuffer = this._cachedRawNormalsBuffer.concat();
        }

        public get3PointNormal(p0:stageJS.geom.Vector3D, p1:stageJS.geom.Vector3D, p2:stageJS.geom.Vector3D):stageJS.geom.Vector3D
        {	// utility function
            // calculate the normal from three vectors
            var p0p1:stageJS.geom.Vector3D = p1.subtract(p0);
            var p0p2:stageJS.geom.Vector3D = p2.subtract(p0);
            var normal:stageJS.geom.Vector3D = p0p1.crossProduct(p0p2);
            normal.normalize();
            return normal;
        }

        public forceNormals():void
        {	// utility function
            // useful for when the OBJ file doesn't have normal data
            // we can calculate it manually by calling this function
            this._cachedRawNormalsBuffer = this._rawNormalsBuffer.concat();
            var i:number, index:number;
            // Translate vertices to vector3d array.
            var loop:number = this._rawPositionsBuffer.length/3;
            var vertices:stageJS.geom.Vector3D[] = [];
            var vertex:stageJS.geom.Vector3D;
            for(i = 0; i < loop; ++i)
            {
                index = 3*i;
                vertex = new stageJS.geom.Vector3D(this._rawPositionsBuffer[index], this._rawPositionsBuffer[index + 1], this._rawPositionsBuffer[index + 2]);
                vertices.push(vertex);
            }
            // Calculate normals.
            loop = vertices.length;
            var p0:stageJS.geom.Vector3D, p1:stageJS.geom.Vector3D, p2:stageJS.geom.Vector3D, normal:stageJS.geom.Vector3D;
            this._rawNormalsBuffer = [];
            for(i = 0; i < loop; i += 3)
            {
                p0 = vertices[i];
                p1 = vertices[i + 1];
                p2 = vertices[i + 2];
                normal = this.get3PointNormal(p0, p1, p2);
                this._rawNormalsBuffer.push(normal.x, normal.y, normal.z);
                this._rawNormalsBuffer.push(normal.x, normal.y, normal.z);
                this._rawNormalsBuffer.push(normal.x, normal.y, normal.z);
            }
        }

        // utility function that outputs all buffer data
        // to the debug window - good for compiling OBJ to
        // pure as3 source code for faster inits
        public dataDumpTrace():void
        {
            console.log(this.dataDumpString());
        }
        // turns all mesh data into AS3 source code
        public dataDumpString():string
        {
            var str:string;
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
        }

    } // end class

} // end package



