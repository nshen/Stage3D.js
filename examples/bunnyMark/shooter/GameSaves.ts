// Stage3D Shoot-em-up Tutorial Part 5
// by Christer Kaitila - www.mcfunkypants.com

// GameSaves.as
// A simple highscore and level save game system.
// For now, only high score is used (by the GUI), but you
// could implement an "unlocked" levels menu to allow players
// to skip levels they have completed when starting a new game.

///<reference path="reference.ts" />
module shooter
{

    export class GameSaves
    {

        private _saves:Storage;

        constructor()
        {
            console.log("Initializing game save system");

            this._saves = window['localStorage'];
            if(this._saves == null)
                throw new Error("Unable to init game save system");
        }

        public get level():number
        {
            if (!this._saves) return 0;
            if (this._saves["level"] == null) return 0;

            console.log("Loaded level is " + this._saves["level"]);
            return this._saves["level"];
        }

        public get score():number
        {
            if (!this._saves) return 0;
            if (this._saves["score"] == null) return 0;
            console.log("Loaded score is " + this._saves["score"]);
            return this._saves["score"];
        }

        public set level(num:number):void
        {
            if (!this._saves) return;
            this._saves["level"] = num;
            console.log("Saved level set to: " + num);
        }

        public set score(num:number):void
        {
            if (!this._saves) return;
            this._saves["score"] = num;
            console.log("Saved score set to: " + num);
        }

    } // end class
} // end package