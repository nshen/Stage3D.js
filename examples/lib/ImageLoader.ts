module lib
{
    //based on http://www.html5rocks.com/en/tutorials/games/assetmanager/

    export class ImageLoader
    {
        //--------------------------------------
        private static _instance:ImageLoader;
        public constructor()
        {
            if(ImageLoader._instance)
                throw new Error("singleton error");
        }
        public static getInstance():ImageLoader
        {
            if(!ImageLoader._instance)
                ImageLoader._instance = new ImageLoader();
            return ImageLoader._instance;
        }
        //---------------------------------------

        private _queue:string[] = [];
        private _successCount:number = 0;
        private _errorCount:number = 0;
        private _cache:Object = {};

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
                var img:HTMLImageElement = new Image();

                img.onload = (e:Event) =>{
                    this._successCount++;
                    if(this.isDone())
                        p_callback();
                };
                img.onerror = (e:Event) =>{
                    this._errorCount++;
                    if(this.isDone())
                        p_callback();
                };
                img.src = this._queue[i];
                this._cache[this._queue[i]] = img;
            }
        }

        public isDone():boolean
        {
            //console.log("image load success:" + this._successCount +" error:" + this._errorCount+" total:"+this._queue.length);
            return this._queue.length == (this._successCount + this._errorCount);
        }

        public get(path:string):HTMLImageElement
        {
            return this._cache[path];
        }
    }
}
