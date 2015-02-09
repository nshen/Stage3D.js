var GPUSprite;
(function (GPUSprite) {
    var Rectangle = (function () {
        function Rectangle(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        }
        return Rectangle;
    })();
    GPUSprite.Rectangle = Rectangle;
})(GPUSprite || (GPUSprite = {}));
var GPUSprite;
(function (GPUSprite) {
    var SpriteSheet = (function () {
        function SpriteSheet(spriteSheetBitmapData, numSpritesW, numSpritesH, uvPad) {
            if (numSpritesW === void 0) { numSpritesW = 8; }
            if (numSpritesH === void 0) { numSpritesH = 8; }
            if (uvPad === void 0) { uvPad = 0; }
            this.uvPadding = 0;
            this._spriteSheet = spriteSheetBitmapData;
            this._uvCoords = [];
            this._rects = [];
            this.uvPadding = uvPad;
            this.createUVs(numSpritesW, numSpritesH);
        }
        SpriteSheet.prototype.createUVs = function (numSpritesW, numSpritesH) {
            var l = 0;
            var r = 0;
            var t = 0;
            var b = 0;
            var padding = this.uvPadding;
            for (var y = 0; y < numSpritesH; y++) {
                for (var x = 0; x < numSpritesW; x++) {
                    l = (x / numSpritesW) + padding;
                    r = (x + 1) / numSpritesW - padding;
                    t = y / numSpritesH + padding;
                    b = (y + 1) / numSpritesH - padding;
                    this._uvCoords.push(l, b, l, t, r, t, r, b);
                    this._rects.push({
                        x: 0,
                        y: 0,
                        width: this._spriteSheet.width / numSpritesW,
                        height: this._spriteSheet.height / numSpritesH
                    });
                }
            }
        };
        SpriteSheet.prototype.defineSprite = function (x, y, w, h) {
            var destRect = new GPUSprite.Rectangle();
            destRect.x = x;
            destRect.y = y;
            destRect.width = w;
            destRect.height = h;
            this._rects.push(destRect);
            this._uvCoords.push(destRect.x / this._spriteSheet.width, destRect.y / this._spriteSheet.height + destRect.height / this._spriteSheet.height, destRect.x / this._spriteSheet.width, destRect.y / this._spriteSheet.height, destRect.x / this._spriteSheet.width + destRect.width / this._spriteSheet.width, destRect.y / this._spriteSheet.height, destRect.x / this._spriteSheet.width + destRect.width / this._spriteSheet.width, destRect.y / this._spriteSheet.height + destRect.height / this._spriteSheet.height);
            return this._rects.length - 1;
        };
        SpriteSheet.prototype.addSprite = function (srcBits, srcRect, destPt) {
            this._spriteSheet.copyPixels(srcBits, srcRect, destPt);
            this._rects.push({ x: destPt.x, y: destPt.y, width: srcRect.width, height: srcRect.height });
            this._uvCoords.push(destPt.x / this._spriteSheet.width, destPt.y / this._spriteSheet.height + srcRect.height / this._spriteSheet.height, destPt.x / this._spriteSheet.width, destPt.y / this._spriteSheet.height, destPt.x / this._spriteSheet.width + srcRect.width / this._spriteSheet.width, destPt.y / this._spriteSheet.height, destPt.x / this._spriteSheet.width + srcRect.width / this._spriteSheet.width, destPt.y / this._spriteSheet.height + srcRect.height / this._spriteSheet.height);
            return this._rects.length - 1;
        };
        SpriteSheet.prototype.removeSprite = function (spriteId) {
            if (spriteId < this._uvCoords.length) {
                this._uvCoords = this._uvCoords.splice(spriteId * 8, 8);
                this._rects.splice(spriteId, 1);
            }
        };
        Object.defineProperty(SpriteSheet.prototype, "numSprites", {
            get: function () {
                return this._rects.length;
            },
            enumerable: true,
            configurable: true
        });
        SpriteSheet.prototype.getUVCoords = function (spriteId) {
            var startIdx = spriteId * 8;
            return this._uvCoords.slice(startIdx, startIdx + 8);
        };
        SpriteSheet.prototype.getRect = function (spriteId) {
            return this._rects[spriteId];
        };
        SpriteSheet.prototype.uploadTexture = function (context3D) {
            if (this._texture == null) {
                this._texture = context3D.createTexture(this._spriteSheet.width, this._spriteSheet.height, stageJS.Context3DTextureFormat.BGRA, false);
            }
            this._texture.uploadFromBitmapData(this._spriteSheet, 0);
        };
        return SpriteSheet;
    })();
    GPUSprite.SpriteSheet = SpriteSheet;
})(GPUSprite || (GPUSprite = {}));
var GPUSprite;
(function (GPUSprite) {
    var SpriteRenderStage = (function () {
        function SpriteRenderStage(stage3D, context3D, rect) {
            this._stage3D = stage3D;
            this._context3D = context3D;
            this._layers = [];
            this.position = rect;
        }
        Object.defineProperty(SpriteRenderStage.prototype, "position", {
            get: function () {
                return this._rect;
            },
            set: function (rect) {
                this._rect = rect;
                this.configureBackBuffer(rect.width, rect.height);
                this._modelViewMatrix = new stageJS.geom.Matrix3D();
                this._modelViewMatrix.appendTranslation(-rect.width / 2, -rect.height / 2, 0);
                this._modelViewMatrix.appendScale(2.0 / rect.width, -2.0 / rect.height, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpriteRenderStage.prototype, "modelViewMatrix", {
            get: function () {
                return this._modelViewMatrix;
            },
            enumerable: true,
            configurable: true
        });
        SpriteRenderStage.prototype.addLayer = function (layer, name) {
            if (name === void 0) { name = ""; }
            layer.parent = this;
            layer.name = name;
            this._layers.push(layer);
        };
        SpriteRenderStage.prototype.removeLayer = function (layer) {
            for (var i = 0; i < this._layers.length; i++) {
                if (this._layers[i] == layer) {
                    layer.parent = null;
                    this._layers.splice(i, 1);
                }
            }
        };
        SpriteRenderStage.prototype.draw = function () {
            this._context3D.clear(1.0, 1.0, 1.0);
            for (var i = 0; i < this._layers.length; i++) {
                this._layers[i].draw();
            }
            this._context3D.present();
        };
        SpriteRenderStage.prototype.drawDeferred = function () {
            for (var i = 0; i < this._layers.length; i++) {
                this._layers[i].draw();
            }
        };
        SpriteRenderStage.prototype.configureBackBuffer = function (width, height) {
            this._context3D.configureBackBuffer(width, height, 0, false);
        };
        return SpriteRenderStage;
    })();
    GPUSprite.SpriteRenderStage = SpriteRenderStage;
})(GPUSprite || (GPUSprite = {}));
var GPUSprite;
(function (GPUSprite) {
    var SpriteRenderLayer = (function () {
        function SpriteRenderLayer(context3D, spriteSheet) {
            this.name = "";
            this._context3D = context3D;
            this._spriteSheet = spriteSheet;
            this._vertexData = [];
            this._indexData = [];
            this._uvData = [];
            this._children = [];
            this._updateVBOs = true;
            this.setupShaders();
            this.updateTexture();
        }
        Object.defineProperty(SpriteRenderLayer.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (parentStage) {
                this._parent = parentStage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpriteRenderLayer.prototype, "numChildren", {
            get: function () {
                return this._children.length;
            },
            enumerable: true,
            configurable: true
        });
        SpriteRenderLayer.prototype.createChild = function (spriteId) {
            var sprite = new GPUSprite.Sprite();
            this.addChild(sprite, spriteId);
            return sprite;
        };
        SpriteRenderLayer.prototype.addChild = function (sprite, spriteId) {
            sprite._parent = this;
            sprite._spriteId = spriteId;
            sprite._childId = this._children.length;
            this._children.push(sprite);
            var childVertexFirstIndex = (sprite._childId * 12) / 3;
            this._vertexData.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
            this._indexData.push(childVertexFirstIndex, childVertexFirstIndex + 1, childVertexFirstIndex + 2, childVertexFirstIndex, childVertexFirstIndex + 2, childVertexFirstIndex + 3);
            var childUVCoords = this._spriteSheet.getUVCoords(spriteId);
            this._uvData.push(childUVCoords[0], childUVCoords[1], childUVCoords[2], childUVCoords[3], childUVCoords[4], childUVCoords[5], childUVCoords[6], childUVCoords[7]);
            this._updateVBOs = true;
        };
        SpriteRenderLayer.prototype.removeChild = function (child) {
            var childId = child._childId;
            if ((child._parent == this) && childId < this._children.length) {
                child._parent = null;
                this._children.splice(childId, 1);
                var idx;
                for (idx = childId; idx < this._children.length; idx++) {
                    this._children[idx]._childId = idx;
                }
                var vertexIdx = childId * 12;
                var indexIdx = childId * 6;
                this._vertexData.splice(vertexIdx, 12);
                this._indexData.splice(indexIdx, 6);
                this._uvData.splice(vertexIdx, 8);
                this._updateVBOs = true;
            }
        };
        SpriteRenderLayer.prototype.draw = function () {
            var nChildren = this._children.length;
            if (nChildren == 0)
                return;
            for (var i = 0; i < nChildren; i++) {
                this.updateChildVertexData(this._children[i]);
            }
            this._context3D.setBlendFactors(stageJS.Context3DBlendFactor.SOURCE_ALPHA, stageJS.Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
            this._context3D.setProgramConstantsFromMatrix("vc0", this._parent.modelViewMatrix, false);
            this._context3D.setTextureAt("fs0", this._spriteSheet._texture);
            if (this._updateVBOs) {
                this._vertexBuffer = this._context3D.createVertexBuffer(this._vertexData.length / 3, 3);
                this._indexBuffer = this._context3D.createIndexBuffer(this._indexData.length);
                this._uvBuffer = this._context3D.createVertexBuffer(this._uvData.length / 2, 2);
                this._indexBuffer.uploadFromVector(this._indexData, 0, this._indexData.length);
                this._uvBuffer.uploadFromVector(this._uvData, 0, this._uvData.length / 2);
                this._updateVBOs = false;
            }
            this._vertexBuffer.uploadFromVector(this._vertexData, 0, this._vertexData.length / 3);
            this._context3D.setVertexBufferAt("va0", this._vertexBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_3);
            this._context3D.setVertexBufferAt("va1", this._uvBuffer, 0, stageJS.Context3DVertexBufferFormat.FLOAT_2);
            this._context3D.drawTriangles(this._indexBuffer);
        };
        SpriteRenderLayer.prototype.setupShaders = function () {
            this._shaderProgram = this._context3D.createProgram();
            this._shaderProgram.upload("shader-vs", "shader-fs");
            this._context3D.setProgram(this._shaderProgram);
        };
        SpriteRenderLayer.prototype.updateTexture = function () {
            this._spriteSheet.uploadTexture(this._context3D);
        };
        SpriteRenderLayer.prototype.updateChildVertexData = function (sprite) {
            var childVertexIdx = sprite._childId * 12;
            if (sprite.visible) {
                var x = sprite.position.x;
                var y = sprite.position.y;
                var rect = sprite.rect;
                var sinT = Math.sin(sprite.rotation);
                var cosT = Math.cos(sprite.rotation);
                var alpha = sprite.alpha;
                var scaledWidth = rect.width * sprite.scaleX;
                var scaledHeight = rect.height * sprite.scaleY;
                var centerX = scaledWidth * 0.5;
                var centerY = scaledHeight * 0.5;
                this._vertexData[childVertexIdx] = x - (cosT * centerX) - (sinT * (scaledHeight - centerY));
                this._vertexData[childVertexIdx + 1] = y - (sinT * centerX) + (cosT * (scaledHeight - centerY));
                this._vertexData[childVertexIdx + 2] = alpha;
                this._vertexData[childVertexIdx + 3] = x - (cosT * centerX) + (sinT * centerY);
                this._vertexData[childVertexIdx + 4] = y - (sinT * centerX) - (cosT * centerY);
                this._vertexData[childVertexIdx + 5] = alpha;
                this._vertexData[childVertexIdx + 6] = x + (cosT * (scaledWidth - centerX)) + (sinT * centerY);
                this._vertexData[childVertexIdx + 7] = y + (sinT * (scaledWidth - centerX)) - (cosT * centerY);
                this._vertexData[childVertexIdx + 8] = alpha;
                this._vertexData[childVertexIdx + 9] = x + (cosT * (scaledWidth - centerX)) - (sinT * (scaledHeight - centerY));
                this._vertexData[childVertexIdx + 10] = y + (sinT * (scaledWidth - centerX)) + (cosT * (scaledHeight - centerY));
                this._vertexData[childVertexIdx + 11] = alpha;
            }
            else {
                for (var i = 0; i < 12; i++) {
                    this._vertexData[childVertexIdx + i] = 0;
                }
            }
        };
        return SpriteRenderLayer;
    })();
    GPUSprite.SpriteRenderLayer = SpriteRenderLayer;
})(GPUSprite || (GPUSprite = {}));
var GPUSprite;
(function (GPUSprite) {
    var Sprite = (function () {
        function Sprite() {
            this._parent = null;
            this._spriteId = 0;
            this._childId = 0;
            this._pos = { x: 0, y: 0 };
            this._scaleX = 1.0;
            this._scaleY = 1.0;
            this._rotation = 0;
            this._alpha = 1.0;
            this._visible = true;
        }
        Object.defineProperty(Sprite.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (isVisible) {
                this._visible = isVisible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "alpha", {
            get: function () {
                return this._alpha;
            },
            set: function (a) {
                this._alpha = a;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "position", {
            get: function () {
                return this._pos;
            },
            set: function (pt) {
                this._pos = pt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "scaleX", {
            get: function () {
                return this._scaleX;
            },
            set: function (val) {
                this._scaleX = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "scaleY", {
            get: function () {
                return this._scaleY;
            },
            set: function (val) {
                this._scaleY = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (val) {
                this._rotation = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "rect", {
            get: function () {
                return this._parent._spriteSheet.getRect(this._spriteId);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "spriteId", {
            get: function () {
                return this._spriteId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "childId", {
            get: function () {
                return this._childId;
            },
            enumerable: true,
            configurable: true
        });
        return Sprite;
    })();
    GPUSprite.Sprite = Sprite;
})(GPUSprite || (GPUSprite = {}));
var lib;
(function (lib) {
    var ImageLoader = (function () {
        function ImageLoader() {
            this._queue = [];
            this._successCount = 0;
            this._errorCount = 0;
            this._cache = {};
            if (ImageLoader._instance)
                throw new Error("singleton error");
        }
        ImageLoader.getInstance = function () {
            if (!ImageLoader._instance)
                ImageLoader._instance = new ImageLoader();
            return ImageLoader._instance;
        };
        ImageLoader.prototype.add = function (path) {
            this._queue.push(path);
        };
        ImageLoader.prototype.downloadAll = function (p_callback) {
            var _this = this;
            if (this._queue.length <= 0)
                return p_callback();
            for (var i = 0; i < this._queue.length; i++) {
                var img = new Image();
                img.onload = function (e) {
                    _this._successCount++;
                    if (_this.isDone())
                        p_callback();
                };
                img.onerror = function (e) {
                    _this._errorCount++;
                    if (_this.isDone())
                        p_callback();
                };
                img.src = this._queue[i];
                this._cache[this._queue[i]] = img;
            }
        };
        ImageLoader.prototype.isDone = function () {
            return this._queue.length == (this._successCount + this._errorCount);
        };
        ImageLoader.prototype.get = function (path) {
            return this._cache[path];
        };
        return ImageLoader;
    })();
    lib.ImageLoader = ImageLoader;
})(lib || (lib = {}));
var lib;
(function (lib) {
    var FileLoader = (function () {
        function FileLoader() {
            this._queue = [];
            this._successCount = 0;
            this._errorCount = 0;
            this._cache = {};
            this._resType = "text";
            if (FileLoader._instance)
                throw new Error("singleton error");
        }
        FileLoader.getInstance = function () {
            if (!FileLoader._instance)
                FileLoader._instance = new FileLoader();
            return FileLoader._instance;
        };
        FileLoader.prototype.add = function (path) {
            this._queue.push(path);
        };
        FileLoader.prototype.downloadAll = function (p_callback) {
            var _this = this;
            if (this._queue.length <= 0)
                return p_callback();
            for (var i = 0; i < this._queue.length; i++) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function (e) {
                };
                xhr.onload = function (e) {
                    if (xhr.status == 0) {
                        _this._successCount++;
                        if (_this.isDone())
                            p_callback();
                        return;
                    }
                    if (xhr.readyState == 4 || xhr.status == 0) {
                        _this._successCount++;
                        if (_this.isDone())
                            p_callback();
                    }
                    else {
                        throw new Error("error");
                    }
                    console.log("readState:", xhr.readyState, xhr.status);
                };
                xhr.onerror = function (e) {
                    _this._errorCount++;
                    if (_this.isDone())
                        p_callback();
                };
                xhr.open('GET', this._queue[i], true);
                xhr.send();
                xhr.responseType = this._resType;
                this._cache[this._queue[i]] = xhr;
            }
        };
        FileLoader.prototype.isDone = function () {
            return this._queue.length == (this._successCount + this._errorCount);
        };
        FileLoader.prototype.get = function (path) {
            return this._cache[path];
        };
        FileLoader.RES_TYPE_TEXT = "text";
        FileLoader.RES_TYPE_BUFFER = "arraybuffer";
        FileLoader.RES_TYPE_BLOB = "blob";
        FileLoader.RES_TYPE_DOCUMENT = "document";
        return FileLoader;
    })();
    lib.FileLoader = FileLoader;
})(lib || (lib = {}));
var shooter;
(function (shooter) {
    var GameSaves = (function () {
        function GameSaves() {
            console.log("Initializing game save system");
            this._saves = window['localStorage'];
            if (this._saves == null)
                throw new Error("Unable to init game save system");
        }
        Object.defineProperty(GameSaves.prototype, "level", {
            get: function () {
                if (!this._saves)
                    return 0;
                if (this._saves["level"] == null)
                    return 0;
                console.log("Loaded level is " + this._saves["level"]);
                return parseInt(this._saves["level"]);
            },
            set: function (num) {
                if (!this._saves)
                    return;
                this._saves["level"] = num;
                console.log("Saved level set to: " + num);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameSaves.prototype, "score", {
            get: function () {
                if (!this._saves)
                    return 0;
                if (this._saves["score"] == null)
                    return 0;
                console.log("Loaded score is " + this._saves["score"]);
                return parseInt(this._saves["score"]);
            },
            set: function (num) {
                if (!this._saves)
                    return;
                this._saves["score"] = num;
                console.log("Saved score set to: " + num);
            },
            enumerable: true,
            configurable: true
        });
        return GameSaves;
    })();
    shooter.GameSaves = GameSaves;
})(shooter || (shooter = {}));
var shooter;
(function (shooter) {
    var GameControls = (function () {
        function GameControls(theStage) {
            var _this = this;
            this.autofire = false;
            this.pressing = { up: false, down: false, left: false, right: false, fire: false, hasfocus: false };
            this.keyPressed = function (event) {
                _this.keyHandler(event, true);
            };
            this.keyReleased = function (event) {
                _this.keyHandler(event, false);
            };
            this.lostFocus = function (event) {
                console.log("Game lost keyboard focus.");
                _this.pressing.up = false;
                _this.pressing.down = false;
                _this.pressing.left = false;
                _this.pressing.right = false;
                _this.pressing.fire = _this.autofire;
                _this.pressing.hasfocus = false;
            };
            this.gainFocus = function (event) {
                console.log("Game received keyboard focus.");
                _this.pressing.hasfocus = true;
            };
            this.textDescription = function () {
                return ("Controls: " + (_this.pressing.up ? "up " : "") + (_this.pressing.down ? "down " : "") + (_this.pressing.left ? "left " : "") + (_this.pressing.right ? "right " : "") + (_this.pressing.fire ? "fire" : ""));
            };
            this.stage = theStage;
            this.stage.addEventListener("keydown", this.keyPressed);
            this.stage.addEventListener("keyup", this.keyReleased);
            this.stage.addEventListener("blur", this.lostFocus);
        }
        GameControls.prototype.keyHandler = function (event, isDown) {
            if (event.ctrlKey || event.altKey || event.shiftKey)
                this.pressing.fire = isDown;
            switch (event.keyCode) {
                case 38:
                case 87:
                case 90:
                case 188:
                    this.pressing.up = isDown;
                    break;
                case 40:
                case 83:
                case 79:
                    this.pressing.down = isDown;
                    break;
                case 37:
                case 65:
                case 81:
                    this.pressing.left = isDown;
                    break;
                case 39:
                case 68:
                case 69:
                    this.pressing.right = isDown;
                    break;
                case 32:
                case 16:
                case 17:
                case 13:
                case 88:
                case 67:
                    this.pressing.fire = isDown;
                    break;
            }
            if (this.autofire)
                this.pressing.fire = true;
        };
        return GameControls;
    })();
    shooter.GameControls = GameControls;
})(shooter || (shooter = {}));
var shooter;
(function (shooter) {
    var GameMenu = (function () {
        function GameMenu(view) {
            this.menuState = 0;
            this.menuWidth = 128;
            this.menuItemHeight = 32;
            this.menuY1 = 0;
            this.menuY2 = 0;
            this.menuY3 = 0;
            this.showingAbout = false;
            this.showingControls = false;
            this.showingControlsUntil = 0;
            this.showingAboutUntil = 0;
            this.logoX = 0;
            this.logoY = 0;
            this.menuX = 0;
            this.menuY = 0;
            this.menuCreated = false;
            console.log("Init the game menu..");
            this.setPosition(view);
        }
        GameMenu.prototype.setPosition = function (view) {
            this.logoX = view.width / 2;
            this.logoY = view.height / 2 - 56;
            this.menuX = view.width / 2;
            this.menuY = view.height / 2 + 64;
            this.menuY1 = this.menuY - (this.menuItemHeight / 2);
            this.menuY2 = this.menuY - (this.menuItemHeight / 2) + this.menuItemHeight;
            this.menuY3 = this.menuY - (this.menuItemHeight / 2) + (this.menuItemHeight * 2);
            if (this.menuCreated)
                this.updatePos();
        };
        GameMenu.prototype.updatePos = function () {
            this.logoSprite.position.x = this.logoX;
            this.logoSprite.position.y = this.logoY;
            this.menuPlaySprite.position.x = this.menuX;
            this.menuPlaySprite.position.y = this.menuY;
            this.amenuPlaySprite.position.x = this.menuX;
            this.amenuPlaySprite.position.y = this.menuY;
            this.menuControlsSprite.position.x = this.menuX;
            this.menuControlsSprite.position.y = this.menuY + this.menuItemHeight;
            this.amenuControlsSprite.position.x = this.menuX;
            this.amenuControlsSprite.position.y = this.menuY + this.menuItemHeight;
            this.menuAboutSprite.position.x = this.menuX;
            this.menuAboutSprite.position.y = this.menuY + this.menuItemHeight + this.menuItemHeight;
            this.amenuAboutSprite.position.x = this.menuX;
            this.amenuAboutSprite.position.y = this.menuY + this.menuItemHeight + this.menuItemHeight;
            this.aboutSprite.position.x = this.menuX;
            this.aboutSprite.position.y = this.menuY + 64;
            this.controlsSprite.position.x = this.menuX;
            this.controlsSprite.position.y = this.menuY + 64;
        };
        GameMenu.prototype.createBatch = function (context3D) {
            var source = stageJS.BitmapData.fromImageElement(lib.ImageLoader.getInstance().get("assets/titlescreen.png"));
            this.spriteSheet = new GPUSprite.SpriteSheet(source, 0, 0);
            this.batch = new GPUSprite.SpriteRenderLayer(context3D, this.spriteSheet);
            var logoID = this.spriteSheet.defineSprite(0, 0, 512, 256);
            this.logoSprite = this.batch.createChild(logoID);
            var menuPlaySpriteID = this.spriteSheet.defineSprite(0, 256, this.menuWidth, 48);
            this.menuPlaySprite = this.batch.createChild(menuPlaySpriteID);
            var amenuPlaySpriteID = this.spriteSheet.defineSprite(0, 256 + 128, this.menuWidth, 48);
            this.amenuPlaySprite = this.batch.createChild(amenuPlaySpriteID);
            this.amenuPlaySprite.alpha = 0;
            var menuControlsSpriteID = this.spriteSheet.defineSprite(0, 304, this.menuWidth, 32);
            this.menuControlsSprite = this.batch.createChild(menuControlsSpriteID);
            var amenuControlsSpriteID = this.spriteSheet.defineSprite(0, 304 + 128, this.menuWidth, 32);
            this.amenuControlsSprite = this.batch.createChild(amenuControlsSpriteID);
            this.amenuControlsSprite.alpha = 0;
            var menuAboutSpriteID = this.spriteSheet.defineSprite(0, 336, this.menuWidth, 48);
            this.menuAboutSprite = this.batch.createChild(menuAboutSpriteID);
            var amenuAboutSpriteID = this.spriteSheet.defineSprite(0, 336 + 128, this.menuWidth, 48);
            this.amenuAboutSprite = this.batch.createChild(amenuAboutSpriteID);
            this.amenuAboutSprite.alpha = 0;
            var aboutSpriteID = this.spriteSheet.defineSprite(128, 256, 384, 128);
            this.aboutSprite = this.batch.createChild(aboutSpriteID);
            this.aboutSprite.alpha = 0;
            var controlsSpriteID = this.spriteSheet.defineSprite(128, 384, 384, 128);
            this.controlsSprite = this.batch.createChild(controlsSpriteID);
            this.controlsSprite.alpha = 0;
            this.menuCreated = true;
            this.updatePos();
            return this.batch;
        };
        GameMenu.prototype.nextMenuItem = function () {
            this.menuState++;
            if (this.menuState > 3)
                this.menuState = 1;
            this.updateState();
        };
        GameMenu.prototype.prevMenuItem = function () {
            this.menuState--;
            if (this.menuState < 1)
                this.menuState = 3;
            this.updateState();
        };
        GameMenu.prototype.mouseHighlight = function (x, y) {
            this.menuState = 0;
            var menuLeft = this.menuX - (this.menuWidth / 2);
            var menuRight = this.menuX + (this.menuWidth / 2);
            if ((x >= menuLeft) && (x <= menuRight)) {
                if ((y >= this.menuY1) && (y <= (this.menuY1 + this.menuItemHeight))) {
                    this.menuState = 1;
                }
                if ((y >= this.menuY2) && (y <= (this.menuY2 + this.menuItemHeight))) {
                    this.menuState = 2;
                }
                if ((y >= this.menuY3) && (y <= (this.menuY3 + this.menuItemHeight))) {
                    this.menuState = 3;
                }
            }
            this.updateState();
        };
        GameMenu.prototype.updateState = function () {
            if (this.showingAbout || this.showingControls)
                return;
            switch (this.menuState) {
                case 0:
                    this.menuAboutSprite.alpha = 1;
                    this.menuControlsSprite.alpha = 1;
                    this.menuPlaySprite.alpha = 1;
                    this.amenuAboutSprite.alpha = 0;
                    this.amenuControlsSprite.alpha = 0;
                    this.amenuPlaySprite.alpha = 0;
                    break;
                case 1:
                    this.menuAboutSprite.alpha = 1;
                    this.menuControlsSprite.alpha = 1;
                    this.menuPlaySprite.alpha = 0;
                    this.amenuAboutSprite.alpha = 0;
                    this.amenuControlsSprite.alpha = 0;
                    this.amenuPlaySprite.alpha = 1;
                    break;
                case 2:
                    this.menuAboutSprite.alpha = 1;
                    this.menuControlsSprite.alpha = 0;
                    this.menuPlaySprite.alpha = 1;
                    this.amenuAboutSprite.alpha = 0;
                    this.amenuControlsSprite.alpha = 1;
                    this.amenuPlaySprite.alpha = 0;
                    break;
                case 3:
                    this.menuAboutSprite.alpha = 0;
                    this.menuControlsSprite.alpha = 1;
                    this.menuPlaySprite.alpha = 1;
                    this.amenuAboutSprite.alpha = 1;
                    this.amenuControlsSprite.alpha = 0;
                    this.amenuPlaySprite.alpha = 0;
                    break;
            }
        };
        GameMenu.prototype.activateCurrentMenuItem = function (currentTime) {
            if (this.showingAbout || this.showingControls)
                return false;
            switch (this.menuState) {
                case 1:
                    return true;
                    break;
                case 2:
                    this.menuAboutSprite.alpha = 0;
                    this.menuControlsSprite.alpha = 0;
                    this.menuPlaySprite.alpha = 0;
                    this.amenuAboutSprite.alpha = 0;
                    this.amenuControlsSprite.alpha = 0;
                    this.amenuPlaySprite.alpha = 0;
                    this.controlsSprite.alpha = 1;
                    this.showingControls = true;
                    this.showingControlsUntil = currentTime + 1000;
                    break;
                case 3:
                    this.menuAboutSprite.alpha = 0;
                    this.menuControlsSprite.alpha = 0;
                    this.menuPlaySprite.alpha = 0;
                    this.amenuAboutSprite.alpha = 0;
                    this.amenuControlsSprite.alpha = 0;
                    this.amenuPlaySprite.alpha = 0;
                    this.aboutSprite.alpha = 1;
                    this.showingAbout = true;
                    this.showingAboutUntil = currentTime + 1000;
                    break;
            }
            return false;
        };
        GameMenu.prototype.update = function (currentTime) {
            this.logoSprite.position.x = this.logoX;
            this.logoSprite.position.y = this.logoY;
            var wobble = (Math.cos(currentTime / 500) / Math.PI) * 0.2;
            this.logoSprite.scaleX = .8 + wobble;
            this.logoSprite.scaleY = .8 + wobble;
            wobble = (Math.cos(currentTime / 777) / Math.PI) * 0.1;
            this.logoSprite.rotation = wobble;
            wobble = (Math.cos(currentTime / 150) / Math.PI) * 0.1;
            this.amenuAboutSprite.scaleX = this.amenuAboutSprite.scaleY = this.amenuControlsSprite.scaleX = this.amenuControlsSprite.scaleY = this.amenuPlaySprite.scaleX = this.amenuPlaySprite.scaleY = 1.1 + wobble;
            if (this.showingAbout) {
                if (this.showingAboutUntil > currentTime) {
                    this.aboutSprite.alpha = 1;
                }
                else {
                    this.aboutSprite.alpha = 0;
                    this.showingAbout = false;
                    this.updateState();
                }
            }
            if (this.showingControls) {
                if (this.showingControlsUntil > currentTime) {
                    this.controlsSprite.alpha = 1;
                }
                else {
                    this.controlsSprite.alpha = 0;
                    this.showingControls = false;
                    this.updateState();
                }
            }
        };
        return GameMenu;
    })();
    shooter.GameMenu = GameMenu;
})(shooter || (shooter = {}));
var shooter;
(function (shooter) {
    var GameGUI = (function () {
        function GameGUI() {
            this.score = 0;
            this.prevHighScore = 0;
            this.highScore = 0;
            this.level = 0;
            this.lives = 3;
            this.health = 100;
            this.transitionText = "";
            this.bosshealth = 100;
            this.npcText = "";
            this.titleText = "";
            this.statsText = "";
            this.frameCount = 0;
            this.lastfps = 60;
            this.transitionTf_y_location = 162;
            document.body.style.visibility = "visible";
            this.hudOverlay = document.getElementById("hud-bg");
            this.npcOverlay = document.getElementById("npcOverlay");
            this.scoreTf = document.getElementById("scoreTf");
            this.highScoreTf = document.getElementById("highScoreTf");
            this.levelTf = document.getElementById("levelTf");
            this.healthTf = document.getElementById("healthTf");
            this.transitionTf = document.getElementById("transitionTf");
            this.bosshealthTf = document.getElementById("bosshealthTf");
            this.npcTf = document.getElementById("npcTf");
            document.body.removeChild(this.bosshealthTf);
            document.body.removeChild(this.transitionTf);
            document.body.removeChild(this.npcOverlay);
            document.body.removeChild(document.getElementById("loading"));
        }
        GameGUI.prototype.setPosition = function (view) {
            console.log('Moving GUI');
            var mid = view.width / 2;
            this.hudOverlay.style.left = (mid - 300) + "px";
            this.scoreTf.style.left = (mid - 300 + 442) + "px";
            this.highScoreTf.style.left = (mid - 300 + 208) + "px";
            this.healthTf.style.left = (mid - 300 + 208) + "px";
            this.bosshealthTf.style.left = (mid - 300) + "px";
            this.bosshealthTf.style.top = (60) + "px";
            this.transitionTf.style.top = (view.height / 2 - 80) + "px";
            this.transitionTf.style.left = (mid - 300) + "px";
            this.npcOverlay.style.left = (mid - 300) + "px";
            this.npcOverlay.style.top = (view.height - 64 - 8) + "px";
            this.npcTf.style.top = (view.height - 64) + "px";
            this.npcTf.style.left = (mid - 220) + "px";
        };
        GameGUI.prototype.addChild = function (t) {
            document.body.appendChild(t);
        };
        GameGUI.prototype.removeChild = function (t) {
            document.body.removeChild(t);
        };
        GameGUI.prototype.contains = function (t) {
            return document.body.contains(t);
        };
        GameGUI.prototype.healthBar = function (num) {
            if (num >= 99)
                return "|||||||||||||";
            else if (num >= 92)
                return "||||||||||||";
            else if (num >= 84)
                return "|||||||||||";
            else if (num >= 76)
                return "||||||||||";
            else if (num >= 68)
                return "|||||||||";
            else if (num >= 60)
                return "||||||||";
            else if (num >= 52)
                return "|||||||";
            else if (num >= 44)
                return "||||||";
            else if (num >= 36)
                return "|||||";
            else if (num >= 28)
                return "||||";
            else if (num >= 20)
                return "|||";
            else if (num >= 12)
                return "||";
            else if (num >= 1)
                return "|";
            else
                return "";
        };
        GameGUI.prototype.pad0s = function (num) {
            if (num < 10)
                return '00000' + num;
            else if (num < 100)
                return '0000' + num;
            else if (num < 1000)
                return '000' + num;
            else if (num < 10000)
                return '00' + num;
            else if (num < 100000)
                return '0' + num;
            else
                return '' + num;
        };
        GameGUI.prototype.updateScore = function () {
            if (this.npcText != this.npcTf.innerHTML) {
                this.npcTf.innerHTML = this.npcText;
                if (this.npcText != "") {
                    if (!this.contains(this.npcOverlay))
                        this.addChild(this.npcOverlay);
                    if (!this.contains(this.npcTf))
                        this.addChild(this.npcTf);
                }
                else {
                    if (this.contains(this.npcOverlay))
                        this.removeChild(this.npcOverlay);
                    if (this.contains(this.npcTf))
                        this.removeChild(this.npcTf);
                }
            }
            if (this.transitionText != this.transitionTf.innerText) {
                this.transitionTf.innerHTML = this.transitionText;
                if (this.transitionTf.innerHTML != "") {
                    if (!this.contains(this.transitionTf))
                        this.addChild(this.transitionTf);
                }
                else {
                    if (this.contains(this.transitionTf))
                        this.removeChild(this.transitionTf);
                }
            }
            if (this.statsTarget && this.statsTarget.thePlayer) {
                if (this.statsTarget.theBoss) {
                    if (this.bosshealth != this.statsTarget.theBoss.health) {
                        this.bosshealth = this.statsTarget.theBoss.health;
                        this.bosshealthTf.innerHTML = "BOSS: " + this.healthBar(this.bosshealth);
                    }
                }
                if (this.health != this.statsTarget.thePlayer.health) {
                    this.health = this.statsTarget.thePlayer.health;
                    this.healthTf.innerHTML = "HP: " + this.healthBar(this.health);
                }
                if ((this.score != this.statsTarget.thePlayer.score) || (this.lives != this.statsTarget.thePlayer.lives)) {
                    this.score = this.statsTarget.thePlayer.score;
                    this.lives = this.statsTarget.thePlayer.lives;
                    if (this.lives == -1)
                        this.scoreTf.innerHTML = this.scoreTf.innerHTML = 'SCORE: ' + this.pad0s(this.score) + '<br>' + 'GAME OVER';
                    else
                        this.scoreTf.innerHTML = 'SCORE: ' + this.pad0s(this.score) + '<br>' + this.lives + (this.lives != 1 ? ' LIVES' : ' LIFE') + ' LEFT';
                    if (this.score > this.highScore)
                        this.highScore = this.score;
                }
            }
            if (this.prevHighScore != this.highScore) {
                this.prevHighScore = this.highScore;
                this.highScoreTf.innerHTML = "HIGH SCORE: " + this.pad0s(this.highScore);
            }
        };
        GameGUI.prototype.onEnterFrame = function () {
            this.updateScore();
        };
        return GameGUI;
    })();
    shooter.GameGUI = GameGUI;
})(shooter || (shooter = {}));
var shooter;
(function (shooter) {
    var GameLevels = (function () {
        function GameLevels() {
            this.levelLength = 0;
            this.level0data = lib.FileLoader.getInstance().get("assets/level0.oel").responseText;
            this.level0terrain = lib.FileLoader.getInstance().get("assets/terrain0.oel").responseText;
            this.level1data = lib.FileLoader.getInstance().get("assets/level1.oel").responseText;
            this.level1terrain = lib.FileLoader.getInstance().get("assets/terrain1.oel").responseText;
            this.level2data = lib.FileLoader.getInstance().get("assets/level2.oel").responseText;
            this.level2terrain = lib.FileLoader.getInstance().get("assets/terrain2.oel").responseText;
            this.level3data = lib.FileLoader.getInstance().get("assets/level3.oel").responseText;
            this.level3terrain = lib.FileLoader.getInstance().get("assets/terrain3.oel").responseText;
            this.data = [];
        }
        GameLevels.prototype.stripTags = function (str) {
            var pattern = /<\/?[a-zA-Z0-9]+.*?>/gim;
            return str.replace(pattern, "");
        };
        GameLevels.prototype.parseLevelData = function (lvl) {
            var levelString;
            var temps;
            var nextValue;
            var output = [];
            var nextrow;
            this.levelLength = 0;
            switch (lvl) {
                case "level0":
                    levelString = this.stripTags(this.level0data);
                    break;
                case "terrain0":
                    levelString = this.stripTags(this.level0terrain);
                    break;
                case "level1":
                    levelString = this.stripTags(this.level1data);
                    break;
                case "terrain1":
                    levelString = this.stripTags(this.level1terrain);
                    break;
                case "level2":
                    levelString = this.stripTags(this.level2data);
                    break;
                case "terrain2":
                    levelString = this.stripTags(this.level2terrain);
                    break;
                case "level3":
                    levelString = this.stripTags(this.level3data);
                    break;
                case "terrain3":
                    levelString = this.stripTags(this.level3terrain);
                    break;
                default:
                    return output;
            }
            var lines = levelString.split(/\r\n|\n|\r/);
            for (var row = 0; row < lines.length; row++) {
                temps = lines[row].split(",");
                if (temps.length > 1) {
                    nextrow = output.push([]) - 1;
                    for (var col = 0; col < temps.length; col++) {
                        if (temps[col] == "")
                            temps[col] = "-1";
                        nextValue = parseInt(temps[col]);
                        if (nextValue < 0)
                            nextValue = -1;
                        if (col > this.levelLength)
                            this.levelLength = col;
                        output[nextrow].push(nextValue);
                    }
                }
            }
            return output;
        };
        GameLevels.prototype.loadLevel = function (lvl) {
            console.log("Loading level " + lvl);
            this.data = this.parseLevelData(lvl);
        };
        return GameLevels;
    })();
    shooter.GameLevels = GameLevels;
})(shooter || (shooter = {}));
var shooter;
(function (shooter) {
    var Entity = (function () {
        function Entity(gs, myManager) {
            this.name = "null";
            this.age = 0;
            this.fireTime = 0;
            this.fireDelayMin = 1;
            this.fireDelayMax = 6;
            this.pathNodeTime = 1;
            this.aiPathOffsetX = 0;
            this.aiPathOffsetY = 0;
            this.aiPathSize = 128;
            this.aiPathWaypointCount = 8;
            this.active = true;
            this.isBullet = false;
            this.leavesTrail = false;
            this.collidemode = 0;
            this.collideradius = 32;
            this.fadeAnim = 0;
            this.zoomAnim = 0;
            this.rotationSpeed = 0;
            this.recycled = false;
            this.health = 100;
            this.lives = 3;
            this.score = 0;
            this.level = 0;
            this.invulnerabilityTimeLeft = 0;
            this.invulnerabilitySecsWhenHit = 4;
            this.transitionTimeLeft = 0;
            this.transitionSeconds = 5;
            this.damage = 49;
            this.collidepoints = 25;
            this.isBoss = false;
            this.burstTimerStart = 0;
            this.burstTimerEnd = 0;
            this.burstPauseTime = 2;
            this.burstLength = 2;
            this.burstShootInterval = 0.2;
            this._sprite = gs;
            this.gfx = myManager;
            this._speedX = 0.0;
            this._speedY = 0.0;
            this.fireTime = (Math.random() * (this.fireDelayMax - this.fireDelayMin)) + this.fireDelayMin;
        }
        Entity.prototype.die = function () {
            this.active = false;
            this._sprite.visible = false;
            this.leavesTrail = false;
            this.isBullet = false;
            this.touching = null;
            this.owner = null;
            this.age = 0;
            this.collidemode = 0;
            this.isBoss = false;
        };
        Object.defineProperty(Entity.prototype, "speedX", {
            get: function () {
                return this._speedX;
            },
            set: function (sx) {
                this._speedX = sx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "speedY", {
            get: function () {
                return this._speedY;
            },
            set: function (sy) {
                this._speedY = sy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "sprite", {
            get: function () {
                return this._sprite;
            },
            set: function (gs) {
                this._sprite = gs;
            },
            enumerable: true,
            configurable: true
        });
        Entity.prototype.colliding = function (checkme) {
            if (this.collidemode == 1) {
                if (this.isCollidingSphere(checkme))
                    return checkme;
            }
            return null;
        };
        Entity.prototype.isCollidingSphere = function (checkme) {
            if (this == checkme)
                return false;
            if (!this.collidemode || !checkme.collidemode)
                return false;
            if (checkme.owner == this)
                return false;
            if (checkme.owner == this.owner)
                return false;
            if (this.collideradius == 0 || checkme.collideradius == 0)
                return false;
            if (((this.sprite.position.x - checkme.sprite.position.x) * (this.sprite.position.x - checkme.sprite.position.x) + (this.sprite.position.y - checkme.sprite.position.y) * (this.sprite.position.y - checkme.sprite.position.y)) <= (this.collideradius + checkme.collideradius) * (this.collideradius + checkme.collideradius)) {
                this.touching = checkme;
                return true;
            }
            return false;
        };
        Entity.prototype.spline = function (p0, p1, p2, p3, t) {
            var xx = 0.5 * ((2 * p1.x) + t * ((-p0.x + p2.x) + t * ((2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) + t * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x))));
            var yy = 0.5 * ((2 * p1.y) + t * ((-p0.y + p2.y) + t * ((2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) + t * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y))));
            return { x: xx, y: yy };
        };
        Entity.prototype.generatePath = function () {
            this.aiPathWaypoints = [];
            var N = this.aiPathWaypointCount;
            for (var i = 0; i < N; i++) {
                this.aiPathWaypoints.push({ x: this.aiPathSize * Math.random(), y: this.aiPathSize * Math.random() });
            }
        };
        Entity.prototype.calculatePathPosition = function (ratio) {
            if (ratio === void 0) { ratio = 0; }
            var i = Math.floor(ratio);
            var pointratio = ratio - i;
            var p0 = this.aiPathWaypoints[(i - 1 + this.aiPathWaypoints.length) % this.aiPathWaypoints.length];
            var p1 = this.aiPathWaypoints[i % this.aiPathWaypoints.length];
            var p2 = this.aiPathWaypoints[(i + 1 + this.aiPathWaypoints.length) % this.aiPathWaypoints.length];
            var p3 = this.aiPathWaypoints[(i + 2 + this.aiPathWaypoints.length) % this.aiPathWaypoints.length];
            var q = this.spline(p0, p1, p2, p3, pointratio);
            return q;
        };
        Entity.prototype.maybeShoot = function (bulletNum, delayMin, delayMax) {
            if (bulletNum === void 0) { bulletNum = 1; }
            if (delayMin === void 0) { delayMin = NaN; }
            if (delayMax === void 0) { delayMax = NaN; }
            if (this.fireTime < this.age) {
                if (isNaN(delayMin))
                    delayMin = this.fireDelayMin;
                if (isNaN(delayMax))
                    delayMax = this.fireDelayMax;
                this.gfx.shootBullet(bulletNum, this);
                this.fireTime = this.age + (Math.random() * (delayMax - delayMin)) + delayMin;
            }
        };
        Entity.prototype.straightAI = function (seconds) {
            this.age += seconds;
            this.maybeShoot(1);
            this.sprite.rotation = this.gfx.pointAtRad(this.speedX, this.speedY) - (90 * this.gfx.DEGREES_TO_RADIANS);
        };
        Entity.prototype.wobbleAI = function (seconds) {
            this.age += seconds;
            this.maybeShoot(1);
            this.aiPathOffsetY = (Math.sin(this.age * 2) / Math.PI) * 128;
        };
        Entity.prototype.sentryAI = function (seconds) {
            this.age += seconds;
            this.maybeShoot(2);
            if (this.gfx.thePlayer)
                this.sprite.rotation = this.gfx.pointAtRad(this.gfx.thePlayer.sprite.position.x - this.sprite.position.x, this.gfx.thePlayer.sprite.position.y - this.sprite.position.y) - (90 * this.gfx.DEGREES_TO_RADIANS);
        };
        Entity.prototype.droneAI = function (seconds) {
            this.age += seconds;
            this.maybeShoot(1);
            if (this.aiPathWaypoints == null)
                this.generatePath();
            var pathProgress = this.age / this.pathNodeTime;
            var newPos = this.calculatePathPosition(pathProgress);
            this.sprite.rotation = this.gfx.pointAtRad(newPos.x - this.aiPathOffsetX, newPos.y - this.aiPathOffsetY) - (90 * this.gfx.DEGREES_TO_RADIANS);
            this.aiPathOffsetX = newPos.x;
            this.aiPathOffsetY = newPos.x;
        };
        Entity.prototype.bossAI = function (seconds) {
            this.age += seconds;
            if (this.age > this.burstTimerStart) {
                if (this.age > this.burstTimerEnd) {
                    for (var deg = 0; deg < 20; deg++) {
                        this.gfx.shootBullet(1, this, deg * 18 * this.gfx.DEGREES_TO_RADIANS);
                    }
                    this.burstTimerStart = this.age + this.burstPauseTime;
                    this.burstTimerEnd = this.burstTimerStart + this.burstLength;
                }
                else {
                    this.maybeShoot(2, this.burstShootInterval, this.burstShootInterval);
                }
            }
            if (this.gfx.thePlayer) {
                this.sprite.rotation = this.gfx.pointAtRad(this.gfx.thePlayer.sprite.position.x - this.sprite.position.x, this.gfx.thePlayer.sprite.position.y - this.sprite.position.y) - (90 * this.gfx.DEGREES_TO_RADIANS);
                this.speedX = (this.gfx.thePlayer.sprite.position.x + 256 - this.sprite.position.x);
                this.aiPathOffsetY = (Math.sin(this.age) / Math.PI) * 256;
            }
        };
        return Entity;
    })();
    shooter.Entity = Entity;
})(shooter || (shooter = {}));
var shooter;
(function (shooter) {
    var GameParticles = (function () {
        function GameParticles(entityMan) {
            this.allParticles = [];
            this.gfx = entityMan;
        }
        GameParticles.prototype.addExplosion = function (pos) {
            this.addShockwave(pos);
            this.addDebris(pos, 6, 12);
            this.addFireball(pos);
            this.addBursts(pos, 10, 20);
            this.addSparks(pos, 8, 16);
        };
        GameParticles.prototype.addParticle = function (spr, x, y, startScale, spdX, spdY, startAlpha, rot, rotSpd, fadeSpd, zoomSpd) {
            if (startScale === void 0) { startScale = 0.01; }
            if (spdX === void 0) { spdX = 0; }
            if (spdY === void 0) { spdY = 0; }
            if (startAlpha === void 0) { startAlpha = 1; }
            if (rot === void 0) { rot = NaN; }
            if (rotSpd === void 0) { rotSpd = NaN; }
            if (fadeSpd === void 0) { fadeSpd = NaN; }
            if (zoomSpd === void 0) { zoomSpd = NaN; }
            if (isNaN(rot))
                rot = Math.random() * 360;
            if (isNaN(rotSpd))
                rotSpd = Math.random() * 360 - 180;
            if (isNaN(fadeSpd))
                fadeSpd = -1 * (Math.random() * 1 + 1);
            if (isNaN(zoomSpd))
                zoomSpd = Math.random() * 2 + 1;
            var anEntity;
            anEntity = this.gfx.respawn(spr);
            anEntity.sprite.position.x = x;
            anEntity.sprite.position.y = y;
            anEntity.speedX = spdX;
            anEntity.speedY = spdY;
            anEntity.sprite.rotation = rot * this.gfx.DEGREES_TO_RADIANS;
            anEntity.rotationSpeed = rotSpd * this.gfx.DEGREES_TO_RADIANS;
            anEntity.collidemode = 0;
            anEntity.fadeAnim = fadeSpd;
            anEntity.zoomAnim = zoomSpd;
            anEntity.sprite.scaleX = startScale;
            anEntity.sprite.scaleY = startScale;
            anEntity.sprite.alpha = startAlpha;
            if (!anEntity.recycled)
                this.allParticles.push(anEntity);
            return anEntity;
        };
        GameParticles.prototype.addFireball = function (pos) {
            this.addParticle(this.gfx.spritenumFireball, pos.x, pos.y, 0.01, 0, 0, 1, NaN, NaN, NaN, 4);
        };
        GameParticles.prototype.addShockwave = function (pos) {
            this.addParticle(this.gfx.spritenumShockwave, pos.x, pos.y, 0.01, 0, 0, 1, NaN, NaN, -3, 20);
        };
        GameParticles.prototype.addBursts = function (pos, mincount, maxcount) {
            var nextparticle = 0;
            var numparticles = Math.random() * mincount + (maxcount - mincount);
            for (nextparticle = 0; nextparticle < numparticles; nextparticle++) {
                this.addParticle(this.gfx.spritenumFireburst, pos.x + Math.random() * 16 - 8, pos.y + +Math.random() * 16 - 8, 0.02, Math.random() * 200 - 100, Math.random() * 200 - 100, 0.75);
            }
        };
        GameParticles.prototype.addSparks = function (pos, mincount, maxcount) {
            var nextparticle = 0;
            var numparticles = Math.random() * mincount + (maxcount - mincount);
            for (nextparticle = 0; nextparticle < numparticles; nextparticle++) {
                this.addParticle(this.gfx.spritenumSpark, pos.x, pos.y, 1, Math.random() * 320 - 160, Math.random() * 320 - 160, 1, NaN, NaN, 0, -1.5);
            }
        };
        GameParticles.prototype.addDebris = function (pos, mincount, maxcount) {
            var nextparticle = 0;
            var numparticles = Math.random() * mincount + (maxcount - mincount);
            for (nextparticle = 0; nextparticle < numparticles; nextparticle++) {
                this.addParticle(this.gfx.spritenumDebris, pos.x, pos.y, 1, Math.random() * 180 - 120, Math.random() * 180 - 90, 1, NaN, NaN, -1, 0);
            }
        };
        return GameParticles;
    })();
    shooter.GameParticles = GameParticles;
})(shooter || (shooter = {}));
var shooter;
(function (_shooter) {
    var EntityManager = (function () {
        function EntityManager(view) {
            this.bossDestroyedCallback = null;
            this.levelNum = 0;
            this.levelCurrentScrollX = 0;
            this.levelPrevCol = -1;
            this.levelTilesize = 48;
            this.cullingDistance = 200;
            this._SpritesPerRow = 8;
            this._SpritesPerCol = 8;
            this.defaultScale = 1.5;
            this.defaultSpeed = 160;
            this.playerBulletSpeed = 300;
            this.enemyBulletSpeed = 200;
            this.bulletScale = 1;
            this.bulletSpeed = 250;
            this.currentFrameSeconds = 0;
            this.spritenumFireball = 63;
            this.spritenumFireburst = 62;
            this.spritenumShockwave = 61;
            this.spritenumDebris = 60;
            this.spritenumSpark = 59;
            this.spritenumBullet3 = 58;
            this.spritenumBullet2 = 57;
            this.spritenumBullet1 = 56;
            this.spritenumPlayer = 10;
            this.spritenumOrb = 17;
            this.DEGREES_TO_RADIANS = Math.PI / 180;
            this.RADIANS_TO_DEGREES = 180 / Math.PI;
            this.numCreated = 0;
            this.numReused = 0;
            this.sourceImage = "assets/sprites.png";
            this.levelTopOffset = 0;
            this._entityPool = [];
            this.allBullets = [];
            this.allEnemies = [];
            this.particles = new _shooter.GameParticles(this);
            this.setPosition(view);
            this.level = new shooter.GameLevels();
        }
        EntityManager.prototype.setPosition = function (view) {
            this.maxX = view.width + this.cullingDistance;
            this.minX = view.x - this.cullingDistance;
            this.maxY = view.height + this.cullingDistance;
            this.minY = view.y - this.cullingDistance;
            this.midpoint = view.height / 2;
            this.levelTopOffset = this.midpoint - 200;
        };
        EntityManager.prototype.createBatch = function (context3D, SpritesPerRow, SpritesPerCol, uvPadding) {
            if (SpritesPerRow === void 0) { SpritesPerRow = 8; }
            if (SpritesPerCol === void 0) { SpritesPerCol = 8; }
            if (uvPadding === void 0) { uvPadding = 0; }
            var sourceBitmap = lib.ImageLoader.getInstance().get(this.sourceImage);
            this._spriteSheet = new GPUSprite.SpriteSheet(stageJS.BitmapData.fromImageElement(sourceBitmap), SpritesPerRow, SpritesPerCol, uvPadding);
            this._batch = new GPUSprite.SpriteRenderLayer(context3D, this._spriteSheet);
            return this._batch;
        };
        EntityManager.prototype.respawn = function (sprID) {
            if (sprID === void 0) { sprID = 0; }
            var currentEntityCount = this._entityPool.length;
            var anEntity;
            for (var i = 0; i < currentEntityCount; i++) {
                anEntity = this._entityPool[i];
                if (!anEntity.active && (anEntity.sprite.spriteId == sprID)) {
                    anEntity.active = true;
                    anEntity.sprite.visible = true;
                    anEntity.recycled = true;
                    anEntity.age = 0;
                    anEntity.burstTimerStart = 0;
                    anEntity.burstTimerEnd = 0;
                    anEntity.fireTime = 0;
                    this.numReused++;
                    return anEntity;
                }
            }
            var sprite;
            sprite = this._batch.createChild(sprID);
            anEntity = new _shooter.Entity(sprite, this);
            anEntity.age = 0;
            anEntity.burstTimerStart = 0;
            anEntity.burstTimerEnd = 0;
            anEntity.fireTime = 0;
            this._entityPool.push(anEntity);
            this.numCreated++;
            return anEntity;
        };
        EntityManager.prototype.addPlayer = function (playerController) {
            this.thePlayer = this.respawn(this.spritenumPlayer);
            this.thePlayer.sprite.position.x = 64;
            this.thePlayer.sprite.position.y = this.midpoint;
            this.thePlayer.sprite.rotation = 180 * this.DEGREES_TO_RADIANS;
            this.thePlayer.sprite.scaleX = this.thePlayer.sprite.scaleY = this.defaultScale;
            this.thePlayer.speedX = 0;
            this.thePlayer.speedY = 0;
            this.thePlayer.active = true;
            this.thePlayer.collidemode = 1;
            this.thePlayer.collideradius = 10;
            this.thePlayer.owner = this.thePlayer;
            this.thePlayer.aiFunction = playerController;
            this.thePlayer.name = "thePlayer";
            this.theOrb = this.respawn(this.spritenumOrb);
            this.theOrb.rotationSpeed = 720 * this.DEGREES_TO_RADIANS;
            this.theOrb.sprite.scaleX = this.theOrb.sprite.scaleY = this.defaultScale / 2;
            this.theOrb.leavesTrail = true;
            this.theOrb.collidemode = 1;
            this.theOrb.collideradius = 12;
            this.theOrb.isBullet = true;
            this.theOrb.owner = this.thePlayer;
            this.theOrb.orbiting = this.thePlayer;
            this.theOrb.orbitingDistance = 180;
            this.theOrb.name = "theOrb";
            return this.thePlayer;
        };
        EntityManager.prototype.shootBullet = function (powa, shooter, angle) {
            if (powa === void 0) { powa = 1; }
            if (shooter === void 0) { shooter = null; }
            if (angle === void 0) { angle = NaN; }
            if (this.thePlayer == null)
                return null;
            if (shooter == null) {
                if (powa == 3)
                    shooter = this.thePlayer;
                else {
                    console.warn("what's wrong?");
                    return null;
                }
            }
            var theBullet;
            if (powa == 1)
                theBullet = this.respawn(this.spritenumBullet1);
            else if (powa == 2)
                theBullet = this.respawn(this.spritenumBullet2);
            else
                theBullet = this.respawn(this.spritenumBullet3);
            theBullet.name = "bullet";
            theBullet.sprite.position.x = shooter.sprite.position.x + 8;
            theBullet.sprite.position.y = shooter.sprite.position.y + 2;
            theBullet.sprite.scaleX = theBullet.sprite.scaleY = this.bulletScale;
            if (shooter == this.thePlayer) {
                theBullet.speedX = this.playerBulletSpeed;
                theBullet.speedY = 0;
            }
            else {
                if (isNaN(angle)) {
                    theBullet.sprite.rotation = this.pointAtRad(theBullet.sprite.position.x - this.thePlayer.sprite.position.x, theBullet.sprite.position.y - this.thePlayer.sprite.position.y) - (90 * this.DEGREES_TO_RADIANS);
                }
                else {
                    theBullet.sprite.rotation = angle;
                }
                theBullet.speedX = this.enemyBulletSpeed * Math.cos(theBullet.sprite.rotation);
                theBullet.speedY = this.enemyBulletSpeed * Math.sin(theBullet.sprite.rotation);
            }
            theBullet.owner = shooter;
            theBullet.collideradius = 10;
            theBullet.collidemode = 1;
            theBullet.isBullet = true;
            if (!theBullet.recycled)
                this.allBullets.push(theBullet);
            return theBullet;
        };
        EntityManager.prototype.addRandomEntity = function () {
            var anEntity;
            var randomSpriteID = Math.floor(Math.random() * 55);
            anEntity = this.respawn(randomSpriteID);
            anEntity.sprite.position.x = this.maxX;
            anEntity.sprite.position.y = Math.random() * this.maxY;
            anEntity.speedX = 15 * ((-1 * Math.random() * 10) - 2);
            anEntity.speedY = 15 * ((Math.random() * 5) - 2.5);
            anEntity.sprite.scaleX = this.defaultScale;
            anEntity.sprite.scaleY = this.defaultScale;
            anEntity.sprite.rotation = this.pointAtRad(anEntity.speedX, anEntity.speedY) - (90 * this.DEGREES_TO_RADIANS);
            anEntity.collidemode = 1;
            anEntity.collideradius = 16;
            anEntity.name = "randomEnemy";
            if (!anEntity.recycled)
                this.allEnemies.push(anEntity);
        };
        EntityManager.prototype.pointAngle = function (point1, point2) {
            var dx = point2.x - point1.x;
            var dy = point2.y - point1.y;
            return -Math.atan2(dx, dy);
        };
        EntityManager.prototype.pointAtDeg = function (x, y) {
            return -Math.atan2(x, y) * this.RADIANS_TO_DEGREES;
        };
        EntityManager.prototype.pointAtRad = function (x, y) {
            return -Math.atan2(x, y);
        };
        EntityManager.prototype.checkCollisions = function (checkMe) {
            if (!this.thePlayer)
                return null;
            var anEntity;
            var collided = false;
            if (checkMe.owner != this.thePlayer) {
                anEntity = this.thePlayer;
                if (checkMe.colliding(anEntity)) {
                    collided = true;
                }
            }
            else {
                for (var i = 0; i < this.allEnemies.length; i++) {
                    anEntity = this.allEnemies[i];
                    if (anEntity.active && anEntity.collidemode) {
                        if (checkMe.colliding(anEntity)) {
                            collided = true;
                            if (this.thePlayer.sprite.visible)
                                this.thePlayer.score += anEntity.collidepoints;
                            break;
                        }
                    }
                }
            }
            if (collided) {
                if ((anEntity == this.thePlayer) || (checkMe == this.thePlayer)) {
                    if (this.thePlayer.invulnerabilityTimeLeft <= 0) {
                        this.thePlayer.health -= anEntity.damage;
                        this.thePlayer.invulnerabilityTimeLeft = this.thePlayer.invulnerabilitySecsWhenHit;
                        var explosionPos = { x: 0, y: 0 };
                        for (var numExplosions = 0; numExplosions < 6; numExplosions++) {
                            explosionPos.x = this.thePlayer.sprite.position.x + Math.random() * 64 - 32;
                            explosionPos.y = this.thePlayer.sprite.position.y + Math.random() * 64 - 32;
                            this.particles.addExplosion(explosionPos);
                        }
                        if (this.thePlayer.health > 0) {
                            console.log("Player was HIT!");
                        }
                        else {
                            console.log('Player was HIT... and DIED!');
                            this.thePlayer.lives--;
                            this.thePlayer.invulnerabilityTimeLeft = this.thePlayer.invulnerabilitySecsWhenHit + this.thePlayer.transitionSeconds;
                            this.thePlayer.transitionTimeLeft = this.thePlayer.transitionSeconds;
                        }
                    }
                    else {
                        collided = false;
                    }
                }
                if (collided) {
                    this.particles.addExplosion(checkMe.sprite.position);
                    if (anEntity == this.theBoss) {
                        this.theBoss.health -= 2;
                        this.theBoss.sprite.position.x += 8;
                        if (this.theBoss.health < 1) {
                            this.particles.addParticle(this.spritenumShockwave, this.theBoss.sprite.position.x, this.theBoss.sprite.position.y, 0.01, 0, 0, 1, NaN, NaN, -1, 30);
                            var bossexpPos = { x: 0, y: 0 };
                            for (var bossnumExps = 0; bossnumExps < 6; bossnumExps++) {
                                bossexpPos.x = this.theBoss.sprite.position.x + Math.random() * 128 - 64;
                                bossexpPos.y = this.theBoss.sprite.position.y + Math.random() * 128 - 64;
                                this.particles.addExplosion(bossexpPos);
                            }
                            this.theBoss.die();
                            this.theBoss = null;
                            if (this.bossDestroyedCallback != null)
                                this.bossDestroyedCallback();
                        }
                    }
                    else if ((anEntity != this.theOrb) && (anEntity != this.thePlayer))
                        anEntity.die();
                    if ((checkMe != this.theOrb) && ((checkMe != this.thePlayer)))
                        checkMe.die();
                    return anEntity;
                }
            }
            return null;
        };
        EntityManager.prototype.update = function (currentTime) {
            var anEntity;
            this.currentFrameSeconds = currentTime / 1000;
            var max = this._entityPool.length;
            for (var i = 0; i < max; i++) {
                anEntity = this._entityPool[i];
                if (anEntity.active) {
                    anEntity.sprite.position.x -= anEntity.aiPathOffsetX;
                    anEntity.sprite.position.y -= anEntity.aiPathOffsetY;
                    anEntity.sprite.position.x += anEntity.speedX * this.currentFrameSeconds;
                    anEntity.sprite.position.y += anEntity.speedY * this.currentFrameSeconds;
                    if (anEntity.aiFunction != null)
                        anEntity.aiFunction(this.currentFrameSeconds);
                    anEntity.sprite.position.x += anEntity.aiPathOffsetX;
                    anEntity.sprite.position.y += anEntity.aiPathOffsetY;
                    if (anEntity.collidemode)
                        this.checkCollisions(anEntity);
                    if (anEntity.orbiting != null) {
                        anEntity.sprite.position.x = anEntity.orbiting.sprite.position.x + ((Math.sin(anEntity.sprite.rotation / 4) / Math.PI) * anEntity.orbitingDistance);
                        anEntity.sprite.position.y = anEntity.orbiting.sprite.position.y - ((Math.cos(anEntity.sprite.rotation / 4) / Math.PI) * anEntity.orbitingDistance);
                    }
                    if (anEntity.leavesTrail) {
                        if (anEntity == this.theOrb) {
                            if (this.theOrb.sprite.visible)
                                this.particles.addParticle(63, anEntity.sprite.position.x, anEntity.sprite.position.y, 0.25, 0, 0, 0.6, NaN, NaN, -1.5, -1);
                        }
                        else
                            this.particles.addParticle(63, anEntity.sprite.position.x + 12, anEntity.sprite.position.y + 2, 0.5, 3, 0, 0.6, NaN, NaN, -1.5, -1);
                    }
                    if ((anEntity.sprite.position.x > this.maxX) || (anEntity.sprite.position.x < this.minX) || (anEntity.sprite.position.y > this.maxY) || (anEntity.sprite.position.y < this.minY)) {
                        if ((anEntity != this.thePlayer) && (anEntity != this.theOrb))
                            anEntity.die();
                    }
                    if (anEntity.rotationSpeed != 0)
                        anEntity.sprite.rotation += anEntity.rotationSpeed * this.currentFrameSeconds;
                    if (anEntity.fadeAnim != 0) {
                        anEntity.sprite.alpha += anEntity.fadeAnim * this.currentFrameSeconds;
                        if (anEntity.sprite.alpha <= 0.001) {
                            anEntity.die();
                        }
                        else if (anEntity.sprite.alpha > 1) {
                            anEntity.sprite.alpha = 1;
                        }
                    }
                    if (anEntity.zoomAnim != 0) {
                        anEntity.sprite.scaleX += anEntity.zoomAnim * this.currentFrameSeconds;
                        anEntity.sprite.scaleY += anEntity.zoomAnim * this.currentFrameSeconds;
                        if (anEntity.sprite.scaleX < 0 || anEntity.sprite.scaleY < 0)
                            anEntity.die();
                    }
                }
            }
        };
        EntityManager.prototype.killEmAll = function () {
            var anEntity;
            var i;
            var max;
            max = this._entityPool.length;
            for (i = 0; i < max; i++) {
                anEntity = this._entityPool[i];
                if ((anEntity != this.thePlayer) && (anEntity != this.theOrb))
                    anEntity.die();
            }
        };
        EntityManager.prototype.changeLevels = function (lvl) {
            this.killEmAll();
            this.level.loadLevel(lvl);
            this.levelCurrentScrollX = 0;
            this.levelPrevCol = -1;
            this.lastTerrainEntity = null;
        };
        EntityManager.prototype.streamLevelEntities = function (theseAreEnemies) {
            if (theseAreEnemies === void 0) { theseAreEnemies = false; }
            var anEntity;
            var sprID;
            this.levelCurrentScrollX += this.defaultSpeed * this.currentFrameSeconds;
            if (this.levelCurrentScrollX >= this.levelTilesize) {
                this.levelCurrentScrollX = 0;
                this.levelPrevCol++;
                var currentLevelXCoord;
                if (this.lastTerrainEntity && !theseAreEnemies)
                    currentLevelXCoord = this.lastTerrainEntity.sprite.position.x + this.levelTilesize;
                else
                    currentLevelXCoord = this.maxX;
                var rows = this.level.data.length;
                if (this.level.data && this.level.data.length) {
                    for (var row = 0; row < rows; row++) {
                        if (this.level.data[row].length > this.levelPrevCol) {
                            sprID = this.level.data[row][this.levelPrevCol];
                            if (sprID > -1) {
                                anEntity = this.respawn(sprID);
                                anEntity.sprite.position.x = currentLevelXCoord;
                                anEntity.sprite.position.y = (row * this.levelTilesize) + (this.levelTilesize / 2) + this.levelTopOffset;
                                anEntity.speedX = -this.defaultSpeed;
                                anEntity.speedY = 0;
                                anEntity.sprite.scaleX = this.defaultScale;
                                anEntity.sprite.scaleY = this.defaultScale;
                                anEntity.name = "tile";
                                if (theseAreEnemies) {
                                    anEntity.name = "tile_enemy";
                                    switch (sprID) {
                                        case 1:
                                        case 2:
                                        case 3:
                                        case 4:
                                        case 5:
                                        case 6:
                                        case 7:
                                            anEntity.speedX = 15 * ((-1 * Math.random() * 10) - 2);
                                            anEntity.speedY = 15 * ((Math.random() * 5) - 2.5);
                                            anEntity.aiFunction = anEntity.straightAI;
                                            break;
                                        case 8:
                                        case 9:
                                        case 10:
                                        case 11:
                                        case 12:
                                        case 13:
                                        case 14:
                                        case 15:
                                            anEntity.aiFunction = anEntity.wobbleAI;
                                            break;
                                        case 16:
                                        case 24:
                                            anEntity.aiFunction = anEntity.sentryAI;
                                            anEntity.speedX = -90;
                                            break;
                                        case 17:
                                        case 18:
                                        case 19:
                                        case 20:
                                        case 21:
                                        case 22:
                                        case 23:
                                            anEntity.speedX = 15 * ((-1 * Math.random() * 10) - 2);
                                            anEntity.speedY = 15 * ((Math.random() * 5) - 2.5);
                                            anEntity.aiFunction = anEntity.wobbleAI;
                                            break;
                                        case 32:
                                        case 40:
                                        case 48:
                                            anEntity.aiFunction = null;
                                            anEntity.rotationSpeed = Math.random() * 8 - 4;
                                            anEntity.speedY = Math.random() * 64 - 32;
                                            break;
                                        default:
                                            anEntity.aiFunction = anEntity.droneAI;
                                            break;
                                    }
                                    anEntity.sprite.rotation = this.pointAtRad(anEntity.speedX, anEntity.speedY) - (90 * this.DEGREES_TO_RADIANS);
                                    anEntity.collidemode = 1;
                                    anEntity.collideradius = 16;
                                    if (!anEntity.recycled)
                                        this.allEnemies.push(anEntity);
                                }
                            }
                        }
                    }
                }
                if (!theseAreEnemies)
                    this.lastTerrainEntity = anEntity;
            }
        };
        return EntityManager;
    })();
    _shooter.EntityManager = EntityManager;
})(shooter || (shooter = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var shooter;
(function (shooter) {
    var GameBackground = (function (_super) {
        __extends(GameBackground, _super);
        function GameBackground(view) {
            _super.call(this, view);
            this.bgSpeed = -1;
            this.bgSpritesPerRow = 1;
            this.bgSpritesPerCol = 1;
            this.yParallaxAmount = 128;
            this.yOffset = 0;
            this.bgSourceImage = "assets/stars.gif";
        }
        GameBackground.prototype.createBatch = function (context3D) {
            var bgsourceBitmap = lib.ImageLoader.getInstance().get(this.bgSourceImage);
            this._spriteSheet = new GPUSprite.SpriteSheet(stageJS.BitmapData.fromImageElement(bgsourceBitmap), this.bgSpritesPerRow, this.bgSpritesPerCol);
            this._batch = new GPUSprite.SpriteRenderLayer(context3D, this._spriteSheet);
            return this._batch;
        };
        GameBackground.prototype.setPosition = function (view) {
            this.maxX = 256 + 512 + 512 + 512 + 512;
            this.minX = -256;
            this.maxY = view.height;
            this.minY = view.y;
            this.yParallaxAmount = 128;
            this.yOffset = (this.maxY / 2) + (-1 * this.yParallaxAmount * 0.5);
        };
        GameBackground.prototype.initBackground = function () {
            var anEntity1 = this.respawn(0);
            anEntity1.sprite.position.x = 256;
            anEntity1.sprite.position.y = this.maxY / 2;
            anEntity1.speedX = this.bgSpeed;
            var anEntity2 = this.respawn(0);
            anEntity2.sprite.position.x = 256 + 512;
            anEntity2.sprite.position.y = this.maxY / 2;
            anEntity2.speedX = this.bgSpeed;
            var anEntity3 = this.respawn(0);
            anEntity3.sprite.position.x = 256 + 512 + 512;
            anEntity3.sprite.position.y = this.maxY / 2;
            anEntity3.speedX = this.bgSpeed;
            var anEntity4 = this.respawn(0);
            anEntity4.sprite.position.x = 256 + 512 + 512 + 512;
            anEntity4.sprite.position.y = this.maxY / 2;
            anEntity4.speedX = this.bgSpeed;
            var anEntity5 = this.respawn(0);
            anEntity5.sprite.position.x = 256 + 512 + 512 + 512 + 512;
            anEntity5.sprite.position.y = this.maxY / 2;
            anEntity5.speedX = this.bgSpeed;
            var anEntity1a = this.respawn(0);
            anEntity1a.sprite.position.x = 256;
            anEntity1a.sprite.position.y = this.maxY / 2 + 512;
            anEntity1a.speedX = this.bgSpeed;
            var anEntity2a = this.respawn(0);
            anEntity2a.sprite.position.x = 256 + 512;
            anEntity2a.sprite.position.y = this.maxY / 2 + 512;
            anEntity2a.speedX = this.bgSpeed;
            var anEntity3a = this.respawn(0);
            anEntity3a.sprite.position.x = 256 + 512 + 512;
            anEntity3a.sprite.position.y = this.maxY / 2 + 512;
            anEntity3a.speedX = this.bgSpeed;
            var anEntity4a = this.respawn(0);
            anEntity4a.sprite.position.x = 256 + 512 + 512 + 512;
            anEntity4a.sprite.position.y = this.maxY / 2 + 512;
            anEntity4a.speedX = this.bgSpeed;
            var anEntity5a = this.respawn(0);
            anEntity5a.sprite.position.x = 256 + 512 + 512 + 512 + 512;
            anEntity5a.sprite.position.y = this.maxY / 2 + 512;
            anEntity5a.speedX = this.bgSpeed;
            var anEntity1b = this.respawn(0);
            anEntity1b.sprite.position.x = 256;
            anEntity1b.sprite.position.y = this.maxY / 2 - 512;
            anEntity1b.speedX = this.bgSpeed;
            var anEntity2b = this.respawn(0);
            anEntity2b.sprite.position.x = 256 + 512;
            anEntity2b.sprite.position.y = this.maxY / 2 - 512;
            anEntity2b.speedX = this.bgSpeed;
            var anEntity3b = this.respawn(0);
            anEntity3b.sprite.position.x = 256 + 512 + 512;
            anEntity3b.sprite.position.y = this.maxY / 2 - 512;
            anEntity3b.speedX = this.bgSpeed;
            var anEntity4b = this.respawn(0);
            anEntity4b.sprite.position.x = 256 + 512 + 512 + 512;
            anEntity4b.sprite.position.y = this.maxY / 2 - 512;
            anEntity4b.speedX = this.bgSpeed;
            var anEntity5b = this.respawn(0);
            anEntity5b.sprite.position.x = 256 + 512 + 512 + 512 + 512;
            anEntity5b.sprite.position.y = this.maxY / 2 - 512;
            anEntity5b.speedX = this.bgSpeed;
        };
        GameBackground.prototype.yParallax = function (OffsetPercent) {
            if (OffsetPercent === void 0) { OffsetPercent = 0; }
            this.yOffset = (this.maxY * 0.5) - this.yParallaxAmount * (OffsetPercent);
        };
        GameBackground.prototype.update = function (currentTime) {
            var anEntity;
            for (var i = 0; i < this._entityPool.length; i++) {
                anEntity = this._entityPool[i];
                if (anEntity.active) {
                    anEntity.sprite.position.x += anEntity.speedX;
                    anEntity.sprite.position.y = this.yOffset;
                    if (i > 9)
                        anEntity.sprite.position.y += 512;
                    else if (i > 4)
                        anEntity.sprite.position.y -= 512;
                    if (anEntity.sprite.position.x >= this.maxX) {
                        anEntity.sprite.position.x = this.minX;
                    }
                    else if (anEntity.sprite.position.x <= this.minX) {
                        anEntity.sprite.position.x = this.maxX;
                    }
                }
            }
        };
        return GameBackground;
    })(shooter.EntityManager);
    shooter.GameBackground = GameBackground;
})(shooter || (shooter = {}));
var shooter;
(function (shooter) {
    var ShooterMain = (function () {
        function ShooterMain(canvas) {
            var _this = this;
            this.enableFullscreen = true;
            this.enableAutofire = true;
            this.timeDilation = 1;
            this.nothingPressedLastFrame = false;
            this.currentTime = 0;
            this.currentFrameMs = 0;
            this.previousFrameTime = 0;
            this.playerSpeed = 180;
            this.nextFireTime = 0;
            this.fireDelay = 200;
            this._state = 0;
            this.onContext3DCreate = function (e) {
                _this.context3D = _this.stage3d.context3D;
                _this.initSpriteEngine();
            };
            this.bossSpriteID = 0;
            this.bossComplete = function () {
                _this.thePlayer.score += 1000;
                if (_this._gui.contains(_this._gui.bosshealthTf))
                    _this._gui.removeChild(_this._gui.bosshealthTf);
                _this._entities.theBoss = null;
                _this._state -= 999;
                _this.thePlayer.transitionTimeLeft = _this.thePlayer.transitionSeconds;
            };
            this.currentTransitionSeconds = 0;
            this.playerLogic = function (seconds) {
                var me = _this.thePlayer;
                me.age += seconds;
                _this.handleTransitions(seconds);
                me.speedY = me.speedX = 0;
                if (_this._state == 0)
                    return;
                if (_this._controls.pressing.up)
                    me.speedY = -_this.playerSpeed;
                if (_this._controls.pressing.down)
                    me.speedY = _this.playerSpeed;
                if (_this._controls.pressing.left)
                    me.speedX = -_this.playerSpeed;
                if (_this._controls.pressing.right)
                    me.speedX = _this.playerSpeed;
                if (_this._controls.pressing.fire && (_this.thePlayer.health > 0)) {
                    if (_this.currentTime >= _this.nextFireTime) {
                        _this.nextFireTime = _this.currentTime + _this.fireDelay;
                        _this._entities.shootBullet(3, me);
                    }
                }
                if (me.sprite.position.x < 0)
                    me.sprite.position.x = 0;
                if (me.sprite.position.x > _this.stage3d.stageWidth)
                    me.sprite.position.x = _this.stage3d.stageWidth;
                if (me.sprite.position.y < 0)
                    me.sprite.position.y = 0;
                if (me.sprite.position.y > _this.stage3d.stageHeight)
                    me.sprite.position.y = _this.stage3d.stageHeight;
                _this._entities.particles.addParticle(63, me.sprite.position.x - 12, me.sprite.position.y + 2, 0.75, -200, 0, 0.4, NaN, NaN, -1, -1.5);
                if (me.health < 10)
                    _this._entities.particles.addSparks(me.sprite.position, 1, 2);
                if (_this.thePlayer.invulnerabilityTimeLeft > 0) {
                    _this.thePlayer.invulnerabilityTimeLeft -= seconds;
                    if (_this.thePlayer.invulnerabilityTimeLeft <= 0) {
                        console.log("Invulnerability wore off.");
                        _this.thePlayer.sprite.alpha = 1;
                    }
                    else {
                        _this.thePlayer.sprite.alpha = Math.sin(_this.thePlayer.age * 30) / Math.PI + 0.25;
                    }
                }
            };
            this.onEnterFrame = function () {
                _this.checkResize();
                _this.stats.begin();
                _this.currentTime = _this.getTimer();
                _this.currentFrameMs = (_this.currentTime - _this.previousFrameTime) * _this.timeDilation;
                _this.previousFrameTime = _this.currentTime;
                _this.context3D.clear(0, 0, 0, 1);
                _this.processInput();
                if (_this._entities.thePlayer)
                    _this._bg.yParallax(_this._entities.thePlayer.sprite.position.y / _this.stage3d.stageHeight);
                _this._bg.update(_this.currentTime);
                if (_this._state == 0)
                    _this._mainmenu.update(_this.currentTime);
                _this._terrain.update(_this.currentFrameMs);
                _this._entities.update(_this.currentFrameMs);
                _this._terrain.streamLevelEntities(false);
                _this._entities.streamLevelEntities(true);
                _this._spriteStage.drawDeferred();
                _this.context3D.present();
                _this.checkPlayerState();
                _this.checkMapState();
                if (_this._gui)
                    _this._gui.onEnterFrame();
                _this.stats.end();
                requestAnimationFrame(_this.onEnterFrame);
            };
            this.stage3d = new stageJS.Stage3D(canvas);
            this.stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, this.onContext3DCreate);
            this.stage3d.requestContext3D();
        }
        ShooterMain.prototype.checkResize = function () {
            var canvas = ShooterMain.canvas;
            var displayWidth = canvas.clientWidth;
            var displayHeight = canvas.clientHeight;
            if (canvas.width != displayWidth || canvas.height != displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
                this.onResize();
            }
        };
        ShooterMain.prototype.onResize = function () {
            console.log("onResize:", ShooterMain.canvas.width, ShooterMain.canvas.height);
            var view = { x: 0, y: 0, width: ShooterMain.canvas.width, height: ShooterMain.canvas.height };
            if (this._spriteStage != null)
                this._spriteStage.position = view;
            if (this._terrain != null)
                this._terrain.setPosition(view);
            if (this._entities != null)
                this._entities.setPosition(view);
            if (this._mainmenu != null)
                this._mainmenu.setPosition(view);
            if (this._bg != null)
                this._bg.setPosition(view);
            if (this._gui != null)
                this._gui.setPosition(view);
        };
        ShooterMain.prototype.initSpriteEngine = function () {
            var _this = this;
            this._start = new Date().valueOf();
            this.initStats();
            this._controls = new shooter.GameControls(window);
            var _width = this.stage3d.stageWidth;
            var _height = this.stage3d.stageHeight;
            var stageRect = new GPUSprite.Rectangle(0, 0, _width, _height);
            this._spriteStage = new GPUSprite.SpriteRenderStage(this.stage3d, this.context3D, stageRect);
            this._spriteStage.configureBackBuffer(_width, _height);
            this._bg = new shooter.GameBackground(stageRect);
            var batch = this._bg.createBatch(this.context3D);
            this._bg.initBackground();
            this._spriteStage.addLayer(batch, "bg");
            this._terrain = new shooter.EntityManager(stageRect);
            this._terrain.sourceImage = "assets/terrain.png";
            this._terrain.defaultSpeed = 90;
            this._terrain.defaultScale = 1.5;
            this._terrain.levelTilesize = 48;
            batch = this._terrain.createBatch(this.context3D, 16, 16, 0.002);
            this._spriteStage.addLayer(batch, "terrain");
            this._terrain.changeLevels("terrain" + this._state);
            this._entities = new shooter.EntityManager(stageRect);
            this._entities.sourceImage = "assets/sprites.png";
            this._entities.defaultScale = 1.5;
            this._entities.levelTilesize = 48;
            batch = this._entities.createBatch(this.context3D, 8, 8, 0.0015);
            this._spriteStage.addLayer(batch, "entities");
            this._entities.changeLevels("level" + this._state);
            this._entities.streamLevelEntities(true);
            this._mainmenu = new shooter.GameMenu(stageRect);
            batch = this._mainmenu.createBatch(this.context3D);
            this._spriteStage.addLayer(batch);
            this._gui = new shooter.GameGUI();
            this._gui.statsTarget = this._entities;
            this.saved = new shooter.GameSaves();
            this._gui.highScore = this.saved.score;
            this._gui.level = this.saved.level;
            ShooterMain.canvas.onmousedown = function (ev) {
                if (_this._state == 0) {
                    if (_this._mainmenu && _this._mainmenu.activateCurrentMenuItem(_this.getTimer())) {
                        _this.startGame();
                    }
                }
            };
            ShooterMain.canvas.onmousemove = function (ev) {
                if (_this._state == 0) {
                    if (_this._mainmenu)
                        _this._mainmenu.mouseHighlight(ev.clientX, ev.clientY);
                }
            };
            this.checkResize();
            this.onEnterFrame();
        };
        ShooterMain.prototype.bossBattle = function () {
            console.log("Boss battle begins!");
            if (!this.bossSpriteID)
                this.bossSpriteID = this._entities._spriteSheet.defineSprite(160, 128, 96, 96);
            var anEntity;
            anEntity = this._entities.respawn(this.bossSpriteID);
            anEntity.sprite.position.x = this.stage3d.stageWidth + 64;
            anEntity.sprite.position.y = this.stage3d.stageHeight / 2;
            anEntity.sprite.scaleX = anEntity.sprite.scaleY = 2;
            anEntity.aiFunction = anEntity.bossAI;
            anEntity.isBoss = true;
            anEntity.collideradius = 96;
            anEntity.collidemode = 1;
            this._gui.addChild(this._gui.bosshealthTf);
            anEntity.health = 100;
            if (!anEntity.recycled)
                this._entities.allEnemies.push(anEntity);
            this._entities.theBoss = anEntity;
            this._entities.bossDestroyedCallback = this.bossComplete;
        };
        ShooterMain.prototype.handleTransitions = function (seconds) {
            if (this.thePlayer.transitionTimeLeft > 0) {
                this.currentTransitionSeconds += seconds;
                this.thePlayer.transitionTimeLeft -= seconds;
                if (this.thePlayer.transitionTimeLeft > 0) {
                    if (this.thePlayer.level != this._state && this._state < 1000) {
                        if (this._state == -1) {
                            this._gui.transitionText = "<br><br><br><br><br><br>CONGRATULATIONS<br><br>" + "You fought bravely and defended<br>" + "the universe from certain doom.<br><br>You got to level " + this.thePlayer.level + "<br>with " + this.thePlayer.score + " points." + "<br><br>CREDITS:<br><br>Programming: McFunkypants<br>(mcfunkypants.com)<br><br>" + "Art: Daniel Cook<br>(lostgarden.com)<br><br>" + "Music: MaF<br>(maf464.com)<br><br>" + "Thanks for playing!";
                            console.log("thanks for playing");
                            this.timeDilation = 0.5;
                            this._gui.npcText = "You saved us!<br>Thank you!<br>My hero!";
                        }
                        else if (this._state == 0) {
                            this._gui.transitionText = "GAME OVER<br>You got to level " + this.thePlayer.level + "<br>with " + this.thePlayer.score + " points.";
                            this._gui.npcText = "You were incredible.<br>There were simply too many of them.<br>You'll win next time. I know it.";
                            this.timeDilation = 0.5;
                        }
                        else if (this._state > 1) {
                            this._gui.transitionText = "<br>LEVEL " + (this._state - 1) + " COMPLETE!";
                            this._gui.npcText = "That was amazing!<br>You destroyed it!<br>Your skill is legendary.";
                        }
                        else {
                            this._gui.transitionText = "<br>LEVEL " + this._state;
                            this._gui.npcText = "We're under attack! Please help us!<br>You're our only hope for survival.<br>Use the arrow keys to move.";
                        }
                    }
                    else {
                        if ((this._state > 1000) && (this.thePlayer.health > 0)) {
                            this._gui.transitionText = "<br>INCOMING BOSS BATTLE!";
                            this._gui.npcText = "Be careful! That ship is HUGE!<br>Keep moving and watch out for<br>any burst attacks. Good luck!";
                        }
                        else {
                            this._gui.transitionText = "Your ship was destroyed.<br><br>You have " + this.thePlayer.lives + (this.thePlayer.lives != 1 ? " lives" : " life") + " left.";
                            this._gui.npcText = "Nooooo!<br>Don't give up! I believe in you!<br>You can do it.";
                            this.timeDilation = 0.5;
                        }
                    }
                    if (this.thePlayer.lives < 0 || this.thePlayer.health <= 0) {
                        if (Math.random() < 0.2) {
                            var explosionPos = {};
                            explosionPos.x = this.thePlayer.sprite.position.x + Math.random() * 128 - 64;
                            explosionPos.y = this.thePlayer.sprite.position.y + Math.random() * 128 - 64;
                            this._entities.particles.addExplosion(explosionPos);
                        }
                    }
                }
                else {
                    this._gui.npcText = "";
                    this.timeDilation = 1;
                    this.currentTransitionSeconds = 0;
                    this.thePlayer.transitionTimeLeft = 0;
                    if (this._state == -1)
                        this._state = 0;
                    this._gui.transitionText = "";
                    if ((this.thePlayer.health <= 0) && (this._state != 0)) {
                        this.thePlayer.sprite.position.y = this._entities.midpoint;
                        this.thePlayer.sprite.position.x = 64;
                        this.thePlayer.health = 100;
                        if (this._state > 1000) {
                            console.log('Filed to kill boss. Resetting.');
                            this._state -= 1000;
                            this._gui.bosshealth = -999;
                            if (this._gui.contains(this._gui.bosshealthTf))
                                this._gui.removeChild(this._gui.bosshealthTf);
                            if (this._entities.theBoss) {
                                this._entities.theBoss.die();
                                this._entities.theBoss = null;
                            }
                        }
                        this._entities.changeLevels('level' + this._state);
                        this._terrain.changeLevels('terrain' + this._state);
                    }
                    if (this.thePlayer.level != this._state && (this._state < 1000)) {
                        console.log('Level transition over. Starting level ' + this._state);
                        this.thePlayer.level = this._state;
                        if (this._state > 1) {
                            this._entities.changeLevels('level' + this._state);
                            this._terrain.changeLevels('terrain' + this._state);
                            this._gui.statsText = "Level " + this._state;
                        }
                        if (this._state == 0) {
                            console.log('Game Over transition over: starting main menu');
                            this.thePlayer.health = 100;
                            this.thePlayer.lives = 3;
                            this.thePlayer.sprite.visible = false;
                            this._entities.theOrb.sprite.visible = false;
                            this._entities.changeLevels('level' + this._state);
                            this._terrain.changeLevels('terrain' + this._state);
                            this._spriteStage.addLayer(this._mainmenu.batch);
                            this._gui.statsText = "GAME OVER";
                            this._gui.bosshealth = 0;
                            if (this._gui.contains(this._gui.bosshealthTf))
                                this._gui.removeChild(this._gui.bosshealthTf);
                            if (this.enableFullscreen) {
                                console.log('Leaving fullscreen...');
                            }
                        }
                    }
                }
            }
        };
        ShooterMain.prototype.processInput = function () {
            if (this._state == 0) {
                if (this._controls.pressing.down || this._controls.pressing.right) {
                    if (this.nothingPressedLastFrame) {
                        this._mainmenu.nextMenuItem();
                        this.nothingPressedLastFrame = false;
                    }
                }
                else if (this._controls.pressing.up || this._controls.pressing.left) {
                    if (this.nothingPressedLastFrame) {
                        this._mainmenu.prevMenuItem();
                        this.nothingPressedLastFrame = false;
                    }
                }
                else if (this._controls.pressing.fire) {
                    if (this._mainmenu.activateCurrentMenuItem(this.getTimer())) {
                        this.startGame();
                    }
                }
                else {
                    this.nothingPressedLastFrame = true;
                }
            }
        };
        ShooterMain.prototype.startGame = function () {
            console.log("Starting game!");
            this._state = 1;
            this._spriteStage.removeLayer(this._mainmenu.batch);
            if (this.enableAutofire) {
                this._controls.autofire = true;
            }
            if (!this.thePlayer)
                this.thePlayer = this._entities.addPlayer(this.playerLogic);
            else
                this.thePlayer.sprite.visible = true;
            if (this._entities.theOrb)
                this._entities.theOrb.sprite.visible = true;
            this._entities.changeLevels("level" + this._state);
            this._terrain.changeLevels("terrain" + this._state);
            this._gui.statsText = "Level " + this._state;
            this.thePlayer.level = 0;
            this.thePlayer.score = 0;
            this.thePlayer.lives = 3;
            this.thePlayer.sprite.position.x = 64;
            this.thePlayer.sprite.position.y = this._entities.midpoint;
            this.thePlayer.transitionTimeLeft = this.thePlayer.transitionSeconds;
            this.thePlayer.invulnerabilityTimeLeft = this.thePlayer.transitionSeconds + this.thePlayer.invulnerabilitySecsWhenHit;
        };
        ShooterMain.prototype.gameOver = function () {
            console.log("================ GAME OVER ================");
            if (this.saved.level < this.thePlayer.level)
                this.saved.level = this.thePlayer.level;
            if (this.saved.score < this.thePlayer.score) {
                this.saved.score = this.thePlayer.score;
                this._gui.highScore = this.thePlayer.score;
            }
            this._state = 0;
            this.thePlayer.transitionTimeLeft = this.thePlayer.transitionSeconds;
            if (this.enableAutofire) {
                this._controls.autofire = false;
                this._controls.pressing.fire = false;
            }
        };
        ShooterMain.prototype.checkPlayerState = function () {
            if (this._state == 0)
                return;
            if (this.thePlayer) {
                if (this.thePlayer.lives < 0) {
                    this.gameOver();
                }
            }
        };
        ShooterMain.prototype.checkMapState = function () {
            if (this._state < 1)
                return;
            if (this._state > 1000)
                return;
            if (this.thePlayer.level != this._state)
                return;
            if (this._terrain.levelPrevCol > this._terrain.level.levelLength) {
                console.log("LEVEL " + this._state + " COMPLETED!");
                this.bossBattle();
                this._state += 1000;
                this.thePlayer.transitionTimeLeft = this.thePlayer.transitionSeconds;
                if (this._entities.level.levelLength == 0) {
                    console.log("NO MORE LEVELS REMAIN! GAME OVER!");
                    this.rollTheCredits();
                }
            }
        };
        ShooterMain.prototype.rollTheCredits = function () {
            this.gameOver();
            this._state = -1;
            this.thePlayer.transitionTimeLeft = this.thePlayer.transitionSeconds * 3;
        };
        ShooterMain.prototype.getTimer = function () {
            return Date.now() - this._start;
        };
        ShooterMain.prototype.initStats = function () {
            this.stats = new Stats();
            this.stats.setMode(0);
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.body.appendChild(this.stats.domElement);
        };
        ShooterMain.main = function () {
            ShooterMain.canvas = document.getElementById("my-canvas");
            lib.ImageLoader.getInstance().add("assets/sprites.png");
            lib.ImageLoader.getInstance().add("assets/titlescreen.png");
            lib.ImageLoader.getInstance().add("assets/stars.gif");
            lib.ImageLoader.getInstance().add("assets/terrain.png");
            lib.ImageLoader.getInstance().downloadAll(function () {
                if (lib.FileLoader.getInstance().isDone())
                    new ShooterMain(ShooterMain.canvas);
            });
            lib.FileLoader.getInstance().add("assets/level0.oel");
            lib.FileLoader.getInstance().add("assets/terrain0.oel");
            lib.FileLoader.getInstance().add("assets/level1.oel");
            lib.FileLoader.getInstance().add("assets/terrain1.oel");
            lib.FileLoader.getInstance().add("assets/level2.oel");
            lib.FileLoader.getInstance().add("assets/terrain2.oel");
            lib.FileLoader.getInstance().add("assets/level3.oel");
            lib.FileLoader.getInstance().add("assets/terrain3.oel");
            lib.FileLoader.getInstance().downloadAll(function () {
                if (lib.ImageLoader.getInstance().isDone())
                    new ShooterMain(ShooterMain.canvas);
            });
        };
        return ShooterMain;
    })();
    shooter.ShooterMain = ShooterMain;
})(shooter || (shooter = {}));
