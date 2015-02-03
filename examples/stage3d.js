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

            if (!transparent)
                this.fillRect(this._rect, fillColor);
        }
        BitmapData.fromImageElement = function (img) {
            var bmd = new BitmapData(img.width, img.height, true);
            bmd._context.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
            return bmd;
        };

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
                    return new geom.Vector3D(this.rawData[3], this.rawData[7], this.rawData[11]);
                },
                enumerable: true,
                configurable: true
            });

            Matrix3D.prototype.append = function (lhs) {
                var a11 = lhs.rawData[0];
                var a12 = lhs.rawData[1];
                var a13 = lhs.rawData[2];
                var a14 = lhs.rawData[3];
                var a21 = lhs.rawData[4];
                var a22 = lhs.rawData[5];
                var a23 = lhs.rawData[6];
                var a24 = lhs.rawData[7];
                var a31 = lhs.rawData[8];
                var a32 = lhs.rawData[9];
                var a33 = lhs.rawData[10];
                var a34 = lhs.rawData[11];
                var a41 = lhs.rawData[12];
                var a42 = lhs.rawData[13];
                var a43 = lhs.rawData[14];
                var a44 = lhs.rawData[15];

                var b11 = this.rawData[0];
                var b12 = this.rawData[1];
                var b13 = this.rawData[2];
                var b14 = this.rawData[3];
                var b21 = this.rawData[4];
                var b22 = this.rawData[5];
                var b23 = this.rawData[6];
                var b24 = this.rawData[7];
                var b31 = this.rawData[8];
                var b32 = this.rawData[9];
                var b33 = this.rawData[10];
                var b34 = this.rawData[11];
                var b41 = this.rawData[12];
                var b42 = this.rawData[13];
                var b43 = this.rawData[14];
                var b44 = this.rawData[15];

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
                var a11 = rhs.rawData[0];
                var a12 = rhs.rawData[1];
                var a13 = rhs.rawData[2];
                var a14 = rhs.rawData[3];
                var a21 = rhs.rawData[4];
                var a22 = rhs.rawData[5];
                var a23 = rhs.rawData[6];
                var a24 = rhs.rawData[7];
                var a31 = rhs.rawData[8];
                var a32 = rhs.rawData[9];
                var a33 = rhs.rawData[10];
                var a34 = rhs.rawData[11];
                var a41 = rhs.rawData[12];
                var a42 = rhs.rawData[13];
                var a43 = rhs.rawData[14];
                var a44 = rhs.rawData[15];

                var b11 = this.rawData[0];
                var b12 = this.rawData[1];
                var b13 = this.rawData[2];
                var b14 = this.rawData[3];
                var b21 = this.rawData[4];
                var b22 = this.rawData[5];
                var b23 = this.rawData[6];
                var b24 = this.rawData[7];
                var b31 = this.rawData[8];
                var b32 = this.rawData[9];
                var b33 = this.rawData[10];
                var b34 = this.rawData[11];
                var b41 = this.rawData[12];
                var b42 = this.rawData[13];
                var b43 = this.rawData[14];
                var b44 = this.rawData[15];

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

            Matrix3D.prototype.appendScale = function (xScale, yScale, zScale) {
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

            Matrix3D.prototype.prependScale = function (xScale, yScale, zScale) {
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
                this.rawData[0] += this.rawData[12] * x;
                this.rawData[1] += this.rawData[13] * x;
                this.rawData[2] += this.rawData[14] * x;
                this.rawData[3] += this.rawData[15] * x;
                this.rawData[4] += this.rawData[12] * y;
                this.rawData[5] += this.rawData[14] * y;
                this.rawData[6] += this.rawData[14] * y;
                this.rawData[7] += this.rawData[15] * y;
                this.rawData[8] += this.rawData[12] * z;
                this.rawData[9] += this.rawData[13] * z;
                this.rawData[10] += this.rawData[14] * z;
                this.rawData[11] += this.rawData[15] * z;
            };

            Matrix3D.prototype.prependTranslation = function (x, y, z) {
                this.rawData[3] = this.rawData[0] * x + this.rawData[1] * y + this.rawData[2] * z + this.rawData[3];
                this.rawData[7] = this.rawData[4] * x + this.rawData[5] * y + this.rawData[6] * z + this.rawData[7];
                this.rawData[11] = this.rawData[8] * x + this.rawData[9] * y + this.rawData[10] * z + this.rawData[11];
                this.rawData[15] = this.rawData[12] * x + this.rawData[13] * y + this.rawData[14] * z + this.rawData[15];
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

            Matrix3D.prototype.clone = function () {
                return new Matrix3D(Array.prototype.slice.call(this.rawData));
            };

            Matrix3D.prototype.copyColumnFrom = function (column, vector3D) {
                if (column < 0 || column > 3)
                    throw new Error("column error");

                this.rawData[column] = vector3D.x;
                this.rawData[column + 4] = vector3D.y;
                this.rawData[column + 8] = vector3D.z;
                this.rawData[column + 12] = vector3D.w;
            };

            Matrix3D.prototype.copyColumnTo = function (column, vector3D) {
                if (column < 0 || column > 3)
                    throw new Error("column error");

                vector3D.x = this.rawData[column];
                vector3D.y = this.rawData[column + 4];
                vector3D.z = this.rawData[column + 8];
                vector3D.w = this.rawData[column + 12];
            };

            Matrix3D.prototype.copyFrom = function (sourceMatrix3D) {
                this.rawData.set(sourceMatrix3D.rawData);
            };

            Matrix3D.prototype.copyRawDataFrom = function (vector, index, transpose) {
                if (typeof index === "undefined") { index = 0; }
                if (typeof transpose === "undefined") { transpose = false; }
                if (transpose)
                    this.transpose();

                var len = vector.length - index;
                if (len < 16)
                    throw new Error("Arguments Error");
                else if (len > 16)
                    len = 16;

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
                if (index > 0) {
                    for (var i = 0; i < index; i++)
                        vector[i] = 0;
                }
                var len = this.rawData.length;
                for (var c = 0; c < len; c++)
                    vector[c + index] = this.rawData[c];

                if (transpose)
                    this.transpose();
            };

            Matrix3D.prototype.copyRowFrom = function (row, vector3D) {
                if (row < 0 || row > 3)
                    throw new Error("row error");
                this.rawData[row * 4 + 0] = vector3D.x;
                this.rawData[row * 4 + 1] = vector3D.y;
                this.rawData[row * 4 + 2] = vector3D.z;
                this.rawData[row * 4 + 3] = vector3D.w;
            };

            Matrix3D.prototype.copyRowTo = function (row, vector3D) {
                if (row < 0 || row > 3)
                    throw new Error("row error");

                vector3D.x = this.rawData[row * 4];
                vector3D.y = this.rawData[row * 4 + 1];
                vector3D.z = this.rawData[row * 4 + 2];
                vector3D.w = this.rawData[row * 4 + 3];
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
                return new geom.Vector3D(v.x * this.rawData[0] + v.y * this.rawData[1] + v.z * this.rawData[2] + this.rawData[3], v.x * this.rawData[4] + v.y * this.rawData[5] + v.z * this.rawData[6] + this.rawData[7], v.x * this.rawData[8] + v.y * this.rawData[9] + v.z * this.rawData[10] + this.rawData[11], 1);
            };

            Matrix3D.prototype.deltaTransformVector = function (v) {
                return new geom.Vector3D(v.x * this.rawData[0] + v.y * this.rawData[1] + v.z * this.rawData[2], v.x * this.rawData[4] + v.y * this.rawData[5] + v.z * this.rawData[6], v.x * this.rawData[8] + v.y * this.rawData[9] + v.z * this.rawData[10], 0);
            };

            Matrix3D.prototype.transformVectors = function (vin, vout) {
                var i = 0;
                var v = new geom.Vector3D();
                var v2 = new geom.Vector3D();
                while (i + 3 <= vin.length) {
                    v.x = vin[i];
                    v.y = vin[i + 1];
                    v.z = vin[i + 2];
                    v2 = this.transformVector(v);
                    vout[i] = v2.x;
                    vout[i + 1] = v2.y;
                    vout[i + 2] = v2.z;
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
                        0, c, -s, 0,
                        0, s, c, 0,
                        0, 0, 0, 1
                    ]);
                } else if (ay != 0 && ax == 0 && az == 0) {
                    rMatrix = new Matrix3D([
                        c, 0, s, 0,
                        0, 1, 0, 0,
                        -s, 0, c, 0,
                        0, 0, 0, 1
                    ]);
                } else if (az != 0 && ax == 0 && ay == 0) {
                    rMatrix = new Matrix3D([
                        c, -s, 0, 0,
                        s, c, 0, 0,
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
                        ax * ax * t + c, ax * ay * t - az * s, ax * az * t + ay * s, 0,
                        ax * ay * t + az * s, ay * ay * t + c, ay * az * t - ax * s, 0,
                        ax * az * t - ay * s, ay * az * t + ax * s, az * az * t + c, 0,
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
            PerspectiveMatrix3D.prototype.lookAtLH = function (eye, at, up) {
                var zX = at.x - eye.x;
                var zY = at.y - eye.y;
                var zZ = at.z - eye.z;
                var len = 1 / Math.sqrt(zX * zX + zY * zY + zZ * zZ);
                zX *= len;
                zY *= len;
                zZ *= len;

                var xX = up.y * zZ - up.z * zY;
                var xY = up.z * zX - up.x * zZ;
                var xZ = up.x * zY - up.y * zX;
                len = 1 / Math.sqrt(xX * xX + xY * xY + xZ * xZ);
                xX *= len;
                xY *= len;
                xZ *= len;

                var yX = zY * xZ - zZ * xY;
                var yY = zZ * xX - zX * xZ;
                var yZ = zX * xY - zY * xX;

                this.copyRawDataFrom([
                    xX, xY, xZ, -(xX * eye.x + xY * eye.y + xZ * eye.z),
                    yX, yY, yZ, -(yX * eye.x + yY * eye.y + yZ * eye.z),
                    zX, zY, zZ, -(zX * eye.x + zY * eye.y + zZ * eye.z),
                    0.0, 0.0, 0.0, 1.0
                ]);
            };

            PerspectiveMatrix3D.prototype.lookAtRH = function (eye, at, up) {
                var zX = eye.x - at.x;
                var zY = eye.y - at.y;
                var zZ = eye.z - at.z;

                var len = 1 / Math.sqrt(zX * zX + zY * zY + zZ * zZ);
                zX *= len;
                zY *= len;
                zZ *= len;

                var xX = up.y * zZ - up.z * zY;
                var xY = up.z * zX - up.x * zZ;
                var xZ = up.x * zY - up.y * zX;

                len = 1 / Math.sqrt(xX * xX + xY * xY + xZ * xZ);
                xX *= len;
                xY *= len;
                xZ *= len;

                var yX = zY * xZ - zZ * xY;
                var yY = zZ * xX - zX * xZ;
                var yZ = zX * xY - zY * xX;

                this.copyRawDataFrom([
                    xX, xY, xZ, -(xX * eye.x + xY * eye.y + xZ * eye.z),
                    yX, yY, yZ, -(yX * eye.x + yY * eye.y + yZ * eye.z),
                    zX, zY, zZ, -(zX * eye.x + zY * eye.y + zZ * eye.z),
                    0.0, 0.0, 0.0, 1.0
                ]);
            };

            PerspectiveMatrix3D.prototype.perspectiveOffCenterLH = function (left, right, bottom, top, zNear, zFar) {
                this.copyRawDataFrom([
                    2.0 * zNear / (right - left), 0.0, (left + right) / (left - right), 0.0,
                    0.0, 2.0 * zNear / (top - bottom), (bottom + top) / (bottom - top), 0.0,
                    0.0, 0.0, (zFar + zNear) / (zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                    0.0, 0.0, 1.0, 0.0
                ]);
            };

            PerspectiveMatrix3D.prototype.perspectiveLH = function (width, height, zNear, zFar) {
                this.copyRawDataFrom([
                    2.0 * zNear / width, 0.0, 0.0, 0.0,
                    0.0, 2.0 * zNear / height, 0.0, 0.0,
                    0.0, 0.0, (zFar + zNear) / (zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                    0.0, 0.0, 1.0, 0.0
                ]);
            };

            PerspectiveMatrix3D.prototype.perspectiveFieldOfViewLH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
                var yScale = 1.0 / Math.tan(fieldOfViewY / 2.0);
                var xScale = yScale / aspectRatio;
                this.copyRawDataFrom([
                    xScale, 0.0, 0.0, 0.0,
                    0.0, yScale, 0.0, 0.0,
                    0.0, 0.0, (zFar + zNear) / (zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                    0.0, 0.0, 1.0, 0.0
                ]);
            };

            PerspectiveMatrix3D.prototype.orthoOffCenterLH = function (left, right, bottom, top, zNear, zFar) {
                this.copyRawDataFrom([
                    2.0 / (right - left), 0.0, 0.0, (left + right) / (left - right),
                    0.0, 2.0 / (top - bottom), 0.0, (bottom + top) / (bottom - top),
                    0.0, 0.0, 2 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                    0.0, 0.0, 0.0, 1.0
                ]);
            };
            PerspectiveMatrix3D.prototype.orthoLH = function (width, height, zNear, zFar) {
                this.copyRawDataFrom([
                    2.0 / width, 0.0, 0.0, 0.0,
                    0.0, 2.0 / height, 0.0, 0.0,
                    0.0, 0.0, 2 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                    0.0, 0.0, 0.0, 1.0
                ]);
            };

            PerspectiveMatrix3D.prototype.perspectiveOffCenterRH = function (left, right, bottom, top, zNear, zFar) {
                this.copyRawDataFrom([
                    2.0 * zNear / (right - left), 0.0, (right + left) / (right - left), 0.0,
                    0.0, 2.0 * zNear / (top - bottom), (top + bottom) / (top - bottom), 0.0,
                    0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                    0.0, 0.0, -1.0, 0.0
                ]);
            };

            PerspectiveMatrix3D.prototype.perspectiveRH = function (width, height, zNear, zFar) {
                this.copyRawDataFrom([
                    2.0 * zNear / width, 0.0, 0.0, 0.0,
                    0.0, 2.0 * zNear / height, 0.0, 0.0,
                    0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                    0.0, 0.0, -1.0, 0.0
                ]);
            };

            PerspectiveMatrix3D.prototype.perspectiveFieldOfViewRH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
                var yScale = 1.0 / Math.tan(fieldOfViewY / 2.0);
                var xScale = yScale / aspectRatio;
                this.copyRawDataFrom([
                    xScale, 0.0, 0.0, 0.0,
                    0.0, yScale, 0.0, 0.0,
                    0.0, 0.0, (zFar + zNear) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                    0.0, 0.0, -1.0, 0.0
                ]);
            };

            PerspectiveMatrix3D.prototype.orthoOffCenterRH = function (left, right, bottom, top, zNear, zFar) {
                this.copyRawDataFrom([
                    2.0 / (right - left), 0.0, 0.0, (left + right) / (left - right),
                    0.0, 2.0 / (top - bottom), 0.0, (bottom + top) / (bottom - top),
                    0.0, 0.0, -2.0 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                    0.0, 0.0, 0.0, 1.0
                ]);
            };

            PerspectiveMatrix3D.prototype.orthoRH = function (width, height, zNear, zFar) {
                this.copyRawDataFrom([
                    2.0 / width, 0.0, 0.0, 0.0,
                    0.0, 2.0 / height, 0.0, 0.0,
                    0.0, 0.0, -2.0 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                    0.0, 0.0, 0.0, 1.0
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

            stageJS.Context3D.GL.texParameteri(stageJS.Context3D.GL.TEXTURE_2D, stageJS.Context3D.GL.TEXTURE_MAG_FILTER, stageJS.Context3D.GL.LINEAR);
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

            stageJS.Context3D.GL.linkProgram(this._glProgram);

            if (!stageJS.Context3D.GL.getProgramParameter(this._glProgram, stageJS.Context3D.GL.LINK_STATUS)) {
                throw new Error(stageJS.Context3D.GL.getProgramInfoLog(this._glProgram));
                this.dispose();
            }
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
    stageJS.VERSION = "0.3.0";

    var Stage3D = (function (_super) {
        __extends(Stage3D, _super);
        function Stage3D(canvas) {
            _super.call(this);
            this._context3D = null;
            this._canvas = canvas;
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
                return this._canvas.width;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage3D.prototype, "stageHeight", {
            get: function () {
                return this._canvas.height;
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
            this._bendDisabled = true;
            this._depthDisabled = true;
            this._linkedProgram = null;
            this._vaCache = {};
            this._vcCache = {};
            this._vcMCache = {};
            this._texCache = {};
            stageJS.Context3DBlendFactor.init();
        }
        Context3D.prototype.configureBackBuffer = function (width, height, antiAlias, enableDepthAndStencil) {
            if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = true; }
            Context3D.GL.viewport(0, 0, width, height);
            this._depthDisabled = enableDepthAndStencil;

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
            if (this._depthDisabled) {
                Context3D.GL.enable(Context3D.GL.DEPTH_TEST);
                this._bendDisabled = false;
            }

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
            if (this._bendDisabled) {
                Context3D.GL.enable(Context3D.GL.BLEND);
                this._bendDisabled = false;
            }
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
//# sourceMappingURL=stage3d.js.map
