///<reference path="../stage3d.d.ts"/>
var lib;
(function (lib) {
    /**
     * 环视相机
     */
    var OrbitCamera = (function () {
        function OrbitCamera() {
            this._rotate = new stageJS.geom.Vector3D();
            this._pos = new stageJS.geom.Vector3D();
            this._matrix = new stageJS.geom.Matrix3D();
            this._invertMatrix = new stageJS.geom.Matrix3D();
        }
        Object.defineProperty(OrbitCamera.prototype, "x", {
            //public set pos(p:stageJS.geom.Vector3D)
            //{
            //    this._pos = p;
            //    this.update();
            //}
            set: function (num) {
                if (num != this._pos.x) {
                    this._pos.x = num;
                    this.update();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OrbitCamera.prototype, "y", {
            set: function (num) {
                if (num != this._pos.y) {
                    this._pos.y = num;
                    this.update();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OrbitCamera.prototype, "z", {
            set: function (num) {
                if (num != this._pos.z) {
                    this._pos.z = num;
                    this.update();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OrbitCamera.prototype, "rotateY", {
            set: function (num) {
                if (num != this._rotate.y) {
                    this._rotate.y = num;
                    this.update();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OrbitCamera.prototype, "rotateX", {
            set: function (num) {
                if (num != this._rotate.x) {
                    this._rotate.x = num;
                    this.update();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OrbitCamera.prototype, "rotateZ", {
            set: function (num) {
                if (num != this._rotate.z) {
                    this._rotate.z = num;
                    this.update();
                }
            },
            enumerable: true,
            configurable: true
        });
        OrbitCamera.prototype.getViewMatrix = function () {
            this._invertMatrix.copyFrom(this._matrix);
            this._invertMatrix.invert();
            return this._invertMatrix;
        };
        OrbitCamera.prototype.update = function () {
            this._matrix.identity();
            this._matrix.appendRotation(this._rotate.x, stageJS.geom.Vector3D.X_AXIS);
            this._matrix.appendRotation(this._rotate.y, stageJS.geom.Vector3D.Y_AXIS);
            this._matrix.appendTranslation(this._pos.x, this._pos.y, this._pos.z);
        };
        return OrbitCamera;
    })();
    lib.OrbitCamera = OrbitCamera;
})(lib || (lib = {})); // end package
