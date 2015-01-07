/// <reference path="../stage3d.d.ts" />
declare module BunnyMark {
    class Rectangle {
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        constructor(x?: number, y?: number, w?: number, h?: number);
    }
}
declare module BunnyMark {
    class Timer {
        private _start;
        private _time;
        constructor();
        public getTimer(): number;
    }
}
declare module BunnyMark {
    class ImageLoader {
        private static _instance;
        constructor();
        static getInstance(): ImageLoader;
        private _queue;
        private _successCount;
        private _errorCount;
        private _cache;
        public add(path: string): void;
        public downloadAll(p_callback: Function): void;
        public isDone(): boolean;
        public get(path: string): HTMLImageElement;
    }
}
declare module GPUSprite {
    class Sprite {
        public _parent: SpriteRenderLayer;
        public _spriteId: number;
        public _childId: number;
        private _pos;
        private _visible;
        private _scaleX;
        private _scaleY;
        private _rotation;
        private _alpha;
        public visible : boolean;
        public alpha : number;
        public position : {
            x: number;
            y: number;
        };
        public scaleX : number;
        public scaleY : number;
        public rotation : number;
        public rect : {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        public parent : SpriteRenderLayer;
        public spriteId : number;
        public childId : number;
        constructor();
    }
}
declare module GPUSprite {
    class SpriteRenderLayer {
        public _spriteSheet: SpriteSheet;
        private _vertexData;
        private _indexData;
        private _uvData;
        private _context3D;
        private _parent;
        private _children;
        private _indexBuffer;
        private _vertexBuffer;
        private _uvBuffer;
        private _shaderProgram;
        private _updateVBOs;
        constructor(context3D: stageJS.Context3D, spriteSheet: SpriteSheet);
        public parent : SpriteRenderStage;
        public numChildren : number;
        public createChild(spriteId: number): Sprite;
        public addChild(sprite: Sprite, spriteId: number): void;
        public removeChild(child: Sprite): void;
        public draw(): void;
        private setupShaders();
        private updateTexture();
        private updateChildVertexData(sprite);
    }
}
declare module GPUSprite {
    class SpriteRenderStage {
        private _stage3D;
        private _context3D;
        private _rect;
        private _layers;
        private _modelViewMatrix;
        public position : {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        private _orth;
        public modelViewMatrix : stageJS.geom.Matrix3D;
        constructor(stage3D: stageJS.Stage3D, context3D: stageJS.Context3D, rect: {
            x: number;
            y: number;
            width: number;
            height: number;
        });
        public addLayer(layer: SpriteRenderLayer): void;
        public removeLayer(layer: SpriteRenderLayer): void;
        public draw(): void;
        public drawDeferred(): void;
        public configureBackBuffer(width: number, height: number): void;
    }
}
declare module GPUSprite {
    class SpriteSheet {
        public _texture: stageJS.Texture;
        public _spriteSheet: stageJS.BitmapData;
        private _uvCoords;
        private _rects;
        constructor(width: number, height: number);
        public addSprite(srcBits: stageJS.BitmapData, srcRect: {
            x: number;
            y: number;
            width: number;
            height: number;
        }, destPt: {
            x: number;
            y: number;
        }): number;
        public addSprite(srcBits: HTMLImageElement, srcRect: {
            x: number;
            y: number;
            width: number;
            height: number;
        }, destPt: {
            x: number;
            y: number;
        }): number;
        public removeSprite(spriteId: number): void;
        public numSprites : number;
        public getUVCoords(spriteId: number): number[];
        public getRect(spriteId: number): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        public uploadTexture(context3D: stageJS.Context3D): void;
    }
}
declare module BunnyMark {
    class BunnySprite {
        private _speedX;
        private _speedY;
        private _gpuSprite;
        constructor(gs: any);
        public speedX : number;
        public speedY : number;
        public sprite : GPUSprite.Sprite;
    }
}
declare module BunnyMark {
    class BunnyLayer {
        private _bunnies;
        private _spriteSheet;
        public _renderLayer: GPUSprite.SpriteRenderLayer;
        private _bunnySpriteID;
        private gravity;
        private maxX;
        private minX;
        private maxY;
        private minY;
        constructor(view: Rectangle);
        public setPosition(view: Rectangle): void;
        public createRenderLayer(context3D: stageJS.Context3D): GPUSprite.SpriteRenderLayer;
        public addBunny(numBunnies: number): void;
        public update(currentTime: number): void;
    }
}
declare module BunnyMark {
    class Background {
        private context3D;
        private _width;
        private _height;
        private texBM;
        private tex;
        private vb;
        private uvb;
        private ib;
        private shader_program;
        private _modelViewMatrix;
        private vertices;
        private uvt;
        private indices;
        public cols: number;
        public rows: number;
        public numTriangles: number;
        public numVertices: number;
        public numIndices: number;
        private _timer;
        constructor(ctx3D: stageJS.Context3D, w: number, h: number);
        private buildMesh();
        public render(): void;
    }
}
declare module BunnyMark {
    function main(): void;
}
declare module SimpleTest {
    function main(): void;
    function init(): void;
}
