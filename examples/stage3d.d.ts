declare module stageJS {
    class BitmapData {
        public transparent: boolean;
        private _rect;
        private _transparent;
        private _canvas;
        private _context;
        constructor(width: number, height: number, transparent?: boolean, fillColor?: number);
        static fromImageElement(img: HTMLImageElement): BitmapData;
        public width : number;
        public height : number;
        public canvas : HTMLCanvasElement;
        public imageData : ImageData;
        public rect : {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        public copyPixels(sourceBitmapData: BitmapData, sourceRect: {
            x: number;
            y: number;
            width: number;
            height: number;
        }, destPoint: {
            x: number;
            y: number;
        }): void;
        public copyPixels(sourceBitmapData: HTMLImageElement, sourceRect: {
            x: number;
            y: number;
            width: number;
            height: number;
        }, destPoint: {
            x: number;
            y: number;
        }): void;
        public draw(source: BitmapData): void;
        public draw(source: HTMLImageElement): void;
        public fillRect(rect: {
            x: number;
            y: number;
            width: number;
            height: number;
        }, color: number): void;
        private hexToRGBACSS(d);
    }
}
declare module stageJS.events {
    class Event {
        static CONTEXT3D_CREATE: string;
        public type: string;
        public target: Object;
        constructor(type: string);
        public clone(): Event;
    }
}
declare module stageJS.events {
    class ErrorEvent extends Event {
        static ERROR: string;
        constructor();
    }
}
declare module stageJS.events {
    class EventDispatcher {
        private listeners;
        private target;
        constructor(target?: any);
        public addEventListener(type: string, listener: Function): void;
        public removeEventListener(type: string, listener: Function): void;
        public dispatchEvent(event: Event): void;
        private getEventListenerIndex(type, listener);
        public hasEventListener(type: string, listener?: Function): boolean;
    }
}
declare module stageJS.geom {
    class Orientation3D {
        static AXIS_ANGLE: string;
        static EULER_ANGLES: string;
        static QUATERNION: string;
    }
}
declare module stageJS.geom {
    class Vector3D {
        static X_AXIS: Vector3D;
        static Y_AXIS: Vector3D;
        static Z_AXIS: Vector3D;
        public w: number;
        public x: number;
        public y: number;
        public z: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        public length : number;
        public lengthSquared : number;
        static angleBetween(a: Vector3D, b: Vector3D): number;
        static distance(pt1: Vector3D, pt2: Vector3D): number;
        public add(a: Vector3D): Vector3D;
        public subtract(a: Vector3D): Vector3D;
        public incrementBy(a: Vector3D): void;
        public decrementBy(a: Vector3D): void;
        public equals(toCompare: Vector3D, allFour?: boolean): boolean;
        public nearEquals(toCompare: Vector3D, tolerance: number, allFour?: boolean): boolean;
        public clone(): Vector3D;
        public copyFrom(sourceVector3D: Vector3D): void;
        public negate(): void;
        public scaleBy(s: number): void;
        public setTo(xa: number, ya: number, za: number): void;
        public normalize(): number;
        public crossProduct(a: Vector3D): Vector3D;
        public dotProduct(a: Vector3D): number;
        public project(): void;
        public toString(): string;
    }
}
declare module stageJS.geom {
    class Matrix3D {
        private static DEG_2_RAD;
        public determinant : number;
        public position : Vector3D;
        public rawData: Float32Array;
        constructor(v?: number[]);
        public append(lhs: Matrix3D): void;
        public prepend(rhs: Matrix3D): void;
        public appendScale(xScale: number, yScale: number, zScale: number): void;
        public prependScale(xScale: number, yScale: number, zScale: number): void;
        public appendTranslation(x: number, y: number, z: number): void;
        public prependTranslation(x: number, y: number, z: number): void;
        public appendRotation(degrees: number, axis: Vector3D, pivotPoint?: Vector3D): void;
        public prependRotation(degrees: number, axis: Vector3D, pivotPoint?: Vector3D): void;
        public clone(): Matrix3D;
        public copyColumnFrom(column: number, vector3D: Vector3D): void;
        public copyColumnTo(column: number, vector3D: Vector3D): void;
        public copyFrom(sourceMatrix3D: Matrix3D): void;
        public copyRawDataFrom(vector: number[], index?: number, transpose?: boolean): void;
        public copyRawDataTo(vector: number[], index?: number, transpose?: boolean): void;
        public copyRowFrom(row: number, vector3D: Vector3D): void;
        public copyRowTo(row: number, vector3D: Vector3D): void;
        public copyToMatrix3D(dest: Matrix3D): void;
        public decompose(orientationStyle?: String): Vector3D[];
        public identity(): void;
        static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number): Matrix3D;
        public interpolateTo(toMat: Matrix3D, percent: number): void;
        public invert(): boolean;
        public pointAt(pos: Vector3D, at?: Vector3D, up?: Vector3D): void;
        public recompose(components: Vector3D[], orientationStyle?: String): boolean;
        public transformVector(v: Vector3D): Vector3D;
        public deltaTransformVector(v: Vector3D): Vector3D;
        public transformVectors(vin: number[], vout: number[]): void;
        public transpose(): void;
        public toString(): string;
        private getRotateMatrix(axis, radians);
    }
}
declare module stageJS.geom {
    class Quaternion {
        public x: number;
        public y: number;
        public z: number;
        public w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        static lerp(qa: Quaternion, qb: Quaternion, percent: number): Quaternion;
        public fromMatrix3D(m: Matrix3D): Quaternion;
        public toMatrix3D(target?: Matrix3D): Matrix3D;
        public fromAxisAngle(axis: Vector3D, angleInRadians: number): void;
        public conjugate(): void;
        public toString(): string;
    }
}
declare module stageJS.geom {
    class PerspectiveMatrix3D extends Matrix3D {
        public lookAtLH(eye: Vector3D, at: Vector3D, up: Vector3D): void;
        public lookAtRH(eye: Vector3D, at: Vector3D, up: Vector3D): void;
        public perspectiveOffCenterLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void;
        public perspectiveLH(width: number, height: number, zNear: number, zFar: number): void;
        public perspectiveFieldOfViewLH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
        public orthoOffCenterLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void;
        public orthoLH(width: number, height: number, zNear: number, zFar: number): void;
        public perspectiveOffCenterRH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void;
        public perspectiveRH(width: number, height: number, zNear: number, zFar: number): void;
        public perspectiveFieldOfViewRH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
        public orthoOffCenterRH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void;
        public orthoRH(width: number, height: number, zNear: number, zFar: number): void;
    }
}
declare module stageJS {
    class Context3DVertexBufferFormat {
        static BYTES_4: string;
        static FLOAT_1: string;
        static FLOAT_2: string;
        static FLOAT_3: string;
        static FLOAT_4: string;
    }
}
declare module stageJS {
    class Context3DTextureFormat {
        static BGRA: string;
    }
}
declare module stageJS {
    class Context3DCompareMode {
        static ALWAYS: string;
        static EQUAL: string;
        static GREATER: string;
        static GREATER_EQUAL: string;
        static LESS: string;
        static LESS_EQUAL: string;
        static NEVER: string;
        static NOT_EQUAL: string;
    }
}
declare module stageJS {
    class Context3DBlendFactor {
        static ONE: number;
        static ZERO: number;
        static SOURCE_COLOR: number;
        static DESTINATION_COLOR: number;
        static SOURCE_ALPHA: number;
        static DESTINATION_ALPHA: number;
        static ONE_MINUS_SOURCE_COLOR: number;
        static ONE_MINUS_DESTINATION_COLOR: number;
        static ONE_MINUS_SOURCE_ALPHA: number;
        static ONE_MINUS_DESTINATION_ALPHA: number;
        static init(): void;
    }
}
declare module stageJS {
    class Context3DTriangleFace {
        static BACK: string;
        static FRONT: string;
        static FRONT_AND_BACK: string;
        static NONE: string;
    }
}
declare module stageJS {
    class VertexBuffer3D {
        private _numVertices;
        private _data32PerVertex;
        private _glBuffer;
        private _data;
        constructor(numVertices: number, data32PerVertex: number);
        public glBuffer : WebGLBuffer;
        public data32PerVertex : number;
        public uploadFromVector(data: number[], startVertex: number, numVertices: number): void;
        public dispose(): void;
    }
}
declare module stageJS {
    class IndexBuffer3D {
        public numIndices: number;
        private _data;
        private _glBuffer;
        constructor(numIndices: number);
        public glBuffer : WebGLBuffer;
        public uploadFromVector(data: number[], startOffset: number, count: number): void;
        public dispose(): void;
    }
}
declare module stageJS {
    class Texture {
        private _glTexture;
        private _streamingLevels;
        private _width;
        private _height;
        private _format;
        private _forRTT;
        private static _bindingTexture;
        private static __texUnit;
        private _textureUnit;
        constructor(width: number, height: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels: number);
        public __getGLTexture(): WebGLTexture;
        public textureUnit : number;
        public uploadFromBitmapData(source: BitmapData, miplevel?: number): void;
        public uploadFromBitmapData(source: HTMLImageElement, miplevel?: number): void;
        public uploadFromImage(source: any, miplevel?: number): void;
        public dispose(): void;
    }
}
declare module stageJS {
    class Program3D {
        private _glProgram;
        private _vShader;
        private _fShader;
        constructor();
        public glProgram : WebGLProgram;
        public dispose(): void;
        public upload(vertexProgramId?: string, fragmentProgramId?: string): void;
        private loadShader(elementId, type);
    }
}
declare module stageJS {
    var VERSION: string;
    class Stage3D extends events.EventDispatcher {
        private _context3D;
        private _canvas;
        constructor(canvas: HTMLCanvasElement);
        public context3D : Context3D;
        public stageWidth : number;
        public stageHeight : number;
        public requestContext3D(): void;
        private create3DContext();
        private onCreationError(e?);
        private onCreateSuccess();
    }
}
declare module stageJS {
    class Context3D {
        static GL: WebGLRenderingContext;
        private _clearBit;
        private _bendDisabled;
        private _depthDisabled;
        constructor();
        public configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): void;
        public createVertexBuffer(numVertices: number, data32PerVertex: number): VertexBuffer3D;
        public createIndexBuffer(numIndices: number): IndexBuffer3D;
        public createTexture(width: number, height: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): Texture;
        private _rttFramebuffer;
        public setRenderToTexture(texture: Texture, enableDepthAndStencil?: boolean, antiAlias?: number, surfaceSelector?: number, colorOutputIndex?: number): void;
        public setRenderToBackBuffer(): void;
        public createProgram(): Program3D;
        public setVertexBufferAt(variable: string, buffer: VertexBuffer3D, bufferOffset?: number, format?: String): void;
        public setProgramConstantsFromVector(variable: string, data: number[]): void;
        public setProgramConstantsFromMatrix(variable: string, matrix: geom.Matrix3D, transposedMatrix?: boolean): void;
        public setTextureAt(sampler: string, texture: Texture): void;
        private _linkedProgram;
        public setProgram(program: Program3D): void;
        public clear(red?: number, green?: number, blue?: number, alpha?: number, depth?: number, stencil?: number, mask?: number): void;
        public setCulling(triangleFaceToCull: string): void;
        public setDepthTest(depthMask: boolean, passCompareMode: string): void;
        public setBlendFactors(sourceFactor: number, destinationFactor: number): void;
        public drawTriangles(indexBuffer: IndexBuffer3D, firstIndex?: number, numTriangles?: number): void;
        public drawLines(indexBuffer: IndexBuffer3D, firstIndex?: number, numLines?: number): void;
        public drawPoints(indexBuffer: IndexBuffer3D, firstIndex?: number, numPoints?: number): void;
        public drawLineLoop(indexBuffer: IndexBuffer3D, firstIndex?: number, numPoints?: number): void;
        public drawLineStrip(indexBuffer: IndexBuffer3D, firstIndex?: number, numPoints?: number): void;
        public drawTriangleStrip(indexBuffer: IndexBuffer3D): void;
        public drawTriangleFan(indexBuffer: IndexBuffer3D): void;
        public present(): void;
        private _vaCache;
        private enableVA(keyInCache);
        private _vcCache;
        private enableVC(keyInCache);
        private _vcMCache;
        private enableVCM(keyInCache);
        private _texCache;
        private enableTex(keyInCache);
    }
}
