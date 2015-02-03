/// <reference path="stage3d.d.ts"/>
/// <reference path="./lib/Stage3dObjParser.ts"/>
/// <reference path="./lib/ImageLoader.ts"/>
/// <reference path="./lib/FileLoader.ts"/>
module test {

    import Context3D = stageJS.Context3D;
    import Program3D = stageJS.Program3D;
    import PerspectiveMatrix3D = stageJS.geom.PerspectiveMatrix3D;
    import Matrix3D = stageJS.geom.Matrix3D;
    import Texture = stageJS.Texture;
    import Stage3D = stageJS.Stage3D;
    import Context3DTextureFormat = stageJS.Context3DTextureFormat;
    import Context3DCompareMode = stageJS.Context3DCompareMode;
    import Vector3D = stageJS.geom.Vector3D;
    import Context3DVertexBufferFormat = stageJS.Context3DVertexBufferFormat;
    import Context3DBlendFactor = stageJS.Context3DBlendFactor;

    export class blend {

        // available blend/texture/mesh
        private blendNum:number = -1;
        private blendNumMax:number = 5;
        private texNum:number = -1;
        private texNumMax:number = 5;
        private meshNum:number = -1;
        private meshNumMax:number = 4;
        private _depthTestEnabled:boolean = true;


        // the compiled shaders used to render our mesh
        private shaderProgram1:Program3D;
        private shaderProgram2:Program3D;

        // matrices that affect the mesh location and camera angles
        private projectionmatrix:PerspectiveMatrix3D = new PerspectiveMatrix3D();
        private modelmatrix:Matrix3D = new Matrix3D();
        private viewmatrix:Matrix3D = new Matrix3D();
        //private terrainviewmatrix:Matrix3D = new Matrix3D();
        private modelViewProjection:Matrix3D = new Matrix3D();

        // a simple frame counter used for animation
        private t:number = 0;
        // a reusable loop counter
        private looptemp:number = 0;

        // The Stage3d Textures that use the above
        private myTexture1:Texture;
        private myTexture2:Texture;
        private myTexture3:Texture;
        private myTexture4:Texture;
        private myTexture5:Texture;
        private myTexture6:Texture;
        private terrainTexture:Texture;

        // Points to whatever the current mesh is
        private myMesh:lib.Stage3dObjParser;

        // The mesh data

        private myMesh1:lib.Stage3dObjParser;
        private myMesh2:lib.Stage3dObjParser;
        private myMesh3:lib.Stage3dObjParser;
        private myMesh4:lib.Stage3dObjParser;
        private myMesh5:lib.Stage3dObjParser;


        private terrainMesh:lib.Stage3dObjParser;

        private stage3d:Stage3D;
        // the 3d graphics window on the stage
        private context3D:Context3D;

        public constructor(canvas:HTMLCanvasElement)
        {
            //canvas.onmousedown = (e)=>{
            //    this.nextBlendmode();
            //}
            window.onkeypress = (e) =>{
                switch(e.charCode)
                {
                    case 98: // the b key
                        this.nextBlendmode();
                        break;
                    case 109: // the m key
                        this.nextMesh();
                        break;
                    case 116: // the t key
                        this.nextTexture();
                        break;
                    case 100: // the d key
                        this.toggleDepthTest();
                        break;
                }
            }


            // force these labels to be set
            this.nextMesh();
            this.nextTexture();
            this.nextBlendmode();
            this.toggleDepthTest();

            this.stage3d = new Stage3D(canvas);
            this.stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, this.onCreated);
            this.stage3d.requestContext3D();
        }

