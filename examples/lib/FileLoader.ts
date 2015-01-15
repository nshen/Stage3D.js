module lib
{
    //based on http://www.html5rocks.com/en/tutorials/games/assetmanager/

    declare var $:any; // todo:依赖jquery
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
                xhr.responseType = this._resType;
                xhr.onreadystatechange = (e) =>
                {
                    //console.log("ready",xhr.readyState);
                }
                xhr.onload = (e:Event) => {

                    //本地
                    if(xhr.status == 0 )
                    {
                        this._successCount ++
                        if(this.isDone())
                            p_callback();
                        return;
                    }

                    if(xhr.readyState == 4 || xhr.status == 0)
                    {
                        //if (xhr.status == 200) {
                        this._successCount ++
                        if(this.isDone())
                            p_callback();
                        //}
                    }
                    else
                    {

                        throw new Error("error");
                    }
                    console.log("readState:",xhr.readyState , xhr.status );
                };
                xhr.onerror = (e) =>{
                    this._errorCount ++;
                    if(this.isDone())
                    p_callback();
                }
                xhr.open('GET', this._queue[i], true); //+"?randnum=" + Math.random()
                xhr.send();
                this._cache[this._queue[i]] = xhr;
            }
        }


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



        public isDone():boolean
        {

            //console.log("file load success:" + this._successCount +" error:" + this._errorCount+" total:"+this._queue.length);
            return this._queue.length == (this._successCount + this._errorCount);
        }

        public get(path:string):XMLHttpRequest
        {
            return this._cache[path];
        }
    }
}
