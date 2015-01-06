var BunnyMark;
(function (BunnyMark) {
    var ImageLoader = (function () {
        function ImageLoader() {
            //---------------------------------------
            //based on this http://www.html5rocks.com/en/tutorials/games/assetmanager/
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
    BunnyMark.ImageLoader = ImageLoader;
})(BunnyMark || (BunnyMark = {}));
