// Stage3D Shoot-em-up Tutorial Part 5
// by Christer Kaitila - www.mcfunkypants.com

// GameGUI.as
// A typical simplistic framerate display for benchmarking performance,
// plus a way to track rendering statistics from the entity manager.
// In this version, we include all sorts of GUI displays <score> such,
// highscore, lives <well> left as a "health bar".

///<reference path="reference.ts" />
module shooter
{

    export class GameGUI
    {

        public spriteSheet:GPUSprite.SpriteSheet;
        public batch:GPUSprite.SpriteRenderLayer; // : LiteSpriteBatch;


        //// Font used by the GUI - only embed the chars we need to save space
        //[Embed (source = '../assets/gui_font.ttf',
        //embedAsCFF = 'false',
        //fontFamily = 'guiFont',
        //mimeType = 'application/x-font-truetype',
        //unicodeRange='U+0020-U+002F, U+0030-U+0039, U+003A-U+0040, U+0041-U+005A, U+005B-U+0060, U+0061-U+007A, U+007B-U+007E')]
        //private GUI_FONT:Class;
        //private myFormat:TextFormat;
        //private myFormatRIGHT:TextFormat;
        //private myFormatCENTER:TextFormat;
        //
        //// GUI bitmap overlays
        // [Embed (source = "../assets/hud_overlay.png")]
        //private hudOverlayData:Class;
        //private hudOverlay:Bitmap = new hudOverlayData();
        //
        //// text on the screen
        //public scoreTf:TextField;
        //public highScoreTf:TextField;
        //public levelTf:TextField;
        //public healthTf:TextField;
        //public transitionTf:TextField;
        //public transitionTf_y_location:number = 162;
        //
        //// numeric values for the text above
        //// used to cache player stats to detect changes
        //// so that textfields will only be updated if needed
        //public score:number = 0;
        //public prevHighScore:number = 0;
        //public highScore:number = 0;
        //public level:number = 0;
        //public lives:number = 3;
        //public health:number = 100;
        //public transitionText:string = "";
        //
        //// debug stats (only used during development)
        //public debugStatsTf:TextField;
        //public titleText : string = "";
        //public statsText : string = "";
        //public statsTarget : EntityManager;
        //public frameCount:number = 0;
        //public timer:number;
        //public ms_prev:number;
        //public lastfps : number = 60;

        constructor(title:string = "", inX:number=0, inY:number=0, inCol:number = 0xFFFFFF)
        {
            //x = inX;
            //y = inY;
            //titleText = title;
            //
            //// used for most GUI text
            //var myFont:Font = new GUI_FONT();
            //myFormat = new TextFormat();
            //myFormat.color = inCol;
            //myFormat.size = 16;
            //myFormat.font = myFont.fontName;
            //
            //// used only by the score
            //myFormatRIGHT = new TextFormat();
            //myFormatRIGHT.color = inCol;
            //myFormatRIGHT.size = 16;
            //myFormatRIGHT.font = myFont.fontName;
            //myFormatRIGHT.align = 'right';
            //
            //// used by the transition texts
            //myFormatCENTER = new TextFormat();
            //myFormatCENTER.color = inCol;
            //myFormatCENTER.size = 32;
            //myFormatCENTER.font = myFont.fontName;
            //myFormatCENTER.align = 'center';
            //
            //this.addEventListener(Event.ADDED_TO_STAGE, onAddedHandler);
        }

        // the sprites
        public bgSprite:GPUSprite.Sprite;//LiteSprite;
        public createBatch(context3D:stageJS.Context3D) : GPUSprite.SpriteRenderLayer//LiteSpriteBatch
        {
            var b:stageJS.BitmapData = new stageJS.BitmapData(1024,64,true);
            b.draw(lib.ImageLoader.getInstance().get("assets/hud_overlay.png"));

            // create a spritesheet using the titlescreen image
            this.spriteSheet = new GPUSprite.SpriteSheet(b, 0, 0);

            // Create new render batch
            this.batch = new GPUSprite.SpriteRenderLayer(context3D, this.spriteSheet);

            // set up all required sprites right now
            var bg:number = this.spriteSheet.defineSprite(0, 0, 600, 40);
            this.bgSprite = this.batch.createChild(bg);
            this.bgSprite.position.x = 300;
            this.bgSprite.position.y = 20;



            return this.batch;
        }


