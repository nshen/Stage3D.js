///<reference path="../_definitions.ts"/>
module stagl.geom
{
    export class PerspectiveMatrix3D extends Matrix3D
    {

        public lookAtLH(eye:Vector3D, at:Vector3D, up:Vector3D):void 
        {
        }

        public lookAtRH(eye:Vector3D, at:Vector3D, up:Vector3D):void 
        {

        }

        public perspectiveLH(width:number,height:number,zNear:number,zFar:number):void 
        {
//            this.copyRawDataFrom(Vector.<number>([
//                    2.0*zNear/width, 0.0, 0.0, 0.0,
//                0.0, 2.0*zNear/height, 0.0, 0.0,
//                0.0, 0.0, zFar/(zFar-zNear), 1.0,
//                0.0, 0.0, zNear*zFar/(zNear-zFar), 0.0
//            ]));
          }

        public perspectiveRH(width:number,height:number,zNear:number,zFar:number):void
        {
            this.copyRawDataFrom([
                    2.0 * zNear / width, 0.0, 0.0, 0.0,
                    0.0, 2.0 * zNear / height, 0.0, 0.0,
                    0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                    0.0, 0.0, -1.0, 0.0
            ]);
        }

        public perspectiveOffCenterLH(left:number,right:number,bottom:number,top:number,zNear:number,zFar:number):void
        {
//            this.copyRawDataFrom(Vector.<number>([
//                    2.0*zNear/(right-left), 0.0, 0.0, 0.0,
//                0.0, -2.0*zNear/(bottom-top), 0.0, 0.0,
//                    -1.0-2.0*left/(right-left), 1.0+2.0*top/(bottom-top), -zFar/(zNear-zFar), 1.0,
//                0.0, 0.0, (zNear*zFar)/(zNear-zFar), 0.0
//            ]));
        }

        public perspectiveOffCenterRH(left:number, right:number,bottom:number,top:number,zNear:number,zFar:number):void
        {
            this.copyRawDataFrom([
                    2.0 * zNear / (right-left), 0.0, (right + left) / (right - left), 0.0,
                    0.0, 2.0 * zNear/(top - bottom), (top + bottom) / (top - bottom), 0.0,
                    0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                    0.0, 0.0, -1.0, 0.0
            ]);
        }

        public orthoLH(width:number, height:number,zNear:number,zFar:number):void
        {
//            this.copyRawDataFrom(Vector.<number>([
//                    2.0/width, 0.0, 0.0, 0.0,
//                0.0, 2.0/height, 0.0, 0.0,
//                0.0, 0.0, 1.0/(zFar-zNear), 0.0,
//                0.0, 0.0, zNear/(zNear-zFar), 1.0
//            ]));
        }

        public orthoRH(width:number,height:number,zNear:number,zFar:number):void
        {
//            this.copyRawDataFrom(Vector.<number>([
//                    2.0/width, 0.0, 0.0, 0.0,
//                0.0, 2.0/height, 0.0, 0.0,
//                0.0, 0.0, 1.0/(zNear-zFar), 0.0,
//                0.0, 0.0, zNear/(zNear-zFar), 1.0
//            ]));
        }

        public orthoOffCenterLH(left:number,right:number,bottom:number,top:number,zNear:number,zFar:number):void
        {
//            this.copyRawDataFrom(Vector.<number>([
//                    2.0/(right-left), 0.0, 0.0, 0.0,
//                0.0, 2.0/(top-bottom), 0.0, 0.0,
//                0.0, 0.0, 1.0/(zFar-zNear), 0.0,
//                    (left+right)/(left-right), (bottom+top)/(bottom-top), zNear/(zNear-zFar), 1.0
//            ]));
        }

        public orthoOffCenterRH(left:number,right:number,bottom:number,top:number,zNear:number,zFar:number):void
        {
//            this.copyRawDataFrom(Vector.<number>([
//                    2.0/(right-left), 0.0, 0.0, 0.0,
//                0.0, 2.0/(top-bottom), 0.0, 0.0,
//                0.0, 0.0, 1.0/(zNear-zFar), 0.0,
//                    (left+right)/(left-right), (bottom+top)/(bottom-top), zNear/(zNear-zFar), 1.0
//            ]));
        }
        public perspectiveFieldOfViewRH(fieldOfViewY:number,aspectRatio:number, zNear:number,zFar:number):void
        {
            var yScale:number = 1.0/Math.tan(fieldOfViewY/2.0);
            var xScale:number = yScale / aspectRatio;
            this.copyRawDataFrom([
                xScale, 0.0, 0.0, 0.0,
                0.0, yScale, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
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