        private onCreated = (event:Event) =>
        {

            this.context3D = this.stage3d.context3D;


            this.context3D.configureBackBuffer(this.stage3d.stageWidth, this.stage3d.stageHeight, 2, true);

            this.initData();
            this.initShaders();

            var myTextureData1 = lib.ImageLoader.getInstance().get("blendAssets/titlescreen.png");
            this.myTexture1 = this.context3D.createTexture(myTextureData1.width, myTextureData1.height, Context3DTextureFormat.BGRA, false);
            //uploadTextureWithMipmaps(this.myTexture1, myTextureData1.bitmapData);
            this.myTexture1.uploadFromBitmapData(myTextureData1, 0);

            var myTextureData2 = lib.ImageLoader.getInstance().get("blendAssets/fire.jpg");
            this.myTexture2 = this.context3D.createTexture(myTextureData2.width, myTextureData2.height, Context3DTextureFormat.BGRA, false);
            this.myTexture2.uploadFromBitmapData(myTextureData2, 0);

            var myTextureData3 = lib.ImageLoader.getInstance().get("blendAssets/flare.jpg");
            this.myTexture3 = this.context3D.createTexture(myTextureData3.width, myTextureData3.height, Context3DTextureFormat.BGRA, false);
            //uploadTextureWithMipmaps(this.myTexture3, myTextureData3.bitmapData);
            this.myTexture3.uploadFromBitmapData(myTextureData3, 0);

            var myTextureData4 = lib.ImageLoader.getInstance().get("blendAssets/glow.jpg");
            this.myTexture4 = this.context3D.createTexture(myTextureData4.width, myTextureData4.height, Context3DTextureFormat.BGRA, false);
            //uploadTextureWithMipmaps(this.myTexture4, myTextureData4.bitmapData);
            this.myTexture4.uploadFromBitmapData(myTextureData4, 0);

            var myTextureData5 = lib.ImageLoader.getInstance().get("blendAssets/smoke.jpg");
            this.myTexture5 = this.context3D.createTexture(myTextureData5.width, myTextureData5.height, Context3DTextureFormat.BGRA, false);
            //uploadTextureWithMipmaps(this.myTexture5, myTextureData5.bitmapData);
            this.myTexture5.uploadFromBitmapData(myTextureData5, 0);

            var myTextureData6 = lib.ImageLoader.getInstance().get("blendAssets/leaf.png");
            this.myTexture6 = this.context3D.createTexture(myTextureData6.width, myTextureData6.height, Context3DTextureFormat.BGRA, false);
            //uploadTextureWithMipmaps(this.myTexture5, myTextureData5.bitmapData);
            this.myTexture6.uploadFromBitmapData(myTextureData6, 0);

            //terrainTexture = context3D.createTexture(terrainTextureData.width, terrainTextureData.height, Context3DTextureFormat.BGRA, false);
            //uploadTextureWithMipmaps(terrainTexture, terrainTextureData.bitmapData);

            // create projection matrix for our 3D scene
            this.projectionmatrix.identity();
            // 45 degrees FOV, 640/480 aspect ratio, 0.1=near, 100=far
            this.projectionmatrix.perspectiveFieldOfViewRH(45.0, this.stage3d.stageWidth / this.stage3d.stageHeight, 0.01, 5000.0);

            // create a matrix that defines the camera location
            this.viewmatrix.identity();
            // move the camera back a little so we can see the mesh
            this.viewmatrix.appendTranslation(0, 0, -1.5);

            // tilt the terrain a little so it is coming towards us
            //terrainviewmatrix.identity();
            //terrainviewmatrix.appendRotation(-60, Vector3D.X_AXIS);

            // start the render loop!
            this.enterFrame();
        }

        private enterFrame = ()=>{
            // clear scene before rendering is mandatory
            this.context3D.clear(0.3,0.3,0.3);
            // move or rotate more each frame
            this.t += 2.0;
            // scroll and render the terrain once
            //renderTerrain();
            // render whatever mesh is selected
            this.renderMesh();
            // present/flip back buffer
            // now that all meshes have been drawn
            this.context3D.present();

            requestAnimationFrame(this.enterFrame);
        }

