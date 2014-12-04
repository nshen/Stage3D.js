///<reference path="../reference.ts"/>
module stageJS.geom
{
    export class PerspectiveMatrix3D extends Matrix3D
    {

        public perspectiveFieldOfViewRH(fieldOfViewY:number,aspectRatio:number, zNear:number,zFar:number):void
        {
            var yScale:number = 1.0/Math.tan(fieldOfViewY/2.0);
            var xScale:number = yScale / aspectRatio;
            this.copyRawDataFrom([
                xScale, 0.0, 0.0, 0.0,
                0.0, yScale, 0.0, 0.0,
                0.0, 0.0, (zFar+zNear)/(zNear-zFar), -1.0,
                0.0, 0.0, (2*zNear*zFar)/(zNear-zFar), 0.0
            ]);
        }

        public perspectiveFieldOfViewLH(fieldOfViewY:number,aspectRatio:number,zNear:number,zFar:number):void
        {
            var yScale:number = 1.0/Math.tan(fieldOfViewY/2.0);
            var xScale:number = yScale / aspectRatio;
            this.copyRawDataFrom([
                xScale, 0.0, 0.0, 0.0,
                0.0, yScale, 0.0, 0.0,
                0.0, 0.0, (zFar+zNear)/(zFar-zNear), 1.0,
                0.0, 0.0, (zNear*zFar)/(zNear-zFar), 0.0
            ]);

        }
    }
}
//clipspace coordinates always go from -1 to +1