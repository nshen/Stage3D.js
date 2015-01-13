///<reference path="reference.ts"/>
module shooter
{
    declare var Stats:any;

    export class ShooterMain
    {

        public stage3d:stageJS.Stage3D;
        public context3D:stageJS.Context3D;

        private _spriteStage:GPUSprite.SpriteRenderStage; // LiteSpriteStage
        private _entities:shooter.EntityManager;

        private _controls : shooter.GameControls;

        private _state:number = 0;
        // the title screen batch
        private _mainmenu : shooter.GameMenu;

        private _start:number;

        public constructor(canvas:HTMLCanvasElement)
        {
            this._start = new Date().valueOf();
            this.initStats();
            this._controls = new shooter.GameControls(window);


            this.stage3d = new stageJS.Stage3D(canvas);
            this.stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, this.onContext3DCreate);
            this.stage3d.requestContext3D();
        }

        private onContext3DCreate = (e:stageJS.events.Event) =>
        {
            this.context3D = this.stage3d.context3D;
            this.initSpriteEngine();
        }

        private initSpriteEngine():void
        {
            var _width:number = this.stage3d.stageWidth;
            var _height:number = this.stage3d.stageHeight;

            //todo:rectangle
            var stageRect:GPUSprite.Rectangle = new GPUSprite.Rectangle(0,0,_width,_height);
            this._spriteStage = new GPUSprite.SpriteRenderStage(this.stage3d,this.context3D,stageRect)
            this._spriteStage.configureBackBuffer(_width,_height);

            // create a single rendering batch
            // which will draw all sprites in one pass
            this._entities = new shooter.EntityManager(stageRect);
            var batch:GPUSprite.SpriteRenderLayer = this._entities.createBatch(this.context3D);
            this._spriteStage.addLayer(batch); // addBatch

            // create the logo/titlescreen main menu
            this._mainmenu = new shooter.GameMenu(stageRect);
            batch = this._mainmenu.createBatch(this.context3D);
            this._spriteStage.addLayer(batch);


            // add the first entity right now
            //this._entities.addEntity();

            // tell the gui where to grab statistics from
            //_gui.statsTarget = _entities;

            // start the render loop
            this.onEnterFrame();//stage.addEventListener(Event.ENTER_FRAME,onEnterFrame);

            // only used for the menu
            ShooterMain.canvas.onmousedown = (ev:MouseEvent)=>
            {
                if (this._state == 0) // are we at the main menu?
                {
                    if (this._mainmenu && this._mainmenu.activateCurrentMenuItem(new Date().valueOf()))
                    { // if the above returns true we should start the game
                        //this.startGame();
                    }
                }
            }

            ShooterMain.canvas.onmouseup = (ev:MouseEvent)=>
            {

            }

            ShooterMain.canvas.onmousemove = (ev:MouseEvent)=>
            {
                if (this._state == 0) // are we at the main menu?
                {
                    // select menu items via mouse
                    if (this._mainmenu) this._mainmenu.mouseHighlight(ev.clientX, ev.clientY);
                }
            }
        }

        private onEnterFrame = () =>
        {
            //console.log(this._controls.textDescription());
            //console.log(this._entities.numReused , this._entities.numCreated);
            try
            {
                this.stats.begin();
                // keep adding more sprites - FOREVER!
                // this is a test of the entity manager's
                // object reuse "pool"
                this._entities.addEntity();

                var timer:number = Date.now() - this._start;


                // erase the previous frame
                this.context3D.clear(0, 0, 0, 1);

                // move/animate all entities
                this._entities.update(timer);

                this._mainmenu.update(timer);

                // draw all entities
                this._spriteStage.drawDeferred(); //render

                // update the screen
                this.context3D.present();

                this.stats.end();
            }
            catch (e)
            {
                console.log("computer goes to sleep ?" ,e.toString());
                // this can happen if the computer goes to sleep and
                // then re-awakens, requiring reinitialization of stage3D
                // (the onContext3DCreate will fire again)
            }


            requestAnimationFrame(this.onEnterFrame);
        }


        //------------------------------------
        public stats:any;
        private initStats()
        {
            this.stats = new Stats();
            this.stats.setMode(0);
            // align top-left
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.body.appendChild(this.stats.domElement);
        }

        public static canvas:HTMLCanvasElement;
        public static main():void
        {
            shooter.ImageLoader.getInstance().add("assets/sprites.png");
            shooter.ImageLoader.getInstance().add("assets/titlescreen.png");
            shooter.ImageLoader.getInstance().downloadAll(function(){
                new ShooterMain(ShooterMain.canvas = <HTMLCanvasElement>document.getElementById("my-canvas"));
            });

        }

    }
}