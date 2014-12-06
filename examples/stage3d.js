var stageJS;
(function (stageJS) {
    var BitmapData = (function () {
        function BitmapData(width, height, transparent, fillColor) {
            if (typeof transparent === "undefined") { transparent = true; }
            if (typeof fillColor === "undefined") { fillColor = 0xFFFFFFFF; }
            this._transparent = transparent;
            this._canvas = document.createElement("canvas");
            this._canvas.width = width;
            this._canvas.height = height;
            this._context = this._canvas.getContext("2d");
            this._rect = { x: 0, y: 0, width: width, height: height };

            this.fillRect(this._rect, fillColor);
        }
        Object.defineProperty(BitmapData.prototype, "width", {
            get: function () {
                return this._canvas.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitmapData.prototype, "height", {
            get: function () {
                return this._canvas.height;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(BitmapData.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(BitmapData.prototype, "imageData", {
            get: function () {
                return this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(BitmapData.prototype, "rect", {
            get: function () {
                return this._rect;
            },
            enumerable: true,
            configurable: true
        });

        BitmapData.prototype.copyPixels = function (sourceBitmapData, sourceRect, destPoint) {
            if (sourceBitmapData instanceof BitmapData)
                this._context.drawImage(sourceBitmapData.canvas, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destPoint.x, destPoint.y, sourceRect.width, sourceRect.height);
            else {
                this._context.drawImage(sourceBitmapData, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destPoint.x, destPoint.y, sourceRect.width, sourceRect.height);
            }
        };

        BitmapData.prototype.draw = function (source) {
            if (source instanceof BitmapData)
                this._context.drawImage(source.canvas, 0, 0);
            else
                this._context.drawImage(source, 0, 0);
        };

        BitmapData.prototype.fillRect = function (rect, color) {
            this._context.fillStyle = this.hexToRGBACSS(color);
            this._context.fillRect(rect.x, rect.y, rect.width, rect.height);
        };

        BitmapData.prototype.hexToRGBACSS = function (d) {
            var r = (d & 0x00ff0000) >>> 16;
            var g = (d & 0x0000ff00) >>> 8;
            var b = d & 0x000000ff;

            if (this._transparent)
                var a = ((d & 0xff000000) >>> 24) / 255;
            else
                var a = 1;

            return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        };
        return BitmapData;
    })();
    stageJS.BitmapData = BitmapData;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (events) {
        var Event = (function () {
            function Event(type) {
                this.type = undefined;
                this.target = undefined;
                this.type = type;
            }
            Event.prototype.clone = function () {
                return new Event(this.type);
            };
            Event.CONTEXT3D_CREATE = "CONTEXT3D_CREATE";
            return Event;
        })();
        events.Event = Event;
    })(stageJS.events || (stageJS.events = {}));
    var events = stageJS.events;
})(stageJS || (stageJS = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var stageJS;
(function (stageJS) {
    (function (events) {
        var ErrorEvent = (function (_super) {
            __extends(ErrorEvent, _super);
            function ErrorEvent() {
                _super.call(this, ErrorEvent.ERROR);
            }
            ErrorEvent.ERROR = "error";
            return ErrorEvent;
        })(stageJS.events.Event);
        events.ErrorEvent = ErrorEvent;
    })(stageJS.events || (stageJS.events = {}));
    var events = stageJS.events;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (events) {
        var EventDispatcher = (function () {
            function EventDispatcher(target) {
                if (typeof target === "undefined") { target = null; }
                this.listeners = new Array();
                this.target = target || this;
            }
            EventDispatcher.prototype.addEventListener = function (type, listener) {
                if (this.listeners[type] === undefined)
                    this.listeners[type] = new Array();

                if (this.getEventListenerIndex(type, listener) === -1)
                    this.listeners[type].push(listener);
            };

            EventDispatcher.prototype.removeEventListener = function (type, listener) {
                var index = this.getEventListenerIndex(type, listener);

                if (index !== -1)
                    this.listeners[type].splice(index, 1);
            };

            EventDispatcher.prototype.dispatchEvent = function (event) {
                var listenerArray = this.listeners[event.type];

                if (listenerArray !== undefined) {
                    var l = listenerArray.length;

                    event.target = this.target;

                    for (var i = 0; i < l; i++)
                        listenerArray[i](event);
                }
            };

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
    })(stageJS.events || (stageJS.events = {}));
    var events = stageJS.events;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (geom) {
        var Orientation3D = (function () {
            function Orientation3D() {
            }
            Orientation3D.AXIS_ANGLE = "axisAngle";
            Orientation3D.EULER_ANGLES = "eulerAngles";
            Orientation3D.QUATERNION = "quaternion";
            return Orientation3D;
        })();
        geom.Orientation3D = Orientation3D;
    })(stageJS.geom || (stageJS.geom = {}));
    var geom = stageJS.geom;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (geom) {
        var Vector3D = (function () {
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
                get: function () {
                    return Math.sqrt(this.lengthSquared);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vector3D.prototype, "lengthSquared", {
                get: function () {
                    return this.x * this.x + this.y * this.y + this.z * this.z;
                },
                enumerable: true,
                configurable: true
            });

            Vector3D.angleBetween = function (a, b) {
                return Math.acos(a.dotProduct(b) / (a.length * b.length));
            };

            Vector3D.distance = function (pt1, pt2) {
                var x = (pt1.x - pt2.x);
                var y = (pt1.y - pt2.y);
                var z = (pt1.z - pt2.z);
                return Math.sqrt(x * x + y * y + z * z);
            };

            Vector3D.prototype.add = function (a) {
                return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z);
            };

            Vector3D.prototype.subtract = function (a) {
                return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z);
            };

            Vector3D.prototype.incrementBy = function (a) {
                this.x += a.x;
                this.y += a.y;
                this.z += a.z;
            };

            Vector3D.prototype.decrementBy = function (a) {
                this.x -= a.x;
                this.y -= a.y;
                this.z -= a.z;
            };

            Vector3D.prototype.equals = function (toCompare, allFour) {
                if (typeof allFour === "undefined") { allFour = false; }
                return (this.x == toCompare.x && this.y == toCompare.y && this.z == toCompare.z && (allFour ? this.w == toCompare.w : true));
            };

            Vector3D.prototype.nearEquals = function (toCompare, tolerance, allFour) {
                if (typeof allFour === "undefined") { allFour = false; }
                var abs = Math.abs;
                return ((abs(this.x - toCompare.x) < tolerance) && (abs(this.y - toCompare.y) < tolerance) && (abs(this.z - toCompare.z) < tolerance) && (allFour ? (abs(this.w - toCompare.w) < tolerance) : true));
            };

            Vector3D.prototype.clone = function () {
                return new Vector3D(this.x, this.y, this.z, this.w);
            };

            Vector3D.prototype.copyFrom = function (sourceVector3D) {
                this.x = sourceVector3D.x;
                this.y = sourceVector3D.y;
                this.z = sourceVector3D.z;
                this.w = sourceVector3D.w;
            };

            Vector3D.prototype.negate = function () {
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;
            };

            Vector3D.prototype.scaleBy = function (s) {
                this.x *= s;
                this.y *= s;
                this.z *= s;
            };

            Vector3D.prototype.setTo = function (xa, ya, za) {
                this.x = xa;
                this.y = ya;
                this.z = za;
            };

            Vector3D.prototype.normalize = function () {
                var leng = this.length;
                if (leng != 0)
                    this.scaleBy(1 / leng);
                return leng;
            };

            Vector3D.prototype.crossProduct = function (a) {
                return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x);
            };

            Vector3D.prototype.dotProduct = function (a) {
                return (this.x * a.x + this.y * a.y + this.z * a.z);
            };

            Vector3D.prototype.project = function () {
                if (this.w == 0)
                    return;
                this.x /= this.w;
                this.y /= this.w;
                this.z /= this.w;
            };

            Vector3D.prototype.toString = function () {
                return "[Vector3D] (x:" + this.x + " ,y:" + this.y + ", z:" + this.z + ", w:" + this.w + ")";
            };
            Vector3D.X_AXIS = new Vector3D(1, 0, 0);

            Vector3D.Y_AXIS = new Vector3D(0, 1, 0);

            Vector3D.Z_AXIS = new Vector3D(0, 0, 1);
            return Vector3D;
        })();
        geom.Vector3D = Vector3D;
    })(stageJS.geom || (stageJS.geom = {}));
    var geom = stageJS.geom;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (geom) {
        var Matrix3D = (function () {
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

            Matrix3D.prototype.append = function (lhs) {
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

            Matrix3D.prototype.prepend = function (rhs) {
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

            Matrix3D.prototype.appendRotation = function (degrees, axis, pivotPoint) {
                if (typeof pivotPoint === "undefined") { pivotPoint = null; }
                var r = this.getRotateMatrix(axis, degrees * Matrix3D.DEG_2_RAD);
                if (pivotPoint) {
                    this.appendTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
                    this.append(r);
                    this.appendTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
                } else {
                    this.append(r);
                }
            };

            Matrix3D.prototype.appendScale = function (xScale, yScale, zScale) {
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

            Matrix3D.prototype.appendTranslation = function (x, y, z) {
                this.rawData[12] += x;
                this.rawData[13] += y;
                this.rawData[14] += z;
            };

            Matrix3D.prototype.prependRotation = function (degrees, axis, pivotPoint) {
                if (typeof pivotPoint === "undefined") { pivotPoint = null; }
                var r = this.getRotateMatrix(axis, degrees * Matrix3D.DEG_2_RAD);
                if (pivotPoint) {
                    this.prependTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
                    this.prepend(r);
                    this.prependTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
                } else {
                    this.prepend(r);
                }
            };

            Matrix3D.prototype.prependScale = function (xScale, yScale, zScale) {
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

            Matrix3D.prototype.prependTranslation = function (x, y, z) {
                this.rawData[12] += this.rawData[0] * x + this.rawData[4] * y + this.rawData[8] * z;
                this.rawData[13] += this.rawData[1] * x + this.rawData[5] * y + this.rawData[9] * z;
                this.rawData[14] += this.rawData[2] * x + this.rawData[6] * y + this.rawData[10] * z;
                this.rawData[15] += this.rawData[3] * x + this.rawData[7] * y + this.rawData[11] * z;
            };

            Matrix3D.prototype.clone = function () {
                return new Matrix3D(Array.prototype.slice.call(this.rawData));
            };

            Matrix3D.prototype.copyColumnFrom = function (column, vector3D) {
                if (column < 0 || column > 3)
                    throw new Error("column error");

                this.rawData[column * 4 + 0] = vector3D.x;
                this.rawData[column * 4 + 1] = vector3D.y;
                this.rawData[column * 4 + 2] = vector3D.z;
                this.rawData[column * 4 + 3] = vector3D.w;
            };

            Matrix3D.prototype.copyColumnTo = function (column, vector3D) {
                if (column < 0 || column > 3)
                    throw new Error("column error");

                vector3D.x = this.rawData[column * 4];
                vector3D.y = this.rawData[column * 4 + 1];
                vector3D.z = this.rawData[column * 4 + 2];
                vector3D.w = this.rawData[column * 4 + 3];
            };

            Matrix3D.prototype.copyFrom = function (sourceMatrix3D) {
                var len = sourceMatrix3D.rawData.length;
                for (var c = 0; c < len; c++)
                    this.rawData[c] = sourceMatrix3D.rawData[c];
            };

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

            Matrix3D.prototype.copyRawDataTo = function (vector, index, transpose) {
                if (typeof index === "undefined") { index = 0; }
                if (typeof transpose === "undefined") { transpose = false; }
                if (transpose)
                    this.transpose();

                var len = this.rawData.length;

                for (var c = 0; c < len; c++)
                    vector[c + index] = this.rawData[c];

                if (index >= 0) {
                    for (var i = 0; i < index; i++)
                        vector[i] = 0;
                    vector.length = index + len;
                }
                if (transpose)
                    this.transpose();
            };

            Matrix3D.prototype.copyRowFrom = function (row, vector3D) {
                if (row < 0 || row > 3)
                    throw new Error("row error");
                this.rawData[row] = vector3D.x;
                this.rawData[row + 4] = vector3D.y;
                this.rawData[row + 8] = vector3D.z;
                this.rawData[row + 12] = vector3D.w;
            };

            Matrix3D.prototype.copyRowTo = function (row, vector3D) {
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

            Matrix3D.prototype.decompose = function (orientationStyle) {
                if (typeof orientationStyle === "undefined") { orientationStyle = "eulerAngles"; }
                var vec = [];
                var m = this.clone();
                var mr = m.rawData;

                var pos = new geom.Vector3D(mr[12], mr[13], mr[14]);
                mr[12] = 0;
                mr[13] = 0;
                mr[14] = 0;

                var scale = new geom.Vector3D();

                scale.x = Math.sqrt(mr[0] * mr[0] + mr[1] * mr[1] + mr[2] * mr[2]);
                scale.y = Math.sqrt(mr[4] * mr[4] + mr[5] * mr[5] + mr[6] * mr[6]);
                scale.z = Math.sqrt(mr[8] * mr[8] + mr[9] * mr[9] + mr[10] * mr[10]);

                if (mr[0] * (mr[5] * mr[10] - mr[6] * mr[9]) - mr[1] * (mr[4] * mr[10] - mr[6] * mr[8]) + mr[2] * (mr[4] * mr[9] - mr[5] * mr[8]) < 0)
                    scale.z = -scale.z;

                mr[0] /= scale.x;
                mr[1] /= scale.x;
                mr[2] /= scale.x;
                mr[4] /= scale.y;
                mr[5] /= scale.y;
                mr[6] /= scale.y;
                mr[8] /= scale.z;
                mr[9] /= scale.z;
                mr[10] /= scale.z;

                var rot = new geom.Vector3D();

                switch (orientationStyle) {
                    case stageJS.geom.Orientation3D.AXIS_ANGLE:
                        rot.w = Math.acos((mr[0] + mr[5] + mr[10] - 1) / 2);

                        var len = Math.sqrt((mr[6] - mr[9]) * (mr[6] - mr[9]) + (mr[8] - mr[2]) * (mr[8] - mr[2]) + (mr[1] - mr[4]) * (mr[1] - mr[4]));
                        rot.x = (mr[6] - mr[9]) / len;
                        rot.y = (mr[8] - mr[2]) / len;
                        rot.z = (mr[1] - mr[4]) / len;

                        break;
                    case stageJS.geom.Orientation3D.QUATERNION:
                        var tr = mr[0] + mr[5] + mr[10];

                        if (tr > 0) {
                            rot.w = Math.sqrt(1 + tr) / 2;

                            rot.x = (mr[6] - mr[9]) / (4 * rot.w);
                            rot.y = (mr[8] - mr[2]) / (4 * rot.w);
                            rot.z = (mr[1] - mr[4]) / (4 * rot.w);
                        } else if ((mr[0] > mr[5]) && (mr[0] > mr[10])) {
                            rot.x = Math.sqrt(1 + mr[0] - mr[5] - mr[10]) / 2;

                            rot.w = (mr[6] - mr[9]) / (4 * rot.x);
                            rot.y = (mr[1] + mr[4]) / (4 * rot.x);
                            rot.z = (mr[8] + mr[2]) / (4 * rot.x);
                        } else if (mr[5] > mr[10]) {
                            rot.y = Math.sqrt(1 + mr[5] - mr[0] - mr[10]) / 2;

                            rot.x = (mr[1] + mr[4]) / (4 * rot.y);
                            rot.w = (mr[8] - mr[2]) / (4 * rot.y);
                            rot.z = (mr[6] + mr[9]) / (4 * rot.y);
                        } else {
                            rot.z = Math.sqrt(1 + mr[10] - mr[0] - mr[5]) / 2;

                            rot.x = (mr[8] + mr[2]) / (4 * rot.z);
                            rot.y = (mr[6] + mr[9]) / (4 * rot.z);
                            rot.w = (mr[1] - mr[4]) / (4 * rot.z);
                        }

                        break;
                    case stageJS.geom.Orientation3D.EULER_ANGLES:
                        rot.y = Math.asin(-mr[2]);

                        if (mr[2] != 1 && mr[2] != -1) {
                            rot.x = Math.atan2(mr[6], mr[10]);
                            rot.z = Math.atan2(mr[1], mr[0]);
                        } else {
                            rot.z = 0;
                            rot.x = Math.atan2(mr[4], mr[5]);
                        }

                        break;
                }

                vec.push(pos);
                vec.push(rot);
                vec.push(scale);

                return vec;
            };

            Matrix3D.prototype.identity = function () {
                this.rawData = new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1]);
            };

            Matrix3D.interpolate = function (thisMat, toMat, percent) {
                var a = new geom.Quaternion().fromMatrix3D(thisMat);
                var b = new geom.Quaternion().fromMatrix3D(toMat);

                return geom.Quaternion.lerp(a, b, percent).toMatrix3D();
            };

            Matrix3D.prototype.interpolateTo = function (toMat, percent) {
                this.rawData.set(Matrix3D.interpolate(this, toMat, percent).rawData);
            };

            Matrix3D.prototype.invert = function () {
                var d = this.determinant;
                var invertable = Math.abs(d) > 0.00000000001;

                if (invertable) {
                    d = 1 / d;
                    var m11 = this.rawData[0];
                    var m21 = this.rawData[4];
                    var m31 = this.rawData[8];
                    var m41 = this.rawData[12];
                    var m12 = this.rawData[1];
                    var m22 = this.rawData[5];
                    var m32 = this.rawData[9];
                    var m42 = this.rawData[13];
                    var m13 = this.rawData[2];
                    var m23 = this.rawData[6];
                    var m33 = this.rawData[10];
                    var m43 = this.rawData[14];
                    var m14 = this.rawData[3];
                    var m24 = this.rawData[7];
                    var m34 = this.rawData[11];
                    var m44 = this.rawData[15];

                    this.rawData[0] = d * (m22 * (m33 * m44 - m43 * m34) - m32 * (m23 * m44 - m43 * m24) + m42 * (m23 * m34 - m33 * m24));
                    this.rawData[1] = -d * (m12 * (m33 * m44 - m43 * m34) - m32 * (m13 * m44 - m43 * m14) + m42 * (m13 * m34 - m33 * m14));
                    this.rawData[2] = d * (m12 * (m23 * m44 - m43 * m24) - m22 * (m13 * m44 - m43 * m14) + m42 * (m13 * m24 - m23 * m14));
                    this.rawData[3] = -d * (m12 * (m23 * m34 - m33 * m24) - m22 * (m13 * m34 - m33 * m14) + m32 * (m13 * m24 - m23 * m14));
                    this.rawData[4] = -d * (m21 * (m33 * m44 - m43 * m34) - m31 * (m23 * m44 - m43 * m24) + m41 * (m23 * m34 - m33 * m24));
                    this.rawData[5] = d * (m11 * (m33 * m44 - m43 * m34) - m31 * (m13 * m44 - m43 * m14) + m41 * (m13 * m34 - m33 * m14));
                    this.rawData[6] = -d * (m11 * (m23 * m44 - m43 * m24) - m21 * (m13 * m44 - m43 * m14) + m41 * (m13 * m24 - m23 * m14));
                    this.rawData[7] = d * (m11 * (m23 * m34 - m33 * m24) - m21 * (m13 * m34 - m33 * m14) + m31 * (m13 * m24 - m23 * m14));
                    this.rawData[8] = d * (m21 * (m32 * m44 - m42 * m34) - m31 * (m22 * m44 - m42 * m24) + m41 * (m22 * m34 - m32 * m24));
                    this.rawData[9] = -d * (m11 * (m32 * m44 - m42 * m34) - m31 * (m12 * m44 - m42 * m14) + m41 * (m12 * m34 - m32 * m14));
                    this.rawData[10] = d * (m11 * (m22 * m44 - m42 * m24) - m21 * (m12 * m44 - m42 * m14) + m41 * (m12 * m24 - m22 * m14));
                    this.rawData[11] = -d * (m11 * (m22 * m34 - m32 * m24) - m21 * (m12 * m34 - m32 * m14) + m31 * (m12 * m24 - m22 * m14));
                    this.rawData[12] = -d * (m21 * (m32 * m43 - m42 * m33) - m31 * (m22 * m43 - m42 * m23) + m41 * (m22 * m33 - m32 * m23));
                    this.rawData[13] = d * (m11 * (m32 * m43 - m42 * m33) - m31 * (m12 * m43 - m42 * m13) + m41 * (m12 * m33 - m32 * m13));
                    this.rawData[14] = -d * (m11 * (m22 * m43 - m42 * m23) - m21 * (m12 * m43 - m42 * m13) + m41 * (m12 * m23 - m22 * m13));
                    this.rawData[15] = d * (m11 * (m22 * m33 - m32 * m23) - m21 * (m12 * m33 - m32 * m13) + m31 * (m12 * m23 - m22 * m13));
                }
                return invertable;
            };

            Matrix3D.prototype.pointAt = function (pos, at, up) {
                if (typeof at === "undefined") { at = null; }
                if (typeof up === "undefined") { up = null; }
                console.log('pointAt not impletement');
            };

            Matrix3D.prototype.recompose = function (components, orientationStyle) {
                if (typeof orientationStyle === "undefined") { orientationStyle = "eulerAngles"; }
                if (components.length < 3)
                    return false;

                var scale_tmp = components[2];
                var pos_tmp = components[0];
                var euler_tmp = components[1];

                this.identity();
                this.appendScale(scale_tmp.x, scale_tmp.y, scale_tmp.z);

                this.append(this.getRotateMatrix(stageJS.geom.Vector3D.X_AXIS, euler_tmp.x));
                this.append(this.getRotateMatrix(stageJS.geom.Vector3D.Y_AXIS, euler_tmp.y));
                this.append(this.getRotateMatrix(stageJS.geom.Vector3D.Z_AXIS, euler_tmp.z));

                this.rawData[12] = pos_tmp.x;
                this.rawData[13] = pos_tmp.y;
                this.rawData[14] = pos_tmp.z;
                this.rawData[15] = 1;

                return true;
            };

            Matrix3D.prototype.transformVector = function (v) {
                return new geom.Vector3D(v.x * this.rawData[0] + v.y * this.rawData[4] + v.z * this.rawData[8] + this.rawData[12], v.x * this.rawData[1] + v.y * this.rawData[5] + v.z * this.rawData[9] + this.rawData[13], v.x * this.rawData[2] + v.y * this.rawData[6] + v.z * this.rawData[10] + this.rawData[14], v.x * this.rawData[3] + v.y * this.rawData[7] + v.z * this.rawData[11] + this.rawData[15]);
            };

            Matrix3D.prototype.deltaTransformVector = function (v) {
                return new geom.Vector3D(v.x * this.rawData[0] + v.y * this.rawData[4] + v.z * this.rawData[8], v.x * this.rawData[1] + v.y * this.rawData[5] + v.z * this.rawData[9], v.x * this.rawData[2] + v.y * this.rawData[6] + v.z * this.rawData[10], v.x * this.rawData[3] + v.y * this.rawData[7] + v.z * this.rawData[11]);
            };

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
                this.rawData[14] = a34;
            };

            Matrix3D.prototype.toString = function () {
                var str = "[Matrix3D]\n";
                for (var i = 0; i < this.rawData.length; i++) {
                    str += this.rawData[i] + "  , ";
                    if (((i + 1) % 4) == 0)
                        str += "\n";
                }

                return str;
            };

            Matrix3D.prototype.getRotateMatrix = function (axis, radians) {
                var ax = axis.x;
                var ay = axis.y;
                var az = axis.z;

                var c = Math.cos(radians);
                var s = Math.sin(radians);

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
            Matrix3D.DEG_2_RAD = Math.PI / 180;
            return Matrix3D;
        })();
        geom.Matrix3D = Matrix3D;
    })(stageJS.geom || (stageJS.geom = {}));
    var geom = stageJS.geom;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (geom) {
        var Quaternion = (function () {
            function Quaternion(x, y, z, w) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof z === "undefined") { z = 0; }
                if (typeof w === "undefined") { w = 1; }
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 1;
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
            }
            Quaternion.lerp = function (qa, qb, percent) {
                if (qa.x * qb.x + qa.y * qb.y + qa.z * qb.z + qa.w * qb.w < 0) {
                    return new Quaternion(qa.x + percent * (-qb.x - qa.x), qa.y + percent * (-qb.y - qa.y), qa.z + percent * (-qb.z - qa.z), qa.w + percent * (-qb.w - qb.w));
                }
                return new Quaternion(qa.x + percent * (qb.x - qa.x), qa.y + percent * (qb.y - qa.y), qa.z + percent * (qb.z - qa.z), qa.w + percent * (qb.w - qb.w));
            };

            Quaternion.prototype.fromMatrix3D = function (m) {
                var m11 = m.rawData[0], m12 = m.rawData[1], m13 = m.rawData[2], m21 = m.rawData[4], m22 = m.rawData[5], m23 = m.rawData[6], m31 = m.rawData[8], m32 = m.rawData[9], m33 = m.rawData[10];

                var tr = m11 + m22 + m33;
                var tmp;
                if (tr > 0) {
                    tmp = 1 / (2 * Math.sqrt(tr + 1));

                    this.x = (m23 - m32) * tmp;
                    this.y = (m31 - m13) * tmp;
                    this.z = (m12 - m21) * tmp;
                    this.w = 0.25 / tmp;
                } else {
                    if ((m11 > m22) && (m11 > m33)) {
                        tmp = 1 / (2 * Math.sqrt(1 + m11 - m22 + m33));

                        this.x = (m21 + m12) * tmp;
                        this.y = (m13 + m31) * tmp;
                        this.z = (m32 - m23) * tmp;
                        this.w = 0.25 / tmp;
                    } else if ((m22 > m11) && (m22 > m33)) {
                        tmp = 1 / (Math.sqrt(1 + m22 - m11 - m33));
                        this.x = 0.25 / tmp;
                        this.y = (m32 + m23) * tmp;
                        this.z = (m13 - m31) * tmp;
                        this.w = (m21 + m12) * tmp;
                    } else if ((m33 > m11) && (m33 > m22)) {
                        tmp = 1 / (Math.sqrt(1 + m33 - m11 - m22));
                        this.x = (m32 + m23) * tmp;
                        this.y = 0.25 / tmp;
                        this.z = (m21 - m12) * tmp;
                        this.w = (m13 + m31) * tmp;
                    }
                }
                return this;
            };

            Quaternion.prototype.toMatrix3D = function (target) {
                if (typeof target === "undefined") { target = null; }
                var x2 = this.x + this.x, y2 = this.y + this.y, z2 = this.z + this.z, xx = this.x * x2, xy = this.x * y2, xz = this.x * z2, yy = this.y * y2, yz = this.y * z2, zz = this.z * z2, wx = this.w * x2, wy = this.w * y2, wz = this.w * z2;

                if (!target)
                    target = new geom.Matrix3D();

                target.rawData[0] = 1 - (yy + zz);
                target.rawData[1] = xy + wz;
                target.rawData[2] = xz - wy;
                target.rawData[3] = 0;
                target.rawData[4] = xy - wz;
                target.rawData[5] = 1 - (xx + zz);
                target.rawData[6] = yz + wx;
                target.rawData[7] = 0;
                target.rawData[8] = xz + wy;
                target.rawData[9] = yz - wx;
                target.rawData[10] = 1 - (xx + yy);
                target.rawData[11] = 0;
                target.rawData[12] = 0;
                target.rawData[13] = 0;
                target.rawData[14] = 0;
                target.rawData[15] = 1;

                return target;
            };

            Quaternion.prototype.fromAxisAngle = function (axis, angleInRadians) {
                var angle = angleInRadians * 0.5;
                var sin_a = Math.sin(angle);
                var cos_a = Math.cos(angle);

                this.x = axis.x * sin_a;
                this.y = axis.y * sin_a;
                this.z = axis.z * sin_a;
                this.w = cos_a;
            };

            Quaternion.prototype.conjugate = function () {
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;
            };

            Quaternion.prototype.toString = function () {
                return "[Quaternion] (x:" + this.x + " ,y:" + this.y + ", z:" + this.z + ", w:" + this.w + ")";
            };
            return Quaternion;
        })();
        geom.Quaternion = Quaternion;
    })(stageJS.geom || (stageJS.geom = {}));
    var geom = stageJS.geom;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (geom) {
        var PerspectiveMatrix3D = (function (_super) {
            __extends(PerspectiveMatrix3D, _super);
            function PerspectiveMatrix3D() {
                _super.apply(this, arguments);
            }
            PerspectiveMatrix3D.prototype.perspectiveFieldOfViewRH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
                var yScale = 1.0 / Math.tan(fieldOfViewY / 2.0);
                var xScale = yScale / aspectRatio;
                this.copyRawDataFrom([
                    xScale, 0.0, 0.0, 0.0,
                    0.0, yScale, 0.0, 0.0,
                    0.0, 0.0, (zFar + zNear) / (zNear - zFar), -1.0,
                    0.0, 0.0, (2 * zNear * zFar) / (zNear - zFar), 0.0
                ]);
            };

            PerspectiveMatrix3D.prototype.perspectiveFieldOfViewLH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
                var yScale = 1.0 / Math.tan(fieldOfViewY / 2.0);
                var xScale = yScale / aspectRatio;
                this.copyRawDataFrom([
                    xScale, 0.0, 0.0, 0.0,
                    0.0, yScale, 0.0, 0.0,
                    0.0, 0.0, (zFar + zNear) / (zFar - zNear), 1.0,
                    0.0, 0.0, (zNear * zFar) / (zNear - zFar), 0.0
                ]);
            };
            return PerspectiveMatrix3D;
        })(geom.Matrix3D);
        geom.PerspectiveMatrix3D = PerspectiveMatrix3D;
    })(stageJS.geom || (stageJS.geom = {}));
    var geom = stageJS.geom;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
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
    stageJS.Context3DVertexBufferFormat = Context3DVertexBufferFormat;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    var Context3DTextureFormat = (function () {
        function Context3DTextureFormat() {
        }
        Context3DTextureFormat.BGRA = "bgra";
        return Context3DTextureFormat;
    })();
    stageJS.Context3DTextureFormat = Context3DTextureFormat;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
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
    stageJS.Context3DCompareMode = Context3DCompareMode;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    var Context3DBlendFactor = (function () {
        function Context3DBlendFactor() {
        }
        Context3DBlendFactor.init = function () {
            Context3DBlendFactor.ONE = stageJS.Context3D.GL.ONE;
            Context3DBlendFactor.ZERO = stageJS.Context3D.GL.ZERO;
            Context3DBlendFactor.SOURCE_COLOR = stageJS.Context3D.GL.SRC_COLOR;
            Context3DBlendFactor.DESTINATION_COLOR = stageJS.Context3D.GL.DST_COLOR;
            Context3DBlendFactor.SOURCE_ALPHA = stageJS.Context3D.GL.SRC_ALPHA;
            Context3DBlendFactor.DESTINATION_ALPHA = stageJS.Context3D.GL.DST_ALPHA;
            Context3DBlendFactor.ONE_MINUS_SOURCE_COLOR = stageJS.Context3D.GL.ONE_MINUS_SRC_COLOR;
            Context3DBlendFactor.ONE_MINUS_DESTINATION_COLOR = stageJS.Context3D.GL.ONE_MINUS_DST_COLOR;
            Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA = stageJS.Context3D.GL.ONE_MINUS_SRC_ALPHA;
            Context3DBlendFactor.ONE_MINUS_DESTINATION_ALPHA = stageJS.Context3D.GL.ONE_MINUS_DST_ALPHA;
        };
        return Context3DBlendFactor;
    })();
    stageJS.Context3DBlendFactor = Context3DBlendFactor;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    var Context3DTriangleFace = (function () {
        function Context3DTriangleFace() {
        }
        Context3DTriangleFace.BACK = "back";
        Context3DTriangleFace.FRONT = "front";
        Context3DTriangleFace.FRONT_AND_BACK = "frontAndBack";
        Context3DTriangleFace.NONE = "none";
        return Context3DTriangleFace;
    })();
    stageJS.Context3DTriangleFace = Context3DTriangleFace;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    var VertexBuffer3D = (function () {
        function VertexBuffer3D(numVertices, data32PerVertex) {
            this._numVertices = numVertices;
            this._data32PerVertex = data32PerVertex;

            this._glBuffer = stageJS.Context3D.GL.createBuffer();
            if (!this._glBuffer)
                throw new Error("Failed to create buffer");
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

        VertexBuffer3D.prototype.uploadFromVector = function (data, startVertex, numVertices) {
            this._data = data;

            if (startVertex != 0 || numVertices != this._numVertices) {
                data = data.slice(startVertex * this._data32PerVertex, (numVertices * this._data32PerVertex));
            }

            stageJS.Context3D.GL.bindBuffer(stageJS.Context3D.GL.ARRAY_BUFFER, this._glBuffer);
            stageJS.Context3D.GL.bufferData(stageJS.Context3D.GL.ARRAY_BUFFER, new Float32Array(data), stageJS.Context3D.GL.STATIC_DRAW);
            stageJS.Context3D.GL.bindBuffer(stageJS.Context3D.GL.ARRAY_BUFFER, null);
        };

        VertexBuffer3D.prototype.dispose = function () {
            stageJS.Context3D.GL.deleteBuffer(this._glBuffer);
            this._glBuffer = null;
            this._data.length = 0;
            this._numVertices = 0;
            this._data32PerVertex = 0;
        };
        return VertexBuffer3D;
    })();
    stageJS.VertexBuffer3D = VertexBuffer3D;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    var IndexBuffer3D = (function () {
        function IndexBuffer3D(numIndices) {
            this.numIndices = numIndices;
            this._glBuffer = stageJS.Context3D.GL.createBuffer();
        }
        Object.defineProperty(IndexBuffer3D.prototype, "glBuffer", {
            get: function () {
                return this._glBuffer;
            },
            enumerable: true,
            configurable: true
        });

        IndexBuffer3D.prototype.uploadFromVector = function (data, startOffset, count) {
            this._data = data;

            if (startOffset != 0 || count != this.numIndices) {
                data = data.slice(startOffset, startOffset + count);
            }
            stageJS.Context3D.GL.bindBuffer(stageJS.Context3D.GL.ELEMENT_ARRAY_BUFFER, this._glBuffer);
            stageJS.Context3D.GL.bufferData(stageJS.Context3D.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), stageJS.Context3D.GL.STATIC_DRAW);
            stageJS.Context3D.GL.bindBuffer(stageJS.Context3D.GL.ELEMENT_ARRAY_BUFFER, null);
        };

        IndexBuffer3D.prototype.dispose = function () {
            stageJS.Context3D.GL.deleteBuffer(this._glBuffer);
            this._glBuffer = null;
            this.numIndices = 0;
            this._data.length = 0;
        };
        return IndexBuffer3D;
    })();
    stageJS.IndexBuffer3D = IndexBuffer3D;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    var Texture = (function () {
        function Texture(width, height, format, optimizeForRenderToTexture, streamingLevels) {
            this._glTexture = stageJS.Context3D.GL.createTexture();
            this._streamingLevels = streamingLevels;

            this._textureUnit = Texture.__texUnit++;

            this._width = width;
            this._height = height;
            this._format = format;
            this._forRTT = optimizeForRenderToTexture;

            if (this._forRTT) {
                stageJS.Context3D.GL.bindTexture(stageJS.Context3D.GL.TEXTURE_2D, this._glTexture);
                stageJS.Context3D.GL.texParameteri(stageJS.Context3D.GL.TEXTURE_2D, stageJS.Context3D.GL.TEXTURE_MAG_FILTER, stageJS.Context3D.GL.LINEAR);
                stageJS.Context3D.GL.texParameteri(stageJS.Context3D.GL.TEXTURE_2D, stageJS.Context3D.GL.TEXTURE_MIN_FILTER, stageJS.Context3D.GL.LINEAR_MIPMAP_NEAREST);

                stageJS.Context3D.GL.texImage2D(stageJS.Context3D.GL.TEXTURE_2D, 0, stageJS.Context3D.GL.RGBA, 512, 512, 0, stageJS.Context3D.GL.RGBA, stageJS.Context3D.GL.UNSIGNED_BYTE, null);

                if (Texture._bindingTexture)
                    stageJS.Context3D.GL.bindTexture(stageJS.Context3D.GL.TEXTURE_2D, Texture._bindingTexture);
                else
                    stageJS.Context3D.GL.bindTexture(stageJS.Context3D.GL.TEXTURE_2D, null);

                stageJS.Context3D.GL.bindRenderbuffer(stageJS.Context3D.GL.RENDERBUFFER, null);
                stageJS.Context3D.GL.bindFramebuffer(stageJS.Context3D.GL.FRAMEBUFFER, null);
            }
        }
        Texture.prototype.__getGLTexture = function () {
            return this._glTexture;
        };

        Object.defineProperty(Texture.prototype, "textureUnit", {
            get: function () {
                return this._textureUnit;
            },
            enumerable: true,
            configurable: true
        });

        Texture.prototype.uploadFromBitmapData = function (source, miplevel) {
            if (typeof miplevel === "undefined") { miplevel = 0; }
            if (this._forRTT)
                console.error("rtt texture");
            if (source instanceof stageJS.BitmapData) {
                this.uploadFromImage(source.imageData, miplevel);
            } else {
                this.uploadFromImage(source, miplevel);
            }
        };

        Texture.prototype.uploadFromImage = function (source, miplevel) {
            if (typeof miplevel === "undefined") { miplevel = 0; }
            stageJS.Context3D.GL.activeTexture(stageJS.Context3D.GL["TEXTURE" + this.textureUnit]);
            stageJS.Context3D.GL.bindTexture(stageJS.Context3D.GL.TEXTURE_2D, this._glTexture);

            Texture._bindingTexture = this._glTexture;

            if (this._streamingLevels == 0) {
                stageJS.Context3D.GL.texParameteri(stageJS.Context3D.GL.TEXTURE_2D, stageJS.Context3D.GL.TEXTURE_MIN_FILTER, stageJS.Context3D.GL.LINEAR);
            } else {
                stageJS.Context3D.GL.texParameteri(stageJS.Context3D.GL.TEXTURE_2D, stageJS.Context3D.GL.TEXTURE_MIN_FILTER, stageJS.Context3D.GL.LINEAR_MIPMAP_LINEAR);
                stageJS.Context3D.GL.generateMipmap(stageJS.Context3D.GL.TEXTURE_2D);
            }

            stageJS.Context3D.GL.texImage2D(stageJS.Context3D.GL.TEXTURE_2D, miplevel, stageJS.Context3D.GL.RGBA, stageJS.Context3D.GL.RGBA, stageJS.Context3D.GL.UNSIGNED_BYTE, source);

            if (!stageJS.Context3D.GL.isTexture(this._glTexture)) {
                throw new Error("Error:Texture is invalid");
            }
        };

        Texture.prototype.dispose = function () {
            stageJS.Context3D.GL.bindTexture(stageJS.Context3D.GL.TEXTURE_2D, null);
            Texture._bindingTexture = null;
            stageJS.Context3D.GL.deleteTexture(this._glTexture);
            this._glTexture = null;
            this._streamingLevels = 0;
        };
        Texture.__texUnit = 0;
        return Texture;
    })();
    stageJS.Texture = Texture;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    var Program3D = (function () {
        function Program3D() {
            this._glProgram = stageJS.Context3D.GL.createProgram();
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
                stageJS.Context3D.GL.detachShader(this._glProgram, this._vShader);
                stageJS.Context3D.GL.deleteShader(this._vShader);
                this._vShader = null;
            }

            if (this._fShader) {
                stageJS.Context3D.GL.detachShader(this._glProgram, this._fShader);
                stageJS.Context3D.GL.deleteShader(this._fShader);
                this._fShader = null;
            }
            stageJS.Context3D.GL.deleteProgram(this._glProgram);
            this._glProgram = null;
        };

        Program3D.prototype.upload = function (vertexProgramId, fragmentProgramId) {
            if (typeof vertexProgramId === "undefined") { vertexProgramId = "shader-vs"; }
            if (typeof fragmentProgramId === "undefined") { fragmentProgramId = "shader-fs"; }
            this._vShader = this.loadShader(vertexProgramId, stageJS.Context3D.GL.VERTEX_SHADER);
            this._fShader = this.loadShader(fragmentProgramId, stageJS.Context3D.GL.FRAGMENT_SHADER);

            if (!this._fShader || !this._vShader)
                throw new Error("loadShader error");

            stageJS.Context3D.GL.attachShader(this._glProgram, this._vShader);
            stageJS.Context3D.GL.attachShader(this._glProgram, this._fShader);
        };

        Program3D.prototype.loadShader = function (elementId, type) {
            var script = document.getElementById(elementId);
            if (!script)
                throw new Error("cant find elementId: " + elementId);
            var shader = stageJS.Context3D.GL.createShader(type);
            stageJS.Context3D.GL.shaderSource(shader, script.innerHTML);
            stageJS.Context3D.GL.compileShader(shader);

            if (!stageJS.Context3D.GL.getShaderParameter(shader, stageJS.Context3D.GL.COMPILE_STATUS)) {
                throw new Error(stageJS.Context3D.GL.getShaderInfoLog(shader));
                stageJS.Context3D.GL.deleteShader(shader);
            }
            return shader;
        };
        return Program3D;
    })();
    stageJS.Program3D = Program3D;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    stageJS.VERSION = 0.001;

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

            stageJS.Context3D.GL = this.create3DContext();

            if (stageJS.Context3D.GL == null)
                return this.onCreationError(null);

            this._context3D = new stageJS.Context3D();
            return this.onCreateSuccess();
        };

        Stage3D.prototype.create3DContext = function () {
            var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            var context = null;
            for (var i = 0; i < names.length; i++) {
                try  {
                    context = this._canvas.getContext(names[i]);
                } catch (e) {
                }

                if (context)
                    break;
            }
            return context;
        };

        Stage3D.prototype.onCreationError = function (e) {
            if (typeof e === "undefined") { e = null; }
            if (e != null) {
                if (this._canvas.removeEventListener)
                    this._canvas.removeEventListener("webglcontextcreationerror", this.onCreationError, false);
            }

            this.dispatchEvent(new stageJS.events.ErrorEvent());
        };

        Stage3D.prototype.onCreateSuccess = function () {
            var e = new stageJS.events.Event(stageJS.events.Event.CONTEXT3D_CREATE);
            e.target = this;
            this.dispatchEvent(e);
        };
        return Stage3D;
    })(stageJS.events.EventDispatcher);
    stageJS.Stage3D = Stage3D;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    var Context3D = (function () {
        function Context3D() {
            this._linkedProgram = null;
            this._vaCache = {};
            this._vcCache = {};
            this._vcMCache = {};
            this._texCache = {};
            Context3D.GL.enable(Context3D.GL.BLEND);
            stageJS.Context3DBlendFactor.init();
        }
        Context3D.prototype.configureBackBuffer = function (width, height, antiAlias, enableDepthAndStencil) {
            if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = true; }
            Context3D.GL.viewport(0, 0, width, height);

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

        Context3D.prototype.createVertexBuffer = function (numVertices, data32PerVertex) {
            return new stageJS.VertexBuffer3D(numVertices, data32PerVertex);
        };

        Context3D.prototype.createIndexBuffer = function (numIndices) {
            return new stageJS.IndexBuffer3D(numIndices);
        };

        Context3D.prototype.createTexture = function (width, height, format, optimizeForRenderToTexture, streamingLevels) {
            if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
            return new stageJS.Texture(width, height, format, optimizeForRenderToTexture, streamingLevels);
        };

        Context3D.prototype.setRenderToTexture = function (texture, enableDepthAndStencil, antiAlias, surfaceSelector, colorOutputIndex) {
            if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = false; }
            if (typeof antiAlias === "undefined") { antiAlias = 0; }
            if (typeof surfaceSelector === "undefined") { surfaceSelector = 0; }
            if (typeof colorOutputIndex === "undefined") { colorOutputIndex = 0; }
            if (enableDepthAndStencil) {
                this._clearBit = Context3D.GL.COLOR_BUFFER_BIT | Context3D.GL.DEPTH_BUFFER_BIT | Context3D.GL.STENCIL_BUFFER_BIT;
                Context3D.GL.enable(Context3D.GL.DEPTH_TEST);
                Context3D.GL.enable(Context3D.GL.STENCIL_TEST);
            } else {
                this._clearBit = Context3D.GL.COLOR_BUFFER_BIT;
                Context3D.GL.disable(Context3D.GL.DEPTH_TEST);
                Context3D.GL.disable(Context3D.GL.STENCIL_TEST);
            }

            if (!this._rttFramebuffer) {
                this._rttFramebuffer = Context3D.GL.createFramebuffer();
                Context3D.GL.bindFramebuffer(Context3D.GL.FRAMEBUFFER, this._rttFramebuffer);

                var renderbuffer = Context3D.GL.createRenderbuffer();
                Context3D.GL.bindRenderbuffer(Context3D.GL.RENDERBUFFER, renderbuffer);
                Context3D.GL.renderbufferStorage(Context3D.GL.RENDERBUFFER, Context3D.GL.DEPTH_COMPONENT16, 512, 512);

                Context3D.GL.framebufferRenderbuffer(Context3D.GL.FRAMEBUFFER, Context3D.GL.DEPTH_ATTACHMENT, Context3D.GL.RENDERBUFFER, renderbuffer);
                Context3D.GL.framebufferTexture2D(Context3D.GL.FRAMEBUFFER, Context3D.GL.COLOR_ATTACHMENT0, Context3D.GL.TEXTURE_2D, texture.__getGLTexture(), 0);
            }
            Context3D.GL.bindFramebuffer(Context3D.GL.FRAMEBUFFER, this._rttFramebuffer);
        };

        Context3D.prototype.setRenderToBackBuffer = function () {
            Context3D.GL.bindFramebuffer(Context3D.GL.FRAMEBUFFER, null);
        };

        Context3D.prototype.createProgram = function () {
            return new stageJS.Program3D();
        };

        Context3D.prototype.setVertexBufferAt = function (variable, buffer, bufferOffset, format) {
            if (typeof bufferOffset === "undefined") { bufferOffset = 0; }
            if (typeof format === "undefined") { format = "float4"; }
            var size = 0;
            switch (format) {
                case stageJS.Context3DVertexBufferFormat.FLOAT_4:
                    size = 4;
                    break;
                case stageJS.Context3DVertexBufferFormat.FLOAT_3:
                    size = 3;
                    break;
                case stageJS.Context3DVertexBufferFormat.FLOAT_2:
                    size = 2;
                    break;
                case stageJS.Context3DVertexBufferFormat.FLOAT_1:
                    size = 1;
                    break;
                case stageJS.Context3DVertexBufferFormat.BYTES_4:
                    size = 4;
                    break;
            }

            if (size <= 0)
                throw new Error("vertexBuffer format error");

            this._vaCache[variable] = {
                size: size,
                buffer: buffer.glBuffer,
                stride: buffer.data32PerVertex * 4,
                offset: bufferOffset * 4 };

            if (this._linkedProgram)
                this.enableVA(variable);
        };

        Context3D.prototype.setProgramConstantsFromVector = function (variable, data) {
            if (data.length > 4)
                throw new Error("data length > 4");

            this._vcCache[variable] = data;
            if (this._linkedProgram)
                this.enableVC(variable);
        };

        Context3D.prototype.setProgramConstantsFromMatrix = function (variable, matrix, transposedMatrix) {
            if (typeof transposedMatrix === "undefined") { transposedMatrix = false; }
            if (transposedMatrix)
                matrix.transpose();

            this._vcMCache[variable] = matrix.rawData;
            if (this._linkedProgram)
                this.enableVCM(variable);
        };

        Context3D.prototype.setTextureAt = function (sampler, texture) {
            this._texCache[sampler] = texture;

            if (this._linkedProgram)
                this.enableTex(sampler);
        };

        Context3D.prototype.setProgram = function (program) {
            if (program == null || program == this._linkedProgram)
                return;

            this._linkedProgram = program;

            Context3D.GL.linkProgram(program.glProgram);

            if (!Context3D.GL.getProgramParameter(program.glProgram, Context3D.GL.LINK_STATUS)) {
                throw new Error(Context3D.GL.getProgramInfoLog(program.glProgram));
                program.dispose();
            }
            Context3D.GL.useProgram(program.glProgram);

            var k;
            for (k in this._vaCache)
                this.enableVA(k);

            for (k in this._vcCache)
                this.enableVC(k);

            for (k in this._vcMCache)
                this.enableVCM(k);

            for (k in this._texCache)
                this.enableTex(k);
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
            Context3D.GL.clearDepth(depth);
            Context3D.GL.clearStencil(stencil);

            Context3D.GL.clear(this._clearBit);
        };

        Context3D.prototype.setCulling = function (triangleFaceToCull) {
            Context3D.GL.frontFace(Context3D.GL.CW);
            switch (triangleFaceToCull) {
                case stageJS.Context3DTriangleFace.NONE:
                    Context3D.GL.disable(Context3D.GL.CULL_FACE);
                    break;
                case stageJS.Context3DTriangleFace.BACK:
                    Context3D.GL.enable(Context3D.GL.CULL_FACE);
                    Context3D.GL.cullFace(Context3D.GL.BACK);
                    break;
                case stageJS.Context3DTriangleFace.FRONT:
                    Context3D.GL.enable(Context3D.GL.CULL_FACE);
                    Context3D.GL.cullFace(Context3D.GL.FRONT);
                    break;
                case stageJS.Context3DTriangleFace.FRONT_AND_BACK:
                    Context3D.GL.enable(Context3D.GL.CULL_FACE);
                    Context3D.GL.cullFace(Context3D.GL.FRONT_AND_BACK);
                    break;
            }
        };

        Context3D.prototype.setDepthTest = function (depthMask, passCompareMode) {
            Context3D.GL.depthMask(depthMask);

            switch (passCompareMode) {
                case stageJS.Context3DCompareMode.LESS:
                    Context3D.GL.depthFunc(Context3D.GL.LESS);
                    break;
                case stageJS.Context3DCompareMode.NEVER:
                    Context3D.GL.depthFunc(Context3D.GL.NEVER);
                    break;
                case stageJS.Context3DCompareMode.EQUAL:
                    Context3D.GL.depthFunc(Context3D.GL.EQUAL);
                    break;
                case stageJS.Context3DCompareMode.GREATER:
                    Context3D.GL.depthFunc(Context3D.GL.GREATER);
                    break;
                case stageJS.Context3DCompareMode.NOT_EQUAL:
                    Context3D.GL.depthFunc(Context3D.GL.NOTEQUAL);
                    break;
                case stageJS.Context3DCompareMode.ALWAYS:
                    Context3D.GL.depthFunc(Context3D.GL.ALWAYS);
                    break;
                case stageJS.Context3DCompareMode.LESS_EQUAL:
                    Context3D.GL.depthFunc(Context3D.GL.LEQUAL);
                    break;
                case stageJS.Context3DCompareMode.GREATER_EQUAL:
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

        Context3D.prototype.drawLines = function (indexBuffer, firstIndex, numLines) {
            if (typeof firstIndex === "undefined") { firstIndex = 0; }
            if (typeof numLines === "undefined") { numLines = -1; }
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.LINES, numLines < 0 ? indexBuffer.numIndices : numLines * 2, Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        };

        Context3D.prototype.drawPoints = function (indexBuffer, firstIndex, numPoints) {
            if (typeof firstIndex === "undefined") { firstIndex = 0; }
            if (typeof numPoints === "undefined") { numPoints = -1; }
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.POINTS, numPoints < 0 ? indexBuffer.numIndices : numPoints, Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        };

        Context3D.prototype.drawLineLoop = function (indexBuffer, firstIndex, numPoints) {
            if (typeof firstIndex === "undefined") { firstIndex = 0; }
            if (typeof numPoints === "undefined") { numPoints = -1; }
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.LINE_LOOP, numPoints < 0 ? indexBuffer.numIndices : numPoints, Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        };

        Context3D.prototype.drawLineStrip = function (indexBuffer, firstIndex, numPoints) {
            if (typeof firstIndex === "undefined") { firstIndex = 0; }
            if (typeof numPoints === "undefined") { numPoints = -1; }
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.LINE_STRIP, numPoints < 0 ? indexBuffer.numIndices : numPoints, Context3D.GL.UNSIGNED_SHORT, firstIndex * 2);
        };

        Context3D.prototype.drawTriangleStrip = function (indexBuffer) {
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.TRIANGLE_STRIP, indexBuffer.numIndices, Context3D.GL.UNSIGNED_SHORT, 0);
        };

        Context3D.prototype.drawTriangleFan = function (indexBuffer) {
            Context3D.GL.bindBuffer(Context3D.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
            Context3D.GL.drawElements(Context3D.GL.TRIANGLE_FAN, indexBuffer.numIndices, Context3D.GL.UNSIGNED_SHORT, 0);
        };

        Context3D.prototype.present = function () {
        };

        Context3D.prototype.enableVA = function (keyInCache) {
            var location = Context3D.GL.getAttribLocation(this._linkedProgram.glProgram, keyInCache);
            if (location < 0) {
                throw new Error("Fail to get the storage location of" + keyInCache);
            }
            var va = this._vaCache[keyInCache];

            Context3D.GL.bindBuffer(Context3D.GL.ARRAY_BUFFER, va.buffer);
            Context3D.GL.vertexAttribPointer(location, va.size, Context3D.GL.FLOAT, false, va.stride, va.offset);
            Context3D.GL.enableVertexAttribArray(location);
        };

        Context3D.prototype.enableVC = function (keyInCache) {
            var index = Context3D.GL.getUniformLocation(this._linkedProgram.glProgram, keyInCache);
            if (!index)
                throw new Error("Fail to get uniform " + keyInCache);

            var vc = this._vcCache[keyInCache];
            Context3D.GL["uniform" + vc.length + "fv"](index, vc);
        };

        Context3D.prototype.enableVCM = function (keyInCache) {
            var index = Context3D.GL.getUniformLocation(this._linkedProgram.glProgram, keyInCache);
            if (!index)
                throw new Error("Fail to get uniform " + keyInCache);

            Context3D.GL.uniformMatrix4fv(index, false, this._vcMCache[keyInCache]);
        };

        Context3D.prototype.enableTex = function (keyInCache) {
            var tex = this._texCache[keyInCache];
            Context3D.GL.activeTexture(Context3D.GL["TEXTURE" + tex.textureUnit]);
            var l = Context3D.GL.getUniformLocation(this._linkedProgram.glProgram, keyInCache);
            Context3D.GL.uniform1i(l, tex.textureUnit);
        };
        return Context3D;
    })();
    stageJS.Context3D = Context3D;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        var ByteArrayBase = (function () {
            function ByteArrayBase() {
                this.position = 0;
                this.length = 0;
                this._mode = "";
            }
            ByteArrayBase.prototype.writeByte = function (b) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.readByte = function () {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.writeUnsignedByte = function (b) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.readUnsignedByte = function () {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.writeUnsignedShort = function (b) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.readUnsignedShort = function () {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.writeUnsignedInt = function (b) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.readUnsignedInt = function () {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.writeFloat = function (b) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.toFloatBits = function (x) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.readFloat = function (b) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.fromFloatBits = function (x) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.getBytesAvailable = function () {
                throw new Error('not implemented');
            };

            ByteArrayBase.prototype.toString = function () {
                return "[ByteArray] ( " + this._mode + " ) position=" + this.position + " length=" + this.length;
            };

            ByteArrayBase.prototype.compareEqual = function (other, count) {
                if (count == null || count > this.length - this.position)
                    count = this.length - this.position;
                if (count > other.length - other.position)
                    count = other.length - other.position;
                var co0 = count;
                var r = true;
                while (r && count >= 4) {
                    count -= 4;
                    if (this.readUnsignedInt() != other.readUnsignedInt())
                        r = false;
                }
                while (r && count >= 1) {
                    count--;
                    if (this.readUnsignedByte() != other.readUnsignedByte())
                        r = false;
                }
                var c0;
                this.position -= (c0 - count);
                other.position -= (c0 - count);
                return r;
            };

            ByteArrayBase.prototype.writeBase64String = function (s) {
                for (var i = 0; i < s.length; i++) {
                    var v = s.charAt(i);
                }
            };

            ByteArrayBase.prototype.dumpToConsole = function () {
                var oldpos = this.position;
                this.position = 0;
                var nstep = 8;

                function asHexString(x, digits) {
                    var lut = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
                    var sh = "";
                    for (var d = 0; d < digits; d++) {
                        sh = lut[(x >> (d << 2)) & 0xf] + sh;
                    }
                    return sh;
                }

                for (var i = 0; i < this.length; i += nstep) {
                    var s = asHexString(i, 4) + ":";
                    for (var j = 0; j < nstep && i + j < this.length; j++) {
                        s += " " + asHexString(this.readUnsignedByte(), 2);
                    }
                    console.log(s);
                }
                this.position = oldpos;
            };

            ByteArrayBase.prototype.readBase64String = function (count) {
                if (count == null || count > this.length - this.position)
                    count = this.length - this.position;
                if (!(count > 0))
                    return "";

                return ByteArrayBase.internalGetBase64String(count, this.readUnsignedByte, this);
            };

            ByteArrayBase.internalGetBase64String = function (count, getUnsignedByteFunc, self) {
                var r = "";
                var b0, b1, b2, enc1, enc2, enc3, enc4;
                var base64Key = ByteArrayBase.Base64Key;
                while (count >= 3) {
                    b0 = getUnsignedByteFunc.apply(self);
                    b1 = getUnsignedByteFunc.apply(self);
                    b2 = getUnsignedByteFunc.apply(self);
                    enc1 = b0 >> 2;
                    enc2 = ((b0 & 3) << 4) | (b1 >> 4);
                    enc3 = ((b1 & 15) << 2) | (b2 >> 6);
                    enc4 = b2 & 63;
                    r += base64Key.charAt(enc1) + base64Key.charAt(enc2) + base64Key.charAt(enc3) + base64Key.charAt(enc4);
                    count -= 3;
                }

                if (count == 2) {
                    b0 = getUnsignedByteFunc.apply(self);
                    b1 = getUnsignedByteFunc.apply(self);
                    enc1 = b0 >> 2;
                    enc2 = ((b0 & 3) << 4) | (b1 >> 4);
                    enc3 = ((b1 & 15) << 2);
                    r += base64Key.charAt(enc1) + base64Key.charAt(enc2) + base64Key.charAt(enc3) + "=";
                } else if (count == 1) {
                    b0 = getUnsignedByteFunc.apply(self);
                    enc1 = b0 >> 2;
                    enc2 = ((b0 & 3) << 4);
                    r += base64Key.charAt(enc1) + base64Key.charAt(enc2) + "==";
                }
                return r;
            };
            ByteArrayBase.Base64Key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            return ByteArrayBase;
        })();
        utils.ByteArrayBase = ByteArrayBase;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        var ByteArray = (function (_super) {
            __extends(ByteArray, _super);
            function ByteArray() {
                _super.call(this);
                this.maxlength = 0;
                this._mode = "Typed array";
                this.maxlength = 4;
                this.arraybytes = new ArrayBuffer(this.maxlength);
                this.unalignedarraybytestemp = new ArrayBuffer(16);
            }
            ByteArray.prototype.ensureWriteableSpace = function (n) {
                this.ensureSpace(n + this.position);
            };

            ByteArray.prototype.setArrayBuffer = function (aBuffer) {
                this.ensureSpace(aBuffer.byteLength);

                this.length = aBuffer.byteLength;

                var inInt8AView = new Int8Array(aBuffer);
                var localInt8View = new Int8Array(this.arraybytes, 0, this.length);

                localInt8View.set(inInt8AView);

                this.position = 0;
            };

            ByteArray.prototype.getBytesAvailable = function () {
                return (this.length) - (this.position);
            };

            ByteArray.prototype.ensureSpace = function (n) {
                if (n > this.maxlength) {
                    var newmaxlength = (n + 255) & (~255);
                    var newarraybuffer = new ArrayBuffer(newmaxlength);
                    var view = new Uint8Array(this.arraybytes, 0, this.length);
                    var newview = new Uint8Array(newarraybuffer, 0, this.length);
                    newview.set(view);
                    this.arraybytes = newarraybuffer;
                    this.maxlength = newmaxlength;
                }
            };

            ByteArray.prototype.writeByte = function (b) {
                this.ensureWriteableSpace(1);
                var view = new Int8Array(this.arraybytes);
                view[this.position++] = (~~b);
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArray.prototype.readByte = function () {
                if (this.position >= this.length) {
                    throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
                }
                var view = new Int8Array(this.arraybytes);

                return view[this.position++];
            };

            ByteArray.prototype.readBytes = function (bytes, offset, length) {
                if (typeof offset === "undefined") { offset = 0; }
                if (typeof length === "undefined") { length = 0; }
                if (length == null) {
                    length = bytes.length;
                }

                bytes.ensureWriteableSpace(offset + length);

                var byteView = new Int8Array(bytes.arraybytes);
                var localByteView = new Int8Array(this.arraybytes);

                byteView.set(localByteView.subarray(this.position, this.position + length), offset);

                this.position += length;

                if (length + offset > bytes.length) {
                    bytes.length += (length + offset) - bytes.length;
                }
            };

            ByteArray.prototype.writeUnsignedByte = function (b) {
                this.ensureWriteableSpace(1);
                var view = new Uint8Array(this.arraybytes);
                view[this.position++] = (~~b) & 0xff;
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArray.prototype.readUnsignedByte = function () {
                if (this.position >= this.length) {
                    throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
                }
                var view = new Uint8Array(this.arraybytes);
                return view[this.position++];
            };

            ByteArray.prototype.writeUnsignedShort = function (b) {
                this.ensureWriteableSpace(2);
                if ((this.position & 1) == 0) {
                    var view = new Uint16Array(this.arraybytes);
                    view[this.position >> 1] = (~~b) & 0xffff;
                } else {
                    var view = new Uint16Array(this.unalignedarraybytestemp, 0, 1);
                    view[0] = (~~b) & 0xffff;
                    var view2 = new Uint8Array(this.arraybytes, this.position, 2);
                    var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 2);
                    view2.set(view3);
                }
                this.position += 2;
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArray.prototype.readUTFBytes = function (len) {
                var value = "";
                var max = this.position + len;
                var data = new DataView(this.arraybytes);

                while (this.position < max) {
                    var c = data.getUint8(this.position++);

                    if (c < 0x80) {
                        if (c == 0)
                            break;
                        value += String.fromCharCode(c);
                    } else if (c < 0xE0) {
                        value += String.fromCharCode(((c & 0x3F) << 6) | (data.getUint8(this.position++) & 0x7F));
                    } else if (c < 0xF0) {
                        var c2 = data.getUint8(this.position++);
                        value += String.fromCharCode(((c & 0x1F) << 12) | ((c2 & 0x7F) << 6) | (data.getUint8(this.position++) & 0x7F));
                    } else {
                        var c2 = data.getUint8(this.position++);
                        var c3 = data.getUint8(this.position++);

                        value += String.fromCharCode(((c & 0x0F) << 18) | ((c2 & 0x7F) << 12) | ((c3 << 6) & 0x7F) | (data.getUint8(this.position++) & 0x7F));
                    }
                }

                return value;
            };

            ByteArray.prototype.readInt = function () {
                var data = new DataView(this.arraybytes);
                var int = data.getInt32(this.position, true);

                this.position += 4;

                return int;
            };

            ByteArray.prototype.readShort = function () {
                var data = new DataView(this.arraybytes);
                var short = data.getInt16(this.position, true);

                this.position += 2;
                return short;
            };

            ByteArray.prototype.readDouble = function () {
                var data = new DataView(this.arraybytes);
                var double = data.getFloat64(this.position, true);

                this.position += 8;
                return double;
            };

            ByteArray.prototype.readUnsignedShort = function () {
                if (this.position > this.length + 2) {
                    throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
                }
                if ((this.position & 1) == 0) {
                    var view = new Uint16Array(this.arraybytes);
                    var pa = this.position >> 1;
                    this.position += 2;
                    return view[pa];
                } else {
                    var view = new Uint16Array(this.unalignedarraybytestemp, 0, 1);
                    var view2 = new Uint8Array(this.arraybytes, this.position, 2);
                    var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 2);
                    view3.set(view2);
                    this.position += 2;
                    return view[0];
                }
            };

            ByteArray.prototype.writeUnsignedInt = function (b) {
                this.ensureWriteableSpace(4);
                if ((this.position & 3) == 0) {
                    var view = new Uint32Array(this.arraybytes);
                    view[this.position >> 2] = (~~b) & 0xffffffff;
                } else {
                    var view = new Uint32Array(this.unalignedarraybytestemp, 0, 1);
                    view[0] = (~~b) & 0xffffffff;
                    var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                    var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                    view2.set(view3);
                }
                this.position += 4;
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArray.prototype.readUnsignedInt = function () {
                if (this.position > this.length + 4) {
                    throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
                }
                if ((this.position & 3) == 0) {
                    var view = new Uint32Array(this.arraybytes);
                    var pa = this.position >> 2;
                    this.position += 4;
                    return view[pa];
                } else {
                    var view = new Uint32Array(this.unalignedarraybytestemp, 0, 1);
                    var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                    var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                    view3.set(view2);
                    this.position += 4;
                    return view[0];
                }
            };

            ByteArray.prototype.writeFloat = function (b) {
                this.ensureWriteableSpace(4);
                if ((this.position & 3) == 0) {
                    var view = new Float32Array(this.arraybytes);
                    view[this.position >> 2] = b;
                } else {
                    var view = new Float32Array(this.unalignedarraybytestemp, 0, 1);
                    view[0] = b;
                    var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                    var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                    view2.set(view3);
                }
                this.position += 4;
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArray.prototype.readFloat = function () {
                if (this.position > this.length + 4) {
                    throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
                }
                if ((this.position & 3) == 0) {
                    var view = new Float32Array(this.arraybytes);
                    var pa = this.position >> 2;
                    this.position += 4;
                    return view[pa];
                } else {
                    var view = new Float32Array(this.unalignedarraybytestemp, 0, 1);
                    var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                    var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                    view3.set(view2);
                    this.position += 4;
                    return view[0];
                }
            };
            return ByteArray;
        })(utils.ByteArrayBase);
        utils.ByteArray = ByteArray;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        (function (assembler) {
            var Flags = (function () {
                function Flags() {
                }
                return Flags;
            })();
            assembler.Flags = Flags;
        })(utils.assembler || (utils.assembler = {}));
        var assembler = utils.assembler;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        (function (assembler) {
            var FS = (function () {
                function FS() {
                }
                return FS;
            })();
            assembler.FS = FS;
        })(utils.assembler || (utils.assembler = {}));
        var assembler = utils.assembler;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        (function (assembler) {
            var Opcode = (function () {
                function Opcode(dest, aformat, asize, bformat, bsize, opcode, simple, horizontal, fragonly, matrix) {
                    this.a = new assembler.FS();
                    this.b = new assembler.FS();
                    this.flags = new assembler.Flags();

                    this.dest = dest;
                    this.a.format = aformat;
                    this.a.size = asize;
                    this.b.format = bformat;
                    this.b.size = bsize;
                    this.opcode = opcode;
                    this.flags.simple = simple;
                    this.flags.horizontal = horizontal;
                    this.flags.fragonly = fragonly;
                    this.flags.matrix = matrix;
                }
                return Opcode;
            })();
            assembler.Opcode = Opcode;
        })(utils.assembler || (utils.assembler = {}));
        var assembler = utils.assembler;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        (function (assembler) {
            var OpcodeMap = (function () {
                function OpcodeMap() {
                }
                Object.defineProperty(OpcodeMap, "map", {
                    get: function () {
                        if (!OpcodeMap._map) {
                            OpcodeMap._map = new Array();
                            OpcodeMap._map['mov'] = new assembler.Opcode("vector", "vector", 4, "none", 0, 0x00, true, null, null, null);
                            OpcodeMap._map['add'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x01, true, null, null, null);
                            OpcodeMap._map['sub'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x02, true, null, null, null);
                            OpcodeMap._map['mul'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x03, true, null, null, null);
                            OpcodeMap._map['div'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x04, true, null, null, null);
                            OpcodeMap._map['rcp'] = new assembler.Opcode("vector", "vector", 4, "none", 0, 0x05, true, null, null, null);
                            OpcodeMap._map['min'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x06, true, null, null, null);
                            OpcodeMap._map['max'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x07, true, null, null, null);
                            OpcodeMap._map['frc'] = new assembler.Opcode("vector", "vector", 4, "none", 0, 0x08, true, null, null, null);
                            OpcodeMap._map['sqt'] = new assembler.Opcode("vector", "vector", 4, "none", 0, 0x09, true, null, null, null);
                            OpcodeMap._map['rsq'] = new assembler.Opcode("vector", "vector", 4, "none", 0, 0x0a, true, null, null, null);
                            OpcodeMap._map['pow'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x0b, true, null, null, null);
                            OpcodeMap._map['log'] = new assembler.Opcode("vector", "vector", 4, "none", 0, 0x0c, true, null, null, null);
                            OpcodeMap._map['exp'] = new assembler.Opcode("vector", "vector", 4, "none", 0, 0x0d, true, null, null, null);
                            OpcodeMap._map['nrm'] = new assembler.Opcode("vector", "vector", 4, "none", 0, 0x0e, true, null, null, null);
                            OpcodeMap._map['sin'] = new assembler.Opcode("vector", "vector", 4, "none", 0, 0x0f, true, null, null, null);
                            OpcodeMap._map['cos'] = new assembler.Opcode("vector", "vector", 4, "none", 0, 0x10, true, null, null, null);
                            OpcodeMap._map['crs'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x11, true, true, null, null);
                            OpcodeMap._map['dp3'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x12, true, true, null, null);
                            OpcodeMap._map['dp4'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x13, true, true, null, null);
                            OpcodeMap._map['abs'] = new assembler.Opcode("vector", "vector", 4, "none", 0, 0x14, true, null, null, null);
                            OpcodeMap._map['neg'] = new assembler.Opcode("vector", "vector", 4, "none", 0, 0x15, true, null, null, null);
                            OpcodeMap._map['sat'] = new assembler.Opcode("vector", "vector", 4, "none", 0, 0x16, true, null, null, null);

                            OpcodeMap._map['ted'] = new assembler.Opcode("vector", "vector", 4, "sampler", 1, 0x26, true, null, true, null);
                            OpcodeMap._map['kil'] = new assembler.Opcode("none", "scalar", 1, "none", 0, 0x27, true, null, true, null);
                            OpcodeMap._map['tex'] = new assembler.Opcode("vector", "vector", 4, "sampler", 1, 0x28, true, null, true, null);

                            OpcodeMap._map['m33'] = new assembler.Opcode("vector", "matrix", 3, "vector", 3, 0x17, true, null, null, true);
                            OpcodeMap._map['m44'] = new assembler.Opcode("vector", "matrix", 4, "vector", 4, 0x18, true, null, null, true);
                            OpcodeMap._map['m43'] = new assembler.Opcode("vector", "matrix", 3, "vector", 4, 0x19, true, null, null, true);

                            OpcodeMap._map['sge'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x29, true, null, null, null);
                            OpcodeMap._map['slt'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x2a, true, null, null, null);
                            OpcodeMap._map['sgn'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x2b, true, null, null, null);
                            OpcodeMap._map['seq'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x2c, true, null, null, null);
                            OpcodeMap._map['sne'] = new assembler.Opcode("vector", "vector", 4, "vector", 4, 0x2d, true, null, null, null);
                        }

                        return OpcodeMap._map;
                    },
                    enumerable: true,
                    configurable: true
                });
                return OpcodeMap;
            })();
            assembler.OpcodeMap = OpcodeMap;
        })(utils.assembler || (utils.assembler = {}));
        var assembler = utils.assembler;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        (function (assembler) {
            var Part = (function () {
                function Part(name, version) {
                    if (typeof name === "undefined") { name = null; }
                    if (typeof version === "undefined") { version = null; }
                    this.name = "";
                    this.version = 0;
                    this.name = name;
                    this.version = version;
                    this.data = new utils.ByteArray();
                }
                return Part;
            })();
            assembler.Part = Part;
        })(utils.assembler || (utils.assembler = {}));
        var assembler = utils.assembler;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        (function (assembler) {
            var Reg = (function () {
                function Reg(code, desc) {
                    this.code = code;
                    this.desc = desc;
                }
                return Reg;
            })();

            var RegMap = (function () {
                function RegMap() {
                }
                Object.defineProperty(RegMap, "map", {
                    get: function () {
                        if (!RegMap._map) {
                            RegMap._map = new Array();
                            RegMap._map['va'] = new Reg(0x00, "vertex attribute");
                            RegMap._map['fc'] = new Reg(0x01, "fragment constant");
                            RegMap._map['vc'] = new Reg(0x01, "vertex constant");
                            RegMap._map['ft'] = new Reg(0x02, "fragment temporary");
                            RegMap._map['vt'] = new Reg(0x02, "vertex temporary");
                            RegMap._map['vo'] = new Reg(0x03, "vertex output");
                            RegMap._map['op'] = new Reg(0x03, "vertex output");
                            RegMap._map['fd'] = new Reg(0x03, "fragment depth output");
                            RegMap._map['fo'] = new Reg(0x03, "fragment output");
                            RegMap._map['oc'] = new Reg(0x03, "fragment output");
                            RegMap._map['v'] = new Reg(0x04, "varying");
                            RegMap._map['vi'] = new Reg(0x04, "varying output");
                            RegMap._map['fi'] = new Reg(0x04, "varying input");
                            RegMap._map['fs'] = new Reg(0x05, "sampler");
                        }

                        return RegMap._map;
                    },
                    enumerable: true,
                    configurable: true
                });
                return RegMap;
            })();
            assembler.RegMap = RegMap;
        })(utils.assembler || (utils.assembler = {}));
        var assembler = utils.assembler;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        (function (assembler) {
            var Sampler = (function () {
                function Sampler(shift, mask, value) {
                    this.shift = shift;
                    this.mask = mask;
                    this.value = value;
                }
                return Sampler;
            })();
            assembler.Sampler = Sampler;
        })(utils.assembler || (utils.assembler = {}));
        var assembler = utils.assembler;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        (function (assembler) {
            var SamplerMap = (function () {
                function SamplerMap() {
                }
                Object.defineProperty(SamplerMap, "map", {
                    get: function () {
                        if (!SamplerMap._map) {
                            SamplerMap._map = new Array();
                            SamplerMap._map['rgba'] = new assembler.Sampler(8, 0xf, 0);
                            SamplerMap._map['rg'] = new assembler.Sampler(8, 0xf, 5);
                            SamplerMap._map['r'] = new assembler.Sampler(8, 0xf, 4);
                            SamplerMap._map['compressed'] = new assembler.Sampler(8, 0xf, 1);
                            SamplerMap._map['compressed_alpha'] = new assembler.Sampler(8, 0xf, 2);
                            SamplerMap._map['dxt1'] = new assembler.Sampler(8, 0xf, 1);
                            SamplerMap._map['dxt5'] = new assembler.Sampler(8, 0xf, 2);

                            SamplerMap._map['2d'] = new assembler.Sampler(12, 0xf, 0);
                            SamplerMap._map['cube'] = new assembler.Sampler(12, 0xf, 1);
                            SamplerMap._map['3d'] = new assembler.Sampler(12, 0xf, 2);

                            SamplerMap._map['centroid'] = new assembler.Sampler(16, 1, 1);
                            SamplerMap._map['ignoresampler'] = new assembler.Sampler(16, 4, 4);

                            SamplerMap._map['clamp'] = new assembler.Sampler(20, 0xf, 0);
                            SamplerMap._map['repeat'] = new assembler.Sampler(20, 0xf, 1);
                            SamplerMap._map['wrap'] = new assembler.Sampler(20, 0xf, 1);

                            SamplerMap._map['nomip'] = new assembler.Sampler(24, 0xf, 0);
                            SamplerMap._map['mipnone'] = new assembler.Sampler(24, 0xf, 0);
                            SamplerMap._map['mipnearest'] = new assembler.Sampler(24, 0xf, 1);
                            SamplerMap._map['miplinear'] = new assembler.Sampler(24, 0xf, 2);

                            SamplerMap._map['nearest'] = new assembler.Sampler(28, 0xf, 0);
                            SamplerMap._map['linear'] = new assembler.Sampler(28, 0xf, 1);
                        }

                        return SamplerMap._map;
                    },
                    enumerable: true,
                    configurable: true
                });
                return SamplerMap;
            })();
            assembler.SamplerMap = SamplerMap;
        })(utils.assembler || (utils.assembler = {}));
        var assembler = utils.assembler;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        (function (assembler) {
            var AGALMiniAssembler = (function () {
                function AGALMiniAssembler() {
                    this.r = {};
                    this.cur = new assembler.Part();
                }
                AGALMiniAssembler.prototype.assemble = function (source, ext_part, ext_version) {
                    if (typeof ext_part === "undefined") { ext_part = null; }
                    if (typeof ext_version === "undefined") { ext_version = null; }
                    if (!ext_version) {
                        ext_version = 1;
                    }

                    if (ext_part) {
                        this.addHeader(ext_part, ext_version);
                    }

                    var lines = source.replace(/[\f\n\r\v]+/g, "\n").split("\n");

                    for (var i in lines) {
                        this.processLine(lines[i], i);
                    }

                    return this.r;
                };

                AGALMiniAssembler.prototype.processLine = function (line, linenr) {
                    var startcomment = line.search("//");
                    if (startcomment != -1) {
                        line = line.slice(0, startcomment);
                    }
                    line = line.replace(/^\s+|\s+$/g, "");
                    if (!(line.length > 0)) {
                        return;
                    }
                    var optsi = line.search(/<.*>/g);
                    var opts = null;
                    if (optsi != -1) {
                        opts = line.slice(optsi).match(/([\w\.\-\+]+)/gi);
                        line = line.slice(0, optsi);
                    }

                    var tokens = line.match(/([\w\.\+\[\]]+)/gi);
                    if (!tokens || tokens.length < 1) {
                        if (line.length >= 3) {
                            console.log("Warning: bad line " + linenr + ": " + line);
                        }
                        return;
                    }

                    switch (tokens[0]) {
                        case "part":
                            this.addHeader(tokens[1], Number(tokens[2]));
                            break;
                        case "endpart":
                            if (!this.cur) {
                                throw "Unexpected endpart";
                            }
                            this.cur.data.position = 0;
                            this.cur = null;
                            return;
                        default:
                            if (!this.cur) {
                                console.log("Warning: bad line " + linenr + ": " + line + " (Outside of any part definition)");
                                return;
                            }
                            if (this.cur.name == "comment") {
                                return;
                            }
                            var op = assembler.OpcodeMap.map[tokens[0]];
                            if (!op) {
                                throw "Bad opcode " + tokens[0] + " " + linenr + ": " + line;
                            }

                            this.emitOpcode(this.cur, op.opcode);
                            var ti = 1;
                            if (op.dest && op.dest != "none") {
                                if (!this.emitDest(this.cur, tokens[ti++], op.dest)) {
                                    throw "Bad destination register " + tokens[ti - 1] + " " + linenr + ": " + line;
                                }
                            } else {
                                this.emitZeroDword(this.cur);
                            }

                            if (op.a && op.a.format != "none") {
                                if (!this.emitSource(this.cur, tokens[ti++], op.a))
                                    throw "Bad source register " + tokens[ti - 1] + " " + linenr + ": " + line;
                            } else {
                                this.emitZeroQword(this.cur);
                            }

                            if (op.b && op.b.format != "none") {
                                if (op.b.format == "sampler") {
                                    if (!this.emitSampler(this.cur, tokens[ti++], op.b, opts)) {
                                        throw "Bad sampler register " + tokens[ti - 1] + " " + linenr + ": " + line;
                                    }
                                } else {
                                    if (!this.emitSource(this.cur, tokens[ti++], op.b)) {
                                        throw "Bad source register " + tokens[ti - 1] + " " + linenr + ": " + line;
                                    }
                                }
                            } else {
                                this.emitZeroQword(this.cur);
                            }
                            break;
                    }
                };

                AGALMiniAssembler.prototype.emitHeader = function (pr) {
                    pr.data.writeUnsignedByte(0xa0);
                    pr.data.writeUnsignedInt(pr.version);
                    if (pr.version >= 0x10) {
                        pr.data.writeUnsignedByte(0);
                    }
                    pr.data.writeUnsignedByte(0xa1);
                    switch (pr.name) {
                        case "fragment":
                            pr.data.writeUnsignedByte(1);
                            break;
                        case "vertex":
                            pr.data.writeUnsignedByte(0);
                            break;
                        case "cpu":
                            pr.data.writeUnsignedByte(2);
                            break;
                        default:
                            pr.data.writeUnsignedByte(0xff);
                            break;
                    }
                };

                AGALMiniAssembler.prototype.emitOpcode = function (pr, opcode) {
                    pr.data.writeUnsignedInt(opcode);
                };

                AGALMiniAssembler.prototype.emitZeroDword = function (pr) {
                    pr.data.writeUnsignedInt(0);
                };

                AGALMiniAssembler.prototype.emitZeroQword = function (pr) {
                    pr.data.writeUnsignedInt(0);
                    pr.data.writeUnsignedInt(0);
                };

                AGALMiniAssembler.prototype.emitDest = function (pr, token, opdest) {
                    var reg = token.match(/([fov]?[tpocidavs])(\d*)(\.[xyzw]{1,4})?/i);

                    console.log('AGALMiniAssembler', 'emitDest', 'reg', reg, reg[1], assembler.RegMap.map[reg[1]]);

                    if (!assembler.RegMap.map[reg[1]])
                        return false;
                    var em = { num: reg[2] ? reg[2] : 0, code: assembler.RegMap.map[reg[1]].code, mask: this.stringToMask(reg[3]) };
                    pr.data.writeUnsignedShort(em.num);
                    pr.data.writeUnsignedByte(em.mask);
                    pr.data.writeUnsignedByte(em.code);

                    return true;
                };

                AGALMiniAssembler.prototype.stringToMask = function (s) {
                    if (!s)
                        return 0xf;
                    var r = 0;
                    if (s.indexOf("x") != -1)
                        r |= 1;
                    if (s.indexOf("y") != -1)
                        r |= 2;
                    if (s.indexOf("z") != -1)
                        r |= 4;
                    if (s.indexOf("w") != -1)
                        r |= 8;
                    return r;
                };

                AGALMiniAssembler.prototype.stringToSwizzle = function (s) {
                    if (!s) {
                        return 0xe4;
                    }
                    var chartoindex = { x: 0, y: 1, z: 2, w: 3 };
                    var sw = 0;

                    if (s.charAt(0) != ".") {
                        throw "Missing . for swizzle";
                    }

                    if (s.length > 1) {
                        sw |= chartoindex[s.charAt(1)];
                    }

                    if (s.length > 2) {
                        sw |= chartoindex[s.charAt(2)] << 2;
                    } else {
                        sw |= (sw & 3) << 2;
                    }

                    if (s.length > 3) {
                        sw |= chartoindex[s.charAt(3)] << 4;
                    } else {
                        sw |= (sw & (3 << 2)) << 2;
                    }

                    if (s.length > 4) {
                        sw |= chartoindex[s.charAt(4)] << 6;
                    } else {
                        sw |= (sw & (3 << 4)) << 2;
                    }

                    return sw;
                };

                AGALMiniAssembler.prototype.emitSampler = function (pr, token, opsrc, opts) {
                    var reg = token.match(/fs(\d*)/i);
                    if (!reg || !reg[1]) {
                        return false;
                    }
                    pr.data.writeUnsignedShort(parseInt(reg[1]));
                    pr.data.writeUnsignedByte(0);
                    pr.data.writeUnsignedByte(0);

                    var samplerbits = 0x5;
                    var sampleroptset = 0;
                    for (var i = 0; i < opts.length; i++) {
                        var o = assembler.SamplerMap.map[opts[i].toLowerCase()];

                        if (o) {
                            if (((sampleroptset >> o.shift) & o.mask) != 0) {
                                console.log("Warning, duplicate sampler option");
                            }
                            sampleroptset |= o.mask << o.shift;
                            samplerbits &= ~(o.mask << o.shift);
                            samplerbits |= o.value << o.shift;
                        } else {
                            console.log("Warning, unknown sampler option: ", opts[i]);
                        }
                    }
                    pr.data.writeUnsignedInt(samplerbits);
                    return true;
                };

                AGALMiniAssembler.prototype.emitSource = function (pr, token, opsrc) {
                    var indexed = token.match(/vc\[(v[tcai])(\d+)\.([xyzw])([\+\-]\d+)?\](\.[xyzw]{1,4})?/i);
                    var reg;
                    if (indexed) {
                        if (!assembler.RegMap.map[indexed[1]]) {
                            return false;
                        }
                        var selindex = { x: 0, y: 1, z: 2, w: 3 };
                        var em = {
                            num: indexed[2] | 0,
                            code: assembler.RegMap.map[indexed[1]].code,
                            swizzle: this.stringToSwizzle(indexed[5]),
                            select: selindex[indexed[3]],
                            offset: indexed[4] | 0
                        };
                        pr.data.writeUnsignedShort(em.num);
                        pr.data.writeByte(em.offset);
                        pr.data.writeUnsignedByte(em.swizzle);
                        pr.data.writeUnsignedByte(0x1);
                        pr.data.writeUnsignedByte(em.code);
                        pr.data.writeUnsignedByte(em.select);
                        pr.data.writeUnsignedByte(1 << 7);
                    } else {
                        reg = token.match(/([fov]?[tpocidavs])(\d*)(\.[xyzw]{1,4})?/i);
                        if (!assembler.RegMap.map[reg[1]]) {
                            return false;
                        }
                        var em = { num: reg[2] | 0, code: assembler.RegMap.map[reg[1]].code, swizzle: this.stringToSwizzle(reg[3]) };
                        pr.data.writeUnsignedShort(em.num);
                        pr.data.writeUnsignedByte(0);
                        pr.data.writeUnsignedByte(em.swizzle);
                        pr.data.writeUnsignedByte(em.code);
                        pr.data.writeUnsignedByte(0);
                        pr.data.writeUnsignedByte(0);
                        pr.data.writeUnsignedByte(0);
                    }
                    return true;
                };

                AGALMiniAssembler.prototype.addHeader = function (partname, version) {
                    if (!version) {
                        version = 1;
                    }
                    if (this.r[partname] == null) {
                        this.r[partname] = new assembler.Part(partname, version);
                        this.emitHeader(this.r[partname]);
                    } else if (this.r[partname].version != version) {
                        throw "Multiple versions for part " + partname;
                    }
                    this.cur = this.r[partname];
                };
                return AGALMiniAssembler;
            })();
            assembler.AGALMiniAssembler = AGALMiniAssembler;
        })(utils.assembler || (utils.assembler = {}));
        var assembler = utils.assembler;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        var Header = (function () {
            function Header() {
                this.progid = 0;
                this.version = 0;
                this.type = "";
            }
            return Header;
        })();
        utils.Header = Header;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        var Destination = (function () {
            function Destination() {
                this.mask = 0;
                this.regnum = 0;
                this.regtype = 0;
                this.dim = 0;
            }
            return Destination;
        })();
        utils.Destination = Destination;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        var Token = (function () {
            function Token() {
                this.dest = new utils.Destination();
                this.opcode = 0;
                this.a = new utils.Destination();
                this.b = new utils.Destination();
            }
            return Token;
        })();
        utils.Token = Token;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        var Description = (function () {
            function Description() {
                this.regread = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ];
                this.regwrite = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ];
                this.hasindirect = false;
                this.writedepth = false;
                this.hasmatrix = false;
                this.samplers = [];
                this.tokens = [];
                this.header = new utils.Header();
            }
            return Description;
        })();
        utils.Description = Description;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        var OpLUT = (function () {
            function OpLUT(s, flags, dest, a, b, matrixwidth, matrixheight, ndwm, scaler, dm, lod) {
                this.s = s;
                this.flags = flags;
                this.dest = dest;
                this.a = a;
                this.b = b;
                this.matrixwidth = matrixwidth;
                this.matrixheight = matrixheight;
                this.ndwm = ndwm;
                this.scalar = scaler;
                this.dm = dm;
                this.lod = lod;
            }
            return OpLUT;
        })();
        utils.OpLUT = OpLUT;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        var Mapping = (function () {
            function Mapping(include) {
            }
            Mapping.agal2glsllut = [
                new utils.OpLUT("%dest = %cast(%a);\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(%a + %b);\n", 0, true, true, true, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(%a - %b);\n", 0, true, true, true, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(%a * %b);\n", 0, true, true, true, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(%a / %b);\n", 0, true, true, true, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(1.0) / %a;\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(min(%a,%b));\n", 0, true, true, true, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(max(%a,%b));\n", 0, true, true, true, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(fract(%a));\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(sqrt(abs(%a)));\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(inversesqrt(abs(%a)));\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(pow(abs(%a),%b));\n", 0, true, true, true, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(log2(abs(%a)));\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(exp2(%a));\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(normalize(vec3( %a ) ));\n", 0, true, true, false, null, null, true, null, null, null),
                new utils.OpLUT("%dest = %cast(sin(%a));\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(cos(%a));\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(cross(vec3(%a),vec3(%b)));\n", 0, true, true, true, null, null, true, null, null, null),
                new utils.OpLUT("%dest = %cast(dot(vec3(%a),vec3(%b)));\n", 0, true, true, true, null, null, true, null, null, null),
                new utils.OpLUT("%dest = %cast(dot(vec4(%a),vec4(%b)));\n", 0, true, true, true, null, null, true, null, null, null),
                new utils.OpLUT("%dest = %cast(abs(%a));\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(%a * -1.0);\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(clamp(%a,0.0,1.0));\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(dot(vec3(%a),vec3(%b)));\n", null, true, true, true, 3, 3, true, null, null, null),
                new utils.OpLUT("%dest = %cast(dot(vec4(%a),vec4(%b)));\n", null, true, true, true, 4, 4, true, null, null, null),
                new utils.OpLUT("%dest = %cast(dot(vec4(%a),vec4(%b)));\n", null, true, true, true, 4, 3, true, null, null, null),
                new utils.OpLUT("%dest = %cast(dFdx(%a));\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(dFdx(%a));\n", 0, true, true, false, null, null, null, null, null, null),
                new utils.OpLUT("if (float(%a)==float(%b)) {;\n", 0, false, true, true, null, null, null, true, null, null), new utils.OpLUT("if (float(%a)!=float(%b)) {;\n", 0, false, true, true, null, null, null, true, null, null), new utils.OpLUT("if (float(%a)>=float(%b)) {;\n", 0, false, true, true, null, null, null, true, null, null), new utils.OpLUT("if (float(%a)<float(%b)) {;\n", 0, false, true, true, null, null, null, true, null, null), new utils.OpLUT("} else {;\n", 0, false, false, false, null, null, null, null, null, null), new utils.OpLUT("};\n", 0, false, false, false, null, null, null, null, null, null), new utils.OpLUT(null, null, null, null, false, null, null, null, null, null, null), new utils.OpLUT(null, null, null, null, false, null, null, null, null, null, null), new utils.OpLUT(null, null, null, null, false, null, null, null, null, null, null), new utils.OpLUT(null, null, null, null, false, null, null, null, null, null, null),
                new utils.OpLUT("%dest = %cast(texture%texdimLod(%b,%texsize(%a)).%dm);\n", null, true, true, true, null, null, null, null, true, null), new utils.OpLUT("if ( float(%a)<0.0 ) discard;\n", null, false, true, false, null, null, null, true, null, null), new utils.OpLUT("%dest = %cast(texture%texdim(%b,%texsize(%a)%lod).%dm);\n", null, true, true, true, null, null, true, null, true, true), new utils.OpLUT("%dest = %cast(greaterThanEqual(%a,%b).%dm);\n", 0, true, true, true, null, null, true, null, true, null), new utils.OpLUT("%dest = %cast(lessThan(%a,%b).%dm);\n", 0, true, true, true, null, null, true, null, true, null), new utils.OpLUT("%dest = %cast(sign(%a));\n", 0, true, true, false, null, null, null, null, null, null), new utils.OpLUT("%dest = %cast(equal(%a,%b).%dm);\n", 0, true, true, true, null, null, true, null, true, null), new utils.OpLUT("%dest = %cast(notEqual(%a,%b).%dm);\n", 0, true, true, true, null, null, true, null, true, null)
            ];
            return Mapping;
        })();
        utils.Mapping = Mapping;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        var Sampler = (function () {
            function Sampler() {
                this.lodbias = 0;
                this.dim = 0;
                this.readmode = 0;
                this.special = 0;
                this.wrap = 0;
                this.mipmap = 0;
                this.filter = 0;
            }
            return Sampler;
        })();
        utils.Sampler = Sampler;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        var AGLSLParser = (function () {
            function AGLSLParser() {
            }
            AGLSLParser.prototype.parse = function (desc) {
                var header = "";
                var body = "";

                header += "precision highp float;\n";
                var tag = desc.header.type[0];

                if (desc.header.type == "vertex") {
                    header += "uniform float yflip;\n";
                }
                if (!desc.hasindirect) {
                    for (var i = 0; i < desc.regread[0x1].length; i++) {
                        if (desc.regread[0x1][i]) {
                            header += "uniform vec4 " + tag + "c" + i + ";\n";
                        }
                    }
                } else {
                    header += "uniform vec4 " + tag + "carrr[" + 128 + "];\n";
                }

                for (var i = 0; i < desc.regread[0x2].length || i < desc.regwrite[0x2].length; i++) {
                    if (desc.regread[0x2][i] || desc.regwrite[0x2][i]) {
                        header += "vec4 " + tag + "t" + i + ";\n";
                    }
                }

                for (var i = 0; i < desc.regread[0x0].length; i++) {
                    if (desc.regread[0x0][i]) {
                        header += "attribute vec4 va" + i + ";\n";
                    }
                }

                for (var i = 0; i < desc.regread[0x4].length || i < desc.regwrite[0x4].length; i++) {
                    if (desc.regread[0x4][i] || desc.regwrite[0x4][i]) {
                        header += "varying vec4 vi" + i + ";\n";
                    }
                }

                var samptype = ["2D", "Cube", "3D", ""];
                for (var i = 0; i < desc.samplers.length; i++) {
                    if (desc.samplers[i]) {
                        header += "uniform sampler" + samptype[desc.samplers[i].dim & 3] + " fs" + i + ";\n";
                    }
                }

                if (desc.header.type == "vertex") {
                    header += "vec4 outpos;\n";
                }
                if (desc.writedepth) {
                    header += "vec4 tmp_FragDepth;\n";
                }

                body += "void main() {\n";

                for (var i = 0; i < desc.tokens.length; i++) {
                    var lutentry = utils.Mapping.agal2glsllut[desc.tokens[i].opcode];
                    if (!lutentry) {
                        throw "Opcode not valid or not implemented yet: ";
                    }
                    var sublines = lutentry.matrixheight || 1;

                    for (var sl = 0; sl < sublines; sl++) {
                        var line = "  " + lutentry.s;
                        if (desc.tokens[i].dest) {
                            if (lutentry.matrixheight) {
                                if (((desc.tokens[i].dest.mask >> sl) & 1) != 1) {
                                    continue;
                                }
                                var destregstring = this.regtostring(desc.tokens[i].dest.regtype, desc.tokens[i].dest.regnum, desc, tag);
                                var destcaststring = "float";
                                var destmaskstring = ["x", "y", "z", "w"][sl];
                                destregstring += "." + destmaskstring;
                            } else {
                                var destregstring = this.regtostring(desc.tokens[i].dest.regtype, desc.tokens[i].dest.regnum, desc, tag);
                                var destcaststring;
                                var destmaskstring;
                                if (desc.tokens[i].dest.mask != 0xf) {
                                    var ndest = 0;
                                    destmaskstring = "";
                                    if (desc.tokens[i].dest.mask & 1) {
                                        ndest++;
                                        destmaskstring += "x";
                                    }
                                    if (desc.tokens[i].dest.mask & 2) {
                                        ndest++;
                                        destmaskstring += "y";
                                    }
                                    if (desc.tokens[i].dest.mask & 4) {
                                        ndest++;
                                        destmaskstring += "z";
                                    }
                                    if (desc.tokens[i].dest.mask & 8) {
                                        ndest++;
                                        destmaskstring += "w";
                                    }
                                    destregstring += "." + destmaskstring;
                                    switch (ndest) {
                                        case 1:
                                            destcaststring = "float";
                                            break;
                                        case 2:
                                            destcaststring = "vec2";
                                            break;
                                        case 3:
                                            destcaststring = "vec3";
                                            break;
                                        default:
                                            throw "Unexpected destination mask";
                                    }
                                } else {
                                    destcaststring = "vec4";
                                    destmaskstring = "xyzw";
                                }
                            }
                            line = line.replace("%dest", destregstring);
                            line = line.replace("%cast", destcaststring);
                            line = line.replace("%dm", destmaskstring);
                        }
                        var dwm = 0xf;
                        if (!lutentry.ndwm && lutentry.dest && desc.tokens[i].dest) {
                            dwm = desc.tokens[i].dest.mask;
                        }
                        if (desc.tokens[i].a) {
                            line = line.replace("%a", this.sourcetostring(desc.tokens[i].a, 0, dwm, lutentry.scalar, desc, tag));
                        }
                        if (desc.tokens[i].b) {
                            line = line.replace("%b", this.sourcetostring(desc.tokens[i].b, sl, dwm, lutentry.scalar, desc, tag));
                            if (desc.tokens[i].b.regtype == 0x5) {
                                var texdim = ["2D", "Cube", "3D"][desc.tokens[i].b.dim];
                                var texsize = ["vec2", "vec3", "vec3"][desc.tokens[i].b.dim];
                                line = line.replace("%texdim", texdim);
                                line = line.replace("%texsize", texsize);
                                var texlod = "";
                                line = line.replace("%lod", texlod);
                            }
                        }
                        body += line;
                    }
                }

                if (desc.header.type == "vertex") {
                    body += "  gl_Position = vec4(outpos.x, outpos.y, outpos.z*2.0 - outpos.w, outpos.w);\n";
                }

                if (desc.writedepth) {
                    body += "  gl_FragDepth = clamp(tmp_FragDepth,0.0,1.0);\n";
                }

                body += "}\n";

                return header + body;
            };

            AGLSLParser.prototype.regtostring = function (regtype, regnum, desc, tag) {
                switch (regtype) {
                    case 0x0:
                        return "va" + regnum;
                    case 0x1:
                        if (desc.hasindirect && desc.header.type == "vertex") {
                            return "vcarrr[" + regnum + "]";
                        } else {
                            return tag + "c" + regnum;
                        }
                    case 0x2:
                        return tag + "t" + regnum;
                    case 0x3:
                        return desc.header.type == "vertex" ? "outpos" : "gl_FragColor";
                    case 0x4:
                        return "vi" + regnum;
                    case 0x5:
                        return "fs" + regnum;
                    case 0x6:
                        return "tmp_FragDepth";
                    default:
                        throw "Unknown register type";
                }
            };

            AGLSLParser.prototype.sourcetostring = function (s, subline, dwm, isscalar, desc, tag) {
                var swiz = ["x", "y", "z", "w"];
                var r;

                if (s.indirectflag) {
                    r = "vcarrr[int(" + this.regtostring(s.indexregtype, s.regnum, desc, tag) + "." + swiz[s.indexselect] + ")";
                    var realofs = subline + s.indexoffset;
                    if (realofs < 0)
                        r += realofs.toString();
                    if (realofs > 0)
                        r += "+" + realofs.toString();
                    r += "]";
                } else {
                    r = this.regtostring(s.regtype, s.regnum + subline, desc, tag);
                }

                if (s.regtype == 0x5) {
                    return r;
                }

                if (isscalar) {
                    return r + "." + swiz[(s.swizzle >> 0) & 3];
                }

                if (s.swizzle == 0xe4 && dwm == 0xf) {
                    return r;
                }

                r += ".";
                if (dwm & 1)
                    r += swiz[(s.swizzle >> 0) & 3];
                if (dwm & 2)
                    r += swiz[(s.swizzle >> 2) & 3];
                if (dwm & 4)
                    r += swiz[(s.swizzle >> 4) & 3];
                if (dwm & 8)
                    r += swiz[(s.swizzle >> 6) & 3];
                return r;
            };
            return AGLSLParser;
        })();
        utils.AGLSLParser = AGLSLParser;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
var stageJS;
(function (stageJS) {
    (function (utils) {
        var AGALTokenizer = (function () {
            function AGALTokenizer() {
            }
            AGALTokenizer.prototype.decribeAGALByteArray = function (bytes) {
                var header = new utils.Header();

                if (bytes.readUnsignedByte() != 0xa0) {
                    throw "Bad AGAL: Missing 0xa0 magic byte.";
                }

                header.version = bytes.readUnsignedInt();
                if (header.version >= 0x10) {
                    bytes.readUnsignedByte();
                    header.version >>= 1;
                }
                if (bytes.readUnsignedByte() != 0xa1) {
                    throw "Bad AGAL: Missing 0xa1 magic byte.";
                }

                header.progid = bytes.readUnsignedByte();
                switch (header.progid) {
                    case 1:
                        header.type = "fragment";
                        break;
                    case 0:
                        header.type = "vertex";
                        break;
                    case 2:
                        header.type = "cpu";
                        break;
                    default:
                        header.type = "";
                        break;
                }

                var desc = new utils.Description();
                var tokens = [];
                while (bytes.position < bytes.length) {
                    var token = new utils.Token();

                    token.opcode = bytes.readUnsignedInt();
                    var lutentry = utils.Mapping.agal2glsllut[token.opcode];
                    if (!lutentry) {
                        throw "Opcode not valid or not implemented yet: " + token.opcode;
                    }
                    if (lutentry.matrixheight) {
                        desc.hasmatrix = true;
                    }
                    if (lutentry.dest) {
                        token.dest.regnum = bytes.readUnsignedShort();
                        token.dest.mask = bytes.readUnsignedByte();
                        token.dest.regtype = bytes.readUnsignedByte();
                        desc.regwrite[token.dest.regtype][token.dest.regnum] |= token.dest.mask;
                    } else {
                        token.dest = null;
                        bytes.readUnsignedInt();
                    }
                    if (lutentry.a) {
                        this.readReg(token.a, 1, desc, bytes);
                    } else {
                        token.a = null;
                        bytes.readUnsignedInt();
                        bytes.readUnsignedInt();
                    }
                    if (lutentry.b) {
                        this.readReg(token.b, lutentry.matrixheight | 0, desc, bytes);
                    } else {
                        token.b = null;
                        bytes.readUnsignedInt();
                        bytes.readUnsignedInt();
                    }
                    tokens.push(token);
                }
                desc.header = header;
                desc.tokens = tokens;

                return desc;
            };

            AGALTokenizer.prototype.readReg = function (s, mh, desc, bytes) {
                s.regnum = bytes.readUnsignedShort();
                s.indexoffset = bytes.readByte();
                s.swizzle = bytes.readUnsignedByte();
                s.regtype = bytes.readUnsignedByte();
                desc.regread[s.regtype][s.regnum] = 0xf;
                if (s.regtype == 0x5) {
                    s.lodbiad = s.indexoffset;
                    s.indexoffset = null;
                    s.swizzle = null;

                    s.readmode = bytes.readUnsignedByte();
                    s.dim = s.readmode >> 4;
                    s.readmode &= 0xf;
                    s.special = bytes.readUnsignedByte();
                    s.wrap = s.special >> 4;
                    s.special &= 0xf;
                    s.mipmap = bytes.readUnsignedByte();
                    s.filter = s.mipmap >> 4;
                    s.mipmap &= 0xf;
                    desc.samplers[s.regnum] = s;
                } else {
                    s.indexregtype = bytes.readUnsignedByte();
                    s.indexselect = bytes.readUnsignedByte();
                    s.indirectflag = bytes.readUnsignedByte();
                }
                if (s.indirectflag) {
                    desc.hasindirect = true;
                }
                if (!s.indirectflag && mh) {
                    for (var mhi = 0; mhi < mh; mhi++) {
                        desc.regread[s.regtype][s.regnum + mhi] = desc.regread[s.regtype][s.regnum];
                    }
                }
            };
            return AGALTokenizer;
        })();
        utils.AGALTokenizer = AGALTokenizer;
    })(stageJS.utils || (stageJS.utils = {}));
    var utils = stageJS.utils;
})(stageJS || (stageJS = {}));
//# sourceMappingURL=stage3d.js.map