        private renderMesh():void
        {

            this.context3D.setDepthTest(this._depthTestEnabled, Context3DCompareMode.LESS);



            // for our tests, don't cull any polies
            //context3D.setCulling(Context3DTriangleFace.NONE);
            // clear the transformation matrix to 0,0,0
            this.modelmatrix.identity();
            this.context3D.setProgram ( this.shaderProgram1 );

            this.setTexture();
            this.setBlendmode();

            this.modelmatrix.appendRotation(this.t*0.7, Vector3D.Y_AXIS);
            this.modelmatrix.appendRotation(this.t*0.6, Vector3D.X_AXIS);
            this.modelmatrix.appendRotation(this.t*1.0, Vector3D.Y_AXIS);

            // clear the matrix and append new angles
            this.modelViewProjection.identity();
            this.modelViewProjection.append(this.modelmatrix);
            this.modelViewProjection.append(this.viewmatrix);
            this.modelViewProjection.append(this.projectionmatrix);
            // pass our matrix data to the shader program
            this.context3D.setProgramConstantsFromMatrix("vc0", this.modelViewProjection, false ); // todo:true

            switch(this.meshNum)
            {
                case 0:
                    this.myMesh = this.myMesh1;
                    break;
                case 1:
                    this.myMesh = this.myMesh2;
                    break;
                case 2:
                    this.myMesh = this.myMesh3;
                    break;
                case 3:
                    this.myMesh = this.myMesh4;
                    break;
                case 4:
                    this.myMesh = this.myMesh5;
                    break;
            }

            // draw a mesh
            // position
            this.context3D.setVertexBufferAt("va0", this.myMesh.positionsBuffer,
                0, Context3DVertexBufferFormat.FLOAT_3);
            // tex coord
            this.context3D.setVertexBufferAt("va1", this.myMesh.uvBuffer,
                0, Context3DVertexBufferFormat.FLOAT_2);
            // vertex rgba
            this.context3D.setVertexBufferAt("va2", this.myMesh.colorsBuffer,
                0, Context3DVertexBufferFormat.FLOAT_4);
            // render it
            this.context3D.drawTriangles(this.myMesh.indexBuffer,
                0, this.myMesh.indexBufferCount);

        }
        private setTexture():void
        {
            switch(this.texNum)
            {
                case 0:
                    this.context3D.setTextureAt("fs0", this.myTexture1);
                    break;
                case 1:
                    this.context3D.setTextureAt("fs0", this.myTexture2);
                    break;
                case 2:
                    this.context3D.setTextureAt("fs0", this.myTexture3);
                    break;
                case 3:
                    this.context3D.setTextureAt("fs0", this.myTexture4);
                    break;
                case 4:
                    this.context3D.setTextureAt("fs0", this.myTexture5);
                    break;
                case 5:
                    this.context3D.setTextureAt("fs0", this.myTexture6);
                    break;
            }
        }

