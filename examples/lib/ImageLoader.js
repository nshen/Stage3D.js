var lib;
(function (lib) {
    //based on http://www.html5rocks.com/en/tutorials/games/assetmanager/
    var ImageLoader = (function () {
        function ImageLoader() {
            //---------------------------------------
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
            //console.log("image load success:" + this._successCount +" error:" + this._errorCount+" total:"+this._queue.length);
            return this._queue.length == (this._successCount + this._errorCount);
        };
        ImageLoader.prototype.get = function (path) {
            return this._cache[path];
        };
        return ImageLoader;
    })();
    lib.ImageLoader = ImageLoader;
})(lib || (lib = {}));
