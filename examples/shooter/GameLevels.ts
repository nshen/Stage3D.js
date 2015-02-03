// Stage3D Shoot-em-up Tutorial Part 4
// by Christer Kaitila - www.mcfunkypants.com

// GameLevels.as
// This class parses .CSV level data strings
// that define the locations of tiles from a spritesheet
// Example levels were created using the OGMO editor,
// but could be designed by hand or any number of other
// freeware game level editors that can output .csv
// This can be a .txt, .csv, .oel, .etc file
// - we will strip all xml/html tags (if any) 
// - we only care about raw csv data
// Our game can access the current level with:
// spriteId = myLevel.data[x][y];

///<reference path="reference.ts" />
module shooter
{
    //import flash.display3D.Context3DProgramType;
    export class GameLevels
    {

        // v5 the farthest column in the level
        // used to detect when the map is complete
        public levelLength:number = 0;

        // the "demo" level seen during the title screen
        private level0data:string = lib.FileLoader.getInstance().get("assets/level0.oel").responseText;
        // the "demo" level background TERRAIN
        private level0terrain:string = lib.FileLoader.getInstance().get("assets/terrain0.oel").responseText;

        // the first level that the player actually experiences
        private level1data:string = lib.FileLoader.getInstance().get("assets/level1.oel").responseText;
        // the first level background TERRAIN
        private level1terrain:string = lib.FileLoader.getInstance().get("assets/terrain1.oel").responseText;

        // the first level that the player actually experiences
        private level2data:string = lib.FileLoader.getInstance().get("assets/level2.oel").responseText;
        // the first level background TERRAIN
        private level2terrain:string = lib.FileLoader.getInstance().get("assets/terrain2.oel").responseText;

        // the first level that the player actually experiences
        private level3data:string = lib.FileLoader.getInstance().get("assets/level3.oel").responseText;
        // the first level background TERRAIN
        private level3terrain:string = lib.FileLoader.getInstance().get("assets/terrain3.oel").responseText;


        // the currently loaded level data
        public data:any[] = [];

        constructor()
        {
        }

        private stripTags(str:string):string
        {
            var pattern:RegExp = /<\/?[a-zA-Z0-9]+.*?>/gim;
            return str.replace(pattern, "");
        }

        private parseLevelData(lvl:string):any[]
        {
            var levelString:string;
            var temps:any[];
            var nextValue:number;
            var output:any[] = [];
            var nextrow:number;

            // how many columns wide is the map?
            // note: some rows may be shorter
            this.levelLength = 0;

            switch (lvl)
            {
                case "level0" : levelString = this.stripTags(this.level0data); break;
                case "terrain0" : levelString = this.stripTags(this.level0terrain); break;
                case "level1" : levelString = this.stripTags(this.level1data); break;
                case "terrain1" : levelString = this.stripTags(this.level1terrain); break;
                case "level2" : levelString = this.stripTags(this.level2data); break;
                case "terrain2" : levelString = this.stripTags(this.level2terrain); break;
                case "level3" : levelString = this.stripTags(this.level3data); break;
                case "terrain3" : levelString = this.stripTags(this.level3terrain); break;
                default:
                    return output;
            }

            //console.log("Level " + num + " data:\n" + levelString);
            var lines:any[] = levelString.split(/\r\n|\n|\r/);
            for (var row:number = 0; row < lines.length; row++)
            {
                // split the string by comma
                temps = lines[row].split(",");
                if (temps.length > 1)
                {
                    nextrow = output.push([]) - 1;
                    // turn the string values into integers
                    for (var col:number = 0; col < temps.length; col++)
                    {
                        if (temps[col] == "") temps[col] = "-1";
                        nextValue = parseInt(temps[col]);
                        if (nextValue < 0) nextValue = -1; // we still need blanks
                        //console.log('row '+ nextrow + ' nextValue=' + nextValue);
                        if(col > this.levelLength)
                            this.levelLength = col;

                        output[nextrow].push(nextValue);
                    }
                    //console.log('Level row '+nextrow+':\n' + string(output[nextrow]));
                }
            }
            //console.log('Level output data:\n' + String(output));
            return output;
        }

        public loadLevel(lvl:string):void
        {
            console.log("Loading level " + lvl);
            this.data = this.parseLevelData(lvl);
        }

    } // end class
} // end package