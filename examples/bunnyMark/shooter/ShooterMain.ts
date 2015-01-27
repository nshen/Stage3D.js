///<reference path="reference.ts"/>
module shooter
{
    declare var Stats:any;

    export class ShooterMain
    {

        // v6 fill the entire screen for HD gaming
        public enableFullscreen:boolean = true;

        // v6 players generally hold down the fire button anyway
        // plus in fullscreen only arrow keys can be relied upon
        public enableAutofire:boolean = true;

        // v6 this allows for SLOW-MO and fast forward
        public timeDilation:number = 1;


        // the game save/load system
        public saved:GameSaves;

        // the keyboard control system
        private _controls : shooter.GameControls;

        // don't update the menu too fast
        private nothingPressedLastFrame:boolean = false;
        // timestamp of the current frame
        private currentTime:number = 0;
        // for framerate independent speeds
        public currentFrameMs:number = 0;
        public previousFrameTime:number = 0;

        // player one's entity
        public thePlayer:Entity;
        // movement speed in pixels per second
        public playerSpeed:number = 180;
        // timestamp when next shot can be fired
        private nextFireTime:number = 0;
        // how many ms between shots
        private fireDelay:number = 200;

        // main menu = 0 or current level number
        private _state:number = 0;
        // the title screen batch
        private _mainmenu : shooter.GameMenu;
        //todo:sound
        //private _sfx:shooter.GameSound;
        // the background stars
        private _bg : shooter.GameBackground;

        private _terrain:shooter.EntityManager;
        private _entities:shooter.EntityManager;
        private _spriteStage:GPUSprite.SpriteRenderStage; // LiteSpriteStage

        //private _gui:GameGUI; //todo:gui

        public stage3d:stageJS.Stage3D;
        public context3D:stageJS.Context3D;

        private _start:number; //getTimer


        public constructor(canvas:HTMLCanvasElement)
        {
            this.stage3d = new stageJS.Stage3D(canvas);
            this.stage3d.addEventListener(stageJS.events.Event.CONTEXT3D_CREATE, this.onContext3DCreate);
            this.stage3d.requestContext3D();
        }

        private onContext3DCreate = (e:stageJS.events.Event) =>
        {
            this.context3D = this.stage3d.context3D;
            this.initSpriteEngine();
        };

        private onResizeEvent111(event:Event) : void // v6
        {
            return;
            console.log("resize event...");

            console.log(this.stage3d.stageWidth ,this.stage3d.stageHeight);


            // Get the canvas from the WebGL context
            var canvas = ShooterMain.canvas;

            // Lookup the size the browser is displaying the canvas.
            var displayWidth  = canvas.clientWidth;
            var displayHeight = canvas.clientHeight;

            // Check if the canvas is not the same size.
            if (canvas.width  != displayWidth ||
                canvas.height != displayHeight) {

                // Make the canvas the same size
                canvas.width  = displayWidth;
                canvas.height = displayHeight;

                // Set the viewport to match
                this._spriteStage.configureBackBuffer(canvas.width, canvas.height);
            }


            // Set correct dimensions if we resize
            //_width = stage.stageWidth;
            //_height = stage.stageHeight;

            // Resize Stage3D to continue to fit screen
            var view:{x:number;y:number;width:number;height:number} = {x:0,y:0,width:this.stage3d.stageWidth,height:this.stage3d.stageHeight};
            //if ( this._spriteStage != null ) {
            //    this._spriteStage.position = view;
            //}
            //if (this._terrain != null) {
            //    this._terrain.setPosition(view);
            //}
            //if (this._entities != null) {
            //    this._entities.setPosition(view);
            //}
            //if (this._mainmenu != null) {
            //    this._mainmenu.setPosition(view);
            //}
            //if (this._bg != null) {
            //    this._bg.setPosition(view);
            //}
            //if (this._gui != null)
            //    this._gui.setPosition(view);
        }

