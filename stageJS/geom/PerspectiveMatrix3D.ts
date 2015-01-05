///<reference path="../reference.ts"/>
module stageJS.geom
{
    export class PerspectiveMatrix3D extends Matrix3D
    {

        public lookAtLH(eye:Vector3D, at:Vector3D, up:Vector3D):void 
        {
            //http://msdn.microsoft.com/en-us/library/windows/desktop/bb281710(v=vs.85).aspx

            //zaxis = normal(at - eye)
            var zX:number = at.x - eye.x;
            var zY:number = at.y - eye.y;
            var zZ:number = at.z - eye.z;
            var len:number = 1/Math.sqrt(zX * zX + zY * zY + zZ * zZ);
            zX *= len;
            zY *= len;
            zZ *= len;

            //xaxis = normal(cross(up,zaxis))
            var xX:number = up.y * zZ - up.z * zY;
            var xY:number = up.z * zX - up.x * zZ;
            var xZ:number = up.x * zY - up.y * zX;
            len = 1/Math.sqrt(xX * xX + xY * xY + xZ * xZ);
            xX *= len;
            xY *= len;
            xZ *= len;
            //yaxis = cross(zaxis,xaxis)
            var yX:number = zY * xZ - zZ * xY;
            var yY:number = zZ * xX - zX * xZ;
            var yZ:number = zX * xY - zY * xX;

            this.copyRawDataFrom([
                xX, xY, xZ, -(xX * eye.x + xY * eye.y + xZ * eye.z),
                yX, yY, yZ, -(yX * eye.x + yY * eye.y + yZ * eye.z),
                zX, zY, zZ, -(zX * eye.x + zY * eye.y + zZ * eye.z),
                0.0, 0.0, 0.0, 1.0
            ]);

        }

        public lookAtRH(eye:Vector3D, at:Vector3D, up:Vector3D):void 
        {
            //http://msdn.microsoft.com/en-us/library/windows/desktop/bb281711(v=vs.85).aspx
            //http://blog.csdn.net/popy007/article/details/5120158

            //zaxis = normal(eye - at)
            var zX:number = eye.x - at.x;
            var zY:number = eye.y - at.y;
            var zZ:number = eye.z - at.z;

            var len:number = 1/Math.sqrt(zX * zX + zY * zY + zZ * zZ);
            zX *= len;
            zY *= len;
            zZ *= len;

            // xaxis = normal(cross(up,zaxis))
            var xX:number = up.y * zZ - up.z * zY;
            var xY:number = up.z * zX - up.x * zZ;
            var xZ:number = up.x * zY - up.y * zX;

            len = 1/Math.sqrt(xX * xX + xY * xY + xZ * xZ);
            xX *= len;
            xY *= len;
            xZ *= len;

            //yaxis = cross(zaxis,xaxis)
            var yX:number = zY * xZ - zZ * xY;
            var yY:number = zZ * xX - zX * xZ;
            var yZ:number = zX * xY - zY * xX;

            this.copyRawDataFrom([
                xX, xY, xZ, -(xX * eye.x + xY * eye.y + xZ * eye.z),
                yX, yY, yZ, -(yX * eye.x + yY * eye.y + yZ * eye.z),
                zX, zY, zZ, -(zX * eye.x + zY * eye.y + zZ * eye.z),
                0.0, 0.0, 0.0, 1.0
            ]);

        }

        public perspectiveOffCenterLH(left:number,right:number,bottom:number,top:number,zNear:number,zFar:number):void
        {
            this.copyRawDataFrom([
                2.0 * zNear/(right - left), 0.0, (left + right)/(left - right), 0.0,
                0.0, 2.0 * zNear/(top - bottom), (bottom + top)/(bottom - top), 0.0,
                0.0, 0.0, (zFar + zNear)/(zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                0.0, 0.0, 1.0, 0.0
            ]);
        }

        public perspectiveLH(width:number,height:number,zNear:number,zFar:number):void
        {
            this.copyRawDataFrom([
                2.0 * zNear/width, 0.0, 0.0, 0.0,
                0.0, 2.0 * zNear/height, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear)/(zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                0.0, 0.0, 1.0, 0.0
            ]);
        }

        public perspectiveFieldOfViewLH(fieldOfViewY:number,aspectRatio:number,zNear:number,zFar:number):void
        {
            var yScale:number = 1.0/Math.tan(fieldOfViewY/2.0);
            var xScale:number = yScale / aspectRatio;
            this.copyRawDataFrom([
                xScale, 0.0, 0.0, 0.0,
                0.0, yScale, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear)/(zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                0.0, 0.0, 1.0, 0.0
            ]);

        }

        public orthoOffCenterLH(left:number,right:number,bottom:number,top:number,zNear:number,zFar:number):void
        {
            this.copyRawDataFrom([
                2.0/(right-left), 0.0, 0.0, (left + right)/(left - right),
                0.0, 2.0/(top - bottom), 0.0, (bottom + top)/(bottom - top),
                0.0, 0.0, 2/(zFar - zNear), (zNear + zFar)/(zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        }
        public orthoLH(width:number, height:number,zNear:number,zFar:number):void
        {
            this.copyRawDataFrom([
                2.0/width, 0.0, 0.0, 0.0,
                0.0, 2.0/height, 0.0, 0.0,
                0.0, 0.0, 2/(zFar - zNear), (zNear + zFar)/(zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        }



        //pass test
        public perspectiveOffCenterRH(left:number, right:number,bottom:number,top:number,zNear:number,zFar:number):void
        {
            this.copyRawDataFrom([
                    2.0 * zNear / (right-left), 0.0, (right + left) / (right - left), 0.0,
                    0.0, 2.0 * zNear/(top - bottom), (top + bottom) / (top - bottom), 0.0,
                    0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                    0.0, 0.0, -1.0, 0.0
            ]);
        }
        //pass test
        public perspectiveRH(width:number,height:number,zNear:number,zFar:number):void
        {
            this.copyRawDataFrom([
                2.0 * zNear / width, 0.0, 0.0, 0.0,
                0.0, 2.0 * zNear / height, 0.0, 0.0,
                0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
            ]);
        }

        //pass test
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

        public orthoOffCenterRH(left:number,right:number,bottom:number,top:number,zNear:number,zFar:number):void
        {
            this.copyRawDataFrom([
                2.0/(right - left), 0.0, 0.0, (left + right)/(left - right),
                0.0, 2.0/(top - bottom), 0.0, (bottom + top)/(bottom - top),
                0.0, 0.0, -2.0/(zFar - zNear), (zNear + zFar)/(zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        }

        public orthoRH(width:number,height:number,zNear:number,zFar:number):void
        {
            this.copyRawDataFrom([
                2.0/width, 0.0, 0.0, 0.0,
                0.0, 2.0/height, 0.0, 0.0,
                0.0, 0.0, -2.0/(zFar - zNear),(zNear + zFar)/(zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        }



    }
}
