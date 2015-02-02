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



        //

        //
        //// numeric values for the text above
        //// used to cache player stats to detect changes
        //// so that textfields will only be updated if needed
        public score:number = 0;
        public prevHighScore:number = 0;
        public highScore:number = 0;
        public level:number = 0;
        public lives:number = 3;
        public health:number = 100;
        public transitionText:string = "";
        public bosshealth:number = 100; // v6
        public npcText : string = ""; // v6
        //
        // debug stats (only used during development)
        //public debugStatsTf:TextField;
        public titleText : string = "";
        public statsText : string = "";
        public statsTarget : EntityManager;
        public frameCount:number = 0;
        public timer:number;
        public ms_prev:number;
        public lastfps : number = 60;

        // text on the screen
        public scoreTf:HTMLElement;
        public highScoreTf:HTMLElement;
        public levelTf:HTMLElement;
        public healthTf:HTMLElement;
        public transitionTf:HTMLElement;
        public bosshealthTf:HTMLElement;
        public npcTf:HTMLElement;

        public hudOverlay:HTMLElement;
        public npcOverlay:HTMLElement;
        public transitionTf_y_location:number = 162;


        constructor(/*title:string = "", inX:number=0, inY:number=0, inCol:number = 0xFFFFFF*/)
        {

            this.hudOverlay = document.getElementById("hud-bg");
            this.npcOverlay = document.getElementById("npcOverlay");

            this.scoreTf = document.getElementById("scoreTf");
            this.highScoreTf = document.getElementById("highScoreTf");
            this.levelTf = document.getElementById("levelTf");
            this.healthTf = document.getElementById("healthTf");
            this.transitionTf = document.getElementById("transitionTf");
            this.bosshealthTf = document.getElementById("bosshealthTf");
            this.npcTf = document.getElementById("npcTf");

            document.body.removeChild(this.bosshealthTf);
            document.body.removeChild(this.transitionTf);
            document.body.removeChild(this.npcOverlay);

        }
        public setPosition(view:{x:number;y:number;width:number;height:number}):void // v6
        {
            console.log('Moving GUI');
            var mid:number = view.width / 2;

            this.hudOverlay.style.left = (mid - 300)+"px";//(width/2);
            //this.debugStatsTf.style.left = mid - 300 + 18;
            this.scoreTf.style.left = (mid - 300 + 442) + "px";
            this.highScoreTf.style.left = (mid - 300 + 208) + "px";
            this.healthTf.style.left = (mid - 300 + 208) + "px";
            this.bosshealthTf.style.left = (mid - 300) + "px";
            this.bosshealthTf.style.top = (60) + "px";
            this.transitionTf.style.top = (view.height / 2 - 80) + "px";
            this.transitionTf.style.left = (mid - 300) + "px";
            this.npcOverlay.style.left = (mid - 300/*this.npcOverlay.style.width / 2*/) + "px"; // v6
            this.npcOverlay.style.top = (view.height - /*this.npcOverlay.style.height*/64 - 8) + "px"; // v6
            this.npcTf.style.top = (view.height - 64) + "px"; // v6
            this.npcTf.style.left = (mid - 220) + "px"; // v6
        }


        public addChild(t:HTMLElement):void
        {
            document.body.appendChild(t);
        }

        public removeChild(t:HTMLElement):void
        {
            document.body.removeChild(t);
        }

        public contains(t:HTMLElement):boolean
        {
            return document.body.contains(t);
        }

        private healthBar(num:number):string // v6
        {
            if (num >= 99)      return "|||||||||||||";
            else if (num >= 92) return "||||||||||||";
            else if (num >= 84) return "|||||||||||";
            else if (num >= 76) return "||||||||||";
            else if (num >= 68) return "|||||||||";
            else if (num >= 60) return "||||||||";
            else if (num >= 52) return "|||||||";
            else if (num >= 44) return "||||||";
            else if (num >= 36) return "|||||";
            else if (num >= 28) return "||||";
            else if (num >= 20) return "|||";
            else if (num >= 12) return "||";
            else if (num >=1 )  return "|";
            else return "";
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
            // NPC dialog toggle // v6
            if (this.npcText != this.npcTf.innerHTML)
            {
                this.npcTf.innerHTML = this.npcText;
                if (this.npcText != "")
                {
                    if (!this.contains(this.npcOverlay))
                        this.addChild(this.npcOverlay);
                    if (!this.contains(this.npcTf))
                        this.addChild(this.npcTf);
                }
                else
                {
                    if (this.contains(this.npcOverlay))
                        this.removeChild(this.npcOverlay);
                    if (this.contains(this.npcTf))
                        this.removeChild(this.npcTf);
                }
            }




            console.log(this.transitionText,this.transitionTf.textContent,this.transitionTf.innerText,this.transitionTf.innerHTML)
            if (this.transitionText != this.transitionTf.innerText)
            {
                this.transitionTf.innerHTML = this.transitionText;
                if (this.transitionTf.innerHTML != "")
                {
                    if (!this.contains(this.transitionTf))
                        this.addChild(this.transitionTf);
                }
                else
                {
                    if (this.contains(this.transitionTf))
                        this.removeChild(this.transitionTf);
                }
            }

            if (this.statsTarget && this.statsTarget.thePlayer)
            {

                // v6 optional boss health meter
                if (this.statsTarget.theBoss)
                {
                    if (this.bosshealth != this.statsTarget.theBoss.health)
                    {
                        this.bosshealth = this.statsTarget.theBoss.health;
                        this.bosshealthTf.innerHTML = "BOSS: " + this.healthBar(this.bosshealth);
                    }
                }


                if (this.health != this.statsTarget.thePlayer.health)
                {
                    this.health = this.statsTarget.thePlayer.health;
                    this.healthTf.innerHTML = "HP: " + this.healthBar(this.health);

                }
                if ((this.score != this.statsTarget.thePlayer.score) || (this.lives != this.statsTarget.thePlayer.lives))
                {
                    this.score = this.statsTarget.thePlayer.score;
                    this.lives = this.statsTarget.thePlayer.lives;
                    if (this.lives == -1)
                        this.scoreTf.innerHTML = this.scoreTf.innerHTML = 'SCORE: ' + this.pad0s(this.score) + '<br>' +'GAME OVER';
                    else
                        this.scoreTf.innerHTML = 'SCORE: ' + this.pad0s(this.score) + '<br>' + this.lives +
                        (this.lives != 1 ? ' LIVES' : ' LIFE') + ' LEFT';
                    // we may be beating the high score right now
                    if (this.score > this.highScore) this.highScore = this.score;
                }
            }
            if (this.prevHighScore != this.highScore)
            {
                this.prevHighScore = this.highScore;
                this.highScoreTf.innerHTML = "HIGH SCORE: " + this.pad0s(this.highScore);
            }
        }

        public onEnterFrame():void
        {
            //timer = getTimer();

            this.updateScore();

            //if( timer - 1000 > ms_prev )
            //{
            //    lastfps = Math.round(frameCount/(timer-ms_prev)*1000);
            //    ms_prev = timer;
            //
            //
            //    var mem:number = number((System.totalMemory * 0.000000954).toFixed(1));
            //
            //    // grab the stats from the entity manager
            //    if (statsTarget)
            //    {
            //        statsText =
            //            statsTarget.numCreated + '/' +
            //            statsTarget.numReused + ' sprites';
            //    }
            //
            //    debugStatsTf.text = titleText + lastfps + 'FPS - ' + mem + 'MB' + '<br>' + statsText;
            //    frameCount = 0;
            //}
            //
            //// count each frame to determine the framerate
            //frameCount++;

        }
    } // end class
} // end package