        private checkResize():void
        {
            var canvas = ShooterMain.canvas;

            // Lookup the size the browser is displaying the canvas.
            var displayWidth  = canvas.clientWidth;
            var displayHeight = canvas.clientHeight;

            // Check if the canvas is not the same size.
            if (canvas.width  != displayWidth ||
                canvas.height != displayHeight) {

                // Make the canvas the same size
                canvas.width  = displayWidth;
                canvas.height = displayHeight;

                // Set the viewport to match

                //this._spriteStage.configureBackBuffer(canvas.width,canvas.height);
                this.onResize();
            }
        }

        private onResize():void
        {
            console.log("onResize:",ShooterMain.canvas.width,ShooterMain.canvas.height);
            var view:{x:number;y:number;width:number;height:number} =
            {x:0,y:0,width:ShooterMain.canvas.width,height:ShooterMain.canvas.height};
            if(this._spriteStage != null)
                this._spriteStage.position = view;
            if(this._terrain != null)
                this._terrain.setPosition(view);

            if (this._entities != null) {
                this._entities.setPosition(view);
            }
            if (this._mainmenu != null) {
                this._mainmenu.setPosition(view);
            }
            if (this._bg != null) {
                this._bg.setPosition(view);
            }
            //if (_gui != null) todo:gui
            //    _gui.setPosition(view);
        }

        private initSpriteEngine():void
        {
           // this.onResizeEvent(null);
            this._start = new Date().valueOf();

            this.initStats();

            //this._sfx = new //todo sound gui

            this._controls = new shooter.GameControls(window);


            var _width:number = this.stage3d.stageWidth;
            var _height:number = this.stage3d.stageHeight;



            var stageRect:GPUSprite.Rectangle = new GPUSprite.Rectangle(0,0,_width,_height);
            this._spriteStage = new GPUSprite.SpriteRenderStage(this.stage3d,this.context3D,stageRect);
            this._spriteStage.configureBackBuffer(_width,_height);

            // create the background stars
            this._bg = new shooter.GameBackground(stageRect);
            var batch:GPUSprite.SpriteRenderLayer = this._bg.createBatch(this.context3D);
            this._bg.initBackground();
            this._spriteStage.addLayer(batch,"bg");

            //Terrain
            this._terrain = new shooter.EntityManager(stageRect);
            this._terrain.sourceImage = "assets/terrain.png";
            this._terrain.defaultSpeed = 90;
            this._terrain.defaultScale = 1.5;
            this._terrain.levelTilesize = 48;
            batch = this._terrain.createBatch(this.context3D,16,16,0.002);
            this._spriteStage.addLayer(batch,"terrain");
            this._terrain.changeLevels("terrain" + this._state);

            // create a single rendering batch
            // which will draw all sprites in one pass
            this._entities = new shooter.EntityManager(stageRect);
            this._entities.sourceImage = "assets/sprites.png";
            this._entities.defaultScale = 1.5;
            this._entities.levelTilesize = 48;
            batch = this._entities.createBatch(this.context3D,8,8,0.0015);
            //this._entities.sfx = this._sfx; todo:sound
            this._spriteStage.addLayer(batch,"entities"); // addBatch
            this._entities.changeLevels("level" + this._state);
            this._entities.streamLevelEntities(true); // spawn first row of the level immediately

            // create the logo/titlescreen main menu
            this._mainmenu = new shooter.GameMenu(stageRect);
            batch = this._mainmenu.createBatch(this.context3D);
            this._spriteStage.addLayer(batch);


            //this._gui = new shooter.GameGUI(); // todo:gui
            //batch = this._gui.createBatch(this.context3D);
            //this._spriteStage.addLayer(batch);
            // tell the gui where to grab statistics from

            //_gui.statsTarget = _entities;

            this.saved = new shooter.GameSaves();
            //this._gui.highScore = this.saved.score; // todo:gui
            //this._gui.level = this.saved.level;

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

            //ShooterMain.canvas.onmouseup = (ev:MouseEvent)=>
            //{
            //
            //}

            ShooterMain.canvas.onmousemove = (ev:MouseEvent)=>
            {
                if (this._state == 0) // are we at the main menu?
                {
                    // select menu items via mouse
                    if (this._mainmenu) this._mainmenu.mouseHighlight(ev.clientX, ev.clientY);
                }
            }

            // this forces the game to fill the screen
            this.checkResize();
            // start the render loop
            this.onEnterFrame();//stage.addEventListener(Event.ENTER_FRAME,onEnterFrame);

        }
        // v6 initialize a boss battle
        private bossSpriteID:number = 0;
        private bossBattle():void
        {
            console.log("Boss battle begins!");
            // a special sprite that is larger than the rest
            if (!this.bossSpriteID) this.bossSpriteID = this._entities._spriteSheet.defineSprite(160, 128, 96, 96); // 256x256 texture // v6
            //if (!bossSpriteID) bossSpriteID = _entities.spriteSheet.defineSprite(320, 256, 192, 192); // 512x512 texture
            var anEntity:Entity;
            anEntity = this._entities.respawn(this.bossSpriteID);
            anEntity.sprite.position.x = this.stage3d.stageWidth + 64;
            anEntity.sprite.position.y = this.stage3d.stageHeight / 2;
            anEntity.sprite.scaleX = anEntity.sprite.scaleY = 2; // v6
            anEntity.aiFunction = anEntity.bossAI;
            anEntity.isBoss = true;
            anEntity.collideradius = 96;
            anEntity.collidemode = 1;
            //_gui.addChild(_gui.bosshealthTf); todo:gui
            anEntity.health = 100;
            // ensure that our bullets can hit it
            if (!anEntity.recycled)
                this._entities.allEnemies.push(anEntity);
            this._entities.theBoss = anEntity;
            this._entities.bossDestroyedCallback = this.bossComplete;
        }

