declare module stagl {
    class BitmapData {
        transparent: boolean;
        private _rect;
        private _transparent;
        private _canvas;
        private _context;
        constructor(width: number, height: number, transparent?: boolean, fillColor?: number);
        width: number;
        height: number;
        canvas: HTMLCanvasElement;
        imageData: ImageData;
        rect: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        copyPixels(sourceBitmapData: BitmapData, sourceRect: {
            x: number;
            y: number;
            width: number;
            height: number;
        }, destPoint: {
            x: number;
            y: number;
        }): void;
        copyPixels(sourceBitmapData: HTMLImageElement, sourceRect: {
            x: number;
            y: number;
            width: number;
            height: number;
        }, destPoint: {
            x: number;
            y: number;
        }): void;
        draw(source: BitmapData): void;
        draw(source: HTMLImageElement): void;
        fillRect(rect: {
            x: number;
            y: number;
            width: number;
            height: number;
        }, color: number): void;
        private hexToRGBACSS(d);
    }
}
declare module stagl.events {
    class Event {
        static CONTEXT3D_CREATE: string;
        type: string;
        target: Object;
        constructor(type: string);
        clone(): Event;
    }
}
declare module stagl.events {
    class ErrorEvent extends Event {
        static ERROR: string;
        constructor();
    }
}
declare module stagl.events {
    class EventDispatcher {
        private listeners;
        private target;
        constructor(target?: any);
        addEventListener(type: string, listener: Function): void;
        removeEventListener(type: string, listener: Function): void;
        dispatchEvent(event: Event): void;
        private getEventListenerIndex(type, listener);
        hasEventListener(type: string, listener?: Function): boolean;
    }
}
declare module stagl.geom {
    class Orientation3D {
        static AXIS_ANGLE: string;
        static EULER_ANGLES: string;
        static QUATERNION: string;
    }
}
declare module stagl.geom {
    class Vector3D {
        static X_AXIS: Vector3D;
        static Y_AXIS: Vector3D;
        static Z_AXIS: Vector3D;
        w: number;
        x: number;
        y: number;
        z: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        length: number;
        lengthSquared: number;
        static angleBetween(a: Vector3D, b: Vector3D): number;
        static distance(pt1: Vector3D, pt2: Vector3D): number;
        add(a: Vector3D): Vector3D;
        subtract(a: Vector3D): Vector3D;
        incrementBy(a: Vector3D): void;
        decrementBy(a: Vector3D): void;
        equals(toCompare: Vector3D, allFour?: boolean): boolean;
        nearEquals(toCompare: Vector3D, tolerance: number, allFour?: boolean): boolean;
        clone(): Vector3D;
        copyFrom(sourceVector3D: Vector3D): void;
        negate(): void;
        scaleBy(s: number): void;
        setTo(xa: number, ya: number, za: number): void;
        normalize(): number;
        crossProduct(a: Vector3D): Vector3D;
        dotProduct(a: Vector3D): number;
        project(): void;
        toString(): string;
    }
}
declare module stagl.geom {
    class Matrix3D {
        private static DEG_2_RAD;
        determinant: number;
        position: Vector3D;
        rawData: Float32Array;
        constructor(v?: number[]);
        append(lhs: Matrix3D): void;
        prepend(rhs: Matrix3D): void;
        appendRotation(degrees: number, axis: Vector3D, pivotPoint?: Vector3D): void;
        appendScale(xScale: number, yScale: number, zScale: number): void;
        appendTranslation(x: number, y: number, z: number): void;
        prependRotation(degrees: number, axis: Vector3D, pivotPoint?: Vector3D): void;
        prependScale(xScale: number, yScale: number, zScale: number): void;
        prependTranslation(x: number, y: number, z: number): void;
        clone(): Matrix3D;
        copyColumnFrom(column: number, vector3D: Vector3D): void;
        copyColumnTo(column: number, vector3D: Vector3D): void;
        copyFrom(sourceMatrix3D: Matrix3D): void;
        copyRawDataFrom(vector: number[], index?: number, transpose?: boolean): void;
        copyRawDataTo(vector: number[], index?: number, transpose?: boolean): void;
        copyRowFrom(row: number, vector3D: Vector3D): void;
        copyRowTo(row: number, vector3D: Vector3D): void;
        copyToMatrix3D(dest: Matrix3D): void;
        decompose(orientationStyle?: String): Vector3D[];
        identity(): void;
        static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number): Matrix3D;
        interpolateTo(toMat: Matrix3D, percent: number): void;
        invert(): boolean;
        pointAt(pos: Vector3D, at?: Vector3D, up?: Vector3D): void;
        recompose(components: Vector3D[], orientationStyle?: String): boolean;
        transformVector(v: Vector3D): Vector3D;
        deltaTransformVector(v: Vector3D): Vector3D;
        transformVectors(vin: number[], vout: number[]): void;
        transpose(): void;
        toString(): string;
        private getRotateMatrix(axis, radians);
    }
}
declare module stagl.geom {
    class Quaternion {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        static lerp(qa: Quaternion, qb: Quaternion, percent: number): Quaternion;
        fromMatrix3D(m: Matrix3D): Quaternion;
        toMatrix3D(target?: Matrix3D): Matrix3D;
        fromAxisAngle(axis: Vector3D, angleInRadians: number): void;
        conjugate(): void;
        toString(): string;
    }
}
declare module stagl.geom {
    class PerspectiveMatrix3D extends Matrix3D {
        lookAtLH(eye: Vector3D, at: Vector3D, up: Vector3D): void;
        lookAtRH(eye: Vector3D, at: Vector3D, up: Vector3D): void;
        perspectiveLH(width: number, height: number, zNear: number, zFar: number): void;
        perspectiveRH(width: number, height: number, zNear: number, zFar: number): void;
        perspectiveOffCenterLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void;
        perspectiveOffCenterRH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void;
        orthoLH(width: number, height: number, zNear: number, zFar: number): void;
        orthoRH(width: number, height: number, zNear: number, zFar: number): void;
        orthoOffCenterLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void;
        orthoOffCenterRH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void;
        perspectiveFieldOfViewRH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
        perspectiveFieldOfViewLH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
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
    class Context3DTextureFormat {
        static BGRA: string;
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
    class Context3DTriangleFace {
        static BACK: string;
        static FRONT: string;
        static FRONT_AND_BACK: string;
        static NONE: string;
    }
}
declare module stagl {
    class VertexBuffer3D {
        private _numVertices;
        private _data32PerVertex;
        private _glBuffer;
        private _data;
        constructor(numVertices: number, data32PerVertex: number);
        glBuffer: WebGLBuffer;
        data32PerVertex: number;
        uploadFromVector(data: number[], startVertex: number, numVertices: number): void;
        dispose(): void;
    }
}
declare module stagl {
    class IndexBuffer3D {
        numIndices: number;
        private _data;
        private _glBuffer;
        constructor(numIndices: number);
        glBuffer: WebGLBuffer;
        uploadFromVector(data: number[], startOffset: number, count: number): void;
        dispose(): void;
    }
}
declare module stagl {
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
        __getGLTexture(): WebGLTexture;
        textureUnit: number;
        uploadFromBitmapData(source: BitmapData, miplevel: number): void;
        uploadFromBitmapData(source: HTMLImageElement, miplevel: number): void;
        uploadFromImage(source: any, miplevel?: number): void;
        dispose(): void;
    }
}
declare module stagl {
    class Program3D {
        private _glProgram;
        private _vShader;
        private _fShader;
        constructor();
        glProgram: WebGLProgram;
        dispose(): void;
        upload(vertexProgramId?: string, fragmentProgramId?: string): void;
        private loadShader(elementId, type);
    }
}
declare module stagl {
    var VERSION: number;
    class Stage3D extends events.EventDispatcher {
        private _context3D;
        private _canvas;
        private _stageWidth;
        private _stageHeight;
        constructor(canvas: HTMLCanvasElement);
        context3D: Context3D;
        stageWidth: number;
        stageHeight: number;
        requestContext3D(): void;
        private create3DContext();
        private onCreationError(e?);
        private onCreateSuccess();
    }
}
declare module stagl {
    class Context3D {
        static GL: WebGLRenderingContext;
        private _clearBit;
        constructor();
        configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): void;
        createVertexBuffer(numVertices: number, data32PerVertex: number): VertexBuffer3D;
        createIndexBuffer(numIndices: number): IndexBuffer3D;
        createTexture(width: number, height: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): Texture;
        private _rttFramebuffer;
        setRenderToTexture(texture: Texture, enableDepthAndStencil?: boolean, antiAlias?: number, surfaceSelector?: number, colorOutputIndex?: number): void;
        setRenderToBackBuffer(): void;
        createProgram(): Program3D;
        setVertexBufferAt(variable: string, buffer: VertexBuffer3D, bufferOffset?: number, format?: String): void;
        setProgramConstantsFromVector(variable: string, data: number[]): void;
        setProgramConstantsFromMatrix(variable: string, matrix: geom.Matrix3D, transposedMatrix?: boolean): void;
        setTextureAt(sampler: string, texture: Texture): void;
        private _linkedProgram;
        setProgram(program: Program3D): void;
        clear(red?: number, green?: number, blue?: number, alpha?: number, depth?: number, stencil?: number, mask?: number): void;
        setCulling(triangleFaceToCull: string): void;
        setDepthTest(depthMask: boolean, passCompareMode: string): void;
        setBlendFactors(sourceFactor: number, destinationFactor: number): void;
        drawTriangles(indexBuffer: IndexBuffer3D, firstIndex?: number, numTriangles?: number): void;
        drawLines(indexBuffer: IndexBuffer3D, firstIndex?: number, numLines?: number): void;
        drawPoints(indexBuffer: IndexBuffer3D, firstIndex?: number, numPoints?: number): void;
        drawLineLoop(indexBuffer: IndexBuffer3D, firstIndex?: number, numPoints?: number): void;
        drawLineStrip(indexBuffer: IndexBuffer3D, firstIndex?: number, numPoints?: number): void;
        drawTriangleStrip(indexBuffer: IndexBuffer3D): void;
        drawTriangleFan(indexBuffer: IndexBuffer3D): void;
        present(): void;
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
