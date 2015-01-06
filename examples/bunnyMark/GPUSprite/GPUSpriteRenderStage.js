///<reference path="../_definitions.ts"/>
var GPUSprite;
(function (GPUSprite) {
    var GPUSpriteRenderStage = (function () {
        function GPUSpriteRenderStage(stage3D, context3D, rect) {
            this._stage3D = stage3D;
            this._context3D = context3D;
            this._layers = [];
            this.position = rect;
        }
        Object.defineProperty(GPUSpriteRenderStage.prototype, "position", {
            get: function () {
                return this._rect;
            },
            set: function (rect) {
                this._rect = rect;
                //  this._stage3D.x = rect.x;
                //  this._stage3D.y = rect.y;
                this.configureBackBuffer(rect.width, rect.height);
                this._modelViewMatrix = new stageJS.geom.Matrix3D();
                this._modelViewMatrix.appendTranslation(-rect.width / 2, -rect.height / 2, 0);
                this._modelViewMatrix.appendScale(2.0 / rect.width, -2.0 / rect.height, 1); //y轴向下
                console.log(this._modelViewMatrix.rawData);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUSpriteRenderStage.prototype, "modelViewMatrix", {
            get: function () {
                return this._modelViewMatrix;
            },
            enumerable: true,
            configurable: true
        });
        GPUSpriteRenderStage.prototype.addLayer = function (layer) {
            layer.parent = this;
            this._layers.push(layer);
        };
        GPUSpriteRenderStage.prototype.removeLayer = function (layer) {
            for (var i = 0; i < this._layers.length; i++) {
                if (this._layers[i] == layer) {
                    layer.parent = null;
                    this._layers.splice(i, 1);
                }
            }
        };
        GPUSpriteRenderStage.prototype.draw = function () {
            this._context3D.clear(1.0, 1.0, 1.0);
            for (var i = 0; i < this._layers.length; i++) {
                this._layers[i].draw();
            }
            this._context3D.present();
        };
        GPUSpriteRenderStage.prototype.drawDeferred = function () {
            for (var i = 0; i < this._layers.length; i++) {
                this._layers[i].draw();
            }
        };
        GPUSpriteRenderStage.prototype.configureBackBuffer = function (width, height) {
            this._context3D.configureBackBuffer(width, height, 0, false);
        };
        return GPUSpriteRenderStage;
    })();
    GPUSprite.GPUSpriteRenderStage = GPUSpriteRenderStage;
})(GPUSprite || (GPUSprite = {}));