        // the entity manager calls this when a boss is destroyed
        public bossComplete = ()=>
        {
            console.log("bossComplete!");

            this.thePlayer.score += 1000;

            // remove the boss health bar
            //if (_gui.contains(_gui.bosshealthTf)) todo:gui
            //    _gui.removeChild(_gui.bosshealthTf);

            // so next time we get a fresh one
            this._entities.theBoss = null;

            // remove the +1000 boss battle state
            // and add one so that we go to the next level
            this._state -= 999;
            // trigger a "level complete" transition
            this.thePlayer.transitionTimeLeft = this.thePlayer.transitionSeconds;
        }

        // check player transition state (deaths, game over, etc)
        private currentTransitionSeconds:number = 0;
        private handleTransitions(seconds:number):void
        {
            // are we at a pending transition (death or level change)?
            if (this.thePlayer.transitionTimeLeft > 0)
            {
                this.currentTransitionSeconds += seconds;
                this.thePlayer.transitionTimeLeft -= seconds;

                if (this.thePlayer.transitionTimeLeft > 0)
                {	//was it a level change?
                    if (this.thePlayer.level != this._state && this._state < 1000)
                    {
                        // todo:gui
                         if (this._state == -1)
                         {
                             //_gui.transitionText = "\n\n\n\n\n\nCONGRATULATIONS\n\n" +
                             //"You fought bravely and defended\n" +
                             //"the universe from certain doom.\n\nYou got to level " +
                             //thePlayer.level + "\nwith " + thePlayer.score + " points." +
                             //"\n\nCREDITS:\n\nProgramming: McFunkypants\n(mcfunkypants.com)\n\n" +
                             //"Art: Daniel Cook\n(lostgarden.com)\n\n" +
                             //"Music: MaF\n(maf464.com)\n\n" +
                             //"Thanks for playing!";
                             //_gui.transitionTf.scrollRect = new Rectangle(0, currentTransitionSeconds * 40, 600, 160);
                             console.log("thanks for playing");

                            this.timeDilation = 0.5; // slow mo

                         // v6
                         //if (_gui.npcText == "") _sfx.playNPCthanks();
                         //_gui.npcText = "You saved us!\nThank you!\nMy hero!";
                         }
                         else if (this._state == 0)
                         {
                             //_gui.transitionText = "GAME OVER\nYou got to level " + thePlayer.level
                             //+ "\nwith " + thePlayer.score + " points.";
                             //
                             //if (_gui.npcText == "") _sfx.playNPCgameover();
                             //_gui.npcText = "You were incredible.\nThere were simply too many of them.\nYou'll win next time. I know it.";
                             //

                             console.log("GAME OVER\nYou got to level"+ this.thePlayer.level);
                             this.timeDilation = 0.5; // slow mo
                         }
                         else if (this._state > 1)
                         {
                             //_gui.transitionText = "\nLEVEL " + (_state-1) + " COMPLETE!";
                             //
                             //if (_gui.npcText == "") _sfx.playNPCnextlevel();
                             //_gui.npcText = "That was amazing!\nYou destroyed it!\nYour skill is legendary.";
                             console.log("level "+(this._state -1)+" complete!");
                         }
                         else
                         {
                             console.log("level "+this._state);
                             //_gui.transitionText = "\nLEVEL " + _state;
                             //
                             //if (_gui.npcText == "") _sfx.playNPCwelcome();
                             //_gui.npcText = "We're under attack! Please help us!\nYou're our only hope for survival.\nUse the arrow keys to move.";
                         }
                    }
                    else  // must be a death or boss battle
                    {

                        if ((this._state > 1000) && (this.thePlayer.health > 0)) // v6
                        {
                            console.log("incoming boss battle");
                            //_gui.transitionText = "\nINCOMING BOSS BATTLE!";todo:gui
                            //
                            //if (_gui.npcText == "") _sfx.playNPCboss();
                            //_gui.npcText = "Be careful! That ship is HUGE!\nKeep moving and watch out for\nany burst attacks. Good luck!";
                        }
                        else
                        {
                            //_gui.transitionText = "Your ship was destroyed.\n\nYou have "
                            //+ thePlayer.lives + (thePlayer.lives != 1 ? " lives" : " life") + " left.";
                            //
                            //if (_gui.npcText == "") _sfx.playNPCdeath();
                            //_gui.npcText = "Nooooo!\nDon't give up! I believe in you!\nYou can do it.";


                            this.timeDilation = 0.5; // slow mo
                            console.log("your ship was destroyed!");
                        }

                    }
                    if (this.thePlayer.lives < 0 || this.thePlayer.health <= 0)
                    {
                        // during the death transition, spawn tons of explosions just for fun
                        if (Math.random() < 0.2)
                        {
                            var explosionPos:any = {};
                            explosionPos.x = this.thePlayer.sprite.position.x + Math.random() * 128 - 64;
                            explosionPos.y = this.thePlayer.sprite.position.y + Math.random() * 128 - 64;
                            this._entities.particles.addExplosion(explosionPos);
                        }
                    }
                }
                else // transition time has elapsed
                {
                    //_gui.npcText = ""; // todo:gui
                    this.timeDilation = 1; // turn off slow-mo
                    this.currentTransitionSeconds = 0;

                    this.thePlayer.transitionTimeLeft = 0;

                    if (this._state == -1) this._state = 0;

                    //this._gui.transitionTf.scrollRect = new Rectangle(0,0,600,160);
                    //this._gui.transitionText = "";
                    //todo:gui
                    if ((this.thePlayer.health <= 0) && (this._state != 0)) // we died
                    {
                        console.log("Death transition over. Respawning player.");
                        this.thePlayer.sprite.position.y = this._entities.midpoint;
                        this.thePlayer.sprite.position.x = 64;
                        this.thePlayer.health = 100;

                        // failed to kill boss:
                        if (this._state > 1000)
                        {
                            console.log('Filed to kill boss. Resetting.');
                            this._state -= 1000;
                            //_gui.bosshealth = -999; todo:gui
                            // remove the boss health bar
                            //if (_gui.contains(_gui.bosshealthTf))
                            //    _gui.removeChild(_gui.bosshealthTf);

                            //// remove the boss itself
                            if (this._entities.theBoss)
                            {
                                this._entities.theBoss.die();
                                this._entities.theBoss = null;
                            }
                        }

                        // start the level again
                        this._entities.changeLevels('level' + this._state);
                        this._terrain.changeLevels('terrain' + this._state);
                    }
                    if (this.thePlayer.level != this._state && (this._state < 1000))
                    {
                        console.log('Level transition over. Starting level ' + this._state);
                        this.thePlayer.level = this._state;
                        if (this._state > 1) // no need to reload at startGame
                        {
                            this._entities.changeLevels('level' + this._state);
                            this._terrain.changeLevels('terrain' + this._state);
                            //_gui.statsText = "Level " + _state; // todo:gui
                        }
                        if (this._state == 0) // game over
                        {
                            console.log('Game Over transition over: starting main menu');
                            this.thePlayer.health = 100;
                            this.thePlayer.lives = 3;
                            this.thePlayer.sprite.visible = false;
                            this._entities.theOrb.sprite.visible = false;
                            this._entities.changeLevels('level' + this._state);
                            this._terrain.changeLevels('terrain' + this._state);
                            this._spriteStage.addLayer(this._mainmenu.batch);
                            //_gui.statsText = "GAME OVER"; // v6
                            //_gui.bosshealth = 0;
                            // remove the boss health bar if any
                            //if (_gui.contains(_gui.bosshealthTf))
                            //    _gui.removeChild(_gui.bosshealthTf);
                            // go back to normal size
                            if (this.enableFullscreen)
                            {
                                console.log('Leaving fullscreen...');
                                //todo:leave fullscreen
                                //stage.displayState = StageDisplayState.NORMAL;
                            }
                        }
                    }
                }
            }
        }



