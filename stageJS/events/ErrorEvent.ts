///<reference path="../reference.ts"/>
module stageJS.events {

    export class ErrorEvent extends stageJS.events.Event
    {
        public static ERROR: string = "error";

        constructor()
        {
            super(ErrorEvent.ERROR);


        }
    }

}