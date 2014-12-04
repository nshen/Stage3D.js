///<reference path="../reference.ts"/>
/**
 * Base event class
 * @class stagl.events.Event
 */
module stagl.events
{
     
    export class Event
    {
        public static CONTEXT3D_CREATE: string = "CONTEXT3D_CREATE";

        public type: string = undefined;

        public target: Object = undefined;

        constructor(type: string)
        {
            this.type = type;
        }

        public clone(): Event
        {
            return new Event(this.type);
        }

    }

} 