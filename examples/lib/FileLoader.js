var lib;
(function (lib) {
    var FileLoader = (function () {
        function FileLoader() {
            //---------------------------------------
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
                xhr.responseType = this._resType;
                xhr.onreadystatechange = function (e) {
                    //console.log("ready",xhr.readyState);
                };
                xhr.onload = function (e) {
                    //本地
                    if (xhr.status == 0) {
                        _this._successCount++;
                        if (_this.isDone())
                            p_callback();
                        return;
                    }
                    if (xhr.readyState == 4 || xhr.status == 0) {
                        //if (xhr.status == 200) {
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
                xhr.open('GET', this._queue[i], true); //+"?randnum=" + Math.random()
                xhr.send();
                this._cache[this._queue[i]] = xhr;
            }
        };
        // use jquery
        //public downloadAll2(p_callback:Function):void
        //{
        //    if(this._queue.length <= 0)
        //        return p_callback();
        //
        //    for (var i:number = 0; i< this._queue.length; i++)
        //    {
        //        $.get(this._queue[i], (data) =>
        //        {
        //            this._cache[this._queue[i]] = data;
        //            this._successCount ++
        //            if(this.isDone())
        //                p_callback();
        //        });
        //
        //
        //    }
        //}
        FileLoader.prototype.isDone = function () {
            //console.log("file load success:" + this._successCount +" error:" + this._errorCount+" total:"+this._queue.length);
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