        private setBlendmode():void
        {
            // All possible blendmodes:
            // Context3DBlendFactor.DESTINATION_ALPHA
            // Context3DBlendFactor.DESTINATION_COLOR
            // Context3DBlendFactor.ONE
            // Context3DBlendFactor.ONE_MINUS_DESTINATION_ALPHA
            // Context3DBlendFactor.ONE_MINUS_DESTINATION_COLOR
            // Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA
            // Context3DBlendFactor.ONE_MINUS_SOURCE_COLOR
            // Context3DBlendFactor.SOURCE_ALPHA
            // Context3DBlendFactor.SOURCE_COLOR
            // Context3DBlendFactor.ZERO
            switch(this.blendNum)
            {
                case 0:
                    // the default: nice for opaque textures
                    this.context3D.setBlendFactors(
                        Context3DBlendFactor.ONE,
                        Context3DBlendFactor.ZERO);
                    break;
                case 1:
                    // perfect for transparent textures like foliage/fences/fonts
                    this.context3D.setBlendFactors(
                        Context3DBlendFactor.SOURCE_ALPHA,
                        Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
                    break;
                case 2:
                    // perfect to make it lighten the scene only (black is not drawn)
                    this.context3D.setBlendFactors(
                        Context3DBlendFactor.SOURCE_COLOR,
                        Context3DBlendFactor.ONE);
                    break;
                case 3:
                    // just lightens the scene - great for particles
                    this.context3D.setBlendFactors(
                        Context3DBlendFactor.ONE,
                        Context3DBlendFactor.ONE);
                    break;
                case 4:
                    // perfect for when you want to darken only (smoke, etc)
                    this.context3D.setBlendFactors(
                        Context3DBlendFactor.DESTINATION_COLOR,
                        Context3DBlendFactor.ZERO);
                    break;
                case 5:
                    this.context3D.setBlendFactors(
                        Context3DBlendFactor.ONE,
                        Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA
                    )
                    break;
            }
        }

        private nextMesh():void
        {
            this.meshNum++;
            if (this.meshNum > this.meshNumMax)
                this.meshNum = 0;
            switch(this.meshNum)
            {
                case 0:
                    document.getElementById("p3").innerText = '[M] Random Particle Cluster';
                    break;
                case 1:
                    document.getElementById("p3").innerText ='[M] Round Puff Cluster';
                    break;
                case 2:
                    document.getElementById("p3").innerText ='[M] Cube Model';
                    break;
                case 3:
                    document.getElementById("p3").innerText ='[M] Sphere Model';
                    break;
                case 4:
                    document.getElementById("p3").innerText ='[M] Spaceship Model';
                    break;
            }
        }

        private nextTexture():void
        {
            this.texNum++;
            if (this.texNum > this.texNumMax)
                this.texNum = 0;
            switch(this.texNum)
            {
                case 0:
                    document.getElementById("p2").innerText =  '[T] Transparent titlescreen Texture';
                    break;
                case 1:
                    document.getElementById("p2").innerText = '[T] Fire Texture';
                    break;
                case 2:
                    document.getElementById("p2").innerText = '[T] Lens Flare Texture';
                    break;
                case 3:
                    document.getElementById("p2").innerText = '[T] Glow Texture';
                    break;
                case 4:
                    document.getElementById("p2").innerText = '[T] Smoke Texture';
                    break;
                case 5:
                    document.getElementById("p2").innerText =  '[T] Transparent Leaf Texture';
                    break;
            }
        }


        private nextBlendmode():void
        {
            this.blendNum++;
            if (this.blendNum > this.blendNumMax)
                this.blendNum = 0;

            switch(this.blendNum)
            {
                case 0:
                    document.getElementById("p1").innerText = '[B] ONE,ZERO';
                    break;
                case 1:
                    document.getElementById("p1").innerText = '[B] SOURCE_ALPHA,ONE_MINUS_SOURCE_ALPHA';
                    break;
                case 2:
                    document.getElementById("p1").innerText = '[B] SOURCE_COLOR,ONE';
                    break;
                case 3:
                    document.getElementById("p1").innerText = '[B] ONE,ONE';
                    break;
                case 4:
                    document.getElementById("p1").innerText = '[B] DESTINATION_COLOR,ZERO';
                    break;
                case 5:
                    document.getElementById("p1").innerText = '[B] ONE,ONE_MINUS_SOURCE_ALPHA';
                    break;
            }
        }

        private toggleDepthTest():void
        {
            this._depthTestEnabled = !this._depthTestEnabled;
            document.getElementById("p4").innerText = '[D] DepthTest :  ' + this._depthTestEnabled + " , LESS";
        }


        private initData():void
        {
            // parse the OBJ file and create buffers
            console.log("Parsing the meshes...");

            this.myMesh1 = new lib.Stage3dObjParser(lib.FileLoader.getInstance().get("blendAssets/cluster.obj").response, this.context3D, 1, true, true);
            this.myMesh2 = new lib.Stage3dObjParser(lib.FileLoader.getInstance().get("blendAssets/puff.obj").response, this.context3D, 1, true, true);
            this.myMesh3 = new lib.Stage3dObjParser(lib.FileLoader.getInstance().get("blendAssets/box.obj").response, this.context3D, 1, true, true);
            this.myMesh4 = new lib.Stage3dObjParser(lib.FileLoader.getInstance().get("blendAssets/sphere.obj").response, this.context3D, 1, true, true);
            this.myMesh5 = new lib.Stage3dObjParser(lib.FileLoader.getInstance().get("blendAssets/spaceship.obj").response, this.context3D, 1, true, true);

            // parse the terrain <well> mesh
            //console.log("Parsing the terrain...");
            //terrainMesh = new Stage3dObjParser(
            //    terrainObjData, context3D, 1, true, true);
        }


        private initShaders():void
        {
            // combine shaders into a program which we then upload to the GPU
            this.shaderProgram1 = this.context3D.createProgram();
            this.shaderProgram1.upload("shader-vs", "shader-fs"); // shaders are in html file
        }



        public static main():void
        {

            var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("my-canvas");

            lib.ImageLoader.getInstance().add("blendAssets/titlescreen.png"); //256 256
            lib.ImageLoader.getInstance().add("blendAssets/fire.jpg"); //256 256
            lib.ImageLoader.getInstance().add("blendAssets/flare.jpg");//128 128
            lib.ImageLoader.getInstance().add("blendAssets/glow.jpg"); //128 128
            lib.ImageLoader.getInstance().add("blendAssets/smoke.jpg");//128 128
            lib.ImageLoader.getInstance().add("blendAssets/leaf.png"); //256 256
            //lib.ImageLoader.getInstance().add("blendAssets/terrain_texture.jpg"); //512 512

            lib.ImageLoader.getInstance().downloadAll(()=>
            {
                //console.log("images loaded!");
                if (lib.FileLoader.getInstance().isDone())
                    new test.blend(canvas);
            });

            lib.FileLoader.getInstance().add("blendAssets/cluster.obj");
            lib.FileLoader.getInstance().add("blendAssets/puff.obj");
            lib.FileLoader.getInstance().add("blendAssets/sphere.obj");
            lib.FileLoader.getInstance().add("blendAssets/spaceship.obj");
            lib.FileLoader.getInstance().add("blendAssets/box.obj");
            //lib.FileLoader.getInstance().add("blendAssets/terrain.obj");

            lib.FileLoader.getInstance().downloadAll(()=>
            {
                console.log("models loaded!");
                if (lib.ImageLoader.getInstance().isDone())
                    new test.blend(canvas);
            })
        }


    }
}



window.onload = test.blend.main;