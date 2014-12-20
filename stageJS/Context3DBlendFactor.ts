///<reference path="reference.ts"/>
module stageJS
{
    export class Context3DBlendFactor
    {
        static ONE: number;
        static ZERO: number;

        static SOURCE_COLOR: number;
        static DESTINATION_COLOR: number;

        static SOURCE_ALPHA: number;
        static DESTINATION_ALPHA: number;

        static ONE_MINUS_SOURCE_COLOR: number;
        static ONE_MINUS_DESTINATION_COLOR: number;

        static ONE_MINUS_SOURCE_ALPHA: number;
        static ONE_MINUS_DESTINATION_ALPHA: number;

        static init(): void
        {
            Context3DBlendFactor.ONE = Context3D.GL.ONE;
            Context3DBlendFactor.ZERO = Context3D.GL.ZERO;
            Context3DBlendFactor.SOURCE_COLOR = Context3D.GL.SRC_COLOR;
            Context3DBlendFactor.DESTINATION_COLOR = Context3D.GL.DST_COLOR;
            Context3DBlendFactor.SOURCE_ALPHA = Context3D.GL.SRC_ALPHA;
            Context3DBlendFactor.DESTINATION_ALPHA = Context3D.GL.DST_ALPHA;
            Context3DBlendFactor.ONE_MINUS_SOURCE_COLOR = Context3D.GL.ONE_MINUS_SRC_COLOR;
            Context3DBlendFactor.ONE_MINUS_DESTINATION_COLOR = Context3D.GL.ONE_MINUS_DST_COLOR;
            Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA = Context3D.GL.ONE_MINUS_SRC_ALPHA;
            Context3DBlendFactor.ONE_MINUS_DESTINATION_ALPHA = Context3D.GL.ONE_MINUS_DST_ALPHA;

            //CONSTANT_COLOR
            //ONE_MINUS_CONSTANT_COLOR
            //ONE_MINUS_CONSTANT_ALPHA
        }
    }
} 