     /*   public onAddedHandler(e:Event):void
        {
            console.log("GameGUI was added to the stage");

            addChild(hudOverlay);

            // used for FPS display
            debugStatsTf = new TextField();
            debugStatsTf.defaultTextFormat = myFormat;
            debugStatsTf.embedFonts = true;
            debugStatsTf.x = 18;
            debugStatsTf.y = 0;
            debugStatsTf.width = 320;
            debugStatsTf.selectable = false;
            debugStatsTf.text = titleText;
            debugStatsTf.antiAliasType = 'advanced';
            addChild(debugStatsTf);

            // create a score display
            scoreTf = new TextField();
            scoreTf.defaultTextFormat = myFormatRIGHT;
            scoreTf.embedFonts = true;
            scoreTf.x = 442;
            scoreTf.y = 0;
            scoreTf.selectable = false;
            scoreTf.antiAliasType = 'advanced';
            scoreTf.text = "SCORE: 000000\n3 LIVES LEFT";
            scoreTf.width = 140;
            addChild(scoreTf);

            // high score display
            highScoreTf = new TextField();
            highScoreTf.defaultTextFormat = myFormat;
            highScoreTf.embedFonts = true;
            highScoreTf.x = 232;
            highScoreTf.y = 0;
            highScoreTf.selectable = false;
            highScoreTf.antiAliasType = 'advanced';
            highScoreTf.text = "HIGH SCORE: 000000";
            highScoreTf.width = 320;
            addChild(highScoreTf);

            // add a health meter
            healthTf = new TextField();
            healthTf.defaultTextFormat = myFormat;
            healthTf.embedFonts = true;
            healthTf.x = 232;
            healthTf.y = 15;
            healthTf.selectable = false;
            healthTf.antiAliasType = 'advanced';
            healthTf.text = "HP: |||||||||||||";
            healthTf.width = 320;
            addChild(healthTf);

            // add a "transition text" display
            transitionTf = new TextField();
            transitionTf.defaultTextFormat = myFormatCENTER;
            transitionTf.embedFonts = true;
            transitionTf.x = 0;
            transitionTf.y = transitionTf_y_location;
            transitionTf.selectable = false;
            transitionTf.filters = [new GlowFilter(0xFF0000, 1, 8, 8, 4, 2)];
            transitionTf.antiAliasType = 'advanced';
            transitionTf.text = "";
            transitionTf.width = 600;
            transitionTf.height = 2000;
            transitionTf.scrollRect = new Rectangle(0, 0, 600, 160);
            // keep off screen until needed
            // addChild(transitionTf);

            stage.addEventListener(Event.ENTER_FRAME, onEnterFrame);
        }

        private pad0s(num:number):string
        {
            if (num < 10) return '00000' + num;
            else if (num < 100) return '0000' + num;
            else if (num < 1000) return '000' + num;
            else if (num < 10000) return '00' + num;
            else if (num < 100000) return '0' + num;
            else return '' + num;
        }

        // only updates textfields if they have changed
        private updateScore():void
        {
            if (transitionText != transitionTf.text)
            {
                transitionTf.text = transitionText;
                if (transitionTf.text != "")
                {
                    if (!contains(transitionTf))
                        addChild(transitionTf);
                }
                else
                {
                    if (contains(transitionTf))
                        removeChild(transitionTf);
                }
            }

            if (statsTarget && statsTarget.thePlayer)
            {
                if (health != statsTarget.thePlayer.health)
                {
                    health = statsTarget.thePlayer.health;
                    // generate the health bar (13 chars simply happens to fit the gui nicely)
                    if (statsTarget.thePlayer.health >= 99) healthTf.text = "HP: |||||||||||||";
                    else if (statsTarget.thePlayer.health >= 92) healthTf.text = "HP: ||||||||||||";
                    else if (statsTarget.thePlayer.health >= 84) healthTf.text = "HP: |||||||||||";
                    else if (statsTarget.thePlayer.health >= 76) healthTf.text = "HP: ||||||||||";
                    else if (statsTarget.thePlayer.health >= 68) healthTf.text = "HP: |||||||||";
                    else if (statsTarget.thePlayer.health >= 60) healthTf.text = "HP: ||||||||";
                    else if (statsTarget.thePlayer.health >= 52) healthTf.text = "HP: |||||||";
                    else if (statsTarget.thePlayer.health >= 44) healthTf.text = "HP: ||||||";
                    else if (statsTarget.thePlayer.health >= 36) healthTf.text = "HP: |||||";
                    else if (statsTarget.thePlayer.health >= 28) healthTf.text = "HP: ||||";
                    else if (statsTarget.thePlayer.health >= 20) healthTf.text = "HP: |||";
                    else if (statsTarget.thePlayer.health >= 12) healthTf.text = "HP: ||";
                    else healthTf.text = "HP: |";
                }
                if ((score != statsTarget.thePlayer.score) || (lives != statsTarget.thePlayer.lives))
                {
                    score = statsTarget.thePlayer.score;
                    lives = statsTarget.thePlayer.lives;
                    if (lives == -1)
                        scoreTf.text = scoreTf.text = 'SCORE: ' + pad0s(score) + '\n' +'GAME OVER';
                    else
                        scoreTf.text = 'SCORE: ' + pad0s(score) + '\n' + lives +
                        (lives != 1 ? ' LIVES' : ' LIFE') + ' LEFT';
                    // we may be beating the high score right now
                    if (score > highScore) highScore = score;
                }
            }
            if (prevHighScore != highScore)
            {
                prevHighScore = highScore;
                highScoreTf.text = "HIGH SCORE: " + pad0s(highScore);
            }
        }

        private onEnterFrame(evt:Event):void
        {
            timer = getTimer();

            updateScore();

            if( timer - 1000 > ms_prev )
            {
                lastfps = Math.round(frameCount/(timer-ms_prev)*1000);
                ms_prev = timer;


                var mem:number = number((System.totalMemory * 0.000000954).toFixed(1));

                // grab the stats from the entity manager
                if (statsTarget)
                {
                    statsText =
                        statsTarget.numCreated + '/' +
                        statsTarget.numReused + ' sprites';
                }

                debugStatsTf.text = titleText + lastfps + 'FPS - ' + mem + 'MB' + '\n' + statsText;
                frameCount = 0;
            }

            // count each frame to determine the framerate
            frameCount++;

        }*/
    } // end class
} // end package