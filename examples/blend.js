/// <reference path="stage3d.d.ts"/>
/// <reference path="./lib/Stage3dObjParser.ts"/>
/// <reference path="./lib/ImageLoader.ts"/>
/// <reference path="./lib/FileLoader.ts"/>
var test;
(function (test) {
    var PerspectiveMatrix3D = stageJS.geom.PerspectiveMatrix3D;
    var Matrix3D = stageJS.geom.Matrix3D;
    var Stage3D = stageJS.Stage3D;
    var Context3DTextureFormat = stageJS.Context3DTextureFormat;
    var Context3DCompareMode = stageJS.Context3DCompareMode;
    var Vector3D = stageJS.geom.Vector3D;
    var Context3DVertexBufferFormat = stageJS.Context3DVertexBufferFormat;
    var Context3DBlendFactor = stageJS.Context3DBlendFactor;
    var blend = (function () {
        function blend(canvas) {
            var _this = this;
            // available blend/texture/mesh
            this.blendNum = -1;
            this.blendNumMax = 5;
            this.texNum = -1;
            this.texNumMax = 5;
            this.meshNum = -1;
            this.meshNumMax = 4;
            this._depthTestEnabled = true;
            // matrices that affect the mesh location and camera angles
            this.projectionmatrix = new PerspectiveMatrix3D();
            this.modelmatrix = new Matrix3D();
            this.viewmatrix = new Matrix3D();
            //private terrainviewmatrix:Matrix3D = new Matrix3D();
            this.modelViewProjection = new Matrix3D();
            // a simple frame counter used for animation
            this.t = 0;
            // a reusable loop counter
            this.looptemp = 0;
            this.onCreated = function (event) {
                _this.context3D = _this.stage3d.context3D;
                _this.context3D.configureBackBuffer(_this.stage3d.stageWidth, _this.stage3d.stageHeight, 2, true);
                _this.initData();
                _this.initShaders();
                var myTextureData1 = lib.ImageLoader.getInstance().get("blendAssets/titlescreen.png");
                _this.myTexture1 = _this.context3D.createTexture(myTextureData1.width, myTextureData1.height, Context3DTextureFormat.BGRA, false);
                //uploadTextureWithMipmaps(this.myTexture1, myTextureData1.bitmapData);
                _this.myTexture1.uploadFromBitmapData(myTextureData1, 0);
                var myTextureData2 = lib.ImageLoader.getInstance().get("blendAssets/fire.jpg");
                _this.myTexture2 = _this.context3D.createTexture(myTextureData2.width, myTextureData2.height, Context3DTextureFormat.BGRA, false);
                _this.myTexture2.uploadFromBitmapData(myTextureData2, 0);
                var myTextureData3 = lib.ImageLoader.getInstance().get("blendAssets/flare.jpg");
                _this.myTexture3 = _this.context3D.createTexture(myTextureData3.width, myTextureData3.height, Context3DTextureFormat.BGRA, false);
                //uploadTextureWithMipmaps(this.myTexture3, myTextureData3.bitmapData);
                _this.myTexture3.uploadFromBitmapData(myTextureData3, 0);
                var myTextureData4 = lib.ImageLoader.getInstance().get("blendAssets/glow.jpg");
                _this.myTexture4 = _this.context3D.createTexture(myTextureData4.width, myTextureData4.height, Context3DTextureFormat.BGRA, false);
                //uploadTextureWithMipmaps(this.myTexture4, myTextureData4.bitmapData);
                _this.myTexture4.uploadFromBitmapData(myTextureData4, 0);
                var myTextureData5 = lib.ImageLoader.getInstance().get("blendAssets/smoke.jpg");
                _this.myTexture5 = _this.context3D.createTexture(myTextureData5.width, myTextureData5.height, Context3DTextureFormat.BGRA, false);
                //uploadTextureWithMipmaps(this.myTexture5, myTextureData5.bitmapData);
                _this.myTexture5.uploadFromBitmapData(myTextureData5, 0);
                var myTextureData6 = lib.ImageLoader.getInstance().get("blendAssets/leaf.png");
                _this.myTexture6 = _this.context3D.createTexture(myTextureData6.width, myTextureData6.height, Context3DTextureFormat.BGRA, false);
                //uploadTextureWithMipmaps(this.myTexture5, myTextureData5.bitmapData);
                _this.myTexture6.uploadFromBitmapData(myTextureData6, 0);
                //terrainTexture = context3D.createTexture(terrainTextureData.width, terrainTextureData.height, Context3DTextureFormat.BGRA, false);
                //uploadTextureWithMipmaps(terrainTexture, terrainTextureData.bitmapData);
                // create projection matrix for our 3D scene
                _this.projectionmatrix.identity();
                // 45 degrees FOV, 640/480 aspect ratio, 0.1=near, 100=far
                _this.projectionmatrix.perspectiveFieldOfViewRH(45.0, _this.stage3d.stageWidth / _this.stage3d.stageHeight, 0.01, 5000.0);
                // create a matrix that defines the camera location
                _this.viewmatrix.identity();
                // move the camera back a little so we can see the mesh
                _this.viewmatrix.appendTranslation(0, 0, -1.5);
                // tilt the terrain a little so it is coming towards us
                //terrainviewmatrix.identity();
                //terrainviewmatrix.appendRotation(-60, Vector3D.X_AXIS);
                // start the render loop!
                _this.enterFrame();
            };
            this.enterFrame = function () {
                // clear scene before rendering is mandatory
                _this.context3D.clear(0.3, 0.3, 0.3);
                // move or rotate more each frame
                _this.t += 2.0;
                // scroll and render the terrain once
                //renderTerrain();
                // render whatever mesh is selected
                _this.renderMesh();
                // present/flip back buffer
                // now that all meshes have been drawn
                _this.context3D.present();
                requestAnimationFrame(_this.enterFrame);
            };
            //canvas.onmousedown = (e)=>{
            //    this.nextBlendmode();
            //}
            window.onkeypress = function (e) {
                switch (e.charCode) {
                    case 98:
                        _this.nextBlendmode();
                        break;
                    case 109:
                        _this.nextMesh();
                        break;
                    case 116:
                        _this.nextTexture();
                        break;
                    case 100:
                        _this.toggleDepthTest();
                        break;
                }
            };
            // force these labels to be set
            this.nextMesh();
            this.nextTexture();
            this.nextBlendmode();
            this.toggleDepthTest();
            this.stage3d = new Stage3D(canvas);
            this.stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, this.onCreated);
            this.stage3d.requestContext3D();
        }
        blend.prototype.renderMesh = function () {
            this.context3D.setDepthTest(this._depthTestEnabled, Context3DCompareMode.LESS);
            // for our tests, don't cull any polies
            //context3D.setCulling(Context3DTriangleFace.NONE);
            // clear the transformation matrix to 0,0,0
            this.modelmatrix.identity();
            this.context3D.setProgram(this.shaderProgram1);
            this.setTexture();
            this.setBlendmode();
            this.modelmatrix.appendRotation(this.t * 0.7, Vector3D.Y_AXIS);
            this.modelmatrix.appendRotation(this.t * 0.6, Vector3D.X_AXIS);
            this.modelmatrix.appendRotation(this.t * 1.0, Vector3D.Y_AXIS);
            // clear the matrix and append new angles
            this.modelViewProjection.identity();
            this.modelViewProjection.append(this.modelmatrix);
            this.modelViewProjection.append(this.viewmatrix);
            this.modelViewProjection.append(this.projectionmatrix);
            // pass our matrix data to the shader program
            this.context3D.setProgramConstantsFromMatrix("vc0", this.modelViewProjection, false); // todo:true
            switch (this.meshNum) {
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
            this.context3D.setVertexBufferAt("va0", this.myMesh.positionsBuffer, 0, Context3DVertexBufferFormat.FLOAT_3);
            // tex coord
            this.context3D.setVertexBufferAt("va1", this.myMesh.uvBuffer, 0, Context3DVertexBufferFormat.FLOAT_2);
            // vertex rgba
            this.context3D.setVertexBufferAt("va2", this.myMesh.colorsBuffer, 0, Context3DVertexBufferFormat.FLOAT_4);
            // render it
            this.context3D.drawTriangles(this.myMesh.indexBuffer, 0, this.myMesh.indexBufferCount);
        };
        blend.prototype.setTexture = function () {
            switch (this.texNum) {
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
        };
        blend.prototype.setBlendmode = function () {
            switch (this.blendNum) {
                case 0:
                    // the default: nice for opaque textures
                    this.context3D.setBlendFactors(Context3DBlendFactor.ONE, Context3DBlendFactor.ZERO);
                    break;
                case 1:
                    // perfect for transparent textures like foliage/fences/fonts
                    this.context3D.setBlendFactors(Context3DBlendFactor.SOURCE_ALPHA, Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
                    break;
                case 2:
                    // perfect to make it lighten the scene only (black is not drawn)
                    this.context3D.setBlendFactors(Context3DBlendFactor.SOURCE_COLOR, Context3DBlendFactor.ONE);
                    break;
                case 3:
                    // just lightens the scene - great for particles
                    this.context3D.setBlendFactors(Context3DBlendFactor.ONE, Context3DBlendFactor.ONE);
                    break;
                case 4:
                    // perfect for when you want to darken only (smoke, etc)
                    this.context3D.setBlendFactors(Context3DBlendFactor.DESTINATION_COLOR, Context3DBlendFactor.ZERO);
                    break;
                case 5:
                    this.context3D.setBlendFactors(Context3DBlendFactor.ONE, Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
                    break;
            }
        };
        blend.prototype.nextMesh = function () {
            this.meshNum++;
            if (this.meshNum > this.meshNumMax)
                this.meshNum = 0;
            switch (this.meshNum) {
                case 0:
                    document.getElementById("p3").innerText = '[M] Random Particle Cluster';
                    break;
                case 1:
                    document.getElementById("p3").innerText = '[M] Round Puff Cluster';
                    break;
                case 2:
                    document.getElementById("p3").innerText = '[M] Cube Model';
                    break;
                case 3:
                    document.getElementById("p3").innerText = '[M] Sphere Model';
                    break;
                case 4:
                    document.getElementById("p3").innerText = '[M] Spaceship Model';
                    break;
            }
        };
        blend.prototype.nextTexture = function () {
            this.texNum++;
            if (this.texNum > this.texNumMax)
                this.texNum = 0;
            switch (this.texNum) {
                case 0:
                    document.getElementById("p2").innerText = '[T] Transparent titlescreen Texture';
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
                    document.getElementById("p2").innerText = '[T] Transparent Leaf Texture';
                    break;
            }
        };
        blend.prototype.nextBlendmode = function () {
            this.blendNum++;
            if (this.blendNum > this.blendNumMax)
                this.blendNum = 0;
            switch (this.blendNum) {
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
        };
        blend.prototype.toggleDepthTest = function () {
            this._depthTestEnabled = !this._depthTestEnabled;
            document.getElementById("p4").innerText = '[D] DepthTest :  ' + this._depthTestEnabled + " , LESS";
        };
        blend.prototype.initData = function () {
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
        };
        blend.prototype.initShaders = function () {
            // combine shaders into a program which we then upload to the GPU
            this.shaderProgram1 = this.context3D.createProgram();
            this.shaderProgram1.upload("shader-vs", "shader-fs"); // shaders are in html file
        };
        blend.main = function () {
            var canvas = document.getElementById("my-canvas");
            lib.ImageLoader.getInstance().add("blendAssets/titlescreen.png"); //256 256
            lib.ImageLoader.getInstance().add("blendAssets/fire.jpg"); //256 256
            lib.ImageLoader.getInstance().add("blendAssets/flare.jpg"); //128 128
            lib.ImageLoader.getInstance().add("blendAssets/glow.jpg"); //128 128
            lib.ImageLoader.getInstance().add("blendAssets/smoke.jpg"); //128 128
            lib.ImageLoader.getInstance().add("blendAssets/leaf.png"); //256 256
            //lib.ImageLoader.getInstance().add("blendAssets/terrain_texture.jpg"); //512 512
            lib.ImageLoader.getInstance().downloadAll(function () {
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
            lib.FileLoader.getInstance().downloadAll(function () {
                console.log("models loaded!");
                if (lib.ImageLoader.getInstance().isDone())
                    new test.blend(canvas);
            });
        };
        return blend;
    })();
    test.blend = blend;
})(test || (test = {}));
window.onload = test.blend.main;