        public playerLogic = (seconds:number)=>
        {
            var me:Entity = this.thePlayer;
            me.age += seconds;
            this.handleTransitions(seconds);
            me.speedY = me.speedX = 0;

            if(this._state == 0 )
                return;

            if (this._controls.pressing.up)
                me.speedY = -this.playerSpeed;
            if (this._controls.pressing.down)
                me.speedY = this.playerSpeed;
            if (this._controls.pressing.left)
                me.speedX = -this.playerSpeed;
            if (this._controls.pressing.right)
                me.speedX = this.playerSpeed;

            if (this._controls.pressing.fire && (this.thePlayer.health > 0))
            {
                // is it time to fire again?
                if (this.currentTime >= this.nextFireTime)
                {
                    //console.log("Fire!");
                    this.nextFireTime = this.currentTime + this.fireDelay;
                    //_sfx.playGun(1); todo:sound
                    this._entities.shootBullet(3);
                }
            }

            // keep on screen
            if (me.sprite.position.x < 0)
                me.sprite.position.x = 0;
            if (me.sprite.position.x > this.stage3d.stageWidth)
                me.sprite.position.x = this.stage3d.stageWidth;
            if (me.sprite.position.y < 0)
                me.sprite.position.y = 0;
            if (me.sprite.position.y > this.stage3d.stageHeight)
                me.sprite.position.y = this.stage3d.stageHeight;

            // leave a trail of particles
            this._entities.particles.addParticle(63,
                me.sprite.position.x - 12,
                me.sprite.position.y + 2,
                0.75, -200, 0, 0.4, NaN, NaN, -1, -1.5);

            // v5 if we are about to die, spew <a> sparks warning
            if (me.health < 10)
                this._entities.particles.addSparks(me.sprite.position, 1, 2);

            // when the player gets damaged, they become
            // invulnerable for a short perod of time
            if (this.thePlayer.invulnerabilityTimeLeft > 0)
            {
                this.thePlayer.invulnerabilityTimeLeft -= seconds;
                if (this.thePlayer.invulnerabilityTimeLeft <= 0)
                {
                    console.log("Invulnerability wore off.");
                    this.thePlayer.sprite.alpha = 1;
                }
                else // while invulnerable, flicker
                {
                    this.thePlayer.sprite.alpha = Math.sin(this.thePlayer.age * 30) / Math.PI  + 0.25;
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
                        //_sfx.playGun(1); // todo sound
                        this._mainmenu.nextMenuItem();
                        this.nothingPressedLastFrame = false;
                    }
                }
                else if (this._controls.pressing.up || this._controls.pressing.left)
                {
                    if (this.nothingPressedLastFrame)
                    {
                        //_sfx.playGun(1); // todo sound
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

        }

        private startGame():void
        {
            console.log("Starting game!");
            this._state = 1;
            this._spriteStage.removeLayer(this._mainmenu.batch);

            //_sfx.playMusic(); // todo sound

            if (this.enableAutofire) // v6
            {
                this._controls.autofire = true;
            }

            // v6 fullscreen mode!
            // Note: security blocks keyboard except
            // arrows and space, so WASD keys don't work...
            // also pressing left+up+space doesn't work on
            // normal keyboards (therefore we implemented autofire)
            if (this.enableFullscreen)
            {
                //try
                //{
                //    console.log('Going fullscreen...');
                //    // remember to add this to your HTML:
                //    // <param name="allowFullScreen" value="true" />
                //    //todo:fullscreen stage.displayState = StageDisplayState.FULL_SCREEN;
                //    var i:any = document.getElementById("my-canvas");
                //
                //    // go full-screen
                //    if (i.requestFullscreen) {
                //        i.requestFullscreen();
                //    } else if (i.webkitRequestFullscreen) {
                //        i.webkitRequestFullscreen();
                //    } else if (i.mozRequestFullScreen) {
                //        i.mozRequestFullScreen();
                //    } else if (i.msRequestFullscreen) {
                //        i.msRequestFullscreen();
                //    }
                //
                //    var FShandler = () =>
                //    {
                //        //ShooterMain.canvas.width = window.innerWidth;
                //        //ShooterMain.canvas.height = window.innerHeight;
                //        ////this.onResizeEvent(null);
                //        //console.log(ShooterMain.canvas.clientWidth,"###");
                //        //this._spriteStage.configureBackBuffer(ShooterMain.canvas.width, ShooterMain.canvas.height);
                //
                //    }
                //
                //    document.addEventListener("fullscreenchange", FShandler);
                //    document.addEventListener("webkitfullscreenchange", FShandler);
                //    document.addEventListener("mozfullscreenchange", FShandler);
                //    document.addEventListener("MSFullscreenChange", FShandler);
                //
                //}
                //catch (err)
                //{
                //    console.log("Error going fullscreen.");
                //}
                // in Flash 11.3 (summer 2012) you can use the following
                // for full keyboard access but it asks the user for permission first
                // stage.displayState = StageDisplayState.FULL_SCREEN_INTERACTIVE;
                // you also need to add this to your html
                // <param name="allowFullScreenInteractive" value="true" />
            }



            // add the player entity to the game!
            if(!this.thePlayer)
                this.thePlayer = this._entities.addPlayer(this.playerLogic);
            else
                this.thePlayer.sprite.visible = true;

            if(this._entities.theOrb)
                this._entities.theOrb.sprite.visible = true;

            //load level one (and clear demo entities)

            this._entities.changeLevels("level" + this._state);
            this._terrain.changeLevels("terrain" + this._state);
            //_gui.statsText = "Level " + _state; // todo:gui

            // reset the player position
            this.thePlayer.level = 0; // it will transition to 1
            this.thePlayer.score = 0;
            this.thePlayer.lives = 3;
            this.thePlayer.sprite.position.x = 64;
            this.thePlayer.sprite.position.y = this._entities.midpoint;

            // add a "welcome message"
            this.thePlayer.transitionTimeLeft = this.thePlayer.transitionSeconds;

            // make the player invulnerable at first
            this.thePlayer.invulnerabilityTimeLeft = this.thePlayer.transitionSeconds + this.thePlayer.invulnerabilitySecsWhenHit;


        }




        // v5 triggered if the player loses all lives
        private gameOver():void
        {
            console.log("================ GAME OVER ================");

            // save game
            if (this.saved.level < this.thePlayer.level)
                this.saved.level = this.thePlayer.level;
            if (this.saved.score < this.thePlayer.score)
            {
                this.saved.score = this.thePlayer.score;
                //this._gui.highScore = this.thePlayer.score; todo:gui
            }

            this._state = 0;

            this.thePlayer.transitionTimeLeft = this.thePlayer.transitionSeconds;


            if (this.enableAutofire)
            {
                this._controls.autofire = false; // v6
                this._controls.pressing.fire = false;
            }

        }


        // v5 detect if we just died, etc.
        private checkPlayerState():void
        {
            if (this._state == 0) return;
            if (this.thePlayer)
            {
                if (this.thePlayer.lives < 0)
                {
                    this.gameOver();
                }
            }
        }

        // v5 check to see if we reached the end of the map/game
        private checkMapState():void
        {
            // main menu or gameover credits?
            if (this._state < 1) return;
            // in the middle of a boss battle? // v6
            if (this._state > 1000) return;


            // already transitioning?
            if (this.thePlayer.level != this._state) return;

            // allow some extra spaces for the level to scroll past
            // the player and then call the level complete.
            if (this._terrain.levelPrevCol > this._terrain.level.levelLength)
            {
                console.log("LEVEL " + this._state  + " COMPLETED!");

                this.bossBattle();
                this._state+= 1000;

                this.thePlayer.transitionTimeLeft = this.thePlayer.transitionSeconds;

                if (this._entities.level.levelLength == 0)
                {
                    console.log("NO MORE LEVELS REMAIN! GAME OVER!");
                    this.rollTheCredits();
                }
            }
        }

        // display the "game cleared" screen
        private rollTheCredits():void
        {
            this.gameOver();
            this._state = -1;
            this.thePlayer.transitionTimeLeft = this.thePlayer.transitionSeconds * 3;
        }



        private onEnterFrame = () =>
        {
            this.checkResize();

            //console.log(this._controls.textDescription());
            //console.log(this._entities.numReused , this._entities.numCreated);
            //try
            //{
                this.stats.begin();

                // grab timestamp of current frame
                this.currentTime = this.getTimer();
                this.currentFrameMs = (this.currentTime - this.previousFrameTime) * this.timeDilation;
                this.previousFrameTime = this.currentTime;


                // erase the previous frame
                this.context3D.clear(0, 0, 0, 1);

                // process any player input
                this.processInput();

                // scroll the background
                if( this._entities.thePlayer )
                    this._bg.yParallax(this._entities.thePlayer.sprite.position.y / this.stage3d.stageHeight);

                this._bg.update(this.currentTime);

                // update the main menu titlescreen
                if(this._state == 0)
                  this._mainmenu.update(this.currentTime);

                //console.log(this._terrain.levelCurrentScrollX);
                // move/animate all entities
                this._terrain.update(this.currentFrameMs);
                this._entities.update(this.currentFrameMs);

                // keep adding more sprites - IF we need to
                this._terrain.streamLevelEntities(false);
                this._entities.streamLevelEntities(true);


                // draw all entities
                this._spriteStage.drawDeferred(); //render

                // update the screen
                this.context3D.present();

                // check for gameover/death
                this.checkPlayerState();

                //check for the end of the level
                this.checkMapState();

                this.stats.end();
            //}
            //catch (e)
            //{
            //    console.log("computer goes to sleep ?" ,e.toString());
            //    // this can happen if the computer goes to sleep and
            //    // then re-awakens, requiring reinitialization of stage3D
            //    // (the onContext3DCreate will fire again)
            //}


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
            ShooterMain.canvas = <HTMLCanvasElement>document.getElementById("my-canvas")

            lib.ImageLoader.getInstance().add("assets/sprites.png");
            lib.ImageLoader.getInstance().add("assets/titlescreen.png");
            lib.ImageLoader.getInstance().add("assets/stars.gif");
            lib.ImageLoader.getInstance().add("assets/terrain.png");
            lib.ImageLoader.getInstance().add("assets/hud_overlay.png");

            lib.ImageLoader.getInstance().downloadAll(function(){
                if(lib.FileLoader.getInstance().isDone())
                    new ShooterMain( ShooterMain.canvas);
            });


            lib.FileLoader.getInstance().add("assets/level0.oel");
            lib.FileLoader.getInstance().add("assets/terrain0.oel");
            lib.FileLoader.getInstance().add("assets/level1.oel");
            lib.FileLoader.getInstance().add("assets/terrain1.oel");
            lib.FileLoader.getInstance().add("assets/level2.oel");
            lib.FileLoader.getInstance().add("assets/terrain2.oel");
            lib.FileLoader.getInstance().add("assets/level3.oel");
            lib.FileLoader.getInstance().add("assets/terrain3.oel");

            lib.FileLoader.getInstance().downloadAll(()=>
            {
                if (lib.ImageLoader.getInstance().isDone())
                    new ShooterMain(ShooterMain.canvas);
            })
        }

    }
}