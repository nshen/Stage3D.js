module stagl.events {

    export class ErrorEvent extends stagl.events.Event
    {
        public static ERROR: string = "error";

        constructor()
        {
            super(ErrorEvent.ERROR);
        }
    }

}