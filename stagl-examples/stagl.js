var stagl;
(function (stagl) {
    (function (events) {
        /**
        * copy from https://github.com/awayjs/awayjs-core-ts/blob/master/src/away/events/EventDispatcher.ts
        *
        * Base class for dispatching events
        *
        * @class stage3d.events.EventDispatcher
        *
        */
        var EventDispatcher = (function () {
            function EventDispatcher(target) {
                if (typeof target === "undefined") { target = null; }
                this.listeners = new Array();
                this.target = target || this;
            }
            /**
            * Add an event listener
            * @method addEventListener
            * @param {String} Name of event to add a listener for
            * @param {Function} Callback function
            */
            EventDispatcher.prototype.addEventListener = function (type, listener) {
                if (this.listeners[type] === undefined)
                    this.listeners[type] = new Array();

                if (this.getEventListenerIndex(type, listener) === -1)
                    this.listeners[type].push(listener);
            };

            /**
            * Remove an event listener
            * @method removeEventListener
            * @param {String} Name of event to remove a listener for
            * @param {Function} Callback function
            */
            EventDispatcher.prototype.removeEventListener = function (type, listener) {
                var index = this.getEventListenerIndex(type, listener);

                if (index !== -1)
                    this.listeners[type].splice(index, 1);
            };

            /**
            * Dispatch an event
            * @method dispatchEvent
            * @param {Event} Event to dispatch
            */
            EventDispatcher.prototype.dispatchEvent = function (event) {
                var listenerArray = this.listeners[event.type];

                if (listenerArray !== undefined) {
                    var l = listenerArray.length;

                    event.target = this.target;

                    for (var i = 0; i < l; i++)
                        listenerArray[i](event);
                }
            };

            /**
            * get Event Listener Index in array. Returns -1 if no listener is added
            * @method getEventListenerIndex
            * @param {String} Name of event to remove a listener for
            * @param {Function} Callback function
            */
            EventDispatcher.prototype.getEventListenerIndex = function (type, listener) {
                if (this.listeners[type] !== undefined) {
                    var a = this.listeners[type];
                    var l = a.length;

                    for (var i = 0; i < l; i++)
                        if (listener == a[i])
                            return i;
                }

                return -1;
            };

            /**
            * check if an object has an event listener assigned to it
            * @method hasListener
            * @param {String} Name of event to remove a listener for
            * @param {Function} Callback function
            */
            EventDispatcher.prototype.hasEventListener = function (type, listener) {
                if (listener != null) {
                    return (this.getEventListenerIndex(type, listener) !== -1);
                } else {
                    if (this.listeners[type] !== undefined)
                        return (this.listeners[type].length > 0);

                    return false;
                }

                return false;
            };
            return EventDispatcher;
        })();
        events.EventDispatcher = EventDispatcher;
    })(stagl.events || (stagl.events = {}));
    var events = stagl.events;
})(stagl || (stagl = {}));
var stagl;
(function (stagl) {
    /**
    * Base event class
    * @class stage3d.events.Event
    */
    (function (events) {
        var Event = (function () {
            function Event(type) {
                //        public static COMPLETE: string = 'complete';
                //        public static OPEN: string = 'open';
                //        public static ENTER_FRAME: string = 'enterFrame';
                //        public static EXIT_FRAME: string = 'exitFrame';
                //        public static RESIZE: string = "resize";
                //        public static ERROR: string = "error";
                //        public static CHANGE: string = "change";
                /**
                * Type of event
                * @property type
                * @type String
                */
                this.type = undefined;
                /**
                * Reference to target object
                * @property target
                * @type Object
                */
                this.target = undefined;
                this.type = type;
            }
            /**
            * Clones the current event.
            * @return An exact duplicate of the current event.
            */
            Event.prototype.clone = function () {
                return new Event(this.type);
            };
            Event.CONTEXT3D_CREATE = "CONTEXT3D_CREATE";
            return Event;
        })();
        events.Event = Event;
    })(stagl.events || (stagl.events = {}));
    var events = stagl.events;
})(stagl || (stagl = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var stagl;
(function (stagl) {
    (function (events) {
        var ErrorEvent = (function (_super) {
            __extends(ErrorEvent, _super);
            function ErrorEvent() {
                _super.call(this, ErrorEvent.ERROR);
            }
            ErrorEvent.ERROR = "error";
            return ErrorEvent;
        })(stagl.events.Event);
        events.ErrorEvent = ErrorEvent;
    })(stagl.events || (stagl.events = {}));
    var events = stagl.events;
})(stagl || (stagl = {}));
var stagl;
(function (stagl) {
    ///<reference path="../_definitions.ts"/>
    (function (geom) {
        var Matrix3D = (function () {
            /**
            * Creates a Matrix3D object.
            */
            function Matrix3D(v) {
                if (typeof v === "undefined") { v = null; }
                if (v != null && v.length == 16)
                    this.rawData = new Float32Array(v.slice(0));
                else
                    this.rawData = new Float32Array([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1]);
            }
            Object.defineProperty(Matrix3D.prototype, "determinant", {
                /**
                * [read-only] A Number that determines whether a matrix is invertible.
                */
                get: function () {
                    return ((this.rawData[0] * this.rawData[5] - this.rawData[4] * this.rawData[1]) * (this.rawData[10] * this.rawData[15] - this.rawData[14] * this.rawData[11]) - (this.rawData[0] * this.rawData[9] - this.rawData[8] * this.rawData[1]) * (this.rawData[6] * this.rawData[15] - this.rawData[14] * this.rawData[7]) + (this.rawData[0] * this.rawData[13] - this.rawData[12] * this.rawData[1]) * (this.rawData[6] * this.rawData[11] - this.rawData[10] * this.rawData[7]) + (this.rawData[4] * this.rawData[9] - this.rawData[8] * this.rawData[5]) * (this.rawData[2] * this.rawData[15] - this.rawData[14] * this.rawData[3]) - (this.rawData[4] * this.rawData[13] - this.rawData[12] * this.rawData[5]) * (this.rawData[2] * this.rawData[11] - this.rawData[10] * this.rawData[3]) + (this.rawData[8] * this.rawData[13] - this.rawData[12] * this.rawData[9]) * (this.rawData[2] * this.rawData[7] - this.rawData[6] * this.rawData[3]));
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Matrix3D.prototype, "position", {
                get: function () {
                    return new geom.Vector3D(this.rawData[12], this.rawData[13], this.rawData[14]);
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Appends the matrix by multiplying another Matrix3D object by the current Matrix3D object.
            * Apply a transform after this transform
            */
            Matrix3D.prototype.append = function (lhs) {
                //this * lhs
                var a11 = this.rawData[0];
                var a12 = this.rawData[1];
                var a13 = this.rawData[2];
                var a14 = this.rawData[3];
                var a21 = this.rawData[4];
                var a22 = this.rawData[5];
                var a23 = this.rawData[6];
                var a24 = this.rawData[7];
                var a31 = this.rawData[8];
                var a32 = this.rawData[9];
                var a33 = this.rawData[10];
                var a34 = this.rawData[11];
                var a41 = this.rawData[12];
                var a42 = this.rawData[13];
                var a43 = this.rawData[14];
                var a44 = this.rawData[15];

                var b11 = lhs.rawData[0];
                var b12 = lhs.rawData[1];
                var b13 = lhs.rawData[2];
                var b14 = lhs.rawData[3];
                var b21 = lhs.rawData[4];
                var b22 = lhs.rawData[5];
                var b23 = lhs.rawData[6];
                var b24 = lhs.rawData[7];
                var b31 = lhs.rawData[8];
                var b32 = lhs.rawData[9];
                var b33 = lhs.rawData[10];
                var b34 = lhs.rawData[11];
                var b41 = lhs.rawData[12];
                var b42 = lhs.rawData[13];
                var b43 = lhs.rawData[14];
                var b44 = lhs.rawData[15];

                this.rawData[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
                this.rawData[1] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
                this.rawData[2] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
                this.rawData[3] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

                this.rawData[4] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
                this.rawData[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
                this.rawData[6] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
                this.rawData[7] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

                this.rawData[8] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
                this.rawData[9] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
                this.rawData[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
                this.rawData[11] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

                this.rawData[12] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
                this.rawData[13] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
                this.rawData[14] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
                this.rawData[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
            };

            /**
            * Prepends a matrix by multiplying the current Matrix3D object by another Matrix3D object.
            */
            Matrix3D.prototype.prepend = function (rhs) {
                // rhs * this
                var a11 = this.rawData[0];
                var a12 = this.rawData[1];
                var a13 = this.rawData[2];
                var a14 = this.rawData[3];
                var a21 = this.rawData[4];
                var a22 = this.rawData[5];
                var a23 = this.rawData[6];
                var a24 = this.rawData[7];
                var a31 = this.rawData[8];
                var a32 = this.rawData[9];
                var a33 = this.rawData[10];
                var a34 = this.rawData[11];
                var a41 = this.rawData[12];
                var a42 = this.rawData[13];
                var a43 = this.rawData[14];
                var a44 = this.rawData[15];

                var b11 = rhs.rawData[0];
                var b12 = rhs.rawData[1];
                var b13 = rhs.rawData[2];
                var b14 = rhs.rawData[3];
                var b21 = rhs.rawData[4];
                var b22 = rhs.rawData[5];
                var b23 = rhs.rawData[6];
                var b24 = rhs.rawData[7];
                var b31 = rhs.rawData[8];
                var b32 = rhs.rawData[9];
                var b33 = rhs.rawData[10];
                var b34 = rhs.rawData[11];
                var b41 = rhs.rawData[12];
                var b42 = rhs.rawData[13];
                var b43 = rhs.rawData[14];
                var b44 = rhs.rawData[15];

                this.rawData[0] = b11 * a11 + b12 * a21 + b13 * a31 + b14 * a41;
                this.rawData[1] = b11 * a12 + b12 * a22 + b13 * a32 + b14 * a42;
                this.rawData[2] = b11 * a13 + b12 * a23 + b13 * a33 + b14 * a43;
                this.rawData[3] = b11 * a14 + b12 * a24 + b13 * a34 + b14 * a44;

                this.rawData[4] = b21 * a11 + b22 * a21 + b23 * a31 + b24 * a41;
                this.rawData[5] = b21 * a12 + b22 * a22 + b23 * a32 + b24 * a42;
                this.rawData[6] = b21 * a13 + b22 * a23 + b23 * a33 + b24 * a43;
                this.rawData[7] = b21 * a14 + b22 * a24 + b23 * a34 + b24 * a44;

                this.rawData[8] = b31 * a11 + b32 * a21 + b33 * a31 + b34 * a41;
                this.rawData[9] = b31 * a12 + b32 * a22 + b33 * a32 + b34 * a42;
                this.rawData[10] = b31 * a13 + b32 * a23 + b33 * a33 + b34 * a43;
                this.rawData[11] = b31 * a14 + b32 * a24 + b33 * a34 + b34 * a44;

                this.rawData[12] = b41 * a11 + b42 * a21 + b43 * a31 + b44 * a41;
                this.rawData[13] = b41 * a12 + b42 * a22 + b43 * a32 + b44 * a42;
                this.rawData[14] = b41 * a13 + b42 * a23 + b43 * a33 + b44 * a43;
                this.rawData[15] = b41 * a14 + b42 * a24 + b43 * a34 + b44 * a44;
            };

            /**
            * Appends an incremental rotation to a Matrix3D object.
            */
            Matrix3D.prototype.appendRotation = function (degrees, axis, pivotPoint) {
                if (typeof pivotPoint === "undefined") { pivotPoint = null; }
                var r = this.getRotateMatrix(axis, degrees);
                if (pivotPoint) {
                    //TODO:simplify
                    this.appendTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
                    this.append(r);
                    this.appendTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
                } else {
                    this.append(r);
                }
            };

            /**
            * Appends an incremental scale change along the x, y, and z axes to a Matrix3D object.
            */
            Matrix3D.prototype.appendScale = function (xScale, yScale, zScale) {
                /*
                *              x 0 0 0
                *    this  *   0 y 0 0
                *              0 0 z 0
                *              0 0 0 1
                */
                this.rawData[0] *= xScale;
                this.rawData[1] *= yScale;
                this.rawData[2] *= zScale;
                this.rawData[4] *= xScale;
                this.rawData[5] *= yScale;
                this.rawData[6] *= zScale;
                this.rawData[8] *= xScale;
                this.rawData[9] *= yScale;
                this.rawData[10] *= zScale;
                this.rawData[12] *= xScale;
                this.rawData[13] *= yScale;
                this.rawData[14] *= zScale;
            };

            /**
            * Appends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
            */
            Matrix3D.prototype.appendTranslation = function (x, y, z) {
                this.rawData[12] += x;
                this.rawData[13] += y;
                this.rawData[14] += z;
            };

            /**
            * Prepends an incremental rotation to a Matrix3D object.
            */
            Matrix3D.prototype.prependRotation = function (degrees, axis, pivotPoint) {
                if (typeof pivotPoint === "undefined") { pivotPoint = null; }
                var r = this.getRotateMatrix(axis, degrees);
                if (pivotPoint) {
                    //TODO:simplify
                    this.prependTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
                    this.prepend(r);
                    this.prependTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
                } else {
                    this.prepend(r);
                }
            };

            /**
            * Prepends an incremental scale change along the x, y, and z axes to a Matrix3D object.
            */
            Matrix3D.prototype.prependScale = function (xScale, yScale, zScale) {
                /*
                *      x 0 0 0
                *      0 y 0 0   * this
                *      0 0 z 0
                *      0 0 0 1
                */
                this.rawData[0] *= xScale;
                this.rawData[1] *= xScale;
                this.rawData[2] *= xScale;
                this.rawData[3] *= xScale;
                this.rawData[4] *= yScale;
                this.rawData[5] *= yScale;
                this.rawData[6] *= yScale;
                this.rawData[7] *= yScale;
                this.rawData[8] *= zScale;
                this.rawData[9] *= zScale;
                this.rawData[10] *= zScale;
                this.rawData[11] *= zScale;
            };

            /**
            * Prepends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
            */
            Matrix3D.prototype.prependTranslation = function (x, y, z) {
                /*
                *             1 0 0 0
                *             0 1 0 0   *  this
                *             0 0 1 0
                *             x y z 1
                */
                this.rawData[12] += this.rawData[0] * x + this.rawData[4] * y + this.rawData[8] * z;
                this.rawData[13] += this.rawData[1] * x + this.rawData[5] * y + this.rawData[9] * z;
                this.rawData[14] += this.rawData[2] * x + this.rawData[6] * y + this.rawData[10] * z;
                this.rawData[15] += this.rawData[3] * x + this.rawData[7] * y + this.rawData[11] * z;
            };

            /**
            * Returns a new Matrix3D object that is an exact copy of the current Matrix3D object.
            */
            Matrix3D.prototype.clone = function () {
                return new Matrix3D(Array.prototype.slice.call(this.rawData));
            };

            /**
            *  Copies a Vector3D object into specific column of the calling Matrix3D object.
            */
            Matrix3D.prototype.copyColumnFrom = function (column /*uint*/ , vector3D) {
                if (column < 0 || column > 3)
                    throw new Error("column error");

                // column is row ...
                this.rawData[column] = vector3D.x;
                this.rawData[column * 4 + 1] = vector3D.y;
                this.rawData[column * 4 + 2] = vector3D.z;
                this.rawData[column * 4 + 3] = vector3D.w;
            };

            /**
            * Copies specific column of the calling Matrix3D object into the Vector3D object.
            */
            Matrix3D.prototype.copyColumnTo = function (column /*uint*/ , vector3D) {
                if (column < 0 || column > 3)
                    throw new Error("column error");

                //column is row...
                vector3D.x = this.rawData[column * 4];
                vector3D.y = this.rawData[column * 4 + 1];
                vector3D.z = this.rawData[column * 4 + 2];
                vector3D.w = this.rawData[column * 4 + 3];
            };

            /**
            * Copies all of the matrix data from the source Matrix3D object into the calling Matrix3D object.
            */
            Matrix3D.prototype.copyFrom = function (sourceMatrix3D) {
                var len = sourceMatrix3D.rawData.length;
                for (var c = 0; c < len; c++)
                    this.rawData[c] = sourceMatrix3D.rawData[c];
            };

            /**
            * Copies all of the vector data from the source vector object into the calling Matrix3D object.
            */
            Matrix3D.prototype.copyRawDataFrom = function (vector, index, transpose) {
                if (typeof index === "undefined") { index = 0; }
                if (typeof transpose === "undefined") { transpose = false; }
                if (transpose)
                    this.transpose();

                var len = vector.length - index;
                for (var c = 0; c < len; c++)
                    this.rawData[c] = vector[c + index];

                if (transpose)
                    this.transpose();
            };

            /**
            * Copies all of the matrix data from the calling Matrix3D object into the provided vector.
            */
            Matrix3D.prototype.copyRawDataTo = function (vector, index, transpose) {
                if (typeof index === "undefined") { index = 0; }
                if (typeof transpose === "undefined") { transpose = false; }
                if (transpose)
                    this.transpose();

                var len = this.rawData.length;
                for (var c = 0; c < len; c++)
                    vector[c + index] = this.rawData[c];

                if (transpose)
                    this.transpose();
            };

            /**
            * Copies a Vector3D object into specific row of the calling Matrix3D object.
            */
            Matrix3D.prototype.copyRowFrom = function (row /*uint*/ , vector3D) {
                if (row < 0 || row > 3)
                    throw new Error("row error");
                this.rawData[row] = vector3D.x;
                this.rawData[row + 4] = vector3D.y;
                this.rawData[row + 8] = vector3D.z;
                this.rawData[row + 12] = vector3D.w;
            };

            /**
            * Copies specific row of the calling Matrix3D object into the Vector3D object.
            */
            Matrix3D.prototype.copyRowTo = function (row /*uint*/ , vector3D) {
                if (row < 0 || row > 3)
                    throw new Error("row error");
                vector3D.x = this.rawData[row];
                vector3D.y = this.rawData[row + 4];
                vector3D.z = this.rawData[row + 8];
                vector3D.w = this.rawData[row + 12];
            };

            Matrix3D.prototype.copyToMatrix3D = function (dest) {
                dest.rawData.set(this.rawData);
            };

            /**
            * Returns the transformation matrix's translation, rotation, and scale settings as a Vector of three Vector3D objects.
            */
            //public decompose(orientationStyle: String = "eulerAngles"):Vector3D[]
            //{
            //}
            /**
            * Converts the current matrix to an identity or unit matrix.
            */
            Matrix3D.prototype.identity = function () {
                this.rawData = new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1]);
            };

            /**
            * [static] Interpolates the translation, rotation, and scale transformation of one matrix toward those of the target matrix.
            */
            Matrix3D.interpolate = function (thisMat, toMat, percent) {
                return new Matrix3D();
            };

            /**
            * Interpolates this matrix towards the translation, rotation, and scale transformations of the target matrix.
            */
            Matrix3D.prototype.interpolateTo = function (toMat, percent) {
            };

            /**
            * Inverts the current matrix.
            */
            Matrix3D.prototype.invert = function () {
                return true;
            };

            /**
            * Rotates the display object so that it faces a specified position.
            */
            Matrix3D.prototype.pointAt = function (pos, at, up) {
                if (typeof at === "undefined") { at = null; }
                if (typeof up === "undefined") { up = null; }
                if (at == null)
                    at = new geom.Vector3D(0, -1, 0);
                if (up == null)
                    up = new geom.Vector3D(0, 0, -1);

                var zAxis = at.subtract(pos);
                zAxis.normalize();

                var xAxis = zAxis.crossProduct(up);
                var yAxis = zAxis.crossProduct(xAxis);

                this.rawData = new Float32Array([
                    xAxis.x, xAxis.y, xAxis.z, 0,
                    yAxis.x, yAxis.y, yAxis.z, 0,
                    zAxis.x, zAxis.y, zAxis.z, 0,
                    pos.x, pos.y, pos.z, 1
                ]);
            };

            /**
            * Sets the transformation matrix's translation, rotation, and scale settings.
            */
            Matrix3D.prototype.recompose = function (components, orientationStyle) {
                if (typeof orientationStyle === "undefined") { orientationStyle = "eulerAngles"; }
                return true;
            };

            /**
            * Uses the transformation matrix to transform a Vector3D object from one space coordinate to another.
            */
            Matrix3D.prototype.transformVector = function (v) {
                // [x,y,z,1] * this
                return new geom.Vector3D(v.x * this.rawData[0] + v.y * this.rawData[4] + v.z * this.rawData[8] + this.rawData[12], v.x * this.rawData[1] + v.y * this.rawData[5] + v.z * this.rawData[9] + this.rawData[13], v.x * this.rawData[2] + v.y * this.rawData[6] + v.z * this.rawData[10] + this.rawData[14], v.x * this.rawData[3] + v.y * this.rawData[7] + v.z * this.rawData[11] + this.rawData[15]);
            };

            /**
            * Uses the transformation matrix without its translation elements to transform a Vector3D object from one space coordinate to another.
            */
            Matrix3D.prototype.deltaTransformVector = function (v) {
                //[x,y,z,0] * this
                return new geom.Vector3D(v.x * this.rawData[0] + v.y * this.rawData[4] + v.z * this.rawData[8], v.x * this.rawData[1] + v.y * this.rawData[5] + v.z * this.rawData[9], v.x * this.rawData[2] + v.y * this.rawData[6] + v.z * this.rawData[10], v.x * this.rawData[3] + v.y * this.rawData[7] + v.z * this.rawData[11]);
            };

            /**
            * Uses the transformation matrix to transform a Vector of Numbers from one coordinate space to another.
            */
            Matrix3D.prototype.transformVectors = function (vin, vout) {
                var i = 0;
                var x = 0, y = 0, z = 0;

                while (i + 3 <= vin.length) {
                    x = vin[i];
                    y = vin[i + 1];
                    z = vin[i + 2];
                    vout[i] = x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12];
                    vout[i + 1] = x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13];
                    vout[i + 2] = x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14];
                    i += 3;
                }
            };

            /**
            * Converts the current Matrix3D object to a matrix where the rows and columns are swapped.
            */
            Matrix3D.prototype.transpose = function () {
                var a12 = this.rawData[1];
                var a13 = this.rawData[2];
                var a14 = this.rawData[3];
                var a21 = this.rawData[4];
                var a23 = this.rawData[6];
                var a24 = this.rawData[7];
                var a31 = this.rawData[8];
                var a32 = this.rawData[9];
                var a34 = this.rawData[11];
                var a41 = this.rawData[12];
                var a42 = this.rawData[13];
                var a43 = this.rawData[14];

                this.rawData[1] = a21;
                this.rawData[2] = a31;
                this.rawData[3] = a41;
                this.rawData[4] = a12;
                this.rawData[6] = a32;
                this.rawData[7] = a42;
                this.rawData[8] = a13;
                this.rawData[9] = a23;
                this.rawData[11] = a43;
                this.rawData[12] = a14;
                this.rawData[13] = a24;
                this.rawData[13] = a34;
            };

            Matrix3D.prototype.getRotateMatrix = function (axis, degrees) {
                var ax = axis.x;
                var ay = axis.y;
                var az = axis.z;

                var radians = Math.PI / 180 * degrees;
                var c = Math.cos(radians);
                var s = Math.sin(radians);

                //get rotation matrix
                var rMatrix;

                if (ax != 0 && ay == 0 && az == 0) {
                    rMatrix = new Matrix3D([
                        1, 0, 0, 0,
                        0, c, s, 0,
                        0, -s, c, 0,
                        0, 0, 0, 1
                    ]);
                } else if (ay != 0 && ax == 0 && az == 0) {
                    rMatrix = new Matrix3D([
                        c, 0, -s, 0,
                        0, 1, 0, 0,
                        s, 0, c, 0,
                        0, 0, 0, 1
                    ]);
                } else if (az != 0 && ax == 0 && ay == 0) {
                    rMatrix = new Matrix3D([
                        c, s, 0, 0,
                        -s, c, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1
                    ]);
                } else {
                    //make sure axis is a unit vector
                    var lsq = axis.lengthSquared;
                    if (Math.abs(lsq - 1) > 0.0001) {
                        var f = 1 / Math.sqrt(lsq);
                        ax = axis.x * f;
                        ay = axis.y * f;
                        az = axis.z * f;
                    }

                    var t = 1 - c;

                    rMatrix = new Matrix3D([
                        ax * ax * t + c, ax * ay * t + az * s, ax * az * t - ay * s, 0,
                        ax * ay * t - az * s, ay * ay * t + c, ay * az * t + ax * s, 0,
                        ax * az * t + ay * s, ay * az * t - ax * s, az * az * t + c, 0,
                        0, 0, 0, 1
                    ]);
                }
                return rMatrix;
            };
            return Matrix3D;
        })();
        geom.Matrix3D = Matrix3D;
    })(stagl.geom || (stagl.geom = {}));
    var geom = stagl.geom;
})(stagl || (stagl = {}));
//clipspace coordinates always go from -1 to +1
var stagl;
(function (stagl) {
    ///<reference path="../_definitions.ts"/>
    (function (geom) {
        var Vector3D = (function () {
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
            function Vector3D(x, y, z, w) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof z === "undefined") { z = 0; }
                if (typeof w === "undefined") { w = 0; }
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
            }
            Object.defineProperty(Vector3D.prototype, "length", {
                /**
                * [read-only] The length, magnitude, of the current Vector3D object from the origin(0, 0, 0) to the object's x, y, and z coordinates.
                */
                get: function () {
                    return Math.sqrt(this.lengthSquared);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vector3D.prototype, "lengthSquared", {
                /**
                * [read-only] The square of the length of the current Vector3D object, calculated using the x, y, and z properties.
                */
                get: function () {
                    return this.x * this.x + this.y * this.y + this.z * this.z;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * [static] Returns the angle in radians between two vectors.
            */
            Vector3D.angleBetween = function (a, b) {
                return Math.acos(a.dotProduct(b) / (a.length * b.length));
            };

            /**
            * [static] Returns the distance between two Vector3D objects.
            */
            Vector3D.distance = function (pt1, pt2) {
                var x = (pt1.x - pt2.x);
                var y = (pt1.y - pt2.y);
                var z = (pt1.z - pt2.z);
                return Math.sqrt(x * x + y * y + z * z);
            };

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
            Vector3D.prototype.add = function (a) {
                return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z);
            };

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
            Vector3D.prototype.subtract = function (a) {
                return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z);
            };

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
            Vector3D.prototype.incrementBy = function (a) {
                this.x += a.x;
                this.y += a.y;
                this.z += a.z;
            };

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
            Vector3D.prototype.decrementBy = function (a) {
                this.x -= a.x;
                this.y -= a.y;
                this.z -= a.z;
            };

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
            Vector3D.prototype.equals = function (toCompare, allFour) {
                if (typeof allFour === "undefined") { allFour = false; }
                return (this.x == toCompare.x && this.y == toCompare.y && this.z == toCompare.z && (allFour ? this.w == toCompare.w : true));
            };

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
            Vector3D.prototype.nearEquals = function (toCompare, tolerance, allFour) {
                if (typeof allFour === "undefined") { allFour = false; }
                var abs = Math.abs;
                return ((abs(this.x - toCompare.x) < tolerance) && (abs(this.y - toCompare.y) < tolerance) && (abs(this.z - toCompare.z) < tolerance) && (allFour ? (abs(this.w - toCompare.w) < tolerance) : true));
            };

            /**
            * Returns a new Vector3D object that is an exact copy of the current Vector3D object.
            * @return	A new Vector3D object that is a copy of the current Vector3D object.
            * @langversion	3.0
            * @playerversion	Flash 10
            * @playerversion	AIR 1.5
            */
            Vector3D.prototype.clone = function () {
                return new Vector3D(this.x, this.y, this.z, this.w);
            };

            /**
            * Copies all of vector data from the source Vector3D object into the calling Vector3D object.
            */
            Vector3D.prototype.copyFrom = function (sourceVector3D) {
                this.x = sourceVector3D.x;
                this.y = sourceVector3D.y;
                this.z = sourceVector3D.z;
                this.w = sourceVector3D.w;
            };

            /**
            * Sets the current Vector3D object to its inverse. The inverse object is also considered the
            * opposite of the original object. The value of
            * the x, y, and z properties of the current Vector3D object
            * is changed to -x, -y, and -z.
            * @langversion	3.0
            * @playerversion	Flash 10
            * @playerversion	AIR 1.5
            */
            Vector3D.prototype.negate = function () {
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;
            };

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
            Vector3D.prototype.scaleBy = function (s) {
                this.x *= s;
                this.y *= s;
                this.z *= s;
            };

            /**
            * Sets the members of Vector3D to the specified values
            */
            Vector3D.prototype.setTo = function (xa, ya, za) {
                this.x = xa;
                this.y = ya;
                this.z = za;
            };

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
            Vector3D.prototype.normalize = function () {
                var leng = this.length;
                if (leng != 0)
                    this.scaleBy(1 / leng);
                return leng;
            };

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
            Vector3D.prototype.crossProduct = function (a) {
                return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x);
            };

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
            Vector3D.prototype.dotProduct = function (a) {
                return (this.x * a.x + this.y * a.y + this.z * a.z);
            };

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
            Vector3D.prototype.project = function () {
                if (this.w == 0)
                    return;
                this.x /= this.w;
                this.y /= this.w;
                this.z /= this.w;
            };

            /**
            * Returns a string representation of the current Vector3D object.
            */
            Vector3D.prototype.toString = function () {
                return "[Vector3D] (x:" + this.x + " ,y:" + this.y + ", z" + this.z + ", w:" + this.w + ")";
            };
            Vector3D.X_AXIS = new Vector3D(1, 0, 0);

            Vector3D.Y_AXIS = new Vector3D(0, 1, 0);

            Vector3D.Z_AXIS = new Vector3D(0, 0, 1);
            return Vector3D;
        })();
        geom.Vector3D = Vector3D;
    })(stagl.geom || (stagl.geom = {}));
    var geom = stagl.geom;
})(stagl || (stagl = {}));
///<reference path="_definitions.ts"/>
var stagl;
(function (stagl) {
    var Context3D = (function () {
        function Context3D() {
            /**
            * private  setVertexBufferAt�Ĳ�������
            */
            this._attributesToEnable = new Array();
            this._constantsToEnable = new Array();
            Context3D.GL.enable(Context3D.GL.BLEND); //stage3d cant disable blend?
            stagl.Context3DBlendFactor.init();
        }
        Context3D.prototype.configureBackBuffer = function (width /* int */ , height /* int */ , antiAlias /* int */ , enableDepthAndStencil) {
            if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = true; }
            Context3D.GL.viewport(0, 0, width, height);

            //TODO: antiAlias , Stencil
            if (enableDepthAndStencil) {
                this._clearBit = Context3D.GL.COLOR_BUFFER_BIT | Context3D.GL.DEPTH_BUFFER_BIT | Context3D.GL.STENCIL_BUFFER_BIT;
                Context3D.GL.enable(Context3D.GL.DEPTH_TEST);
                Context3D.GL.enable(Context3D.GL.STENCIL_TEST);
            } else {
                this._clearBit = Context3D.GL.COLOR_BUFFER_BIT;
                Context3D.GL.disable(Context3D.GL.DEPTH_TEST);
                Context3D.GL.disable(Context3D.GL.STENCIL_TEST);
            }
        };

        Context3D.prototype.createVertexBuffer = function (numVertices /* int */ , data32PerVertex /* int */ ) {
            return new stagl.VertexBuffer3D(numVertices, data32PerVertex);
        };

        Context3D.prototype.createIndexBuffer = function (numIndices /* int */ ) {
            return new stagl.IndexBuffer3D(numIndices);
        };

        /**
        * @width and @height are not need.
        * @format only support rgba
        * @optimizeForRenderToTexture not implement
        */
        Context3D.prototype.createTexture = function (streamingLevels) {
            if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
            // public createTexture(width: number/* int */, height: number/* int */, format: string, optimizeForRenderToTexture: bool, streamingLevels: number/* int */ = 0): Texture
            return new stagl.Texture(streamingLevels);
        };

        Context3D.prototype.createProgram = function () {
            return new stagl.Program3D();
        };

        /**
        *  ����webglҪȡ�ñ���������index�ĳ�variable��
        */
        Context3D.prototype.setVertexBufferAt = function (variable, buffer, bufferOffset, format) {
            if (typeof bufferOffset === "undefined") { bufferOffset = 0; }
            if (typeof format === "undefined") { format = "float4"; }
            //��setProgram֮ǰ���õ�setVertexBufferAt ������setProgramʱһ��set
            if (this._linkedProgram == null) {
                this._attributesToEnable.push([variable, buffer, bufferOffset, format]);
                return;
            }

            var location = Context3D.GL.getAttribLocation(this._linkedProgram.glProgram, variable);

            if (location < 0) {
                throw new Error("Fail to get the storage location of" + variable);
                return;
            }

            var size;
            switch (format) {
                case stagl.Context3DVertexBufferFormat.FLOAT_4:
                    size = 4;
                    break;
                case stagl.Context3DVertexBufferFormat.FLOAT_3:
                    size = 3;
                    break;
                case stagl.Context3DVertexBufferFormat.FLOAT_2:
                    size = 2;
                    break;
                case stagl.Context3DVertexBufferFormat.FLOAT_1:
                    size = 1;
                    break;
                case stagl.Context3DVertexBufferFormat.BYTES_4:
                    size = 4;
                    break;
            }

            Context3D.GL.bindBuffer(Context3D.GL.ARRAY_BUFFER, buffer.glBuffer); // Bind the buffer object to a target

            //http://blog.tojicode.com/2011/05/interleaved-array-basics.html
            Context3D.GL.vertexAttribPointer(location, size, Context3D.GL.FLOAT, false, (buffer.data32PerVertex * 4), (bufferOffset * 4)); //  * 4 bytes per value
            Context3D.GL.enableVertexAttribArray(location);
            // Context3D.GL.bindBuffer(Context3D.GL.ARRAY_BUFFER, null);
        };

        /**
        *  programType������Ҫ��ֻ���ṩ�������
        */
        Context3D.prototype.setProgramConstantsFromVector = function (variable, data /* Vector.<Number> */ ) {
            if (data.length > 4)
                throw new Error("data length > 4");

            if (this._linkedProgram == null) {
                this._constantsToEnable.push([variable, data]);
                return;
            }
            var index = Context3D.GL.getUniformLocation(this._linkedProgram.glProgram, variable);

            if (index == null) {
                throw new Error("Fail to get uniform " + variable);
                return;
            }

            Context3D.GL["uniform" + data.length + "fv"](index, data);
            /*
            switch (data.length)
            {
            case 1:
            Context3D.GL.uniform1fv(index, data);
            break;
            case 2:
            Context3D.GL.uniform2fv(index, data);
            break;
            case 3:
            Context3D.GL.uniform3fv(index, data);
            break;
            case 4:
            Context3D.GL.uniform4fv(index, data);
            }
            */
        };

        //programType: String, firstRegister: int, matrix: Matrix3D, transposedMatrix: Boolean = false): void
        /**
        *  programType������Ҫ��ֻ���ṩ�������
        */
        Context3D.prototype.setProgramConstantsFromMatrix = function (variable, matrix, transposedMatrix) {
            if (typeof transposedMatrix === "undefined") { transposedMatrix = false; }
            if (this._linkedProgram == null) {
                this._constantsToEnable.push([variable, matrix, transposedMatrix]);
                return;
            }

            var index = Context3D.GL.getUniformLocation(this._linkedProgram.glProgram, variable);
            if (transposedMatrix)
                matrix.transpose();

            Context3D.GL.uniformMatrix4fv(index, false, matrix.rawData); // bug:��2��������Ϊtrue
        };

        Context3D.prototype.setTextureAt = function (sampler, texture) {
            if (this._linkedProgram == null) {
                console.log("err");
            }

            //Context3D.GL.activeTexture(Context3D.GL.TEXTURE0);
            var l = Context3D.GL.getUniformLocation(this._linkedProgram.glProgram, sampler);
            Context3D.GL.uniform1i(l, 0); // TODO:���texture
        };

        Context3D.prototype.setProgram = function (program) {
            Context3D.GL.linkProgram(program.glProgram);

            if (!Context3D.GL.getProgramParameter(program.glProgram, Context3D.GL.LINK_STATUS)) {
                program.dispose();
                throw new Error("Unable to initialize the shader program.");
            }

            Context3D.GL.useProgram(program.glProgram);
            this._linkedProgram = program;

            //��setProgram֮ǰ�Ѿ�setVertexBufferAt��buffer����
            var arr;
            while (this._attributesToEnable.length > 0) {
                arr = this._attributesToEnable.pop();
                this.setVertexBufferAt(arr[0], arr[1], arr[2], arr[3]);
            }
            while (this._constantsToEnable.length > 0) {
                arr = this._constantsToEnable.pop();
                if (arr.length == 2 || arr[1].length == 4) {
                    this.setProgramConstantsFromVector(arr[0], arr[1]);
                } else {
                    this.setProgramConstantsFromMatrix(arr[0], arr[1], arr[2]);
                }
            }
        };

        Context3D.prototype.clear = function (red, green, blue, alpha, depth, stencil, mask) {
            if (typeof red === "undefined") { red = 0.0; }
            if (typeof green === "undefined") { green = 0.0; }
            if (typeof blue === "undefined") { blue = 0.0; }
            if (typeof alpha === "undefined") { alpha = 1.0; }
            if (typeof depth === "undefined") { depth = 1.0; }
            if (typeof stencil === "undefined") { stencil = 0; }
            if (typeof mask === "undefined") { mask = 0xffffffff; }
            Context3D.GL.clearColor(red, green, blue, alpha);
            Context3D.GL.clearDepth(depth); // TODO:dont need to call this every time
            Context3D.GL.clearStencil(stencil); //stencil buffer ����

            Context3D.GL.clear(this._clearBit);
        };

        Context3D.prototype.setCulling = function (triangleFaceToCull) {
            Context3D.GL.frontFace(Context3D.GL.CW); //˳ʱ��Ϊ����
            switch (triangleFaceToCull) {
                case stagl.Context3DTriangleFace.NONE:
                    Context3D.GL.disable(Context3D.GL.CULL_FACE);
                    break;
                case stagl.Context3DTriangleFace.BACK:
                    Context3D.GL.enable(Context3D.GL.CULL_FACE);
                    Context3D.GL.cullFace(Context3D.GL.BACK);
                    break;
                case stagl.Context3DTriangleFace.FRONT:
                    Context3D.GL.enable(Context3D.GL.CULL_FACE);
                    Context3D.GL.cullFace(Context3D.GL.FRONT);
                    break;
                case stagl.Context3DTriangleFace.FRONT_AND_BACK:
                    Context3D.GL.enable(Context3D.GL.CULL_FACE);
                    Context3D.GL.cullFace(Context3D.GL.FRONT_AND_BACK);
                    break;
            }
        };

        Context3D.prototype.setDepthTest = function (depthMask, passCompareMode) {
            // Context3D.GL.enable(Context3D.GL.DEPTH_TEST); need this ?
            Context3D.GL.depthMask(depthMask);

            switch (passCompareMode) {
                case stagl.Context3DCompareMode.LESS:
                    Context3D.GL.depthFunc(Context3D.GL.LESS); //default
                    break;
                case stagl.Context3DCompareMode.NEVER:
                    Context3D.GL.depthFunc(Context3D.GL.NEVER);
                    break;
                case stagl.Context3DCompareMode.EQUAL:
                    Context3D.GL.depthFunc(Context3D.GL.EQUAL);
                    break;
                case stagl.Context3DCompareMode.GREATER:
                    Context3D.GL.depthFunc(Context3D.GL.GREATER);
                    break;
                case stagl.Context3DCompareMode.NOT_EQUAL:
                    Context3D.GL.depthFunc(Context3D.GL.NOTEQUAL);
                    break;
                case stagl.Context3DCompareMode.ALWAYS:
                    Context3D.GL.depthFunc(Context3D.GL.ALWAYS);
                    break;
                case stagl.Context3DCompareMode.LESS_EQUAL:
                    Context3D.GL.depthFunc(Context3D.GL.LEQUAL);
                    break;
                case stagl.Context3DCompareMode.GREATER_EQUAL:
                    Context3D.GL.depthFunc(Context3D.GL.GEQUAL);
                    break;
            }
        };

        Context3D.prototype.setBlendFactors = function (sourceFactor, destinationFactor) {
            Context3D.GL.blendFunc(sourceFactor, destinationFactor);
        };

        Context3D.prototype.drawTriangles = function (indexBuffer, firstIndex, numTriangles) {
            if (typeof firstIndex === "undefined") { firstIndex = 0; }
            if (typeof numTriangles === "undefined") { numTriangles = -1; }
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.TRIANGLES, numTriangles < 0 ? indexBuffer.numIndices : numTriangles * 3, Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        };

        /*
        *  [Webgl only]
        *   For instance indices = [1,3,0,4,1,2]; will draw 3 lines :
        *   from vertex number 1 to vertex number 3, from vertex number 0 to vertex number 4, from vertex number 1 to vertex number 2
        */
        Context3D.prototype.drawLines = function (indexBuffer, firstIndex, numLines) {
            if (typeof firstIndex === "undefined") { firstIndex = 0; }
            if (typeof numLines === "undefined") { numLines = -1; }
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.LINES, numLines < 0 ? indexBuffer.numIndices : numLines * 2, Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        };

        /*
        * [Webgl only]
        *  For instance indices = [1,2,3] ; will only render vertices number 1, number 2, and number 3
        */
        Context3D.prototype.drawPoints = function (indexBuffer, firstIndex, numPoints) {
            if (typeof firstIndex === "undefined") { firstIndex = 0; }
            if (typeof numPoints === "undefined") { numPoints = -1; }
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.POINTS, numPoints < 0 ? indexBuffer.numIndices : numPoints, Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        };

        /**
        * [Webgl only]
        * draws a closed loop connecting the vertices defined in the indexBuffer to the next one
        */
        Context3D.prototype.drawLineLoop = function (indexBuffer, firstIndex, numPoints) {
            if (typeof firstIndex === "undefined") { firstIndex = 0; }
            if (typeof numPoints === "undefined") { numPoints = -1; }
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.LINE_LOOP, numPoints < 0 ? indexBuffer.numIndices : numPoints, Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        };

        /**
        * [Webgl only]
        * It is similar to drawLineLoop(). The difference here is that WebGL does not connect the last vertex to the first one (not a closed loop).
        */
        Context3D.prototype.drawLineStrip = function (indexBuffer, firstIndex, numPoints) {
            if (typeof firstIndex === "undefined") { firstIndex = 0; }
            if (typeof numPoints === "undefined") { numPoints = -1; }
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.LINE_STRIP, numPoints < 0 ? indexBuffer.numIndices : numPoints, Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        };

        /**
        * [Webgl only]
        *  indices = [0, 1, 2, 3, 4];, then we will generate the triangles:(0, 1, 2), (1, 2, 3), and(2, 3, 4).
        */
        Context3D.prototype.drawTriangleStrip = function (indexBuffer) {
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.TRIANGLE_STRIP, indexBuffer.numIndices, Context3D.GL.UNSIGNED_SHORT, 0);
        };

        /**
        * [Webgl only]
        * creates triangles in a similar way to drawTriangleStrip().
        * However, the first vertex defined in the indexBuffer is taken as the origin of the fan(the only shared vertex among consecutive triangles).
        * In our example, indices = [0, 1, 2, 3, 4]; will create the triangles: (0, 1, 2) and(0, 3, 4).
        */
        Context3D.prototype.drawTriangleFan = function (indexBuffer) {
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.TRIANGLE_FAN, indexBuffer.numIndices, Context3D.GL.UNSIGNED_SHORT, 0);
        };

        /**
        *   In webgl we dont need to call present , browser will do this for us.
        */
        Context3D.prototype.present = function () {
        };
        return Context3D;
    })();
    stagl.Context3D = Context3D;
})(stagl || (stagl = {}));
var stagl;
(function (stagl) {
    var Context3DBlendFactor = (function () {
        function Context3DBlendFactor() {
        }
        Context3DBlendFactor.init = function () {
            Context3DBlendFactor.ONE = stagl.Context3D.GL.ONE;
            Context3DBlendFactor.ZERO = stagl.Context3D.GL.ZERO;
            Context3DBlendFactor.SOURCE_COLOR = stagl.Context3D.GL.SRC_COLOR;
            Context3DBlendFactor.DESTINATION_COLOR = stagl.Context3D.GL.DST_COLOR;
            Context3DBlendFactor.SOURCE_ALPHA = stagl.Context3D.GL.SRC_ALPHA;
            Context3DBlendFactor.DESTINATION_ALPHA = stagl.Context3D.GL.DST_ALPHA;
            Context3DBlendFactor.ONE_MINUS_SOURCE_COLOR = stagl.Context3D.GL.ONE_MINUS_SRC_COLOR;
            Context3DBlendFactor.ONE_MINUS_DESTINATION_COLOR = stagl.Context3D.GL.ONE_MINUS_DST_COLOR;
            Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA = stagl.Context3D.GL.ONE_MINUS_SRC_ALPHA;
            Context3DBlendFactor.ONE_MINUS_DESTINATION_ALPHA = stagl.Context3D.GL.ONE_MINUS_DST_ALPHA;
            //CONSTANT_COLOR
            //ONE_MINUS_CONSTANT_COLOR
            //ONE_MINUS_CONSTANT_ALPHA
        };
        return Context3DBlendFactor;
    })();
    stagl.Context3DBlendFactor = Context3DBlendFactor;
})(stagl || (stagl = {}));
///<reference path="_definitions.ts"/>
var stagl;
(function (stagl) {
    var Context3DVertexBufferFormat = (function () {
        function Context3DVertexBufferFormat() {
        }
        Context3DVertexBufferFormat.BYTES_4 = "bytes4";
        Context3DVertexBufferFormat.FLOAT_1 = "float1";
        Context3DVertexBufferFormat.FLOAT_2 = "float2";
        Context3DVertexBufferFormat.FLOAT_3 = "float3";
        Context3DVertexBufferFormat.FLOAT_4 = "float4";
        return Context3DVertexBufferFormat;
    })();
    stagl.Context3DVertexBufferFormat = Context3DVertexBufferFormat;
})(stagl || (stagl = {}));
///<reference path="_definitions.ts"/>
var stagl;
(function (stagl) {
    var Program3D = (function () {
        function Program3D() {
            this._glProgram = stagl.Context3D.GL.createProgram();
        }
        Object.defineProperty(Program3D.prototype, "glProgram", {
            get: function () {
                return this._glProgram;
            },
            enumerable: true,
            configurable: true
        });

        Program3D.prototype.dispose = function () {
            if (this._vShader) {
                stagl.Context3D.GL.detachShader(this._glProgram, this._vShader);
                stagl.Context3D.GL.deleteShader(this._vShader);
                this._vShader = null;
            }

            if (this._fShader) {
                stagl.Context3D.GL.detachShader(this._glProgram, this._fShader);
                stagl.Context3D.GL.deleteShader(this._fShader);
                this._fShader = null;
            }
            stagl.Context3D.GL.deleteProgram(this._glProgram);
            this._glProgram = null;
        };

        Program3D.prototype.upload = function (vertexProgramId, fragmentProgramId) {
            if (typeof vertexProgramId === "undefined") { vertexProgramId = "shader-vs"; }
            if (typeof fragmentProgramId === "undefined") { fragmentProgramId = "shader-fs"; }
            this._vShader = this.loadShader(vertexProgramId, stagl.Context3D.GL.VERTEX_SHADER);
            this._fShader = this.loadShader(fragmentProgramId, stagl.Context3D.GL.FRAGMENT_SHADER);

            if (!this._fShader || !this._vShader)
                throw new Error("loadShader error");

            stagl.Context3D.GL.attachShader(this._glProgram, this._vShader);
            stagl.Context3D.GL.attachShader(this._glProgram, this._fShader);
        };

        /*
        * load shader from html file by document.getElementById
        */
        Program3D.prototype.loadShader = function (elementId, type) {
            var script = document.getElementById(elementId);
            if (!script)
                throw new Error("cant find elementId: " + elementId);
            var shader = stagl.Context3D.GL.createShader(type);
            stagl.Context3D.GL.shaderSource(shader, script.innerHTML);
            stagl.Context3D.GL.compileShader(shader);

            // Check the result of compilation
            if (!stagl.Context3D.GL.getShaderParameter(shader, stagl.Context3D.GL.COMPILE_STATUS)) {
                throw new Error(stagl.Context3D.GL.getShaderInfoLog(shader));
            }
            return shader;
        };

        /**
        *   to delete .......
        */
        Program3D.prototype.getShader2 = function (elementId) {
            var script = document.getElementById(elementId);
            if (!script)
                return null;

            var str = "";
            var k = script.firstChild;
            while (k) {
                if (k.nodeType == 3) {
                    str += k.textContent;
                }
                k = k.nextSibling;
            }

            var shader;
            if (script.type == "x-shader/x-fragment") {
                shader = stagl.Context3D.GL.createShader(stagl.Context3D.GL.FRAGMENT_SHADER);
            } else if (script.type == "x-shader/x-vertex") {
                shader = stagl.Context3D.GL.createShader(stagl.Context3D.GL.VERTEX_SHADER);
            } else {
                return null;
            }
            stagl.Context3D.GL.shaderSource(shader, str);
            stagl.Context3D.GL.compileShader(shader);

            if (!stagl.Context3D.GL.getShaderParameter(shader, stagl.Context3D.GL.COMPILE_STATUS)) {
                console.log("error getShader() :" + stagl.Context3D.GL.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        };
        return Program3D;
    })();
    stagl.Program3D = Program3D;
})(stagl || (stagl = {}));
///<reference path="_definitions.ts"/>
var stagl;
(function (stagl) {
    var VertexBuffer3D = (function () {
        function VertexBuffer3D(numVertices, data32PerVertex) {
            this._numVertices = numVertices;
            this._data32PerVertex = data32PerVertex;

            this._glBuffer = stagl.Context3D.GL.createBuffer();
            if (!this._glBuffer)
                throw new Error("Failed to create buffer");
            // Context3D.GL.bindBuffer(Context3D.GL.ARRAY_BUFFER, this._glBuffer);
        }
        Object.defineProperty(VertexBuffer3D.prototype, "glBuffer", {
            get: function () {
                return this._glBuffer;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(VertexBuffer3D.prototype, "data32PerVertex", {
            get: function () {
                return this._data32PerVertex;
            },
            enumerable: true,
            configurable: true
        });

        VertexBuffer3D.prototype.uploadFromVector = function (data, startVertex /* int */ , numVertices /* int */ ) {
            this._data = data;

            if (startVertex != 0 || numVertices != this._numVertices) {
                data = data.slice(startVertex, (numVertices * this._data32PerVertex));
            }

            stagl.Context3D.GL.bindBuffer(stagl.Context3D.GL.ARRAY_BUFFER, this._glBuffer);
            stagl.Context3D.GL.bufferData(stagl.Context3D.GL.ARRAY_BUFFER, new Float32Array(data), stagl.Context3D.GL.STATIC_DRAW);
            stagl.Context3D.GL.bindBuffer(stagl.Context3D.GL.ARRAY_BUFFER, null);
        };

        VertexBuffer3D.prototype.dispose = function () {
            stagl.Context3D.GL.deleteBuffer(this._glBuffer);
            this._glBuffer = null;
            this._data.length = 0;
            this._numVertices = 0;
            this._data32PerVertex = 0;
        };
        return VertexBuffer3D;
    })();
    stagl.VertexBuffer3D = VertexBuffer3D;
})(stagl || (stagl = {}));
///<reference path="_definitions.ts" />
var stagl;
(function (stagl) {
    var IndexBuffer3D = (function () {
        function IndexBuffer3D(numIndices /* int */ ) {
            this.numIndices = numIndices;
            this._glBuffer = stagl.Context3D.GL.createBuffer();
            //Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, this._glBuffer);
        }
        Object.defineProperty(IndexBuffer3D.prototype, "glBuffer", {
            get: function () {
                return this._glBuffer;
            },
            enumerable: true,
            configurable: true
        });

        IndexBuffer3D.prototype.uploadFromVector = function (data /* Vector.<uint> */ , startOffset /* int */ , count /* int */ ) {
            this._data = data;

            if (startOffset != 0 || count != this.numIndices) {
                data = data.slice(startOffset, startOffset + count);
            }
            stagl.Context3D.GL.bindBuffer(stagl.Context3D.GL.ELEMENT_ARRAY_BUFFER, this._glBuffer);
            stagl.Context3D.GL.bufferData(stagl.Context3D.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), stagl.Context3D.GL.STATIC_DRAW);
            stagl.Context3D.GL.bindBuffer(stagl.Context3D.GL.ELEMENT_ARRAY_BUFFER, null);
        };

        IndexBuffer3D.prototype.dispose = function () {
            stagl.Context3D.GL.deleteBuffer(this._glBuffer);
            this._glBuffer = null;
            this.numIndices = 0;
            this._data.length = 0;
        };
        return IndexBuffer3D;
    })();
    stagl.IndexBuffer3D = IndexBuffer3D;
})(stagl || (stagl = {}));
///<reference path="_definitions.ts" />
var stagl;
(function (stagl) {
    var Texture = (function () {
        function Texture(streamingLevels) {
            this._glTexture = stagl.Context3D.GL.createTexture();
            this._streamingLevels = streamingLevels;
        }
        Texture.prototype.uploadFromBitmapData = function (source, miplevel) {
            if (typeof miplevel === "undefined") { miplevel = 0; }
            this.uploadFromImage(source, miplevel);
        };
        Texture.prototype.uploadFromImage = function (source, miplevel) {
            if (typeof miplevel === "undefined") { miplevel = 0; }
            stagl.Context3D.GL.bindTexture(stagl.Context3D.GL.TEXTURE_2D, this._glTexture);

            // Context3D.GL.pixelStorei(Context3D.GL.UNPACK_FLIP_Y_WEBGL, 1);
            stagl.Context3D.GL.texImage2D(stagl.Context3D.GL.TEXTURE_2D, miplevel, stagl.Context3D.GL.RGBA, stagl.Context3D.GL.RGBA, stagl.Context3D.GL.UNSIGNED_BYTE, source);

            //�Ŵ�
            stagl.Context3D.GL.texParameteri(stagl.Context3D.GL.TEXTURE_2D, stagl.Context3D.GL.TEXTURE_MAG_FILTER, stagl.Context3D.GL.LINEAR); //�ٶ���Ч����
            if (this._streamingLevels == 0) {
                //��С
                stagl.Context3D.GL.texParameteri(stagl.Context3D.GL.TEXTURE_2D, stagl.Context3D.GL.TEXTURE_MIN_FILTER, stagl.Context3D.GL.LINEAR);
            } else {
                stagl.Context3D.GL.texParameteri(stagl.Context3D.GL.TEXTURE_2D, stagl.Context3D.GL.TEXTURE_MIN_FILTER, stagl.Context3D.GL.LINEAR_MIPMAP_LINEAR); //linnear����mipmap,����Ҳlinear
                stagl.Context3D.GL.generateMipmap(stagl.Context3D.GL.TEXTURE_2D);
            }

            if (!stagl.Context3D.GL.isTexture(this._glTexture)) {
                throw new Error("Error:Texture is invalid");
            }
            //bind null �᲻��ʾ��ͼ
            //Context3D.GL.bindTexture(Context3D.GL.TEXTURE_2D, null);
        };
        return Texture;
    })();
    stagl.Texture = Texture;
})(stagl || (stagl = {}));
///<reference path="_definitions.ts" />
var stagl;
(function (stagl) {
    var Context3DCompareMode = (function () {
        function Context3DCompareMode() {
        }
        Context3DCompareMode.ALWAYS = "always";
        Context3DCompareMode.EQUAL = "equal";
        Context3DCompareMode.GREATER = "greater";
        Context3DCompareMode.GREATER_EQUAL = "greaterEqual";
        Context3DCompareMode.LESS = "less";
        Context3DCompareMode.LESS_EQUAL = "lessEqual";
        Context3DCompareMode.NEVER = "never";
        Context3DCompareMode.NOT_EQUAL = "notEqual";
        return Context3DCompareMode;
    })();
    stagl.Context3DCompareMode = Context3DCompareMode;
})(stagl || (stagl = {}));
///<reference path="_definitions.ts" />
var stagl;
(function (stagl) {
    var Context3DTriangleFace = (function () {
        function Context3DTriangleFace() {
        }
        Context3DTriangleFace.BACK = "back";
        Context3DTriangleFace.FRONT = "front";
        Context3DTriangleFace.FRONT_AND_BACK = "frontAndBack";
        Context3DTriangleFace.NONE = "none";
        return Context3DTriangleFace;
    })();
    stagl.Context3DTriangleFace = Context3DTriangleFace;
})(stagl || (stagl = {}));
///<reference path="events/EventDispatcher.ts"/>
///<reference path="events/Event.ts"/>
///<reference path="events/ErrorEvent.ts"/>
///<reference path="geom/Matrix3D.ts"/>
///<reference path="geom/Vector3D.ts"/>
///<reference path="Context3D.ts"/>
///<reference path="Context3DBlendFactor.ts"/>
///<reference path="Context3DVertexBufferFormat.ts" />
///<reference path="Program3D.ts"/>
///<reference path="Stage3D.ts"/>
///<reference path="VertexBuffer3D.ts"/>
///<reference path="IndexBuffer3D.ts"/>
///<reference path="Texture.ts"/>
///<reference path="Context3DVertexBufferFormat.ts"/>
///<reference path="Context3DCompareMode.ts"/>
///<reference path="Context3DTriangleFace.ts"/>
///<reference path="_definitions.ts"/>
var stagl;
(function (stagl) {
    stagl.VERSION = 0.001;

    var Stage3D = (function (_super) {
        __extends(Stage3D, _super);
        function Stage3D(canvas) {
            _super.call(this);
            this._context3D = null;
            this._stageWidth = 0;
            this._stageHeight = 0;
            this._canvas = canvas;
            this._stageWidth = canvas.width;
            this._stageHeight = canvas.height;
        }
        Object.defineProperty(Stage3D.prototype, "context3D", {
            /**
            * [read-only] The Context3D object associated with this Stage3D instance.
            */
            get: function () {
                return this._context3D;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage3D.prototype, "stageWidth", {
            get: function () {
                return this._stageWidth;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage3D.prototype, "stageHeight", {
            get: function () {
                return this._stageHeight;
            },
            enumerable: true,
            configurable: true
        });

        Stage3D.prototype.requestContext3D = function () {
            if (!this._canvas)
                return;

            if (this._context3D != null)
                return this.onCreateSuccess();

            if (this._canvas.addEventListener)
                this._canvas.addEventListener("webglcontextcreationerror", this.onCreationError, false);

            var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            stagl.Context3D.GL = null;
            for (var i = 0; i < names.length; i++) {
                try  {
                    stagl.Context3D.GL = this._canvas.getContext(names[i]);
                } catch (e) {
                }

                if (stagl.Context3D.GL)
                    break;
            }

            if (stagl.Context3D.GL == null)
                return this.onCreationError(null);

            this._context3D = new stagl.Context3D();
            return this.onCreateSuccess();
        };

        Stage3D.prototype.onCreationError = function (e) {
            if (typeof e === "undefined") { e = null; }
            if (e != null) {
                if (this._canvas.removeEventListener)
                    this._canvas.removeEventListener("webglcontextcreationerror", this.onCreationError, false);
            }

            this.dispatchEvent(new stagl.events.ErrorEvent()); //TODO: error message
        };

        Stage3D.prototype.onCreateSuccess = function () {
            var e = new stagl.events.Event(stagl.events.Event.CONTEXT3D_CREATE);
            e.target = this;
            this.dispatchEvent(e);
        };
        return Stage3D;
    })(stagl.events.EventDispatcher);
    stagl.Stage3D = Stage3D;
})(stagl || (stagl = {}));
//# sourceMappingURL=stagl.js.map
