/**
* Base event class
* @class stagl.events.Event
*/
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
    class ErrorEvent extends Event {
        static ERROR: string;
        constructor();
    }
}
declare module stagl.events {
    /**
    * copy from https://github.com/awayjs/awayjs-core-ts/blob/master/src/away/events/EventDispatcher.ts
    *
    * Base class for dispatching events
    *
    * @class stage3d.events.EventDispatcher
    *
    */
    class EventDispatcher {
        private listeners;
        private target;
        constructor(target?: any);
        /**
        * Add an event listener
        * @method addEventListener
        * @param {String} Name of event to add a listener for
        * @param {Function} Callback function
        */
        public addEventListener(type: string, listener: Function): void;
        /**
        * Remove an event listener
        * @method removeEventListener
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        */
        public removeEventListener(type: string, listener: Function): void;
        /**
        * Dispatch an event
        * @method dispatchEvent
        * @param {Event} Event to dispatch
        */
        public dispatchEvent(event: Event): void;
        /**
        * get Event Listener Index in array. Returns -1 if no listener is added
        * @method getEventListenerIndex
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        */
        private getEventListenerIndex(type, listener);
        /**
        * check if an object has an event listener assigned to it
        * @method hasListener
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        */
        public hasEventListener(type: string, listener?: Function): boolean;
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
        /**
        * The x axis defined as a Vector3D object with coordinates (1,0,0).
        */
        static X_AXIS: Vector3D;
        /**
        * The y axis defined as a Vector3D object with coordinates (0,1,0).
        */
        static Y_AXIS: Vector3D;
        /**
        * The z axis defined as a Vector3D object with coordinates (0,0,1).
        */
        static Z_AXIS: Vector3D;
        /**
        * The fourth element of a Vector3D object (in addition to the x, y, and z properties) can hold data such as the angle of rotation.
        */
        public w: number;
        /**
        * The first element of a Vector3D object, such as the x coordinate of a point in the three-dimensional space.
        */
        public x: number;
        /**
        * The second element of a Vector3D object, such as the y coordinate of a point in the three-dimensional space.
        */
        public y: number;
        /**
        * The third element of a Vector3D object, such as the z coordinate of a point in three - dimensional space.
        */
        public z: number;
        /**
        * Creates an instance of a Vector3D object. If you do not specify a parameter for the constructor,
        * a Vector3D object is created with the elements (0,0,0,0).
        * @param	x	The first element, such as the x coordinate.
        * @param	y	The second element, such as the y coordinate.
        * @param	z	The third element, such as the z coordinate.
        * @param	w	An optional element for additional data such as the angle of rotation.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        constructor(x?: number, y?: number, z?: number, w?: number);
        /**
        * [read-only] The length, magnitude, of the current Vector3D object from the origin(0, 0, 0) to the object's x, y, and z coordinates.
        */
        public length : number;
        /**
        * [read-only] The square of the length of the current Vector3D object, calculated using the x, y, and z properties.
        */
        public lengthSquared : number;
        /**
        * [static] Returns the angle in radians between two vectors.
        */
        static angleBetween(a: Vector3D, b: Vector3D): number;
        /**
        * [static] Returns the distance between two Vector3D objects.
        */
        static distance(pt1: Vector3D, pt2: Vector3D): number;
        /**
        * Adds the value of the x, y, and z elements of the current Vector3D object
        * to the values of the x, y, and z elements of another Vector3D object.
        * The add() method does not change the current Vector3D object. Instead, it returns
        * a new Vector3D object with the new values.
        *
        *   The result of adding two vectors together is a resultant vector. One way to visualize
        * the result is by drawing a vector from the origin or tail of the first vector
        * to the end or head of the second vector. The resultant vector is the distance
        * between the origin point of the first vector and the end point of the second vector.
        * @param	a	A Vector3D object to be added to the current Vector3D object.
        * @return	A Vector3D object that is the result of adding the current Vector3D object
        *   to another Vector3D object.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        public add(a: Vector3D): Vector3D;
        /**
        * Subtracts the value of the x, y, and z elements of the current Vector3D object
        * from the values of the x, y, and z elements of another Vector3D object.
        * The subtract() method does not change the current Vector3D object. Instead,
        * this method returns a new Vector3D object with the new values.
        * @param	a	The Vector3D object to be subtracted from the current Vector3D object.
        * @return	A new Vector3D object that is the difference between the current Vector3D
        *   and the specified Vector3D object.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        public subtract(a: Vector3D): Vector3D;
        /**
        * Increments the value of the x, y, and z elements of the current Vector3D object
        * by the values of the x, y, and z elements of a specified Vector3D object. Unlike the
        * Vector3D.add() method, the incrementBy() method changes the current
        * Vector3D object and does not return a new Vector3D object.
        * @param	a	The Vector3D object to be added to the current Vector3D object.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        public incrementBy(a: Vector3D): void;
        /**
        * Decrements the value of the x, y, and z elements of the current Vector3D object
        * by the values of the x, y, and z elements of specified Vector3D object. Unlike the
        * Vector3D.subtract() method, the decrementBy() method changes the current
        * Vector3D object and does not return a new Vector3D object.
        * @param	a	The Vector3D object containing the values to subtract from the current Vector3D object.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        public decrementBy(a: Vector3D): void;
        /**
        * Determines whether two Vector3D objects are equal by comparing the x, y, and z
        * elements of the current Vector3D object with a specified Vector3D object. If the values of
        * these elements are the same, the two Vector3D objects are equal. If the second
        * optional parameter is set to true, all four elements of the Vector3D objects,
        * including the w property, are compared.
        * @param	toCompare	The Vector3D object to be compared with the current Vector3D object.
        * @param	allFour	An optional parameter that specifies whether the w property of
        *   the Vector3D objects is used in the comparison.
        * @return	A value of true if the specified Vector3D object is equal to the current
        *   Vector3D object; false if it is not equal.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        public equals(toCompare: Vector3D, allFour?: boolean): boolean;
        /**
        * Compares the elements of the current Vector3D object with the elements of a specified
        * Vector3D object to determine whether they are nearly equal. The two Vector3D objects are nearly equal
        * if the value of all the elements of the two vertices are equal, or the result of the comparison
        * is within the tolerance range. The difference between two elements must be less than the number
        * specified as the tolerance parameter. If the third optional parameter is set to
        * true, all four elements of the Vector3D objects, including the w property,
        * are compared. Otherwise, only the x, y, and z elements are included in the comparison.
        * @param	toCompare	The Vector3D object to be compared with the current Vector3D object.
        * @param	tolerance	A number determining the tolerance factor. If the difference between the values
        *   of the Vector3D element specified in the toCompare parameter and the current Vector3D element
        *   is less than the tolerance number, the two values are considered nearly equal.
        * @param	allFour	An optional parameter that specifies whether the w property of
        *   the Vector3D objects is used in the comparison.
        * @return	A value of true if the specified Vector3D object is nearly equal to the current
        *   Vector3D object; false if it is not equal.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        public nearEquals(toCompare: Vector3D, tolerance: number, allFour?: boolean): boolean;
        /**
        * Returns a new Vector3D object that is an exact copy of the current Vector3D object.
        * @return	A new Vector3D object that is a copy of the current Vector3D object.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        public clone(): Vector3D;
        /**
        * Copies all of vector data from the source Vector3D object into the calling Vector3D object.
        */
        public copyFrom(sourceVector3D: Vector3D): void;
        /**
        * Sets the current Vector3D object to its inverse. The inverse object is also considered the
        * opposite of the original object. The value of
        * the x, y, and z properties of the current Vector3D object
        * is changed to -x, -y, and -z.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        public negate(): void;
        /**
        * Scales the current Vector3D object by a scalar, a magnitude. The Vector3D object's
        * x, y, and z elements are multiplied by the scalar number
        * specified in the parameter. For example, if the vector is scaled by ten,
        * the result is a vector that is ten times longer. The scalar can also
        * change the direction of the vector. Multiplying the vector by a negative
        * number reverses its direction.
        * @param	s	A multiplier (scalar) used to scale a Vector3D object.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        public scaleBy(s: number): void;
        /**
        * Sets the members of Vector3D to the specified values
        */
        public setTo(xa: number, ya: number, za: number): void;
        /**
        * Converts a Vector3D object to a unit vector by dividing the first three elements
        * (x, y, z) by the length of the vector. Unit vertices are
        * vertices that have a direction but their length is one. They simplify
        * vector calculations by removing length as a factor.
        * @return	The length of the current Vector3D object.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        public normalize(): number;
        /**
        * Returns a new Vector3D object that is perpendicular (at a right angle) to the current
        * Vector3D and another Vector3D object. If the returned Vector3D object's coordinates are
        * (0,0,0), then the two Vector3D objects are perpendicular to each other.
        *
        *   You can use the normalized cross product of two vertices of a polygon surface with the
        * normalized vector of the camera or eye viewpoint to get a dot product. The value of
        * the dot product can identify whether a surface of a three-dimensional object is hidden
        * from the viewpoint.
        * @param	a	A second Vector3D object.
        * @return	A new Vector3D object that is perpendicular to the current Vector3D object and the Vector3D
        *   object specified as the parameter.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        public crossProduct(a: Vector3D): Vector3D;
        /**
        * If the current Vector3D object and the one specified as the parameter are unit vertices, this
        * method returns the cosine of the angle between the two vertices. Unit vertices are vertices that
        * point to the same direction but their length is one. They remove the length of the vector
        * as a factor in the result. You can use the normalize() method to convert a vector to a unit vector.
        *
        *   The dotProduct() method finds the angle between two vertices. It is also
        * used in backface culling or lighting calculations. Backface culling is a procedure for determining
        * which surfaces are hidden from the viewpoint. You can use the normalized vertices from the camera,
        * or eye, viewpoint and the cross product of the vertices of a polygon surface to get the dot product.
        * If the dot product is less than zero, then the surface is facing the camera or the viewer. If the
        * two unit vertices are perpendicular to each other, they are orthogonal and the dot product is zero.
        * If the two vertices are parallel to each other, the dot product is one.
        * @param	a	The second Vector3D object.
        * @return	A scalar which is the dot product of the current Vector3D object and the specified Vector3D object.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        public dotProduct(a: Vector3D): number;
        /**
        * Divides the value of the x, y, and z properties of the
        * current Vector3D object by the value of its w property.
        *
        *   If the current Vector3D object is the result of multiplying a Vector3D object by a projection Matrix3D object,
        * the w property can hold the transform value. The project() method then can
        * complete the projection by dividing the elements by the w property. Use the
        * Matrix3D.rawData property to create a projection Matrix3D object.
        * @langversion	3.0
        * @playerversion	Flash 10
        * @playerversion	AIR 1.5
        */
        public project(): void;
        /**
        * Returns a string representation of the current Vector3D object.
        */
        public toString(): string;
    }
}
declare module stagl.geom {
    class Matrix3D {
        private static DEG_2_RAD;
        /**
        * [read-only] A Number that determines whether a matrix is invertible.
        */
        public determinant : number;
        public position : Vector3D;
        /**
        * A Vector of 16 Numbers, where every four elements is a column of a 4x4 matrix.
        *
        * <p>An exception is thrown if the rawData property is set to a matrix that is not invertible. The Matrix3D
        * object must be invertible. If a non-invertible matrix is needed, create a subclass of the Matrix3D object.</p>
        */
        public rawData: Float32Array;
        /**
        * Creates a Matrix3D object.
        */
        constructor(v?: number[]);
        /**
        * Appends the matrix by multiplying another Matrix3D object by the current Matrix3D object.
        * Apply a transform after this transform
        */
        public append(lhs: Matrix3D): void;
        /**
        * Prepends a matrix by multiplying the current Matrix3D object by another Matrix3D object.
        */
        public prepend(rhs: Matrix3D): void;
        /**
        * Appends an incremental rotation to a Matrix3D object.
        */
        public appendRotation(degrees: number, axis: Vector3D, pivotPoint?: Vector3D): void;
        /**
        * Appends an incremental scale change along the x, y, and z axes to a Matrix3D object.
        */
        public appendScale(xScale: number, yScale: number, zScale: number): void;
        /**
        * Appends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
        */
        public appendTranslation(x: number, y: number, z: number): void;
        /**
        * Prepends an incremental rotation to a Matrix3D object.
        */
        public prependRotation(degrees: number, axis: Vector3D, pivotPoint?: Vector3D): void;
        /**
        * Prepends an incremental scale change along the x, y, and z axes to a Matrix3D object.
        */
        public prependScale(xScale: number, yScale: number, zScale: number): void;
        /**
        * Prepends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
        */
        public prependTranslation(x: number, y: number, z: number): void;
        /**
        * Returns a new Matrix3D object that is an exact copy of the current Matrix3D object.
        */
        public clone(): Matrix3D;
        /**
        *  Copies a Vector3D object into specific column of the calling Matrix3D object.
        */
        public copyColumnFrom(column: number, vector3D: Vector3D): void;
        /**
        * Copies specific column of the calling Matrix3D object into the Vector3D object.
        */
        public copyColumnTo(column: number, vector3D: Vector3D): void;
        /**
        * Copies all of the matrix data from the source Matrix3D object into the calling Matrix3D object.
        */
        public copyFrom(sourceMatrix3D: Matrix3D): void;
        /**
        * Copies all of the vector data from the source vector object into the calling Matrix3D object.
        */
        public copyRawDataFrom(vector: number[], index?: number, transpose?: boolean): void;
        /**
        * Copies all of the matrix data from the calling Matrix3D object into the provided vector.
        */
        public copyRawDataTo(vector: number[], index?: number, transpose?: boolean): void;
        /**
        * Copies a Vector3D object into specific row of the calling Matrix3D object.
        */
        public copyRowFrom(row: number, vector3D: Vector3D): void;
        /**
        * Copies specific row of the calling Matrix3D object into the Vector3D object.
        */
        public copyRowTo(row: number, vector3D: Vector3D): void;
        public copyToMatrix3D(dest: Matrix3D): void;
        /**
        * Returns the transformation matrix's translation, rotation, and scale settings as a Vector of three Vector3D objects.
        */
        public decompose(orientationStyle?: String): Vector3D[];
        /**
        * Converts the current matrix to an identity or unit matrix.
        */
        public identity(): void;
        static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number): Matrix3D;
        public interpolateTo(toMat: Matrix3D, percent: number): void;
        /**
        * Inverts the current matrix.
        */
        public invert(): boolean;
        /**
        * Rotates the display object so that it faces a specified position.
        */
        public pointAt(pos: Vector3D, at?: Vector3D, up?: Vector3D): void;
        /**
        * Sets the transformation matrix's translation, rotation, and scale settings.
        */
        public recompose(components: Vector3D[], orientationStyle?: String): boolean;
        /**
        * Uses the transformation matrix to transform a Vector3D object from one space coordinate to another.
        */
        public transformVector(v: Vector3D): Vector3D;
        /**
        * Uses the transformation matrix without its translation elements to transform a Vector3D object from one space coordinate to another.
        */
        public deltaTransformVector(v: Vector3D): Vector3D;
        /**
        * Uses the transformation matrix to transform a Vector of Numbers from one coordinate space to another.
        */
        public transformVectors(vin: number[], vout: number[]): void;
        /**
        * Converts the current Matrix3D object to a matrix where the rows and columns are swapped.
        */
        public transpose(): void;
        public toString(): string;
        private getRotateMatrix(axis, radians);
    }
}
declare module stagl.geom {
    class Quaternion {
        public x: number;
        public y: number;
        public z: number;
        public w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        static lerp(qa: Quaternion, qb: Quaternion, percent: number): Quaternion;
        public fromMatrix3D(m: Matrix3D): Quaternion;
        public toMatrix3D(target?: Matrix3D): Matrix3D;
        /**
        * @param axis   must be a normalized vector
        * @param angleInRadians
        */
        public fromAxisAngle(axis: Vector3D, angleInRadians: number): void;
        public conjugate(): void;
        public toString(): string;
    }
}
declare module stagl.geom {
    class PerspectiveMatrix3D extends Matrix3D {
        public perspectiveFieldOfViewRH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
        public perspectiveFieldOfViewLH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
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
        private _width;
        private _height;
        private _format;
        private _forRTT;
        private static _bindingTexture;
        constructor(width: number, height: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels: number);
        public __getGLTexture(): WebGLTexture;
        public uploadFromBitmapData(source: HTMLImageElement, miplevel?: number): void;
        public uploadFromImage(source: HTMLImageElement, miplevel?: number): void;
        public dispose(): void;
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
        /**
        *   to delete .......
        */
        public getShader2(elementId: string): WebGLShader;
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
        /**
        * [read-only] The Context3D object associated with this Stage3D instance.
        */
        public context3D : Context3D;
        public stageWidth : number;
        public stageHeight : number;
        public requestContext3D(): void;
        private onCreationError(e?);
        private onCreateSuccess();
    }
}
declare module stagl {
    class Context3D {
        static GL: WebGLRenderingContext;
        private _clearBit;
        constructor();
        public configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): void;
        public createVertexBuffer(numVertices: number, data32PerVertex: number): VertexBuffer3D;
        public createIndexBuffer(numIndices: number): IndexBuffer3D;
        /**
        * @format only support Context3DTextureFormat.BGRA
        * @optimizeForRenderToTexture not implement
        */
        public createTexture(width: number, height: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): Texture;
        private _rttFramebuffer;
        public setRenderToTexture(texture: Texture, enableDepthAndStencil?: boolean, antiAlias?: number, surfaceSelector?: number, colorOutputIndex?: number): void;
        public setRenderToBackBuffer(): void;
        public createProgram(): Program3D;
        /**
        * private  setVertexBufferAt
        */
        private _attributesToEnable;
        /**
        *  @variable must predefined in glsl
        */
        public setVertexBufferAt(variable: string, buffer: VertexBuffer3D, bufferOffset?: number, format?: String): void;
        private _constantsToEnable;
        /**
        *  @variable must predefined in glsl
        */
        public setProgramConstantsFromVector(variable: string, data: number[]): void;
        /**
        *  @variable must predefined in glsl
        */
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
        /**
        * [Webgl only]
        * draws a closed loop connecting the vertices defined in the indexBuffer to the next one
        */
        public drawLineLoop(indexBuffer: IndexBuffer3D, firstIndex?: number, numPoints?: number): void;
        /**
        * [Webgl only]
        * It is similar to drawLineLoop(). The difference here is that WebGL does not connect the last vertex to the first one (not a closed loop).
        */
        public drawLineStrip(indexBuffer: IndexBuffer3D, firstIndex?: number, numPoints?: number): void;
        /**
        * [Webgl only]
        *  indices = [0, 1, 2, 3, 4];, then we will generate the triangles:(0, 1, 2), (1, 2, 3), and(2, 3, 4).
        */
        public drawTriangleStrip(indexBuffer: IndexBuffer3D): void;
        /**
        * [Webgl only]
        * creates triangles in a similar way to drawTriangleStrip().
        * However, the first vertex defined in the indexBuffer is taken as the origin of the fan(the only shared vertex among consecutive triangles).
        * In our example, indices = [0, 1, 2, 3, 4]; will create the triangles: (0, 1, 2) and(0, 3, 4).
        */
        public drawTriangleFan(indexBuffer: IndexBuffer3D): void;
        /**
        *   In webgl we dont need to call present , browser will do this for us.
        */
        public present(): void;
    }
}
