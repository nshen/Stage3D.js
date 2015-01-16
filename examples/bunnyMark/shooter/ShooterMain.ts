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
        // the background stars
        private _bg : shooter.GameBackground;

        private _controls : shooter.GameControls;

        private _state:number = 0;
        // the title screen batch
        private _mainmenu : shooter.GameMenu;

        private _start:number;
        private currentTime:number;

        // don't update the menu too fast
        private nothingPressedLastFrame:boolean = false;

        // player one's entity
        public thePlayer:Entity;

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

            var stageRect:GPUSprite.Rectangle = new GPUSprite.Rectangle(0,0,_width,_height);
            this._spriteStage = new GPUSprite.SpriteRenderStage(this.stage3d,this.context3D,stageRect)
            this._spriteStage.configureBackBuffer(_width,_height);

            // create the background stars
            this._bg = new shooter.GameBackground(stageRect);
            var batch:GPUSprite.SpriteRenderLayer = this._bg.createBatch(this.context3D);
            this._bg.initBackground();
            this._spriteStage.addLayer(batch);

            // create a single rendering batch
            // which will draw all sprites in one pass
            this._entities = new shooter.EntityManager(stageRect);
            batch = this._entities.createBatch(this.context3D);
            this._spriteStage.addLayer(batch); // addBatch

            // create the logo/titlescreen main menu
            this._mainmenu = new shooter.GameMenu(stageRect);
            batch = this._mainmenu.createBatch(this.context3D);
            this._spriteStage.addLayer(batch);



            // start the render loop
            this.onEnterFrame();//stage.addEventListener(Event.ENTER_FRAME,onEnterFrame);

            // only used for the menu
            ShooterMain.canvas.onmousedown = (ev:MouseEvent)=>
            {
                if (this._state == 0) // are we at the main menu?
                {
                    if (this._mainmenu && this._mainmenu.activateCurrentMenuItem(this.getTimer()))
                    { // if the above returns true we should start the game
                        this.startGame();
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

        // handle any player input
        private processInput():void
        {
            if (this._state == 0) // are we at the main menu?
            {
                // select menu items via keyboard
                if (this._controls.pressing.down || this._controls.pressing.right)
                {
                    if (this.nothingPressedLastFrame)
                    {
                        //_sfx.playGun(1);
                        this._mainmenu.nextMenuItem();
                        this.nothingPressedLastFrame = false;
                    }
                }
                else if (this._controls.pressing.up || this._controls.pressing.left)
                {
                    if (this.nothingPressedLastFrame)
                    {
                        //_sfx.playGun(1);
                        this._mainmenu.prevMenuItem();
                        this.nothingPressedLastFrame = false;
                    }
                }
                else if (this._controls.pressing.fire)
                {
                    if (this._mainmenu.activateCurrentMenuItem(this.getTimer()))
                    { // if the above returns true we should start the game
                        this.startGame();
                    }
                }
                else
                {
                    // this ensures the menu doesn't change too fast
                    this.nothingPressedLastFrame = true;
                }
            }
            else
            {
                // we are NOT at the main menu: we are actually playing the game
                // in future versions we will add projectile
                // spawning functinality here to fire bullets
                if (this._controls.pressing.fire)
                {
                    //_sfx.playGun(1);
                    this._entities.shootBullet();
                }
            }
        }

        private startGame():void
        {
            console.log("Starting game!");
            this._state = 1;
            this._spriteStage.removeLayer(this._mainmenu.batch);
            //_sfx.playMusic();
            // add the player entity to the game!
            this.thePlayer = this._entities.addPlayer(this.playerLogic);
        }

        public playerLogic = (me:Entity)=>
        {
            me.speedY = me.speedX = 0;
            if (this._controls.pressing.up)
                me.speedY = -4;
            if (this._controls.pressing.down)
                me.speedY = 4;
            if (this._controls.pressing.left)
                me.speedX = -4;
            if (this._controls.pressing.right)
                me.speedX = 4;

            // keep on screen
            if (me.sprite.position.x < 0)
                me.sprite.position.x = 0;
            if (me.sprite.position.x > this.stage3d.stageWidth)
                me.sprite.position.x = this.stage3d.stageWidth;
            if (me.sprite.position.y < 0)
                me.sprite.position.y = 0;
            if (me.sprite.position.y > this.stage3d.stageHeight)
                me.sprite.position.y = this.stage3d.stageHeight;
        }
        private onEnterFrame = () =>
        {
            //console.log(this._controls.textDescription());
            //console.log(this._entities.numReused , this._entities.numCreated);
            try
            {
                this.stats.begin();

                this.currentTime = this.getTimer();

                // erase the previous frame
                this.context3D.clear(0, 0, 0, 1);

                this.processInput();
                //this._bg.update(currentTime);

                // scroll the background
                this._bg.update(this.currentTime);

                if(this._state == 0)
                  this._mainmenu.update(this.currentTime);

                // keep adding more sprites - FOREVER!
                // this is a test of the entity manager's
                // object reuse "pool"
                this._entities.addEntity();

                // move/animate all entities
                this._entities.update(this.currentTime);

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

        private getTimer():number
        {
            return Date.now() - this._start;
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
            lib.ImageLoader.getInstance().add("assets/sprites.png");
            lib.ImageLoader.getInstance().add("assets/titlescreen.png");
            lib.ImageLoader.getInstance().add("assets/stars.gif");

            lib.ImageLoader.getInstance().downloadAll(function(){
                new ShooterMain(ShooterMain.canvas = <HTMLCanvasElement>document.getElementById("my-canvas"));
            });

        }

    }
}