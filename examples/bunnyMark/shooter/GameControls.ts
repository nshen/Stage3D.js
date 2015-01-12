///<reference path="reference.ts"/>
// Stage3D Shoot-em-up Tutorial Part 2
// by Christer Kaitila - www.mcfunkypants.com
// Created for active.tutsplus.com

// GameControls.as
// A simple keyboard input class
module shooter
{
    export class GameControls
    {
        // the current state of the keyboard controls
        public pressing:any = { up:false, down:false, left:false, right:false, fire:false, hasfocus:false };

        // the game's main stage
        public stage:Window;

        // class constructor
        constructor(theStage:Window)
        {
            this.stage = theStage;
            // get keypresses and detect the game losing focus
            this.stage.addEventListener("keydown", this.keyPressed);
            this.stage.addEventListener("keyup", this.keyReleased);
            this.stage.addEventListener("blur", this.lostFocus);
            //this.stage.addEventListener(Event.ACTIVATE, gainFocus); //todo: is there activate event?
        }

        private keyPressed = (event:KeyboardEvent) =>
        {
            this.keyHandler(event, true);
        }

        private keyReleased = (event:KeyboardEvent) =>
        {
            this.keyHandler(event, false);
        }

        // if the game loses focus, don't keep keys held down
        // we could optionally pause the game here
        private lostFocus = (event:Event) =>
        {
            console.log("Game lost keyboard focus.");
            this.pressing.up = false;
            this.pressing.down = false;
            this.pressing.left = false;
            this.pressing.right = false;
            this.pressing.fire = false;
            this.pressing.hasfocus = false;
        }

        // we could optionally unpause the game here
        private gainFocus = (event:Event) =>
        {
            console.log("Game received keyboard focus.");
            this.pressing.hasfocus = true;
        }

        // used only for debugging
        public textDescription = () =>
        {
            return ("Controls: " +
            (this.pressing.up?"up ":"") +
            (this.pressing.down?"down ":"") +
            (this.pressing.left?"left ":"") +
            (this.pressing.right?"right ":"") +
            (this.pressing.fire?"fire":""));
        }

        private keyHandler(event:KeyboardEvent, isDown:boolean):void
        {
            //console.log('Key code: ' + event.keyCode);

            // alternate "fire" buttons
            if (event.ctrlKey ||
                event.altKey ||
                event.shiftKey)
                this.pressing.fire = isDown;

            // key codes that support international keyboards:
            // QWERTY = W A S D
            // AZERTY = Z Q S D
            // DVORAK = , A O E

            switch(event.keyCode)
            {
                case 38: //UP
                case 87: // W
                case 90: // Z
                case 188:// ,
                    this.pressing.up = isDown;
                    break;

                case 40: //Keyboard.DOWN
                case 83: // S
                case 79: // O
                    this.pressing.down = isDown;
                    break;

                case 37: //Keyboard.LEFT
                case 65: // A
                case 81: // Q
                    this.pressing.left = isDown;
                    break;

                case 39: //Keyboard.RIGHT
                case 68: // D
                case 69: // E
                    this.pressing.right = isDown;
                    break;

                case 32: //Keyboard.SPACE
                case 16: //Keyboard.SHIFT
                case 17: //Keyboard.CONTROL
                case 13: //Keyboard.ENTER
                case 88: // x
                case 67: // c
                    this.pressing.fire = isDown;
                    break;

            }
        }

    } // end class
} // end package
