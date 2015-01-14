module lib
{
    //based on http://www.html5rocks.com/en/tutorials/games/assetmanager/

    export class FileLoader
    {
        //--------------------------------------
        private static _instance:FileLoader;
        public constructor()
        {
            if(FileLoader._instance)
                throw new Error("singleton error");
        }
        public static getInstance():FileLoader
        {
            if(!FileLoader._instance)
                FileLoader._instance = new FileLoader();
            return FileLoader._instance;
        }
        //---------------------------------------

        private _queue:string[] = [];
        private _successCount:number = 0;
        private _errorCount:number = 0;
        private _cache:Object = {};

        private _resType:string = "text";
        public static RES_TYPE_TEXT:string = "text";
        public static RES_TYPE_BUFFER:string = "arraybuffer";
        public static RES_TYPE_BLOB:string = "blob";
        public static RES_TYPE_DOCUMENT:string = "document";


        public add(path:string):void
        {
            this._queue.push(path);
        }

        public downloadAll(p_callback:Function):void
        {
            if(this._queue.length <= 0)
                return p_callback();

            for (var i:number = 0; i< this._queue.length; i++)
            {

                var xhr = new XMLHttpRequest();
                xhr.open('GET', this._queue[i], true);
                xhr.responseType = this._resType;

                xhr.onload = (e:Event) => {
                    if (xhr.status == 200) {
                        this._successCount ++
                        if(this.isDone())
                            p_callback();
                    }else
                    {
                        throw new Error("error");
                    }
                };
                xhr.onerror = (e) =>{
                    this._errorCount ++;
                    if(this.isDone())
                        p_callback();
                }
                xhr.send();
                this._cache[this._queue[i]] = xhr;
            }
        }

        public isDone():boolean
        {
            return this._queue.length == (this._successCount + this._errorCount);
        }

        public get(path:string):XMLHttpRequest
        {
            return this._cache[path];
        }
    }
}
