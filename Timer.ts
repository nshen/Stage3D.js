module BunnyMark
{
    /**
     * as3 getTimer()
     */
    export class Timer
    {
        private _start:number;
        private _time:number;

        public constructor()
        {
            this._start = new Date().valueOf();
        }

        public getTimer():number
        {
            return Date.now() - this._start;
        }

    }
}