var GPUSprite;
(function (GPUSprite) {
    var Rectangle = (function () {
        function Rectangle(x, y, w, h) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof w === "undefined") { w = 0; }
            if (typeof h === "undefined") { h = 0; }
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
        function SpriteSheet(spriteSheetBitmapData, numSpritesW, numSpritesH) {
            if (typeof numSpritesW === "undefined") { numSpritesW = 8; }
            if (typeof numSpritesH === "undefined") { numSpritesH = 8; }
            this._spriteSheet = spriteSheetBitmapData;
            this._uvCoords = [];
            this._rects = [];
            this.createUVs(numSpritesW, numSpritesH);
        }
        SpriteSheet.prototype.createUVs = function (numSpritesW, numSpritesH) {
            var destRect;

            for (var y = 0; y < numSpritesH; y++) {
                for (var x = 0; x < numSpritesW; x++) {
                    this._uvCoords.push(x / numSpritesW, (y + 1) / numSpritesH, x / numSpritesW, y / numSpritesH, (x + 1) / numSpritesW, y / numSpritesH, (x + 1) / numSpritesW, (y + 1) / numSpritesH);

                    destRect = new GPUSprite.Rectangle();
                    destRect.x = 0;
                    destRect.y = 0;
                    destRect.width = this._spriteSheet.width / numSpritesW;
                    destRect.height = this._spriteSheet.height / numSpritesH;
                    this._rects.push(destRect);
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

            this._rects.push({
                x: destPt.x,
                y: destPt.y,
                width: srcRect.width,
                height: srcRect.height });

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

        SpriteRenderStage.prototype.addLayer = function (layer) {
            layer.parent = this;
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

            this._context3D.setProgram(this._shaderProgram);
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
            } else {
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
var shooter;
(function (shooter) {
    var GameControls = (function () {
        function GameControls(theStage) {
            var _this = this;
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
                _this.pressing.fire = false;
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
            console.log("Init the game menu..");
            this.setPosition(view);
        }
        GameMenu.prototype.setPosition = function (view) {
            this.logoX = view.width / 2;
            this.logoY = view.height / 2 - 64;
            this.menuX = view.width / 2;
            this.menuY = view.height / 2 + 64;
            this.menuY1 = this.menuY - (this.menuItemHeight / 2);
            this.menuY2 = this.menuY - (this.menuItemHeight / 2) + this.menuItemHeight;
            this.menuY3 = this.menuY - (this.menuItemHeight / 2) + (this.menuItemHeight * 2);
        };

        GameMenu.prototype.createBatch = function (context3D) {
            var source = stageJS.BitmapData.fromImageElement(lib.ImageLoader.getInstance().get("assets/titlescreen.png"));

            this.spriteSheet = new GPUSprite.SpriteSheet(source, 0, 0);

            this.batch = new GPUSprite.SpriteRenderLayer(context3D, this.spriteSheet);

            var logoID = this.spriteSheet.defineSprite(0, 0, 512, 256);
            this.logoSprite = this.batch.createChild(logoID);
            this.logoSprite.position.x = this.logoX;
            this.logoSprite.position.y = this.logoY;

            var menuPlaySpriteID = this.spriteSheet.defineSprite(0, 256, this.menuWidth, 48);
            this.menuPlaySprite = this.batch.createChild(menuPlaySpriteID);
            this.menuPlaySprite.position.x = this.menuX;
            this.menuPlaySprite.position.y = this.menuY;

            var amenuPlaySpriteID = this.spriteSheet.defineSprite(0, 256 + 128, this.menuWidth, 48);
            this.amenuPlaySprite = this.batch.createChild(amenuPlaySpriteID);
            this.amenuPlaySprite.position.x = this.menuX;
            this.amenuPlaySprite.position.y = this.menuY;
            this.amenuPlaySprite.alpha = 0;

            var menuControlsSpriteID = this.spriteSheet.defineSprite(0, 304, this.menuWidth, 32);
            this.menuControlsSprite = this.batch.createChild(menuControlsSpriteID);
            this.menuControlsSprite.position.x = this.menuX;
            this.menuControlsSprite.position.y = this.menuY + this.menuItemHeight;

            var amenuControlsSpriteID = this.spriteSheet.defineSprite(0, 304 + 128, this.menuWidth, 32);
            this.amenuControlsSprite = this.batch.createChild(amenuControlsSpriteID);
            this.amenuControlsSprite.position.x = this.menuX;
            this.amenuControlsSprite.position.y = this.menuY + this.menuItemHeight;
            this.amenuControlsSprite.alpha = 0;

            var menuAboutSpriteID = this.spriteSheet.defineSprite(0, 336, this.menuWidth, 48);
            this.menuAboutSprite = this.batch.createChild(menuAboutSpriteID);
            this.menuAboutSprite.position.x = this.menuX;
            this.menuAboutSprite.position.y = this.menuY + this.menuItemHeight + this.menuItemHeight;

            var amenuAboutSpriteID = this.spriteSheet.defineSprite(0, 336 + 128, this.menuWidth, 48);
            this.amenuAboutSprite = this.batch.createChild(amenuAboutSpriteID);
            this.amenuAboutSprite.position.x = this.menuX;
            this.amenuAboutSprite.position.y = this.menuY + this.menuItemHeight + this.menuItemHeight;
            this.amenuAboutSprite.alpha = 0;

            var aboutSpriteID = this.spriteSheet.defineSprite(128, 256, 384, 128);
            this.aboutSprite = this.batch.createChild(aboutSpriteID);
            this.aboutSprite.position.x = this.menuX;
            this.aboutSprite.position.y = this.menuY + 64;
            this.aboutSprite.alpha = 0;

            var controlsSpriteID = this.spriteSheet.defineSprite(128, 384, 384, 128);
            this.controlsSprite = this.batch.createChild(controlsSpriteID);
            this.controlsSprite.position.x = this.menuX;
            this.controlsSprite.position.y = this.menuY + 64;
            this.controlsSprite.alpha = 0;

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
            this.logoSprite.scaleX = 1 + wobble;
            this.logoSprite.scaleY = 1 + wobble;
            wobble = (Math.cos(currentTime / 777) / Math.PI) * 0.1;
            this.logoSprite.rotation = wobble;

            wobble = (Math.cos(currentTime / 150) / Math.PI) * 0.1;
            this.amenuAboutSprite.scaleX = this.amenuAboutSprite.scaleY = this.amenuControlsSprite.scaleX = this.amenuControlsSprite.scaleY = this.amenuPlaySprite.scaleX = this.amenuPlaySprite.scaleY = 1.1 + wobble;

            if (this.showingAbout) {
                if (this.showingAboutUntil > currentTime) {
                    this.aboutSprite.alpha = 1;
                } else {
                    this.aboutSprite.alpha = 0;
                    this.showingAbout = false;
                    this.updateState();
                }
            }

            if (this.showingControls) {
                if (this.showingControlsUntil > currentTime) {
                    this.controlsSprite.alpha = 1;
                } else {
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
    var Entity = (function () {
        function Entity(gs, myManager) {
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
            console.log("Generating AI path");
            this.aiPathWaypoints = [];
            var N = this.aiPathWaypointCount;
            for (var i = 0; i < N; i++) {
                this.aiPathWaypoints.push({
                    x: this.aiPathSize * Math.random(),
                    y: this.aiPathSize * Math.random() });
            }
        };

        Entity.prototype.calculatePathPosition = function (ratio) {
            if (typeof ratio === "undefined") { ratio = 0; }
            var i = Math.round(ratio);
            var pointratio = ratio - i;

            var p0 = this.aiPathWaypoints[(i - 1 + this.aiPathWaypoints.length) % this.aiPathWaypoints.length];
            var p1 = this.aiPathWaypoints[i % this.aiPathWaypoints.length];
            var p2 = this.aiPathWaypoints[(i + 1 + this.aiPathWaypoints.length) % this.aiPathWaypoints.length];
            var p3 = this.aiPathWaypoints[(i + 2 + this.aiPathWaypoints.length) % this.aiPathWaypoints.length];

            var q = this.spline(p0, p1, p2, p3, pointratio);
            return q;
        };

        Entity.prototype.maybeShoot = function (bulletNum, delayMin, delayMax) {
            if (typeof bulletNum === "undefined") { bulletNum = 1; }
            if (typeof delayMin === "undefined") { delayMin = NaN; }
            if (typeof delayMax === "undefined") { delayMax = NaN; }
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
            if (typeof startScale === "undefined") { startScale = 0.01; }
            if (typeof spdX === "undefined") { spdX = 0; }
            if (typeof spdY === "undefined") { spdY = 0; }
            if (typeof startAlpha === "undefined") { startAlpha = 1; }
            if (typeof rot === "undefined") { rot = NaN; }
            if (typeof rotSpd === "undefined") { rotSpd = NaN; }
            if (typeof fadeSpd === "undefined") { fadeSpd = NaN; }
            if (typeof zoomSpd === "undefined") { zoomSpd = NaN; }
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
            this._SpritesPerRow = 8;
            this._SpritesPerCol = 8;
            this.defaultScale = 1;
            this.defaultSpeed = 128;
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
            this._entityPool = [];
            this.allBullets = [];
            this.allEnemies = [];
            this.particles = new _shooter.GameParticles(this);
            this.setPosition(view);
        }
        EntityManager.prototype.setPosition = function (view) {
            this.maxX = view.width + 64;
            this.minX = view.x - 64;
            this.maxY = view.height + 64;
            this.minY = view.y - 64;
        };

        EntityManager.prototype.createBatch = function (context3D) {
            var sourceBitmap = lib.ImageLoader.getInstance().get("assets/sprites.png");

            this._spriteSheet = new GPUSprite.SpriteSheet(stageJS.BitmapData.fromImageElement(sourceBitmap), 8, 8);

            this._batch = new GPUSprite.SpriteRenderLayer(context3D, this._spriteSheet);
            return this._batch;
        };

        EntityManager.prototype.respawn = function (sprID) {
            if (typeof sprID === "undefined") { sprID = 0; }
            var currentEntityCount = this._entityPool.length;
            var anEntity;

            for (var i = 0; i < currentEntityCount; i++) {
                anEntity = this._entityPool[i];
                if (!anEntity.active && (anEntity.sprite.spriteId == sprID)) {
                    anEntity.active = true;
                    anEntity.sprite.visible = true;
                    anEntity.recycled = true;
                    this.numReused++;
                    return anEntity;
                }
            }

            var sprite;
            sprite = this._batch.createChild(sprID);
            anEntity = new _shooter.Entity(sprite, this);
            this._entityPool.push(anEntity);
            this.numCreated++;
            return anEntity;
        };

        EntityManager.prototype.addPlayer = function (playerController) {
            this.thePlayer = this.respawn(10);
            this.thePlayer.sprite.position.x = 32;
            this.thePlayer.sprite.position.y = this.maxY / 2;
            this.thePlayer.sprite.rotation = 180 * this.DEGREES_TO_RADIANS;
            this.thePlayer.sprite.scaleX = this.thePlayer.sprite.scaleY = this.defaultScale;
            this.thePlayer.speedX = 0;
            this.thePlayer.speedY = 0;
            this.thePlayer.active = true;
            this.thePlayer.aiFunction = playerController;
            this.thePlayer.leavesTrail = true;

            this.theOrb = this.respawn(this.spritenumOrb);
            this.theOrb.rotationSpeed = 720 * this.DEGREES_TO_RADIANS;
            this.theOrb.leavesTrail = true;
            this.theOrb.collidemode = 1;
            this.theOrb.collideradius = 12;
            this.theOrb.isBullet = true;
            this.theOrb.owner = this.thePlayer;
            this.theOrb.orbiting = this.thePlayer;
            this.theOrb.orbitingDistance = 180;

            return this.thePlayer;
        };

        EntityManager.prototype.shootBullet = function (powa, shooter) {
            if (typeof powa === "undefined") { powa = 1; }
            if (typeof shooter === "undefined") { shooter = null; }
            if (this.thePlayer == null)
                return null;

            if (shooter == null)
                shooter = this.thePlayer;

            var theBullet;
            if (powa == 1)
                theBullet = this.respawn(this.spritenumBullet1);
            else if (powa == 2)
                theBullet = this.respawn(this.spritenumBullet2);
            else
                theBullet = this.respawn(this.spritenumBullet3);

            theBullet.sprite.position.x = this.thePlayer.sprite.position.x + 8;
            theBullet.sprite.position.y = this.thePlayer.sprite.position.y + 4;
            theBullet.sprite.rotation = 180 * this.DEGREES_TO_RADIANS;
            theBullet.sprite.scaleX = theBullet.sprite.scaleY = 1;
            if (shooter == this.thePlayer) {
                theBullet.speedX = this.bulletSpeed;
                theBullet.speedY = 0;
            } else {
                theBullet.sprite.rotation = this.pointAtRad(theBullet.sprite.position.x - this.thePlayer.sprite.position.x, theBullet.sprite.position.y - this.thePlayer.sprite.position.y) - (90 * this.DEGREES_TO_RADIANS);

                theBullet.speedX = this.defaultSpeed * 1.5 * Math.cos(theBullet.sprite.rotation);
                theBullet.speedY = this.defaultSpeed * 1.5 * Math.sin(theBullet.sprite.rotation);
            }

            theBullet.owner = shooter;
            theBullet.collideradius = 10;
            theBullet.collidemode = 1;
            theBullet.isBullet = true;

            if (!theBullet.recycled)
                this.allBullets.push(theBullet);
            return theBullet;
        };

        EntityManager.prototype.addEntity = function () {
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
            var anEntity;
            for (var i = 0; i < this.allEnemies.length; i++) {
                anEntity = this.allEnemies[i];
                if (anEntity.active && anEntity.collidemode) {
                    if (checkMe.colliding(anEntity)) {
                        this.particles.addExplosion(checkMe.sprite.position);
                        if ((checkMe != this.theOrb) && (checkMe != this.thePlayer))
                            checkMe.die();
                        if ((anEntity != this.theOrb) && ((anEntity != this.thePlayer)))
                            anEntity.die();
                        return anEntity;
                    }
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
                    anEntity.sprite.position.x += anEntity.speedX * this.currentFrameSeconds;
                    anEntity.sprite.position.y += anEntity.speedY * this.currentFrameSeconds;

                    if (anEntity.aiFunction != null)
                        anEntity.aiFunction(anEntity);
                    else {
                        if (anEntity.isBullet && anEntity.collidemode)
                            this.checkCollisions(anEntity);

                        if (anEntity.orbiting != null) {
                            anEntity.sprite.position.x = anEntity.orbiting.sprite.position.x + ((Math.sin(anEntity.sprite.rotation / 4) / Math.PI) * anEntity.orbitingDistance);
                            anEntity.sprite.position.y = anEntity.orbiting.sprite.position.y - ((Math.cos(anEntity.sprite.rotation / 4) / Math.PI) * anEntity.orbitingDistance);
                        }

                        if (anEntity.leavesTrail) {
                            if (anEntity == this.theOrb)
                                this.particles.addParticle(63, anEntity.sprite.position.x, anEntity.sprite.position.y, 0.25, 0, 0, 0.6, NaN, NaN, -1.5, -1);
                            else
                                this.particles.addParticle(63, anEntity.sprite.position.x + 12, anEntity.sprite.position.y + 2, 0.5, 3, 0, 0.6, NaN, NaN, -1.5, -1);
                        }
                        if ((anEntity.sprite.position.x > this.maxX) || (anEntity.sprite.position.x < this.minX) || (anEntity.sprite.position.y > this.maxY) || (anEntity.sprite.position.y < this.minY)) {
                            if ((anEntity != this.thePlayer) && (anEntity != this.theOrb))
                                anEntity.die();
                        }
                    }
                    if (anEntity.rotationSpeed != 0)
                        anEntity.sprite.rotation += anEntity.rotationSpeed * this.currentFrameSeconds;

                    if (anEntity.fadeAnim != 0) {
                        anEntity.sprite.alpha += anEntity.fadeAnim * this.currentFrameSeconds;
                        if (anEntity.sprite.alpha <= 0.001) {
                            anEntity.die();
                        } else if (anEntity.sprite.alpha > 1) {
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
            this.yParallaxAmount = (512 - 400);
        }
        GameBackground.prototype.createBatch = function (context3D) {
            var bgsourceBitmap = lib.ImageLoader.getInstance().get("assets/stars.gif");

            this._spriteSheet = new GPUSprite.SpriteSheet(stageJS.BitmapData.fromImageElement(bgsourceBitmap), this.bgSpritesPerRow, this.bgSpritesPerCol);

            this._batch = new GPUSprite.SpriteRenderLayer(context3D, this._spriteSheet);

            return this._batch;
        };

        GameBackground.prototype.setPosition = function (view) {
            this.maxX = 256 + 512 + 512;
            this.minX = -256;
            this.maxY = view.height;
            this.minY = view.y;
        };

        GameBackground.prototype.initBackground = function () {
            console.log("Init background...");

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

            this.yParallaxAmount = (512 - this.maxY) / 2;
            this.yOffset = this.maxY / 2;
        };

        GameBackground.prototype.yParallax = function (OffsetPercent) {
            if (typeof OffsetPercent === "undefined") { OffsetPercent = 0; }
            this.yOffset = (this.maxY * 0.5) - this.yParallaxAmount * (OffsetPercent);
        };

        GameBackground.prototype.update = function (currentTime) {
            var anEntity;

            for (var i = 0; i < this._entityPool.length; i++) {
                anEntity = this._entityPool[i];
                if (anEntity.active) {
                    anEntity.sprite.position.x += anEntity.speedX;
                    anEntity.sprite.position.y = this.yOffset;
                    if (anEntity.sprite.position.x >= this.maxX) {
                        anEntity.sprite.position.x = this.minX;
                    } else if (anEntity.sprite.position.x <= this.minX) {
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
            this._state = 0;
            this.nothingPressedLastFrame = false;
            this.playerSpeed = 128;
            this.nextFireTime = 0;
            this.fireDelay = 200;
            this.onContext3DCreate = function (e) {
                _this.context3D = _this.stage3d.context3D;
                _this.initSpriteEngine();
            };
            this.playerLogic = function (me) {
                me.speedY = me.speedX = 0;
                if (_this._controls.pressing.up)
                    me.speedY = -_this.playerSpeed;
                if (_this._controls.pressing.down)
                    me.speedY = _this.playerSpeed;
                if (_this._controls.pressing.left)
                    me.speedX = -_this.playerSpeed;
                if (_this._controls.pressing.right)
                    me.speedX = _this.playerSpeed;

                if (me.sprite.position.x < 0)
                    me.sprite.position.x = 0;
                if (me.sprite.position.x > _this.stage3d.stageWidth)
                    me.sprite.position.x = _this.stage3d.stageWidth;
                if (me.sprite.position.y < 0)
                    me.sprite.position.y = 0;
                if (me.sprite.position.y > _this.stage3d.stageHeight)
                    me.sprite.position.y = _this.stage3d.stageHeight;

                _this._entities.particles.addParticle(63, me.sprite.position.x - 12, me.sprite.position.y + 2, 0.75, -200, 0, 0.4, NaN, NaN, -1, -1.5);
            };
            this.onEnterFrame = function () {
                try  {
                    _this.stats.begin();

                    _this.currentTime = _this.getTimer();
                    _this.currentFrameMs = _this.currentTime - _this.previousFrameTime;
                    _this.previousFrameTime = _this.currentTime;

                    _this.context3D.clear(0, 0, 0, 1);

                    _this.processInput();

                    if (_this._entities.thePlayer)
                        _this._bg.yParallax(_this._entities.thePlayer.sprite.position.y / _this.stage3d.stageHeight);
                    _this._bg.update(_this.currentTime);

                    if (_this._state == 0)
                        _this._mainmenu.update(_this.currentTime);

                    if (Math.random() > 0.9) {
                        _this._entities.addEntity();
                    }

                    _this._entities.update(_this.currentFrameMs);

                    _this._spriteStage.drawDeferred();

                    _this.context3D.present();

                    _this.stats.end();
                } catch (e) {
                    console.log("computer goes to sleep ?", e.toString());
                }

                requestAnimationFrame(_this.onEnterFrame);
            };
            this._start = new Date().valueOf();
            this.initStats();
            this._controls = new shooter.GameControls(window);

            this.stage3d = new stageJS.Stage3D(canvas);
            this.stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, this.onContext3DCreate);
            this.stage3d.requestContext3D();
        }
        ShooterMain.prototype.initSpriteEngine = function () {
            var _this = this;
            var _width = this.stage3d.stageWidth;
            var _height = this.stage3d.stageHeight;

            var stageRect = new GPUSprite.Rectangle(0, 0, _width, _height);
            this._spriteStage = new GPUSprite.SpriteRenderStage(this.stage3d, this.context3D, stageRect);
            this._spriteStage.configureBackBuffer(_width, _height);

            this._bg = new shooter.GameBackground(stageRect);
            var batch = this._bg.createBatch(this.context3D);
            this._bg.initBackground();
            this._spriteStage.addLayer(batch);

            this._entities = new shooter.EntityManager(stageRect);
            batch = this._entities.createBatch(this.context3D);
            this._spriteStage.addLayer(batch);

            this._mainmenu = new shooter.GameMenu(stageRect);
            batch = this._mainmenu.createBatch(this.context3D);
            this._spriteStage.addLayer(batch);

            this.onEnterFrame();

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
        };

        ShooterMain.prototype.processInput = function () {
            if (this._state == 0) {
                if (this._controls.pressing.down || this._controls.pressing.right) {
                    if (this.nothingPressedLastFrame) {
                        this._mainmenu.nextMenuItem();
                        this.nothingPressedLastFrame = false;
                    }
                } else if (this._controls.pressing.up || this._controls.pressing.left) {
                    if (this.nothingPressedLastFrame) {
                        this._mainmenu.prevMenuItem();
                        this.nothingPressedLastFrame = false;
                    }
                } else if (this._controls.pressing.fire) {
                    if (this._mainmenu.activateCurrentMenuItem(this.getTimer())) {
                        this.startGame();
                    }
                } else {
                    this.nothingPressedLastFrame = true;
                }
            } else {
                if (this._controls.pressing.fire) {
                    if (this.currentTime >= this.nextFireTime) {
                        this._entities.shootBullet(3);
                        this.nextFireTime = this.currentTime + this.fireDelay;
                    }
                }
            }
        };

        ShooterMain.prototype.startGame = function () {
            console.log("Starting game!");
            this._state = 1;
            this._spriteStage.removeLayer(this._mainmenu.batch);

            this.thePlayer = this._entities.addPlayer(this.playerLogic);
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
            lib.ImageLoader.getInstance().add("assets/sprites.png");
            lib.ImageLoader.getInstance().add("assets/titlescreen.png");
            lib.ImageLoader.getInstance().add("assets/stars.gif");

            lib.ImageLoader.getInstance().downloadAll(function () {
                new ShooterMain(ShooterMain.canvas = document.getElementById("my-canvas"));
            });
        };
        return ShooterMain;
    })();
    shooter.ShooterMain = ShooterMain;
})(shooter || (shooter = {}));
//# sourceMappingURL=Shooter.js.map
