var BunnyMark;
(function (BunnyMark) {
    /**
     * as3 getTimer()
     */
    var Timer = (function () {
        function Timer() {
            this._start = new Date().valueOf();
        }
        Timer.prototype.getTimer = function () {
            return Date.now() - this._start;
        };
        return Timer;
    })();
    BunnyMark.Timer = Timer;
})(BunnyMark || (BunnyMark = {}));
