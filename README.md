Stage3D.js
=====

Stage3D API on top of WebGL


Here is a drawTriangle example using TypeScript :

	var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("my-canvas");

    stage3d = new stageJS.Stage3D(canvas);
    stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, onCreated);
    stage3d.requestContext3D();
  
  
	function onCreated(e: stagl.events.Event): void
	{
	  context3d = stage3d.context3D;
	  context3d.configureBackBuffer(stage3d.stageWidth, stage3d.stageHeight, 2, true);
	
	  var program: stagl.Program3D = context3d.createProgram();
	  program.upload("shader-vs", "shader-fs"); // shaders are in html file
	  context3d.setProgram(program);
	
	
	  var vertexBuffer: stagl.VertexBuffer3D = context3d.createVertexBuffer(3, 7);
	  vertexBuffer.uploadFromVector([
	      -1, -1, 0, 1, 0, 0, 1,   //xyz rgba
	      1, -1, 0, 0, 1, 0, 1,
	      0, 1, 0, 0, 0, 1, 1]
	      , 0, 3);
	
	  context3d.setVertexBufferAt("va0", vertexBuffer, 0, stagl.Context3DVertexBufferFormat.FLOAT_3); // pos
	  context3d.setVertexBufferAt("va1", vertexBuffer, 3, stagl.Context3DVertexBufferFormat.FLOAT_4); // color
	
	
	  var indexBuffer: stagl.IndexBuffer3D = context3d.createIndexBuffer(3);
	  indexBuffer.uploadFromVector([0, 1, 2], 0, 3);
	
	  context3d.clear(0.0, 0.0, 0.0, 1.0);
	  context3d.drawTriangles(indexBuffer);
	  context3d.present();
	
	}

##The MIT License (MIT)

Copyright (c) Nshen.net (nshen121@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.