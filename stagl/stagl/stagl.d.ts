/// <reference path="definitions/WebGL.d.ts" />
declare module stagl.events {
    class EventDispatcher {
        private listeners;
        private target;
        constructor(target?: any);
        public addEventListener(type: string, listener: Function): void;
        public removeEventListener(type: string, listener: Function): void;
        public dispatchEvent(event: events.Event): void;
        private getEventListenerIndex(type, listener);
        public hasEventListener(type: string, listener?: Function): boolean;
    }
}
declare module stagl.events {
    class Event {
        static CONTEXT3D_CREATE: string;
        public type: string;
        public target: Object;
        constructor(type: string);
        public clone(): Event;
    }
}
declare module stagl.events {
    class ErrorEvent extends events.Event {
        static ERROR: string;
        constructor();
    }
}
declare module stagl.geom {
    class Matrix3D {
        public determinant : number;
        public position : geom.Vector3D;
        public rawData: Float32Array;
        constructor(v?: number[]);
        public append(lhs: Matrix3D): void;
        public prepend(rhs: Matrix3D): void;
        public appendRotation(degrees: number, axis: geom.Vector3D, pivotPoint?: geom.Vector3D): void;
        public appendScale(xScale: number, yScale: number, zScale: number): void;
        public appendTranslation(x: number, y: number, z: number): void;
        public prependRotation(degrees: number, axis: geom.Vector3D, pivotPoint?: geom.Vector3D): void;
        public prependScale(xScale: number, yScale: number, zScale: number): void;
        public prependTranslation(x: number, y: number, z: number): void;
        public clone(): Matrix3D;
        public copyColumnFrom(column: number, vector3D: geom.Vector3D): void;
        public copyColumnTo(column: number, vector3D: geom.Vector3D): void;
        public copyFrom(sourceMatrix3D: Matrix3D): void;
        public copyRawDataFrom(vector: number[], index?: number, transpose?: boolean): void;
        public copyRawDataTo(vector: number[], index?: number, transpose?: boolean): void;
        public copyRowFrom(row: number, vector3D: geom.Vector3D): void;
        public copyRowTo(row: number, vector3D: geom.Vector3D): void;
        public copyToMatrix3D(dest: Matrix3D): void;
        public identity(): void;
        static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number): Matrix3D;
        public interpolateTo(toMat: Matrix3D, percent: number): void;
        public invert(): boolean;
        public pointAt(pos: geom.Vector3D, at?: geom.Vector3D, up?: geom.Vector3D): void;
        public recompose(components: geom.Vector3D[], orientationStyle?: String): boolean;
        public transformVector(v: geom.Vector3D): geom.Vector3D;
        public deltaTransformVector(v: geom.Vector3D): geom.Vector3D;
        public transformVectors(vin: number[], vout: number[]): void;
        public transpose(): void;
        private getRotateMatrix(axis, degrees);
    }
}
declare module stagl.geom {
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
declare module stagl {
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
declare module stagl {
    class Context3DVertexBufferFormat {
        static BYTES_4: string;
        static FLOAT_1: string;
        static FLOAT_2: string;
        static FLOAT_3: string;
        static FLOAT_4: string;
    }
}
declare module stagl {
    class Program3D {
        private _glProgram;
        private _vShader;
        private _fShader;
        constructor();
        public glProgram : WebGLProgram;
        public dispose(): void;
        public upload(vertexProgramId?: string, fragmentProgramId?: string): void;
        private loadShader(elementId, type);
        public getShader2(elementId: string): WebGLShader;
    }
}
declare module stagl {
    var VERSION: number;
    class Stage3D extends stagl.events.EventDispatcher {
        private _context3D;
        private _canvas;
        private _stageWidth;
        private _stageHeight;
        constructor(canvas: HTMLCanvasElement);
        public context3D : stagl.Context3D;
        public stageWidth : number;
        public stageHeight : number;
        public requestContext3D(): void;
        private onCreationError(e?);
        private onCreateSuccess();
    }
}
declare module stagl {
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
declare module stagl {
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
declare module stagl {
    class Texture {
        private _glTexture;
        private _streamingLevels;
        constructor(streamingLevels: number);
        public uploadFromBitmapData(source: HTMLImageElement, miplevel?: number): void;
        public uploadFromImage(source: HTMLImageElement, miplevel?: number): void;
    }
}
declare module stagl {
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
declare module stagl {
    class Context3D {
        static GL: WebGLRenderingContext;
        private _clearBit;
        constructor();
        public configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): void;
        public createVertexBuffer(numVertices: number, data32PerVertex: number): stagl.VertexBuffer3D;
        public createIndexBuffer(numIndices: number): stagl.IndexBuffer3D;
        public createTexture(streamingLevels?: number): stagl.Texture;
        public createProgram(): stagl.Program3D;
        private _attributesToEnable;
        public setVertexBufferAt(variable: string, buffer: stagl.VertexBuffer3D, bufferOffset?: number, format?: String): void;
        private _constantsToEnable;
        public setProgramConstantsFromVector(variable: string, data: number[]): void;
        public setProgramConstantsFromMatrix(variable: string, matrix: stagl.geom.Matrix3D, transposedMatrix?: boolean): void;
        public setTextureAt(sampler: string, texture: stagl.Texture): void;
        private _linkedProgram;
        public setProgram(program: stagl.Program3D): void;
        public clear(red?: number, green?: number, blue?: number, alpha?: number, depth?: number, stencil?: number, mask?: number): void;
        public drawTriangles(indexBuffer: stagl.IndexBuffer3D, firstIndex?: number, numTriangles?: number): void;
        public setCulling(triangleFaceToCull: string): void;
        public setDepthTest(depthMask: boolean, passCompareMode: string): void;
        public setBlendFactors(sourceFactor: number, destinationFactor: number): void;
        public present(): void;
    }
}
declare module stagl {
    class Context3DTriangleFace {
        static BACK: string;
        static FRONT: string;
        static FRONT_AND_BACK: string;
        static NONE: string;
    }
}
