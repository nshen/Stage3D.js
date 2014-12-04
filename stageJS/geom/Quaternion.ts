///<reference path="../reference.ts"/>
///<reference path="Matrix3D.ts"/>
module stageJS.geom
{
    export class Quaternion
    {
        public x:number = 0;
        public y:number = 0;
        public z:number = 0;
        public w:number = 1;

        constructor(x:number = 0 ,y:number = 0 ,z:number = 0,w:number = 1)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }


        public static lerp(qa:Quaternion , qb:Quaternion , percent:number ):Quaternion
        {

            // shortest direction
            if (qa.x * qb.x + qa.y * qb.y + qa.z * qb.z + qa.w * qb.w < 0)
            {
                return new Quaternion(
                        qa.x + percent * (-qb.x - qa.x),
                        qa.y + percent * (-qb.y - qa.y),
                        qa.z + percent * (-qb.z - qa.z),
                        qa.w + percent * (-qb.w - qb.w)
                );
            }
            return  new Quaternion(
                    qa.x + percent * (qb.x - qa.x),
                    qa.y + percent * (qb.y - qa.y),
                    qa.z + percent * (qb.z - qa.z),
                    qa.w + percent * (qb.w - qb.w)
            );


        }

        public fromMatrix3D(m:Matrix3D):Quaternion
        {
            var m11:number = m.rawData[0],m12:number = m.rawData[1], m13:number = m.rawData[2],
                m21:number = m.rawData[4],m22:number = m.rawData[5], m23:number = m.rawData[6],
                m31:number = m.rawData[8],m32:number = m.rawData[9], m33:number = m.rawData[10];


            var tr:number = m11 + m22 + m33;
            var tmp:number;
            if(tr > 0)
            {
                tmp = 1 / (2 * Math.sqrt(tr + 1));

                this.x = (m23 - m32) * tmp;
                this.y = (m31 - m13) * tmp;
                this.z = (m12 - m21) * tmp;
                this.w = 0.25 / tmp;

            }else
            {
                if((m11 > m22) && (m11 > m33) )
                {
                    tmp = 1/ (2 * Math.sqrt(1 + m11 - m22 + m33));

                    this.x = (m21 + m12) * tmp;
                    this.y = (m13 + m31) * tmp;
                    this.z = (m32 - m23) * tmp;
                    this.w = 0.25 / tmp;


                }else if((m22 > m11) && (m22 > m33))
                {
                    tmp = 1 / (Math.sqrt(1 + m22 - m11 - m33));
                    this.x = 0.25 / tmp;
                    this.y = (m32 + m23) * tmp;
                    this.z = (m13 - m31) * tmp;
                    this.w = (m21 + m12) * tmp;

                }else if((m33 > m11) &&(m33 > m22 ))
                {
                    tmp = 1 / (Math.sqrt(1 + m33 - m11 - m22));
                    this.x = (m32 + m23) * tmp;
                    this.y = 0.25 / tmp;
                    this.z = (m21 - m12) * tmp;
                    this.w = (m13 + m31) * tmp;

                }

            }
            return this;
        }

        public toMatrix3D(target:Matrix3D = null):Matrix3D
        {
            var x2 = this.x + this.x,
            y2 = this.y + this.y,
            z2 = this.z + this.z,

            xx = this.x * x2,
            xy = this.x * y2,
            xz = this.x * z2,
            yy = this.y * y2,
            yz = this.y * z2,
            zz = this.z * z2,
            wx = this.w * x2,
            wy = this.w * y2,
            wz = this.w * z2;


            if(!target)
                target = new Matrix3D();

            target.rawData[0] = 1 - (yy + zz);
            target.rawData[1] = xy + wz;
            target.rawData[2] = xz - wy;
            target.rawData[3] = 0;
            target.rawData[4] = xy - wz;
            target.rawData[5] = 1 - (xx + zz);
            target.rawData[6] = yz + wx;
            target.rawData[7] = 0;
            target.rawData[8] = xz + wy;
            target.rawData[9] = yz - wx;
            target.rawData[10] = 1 - (xx + yy);
            target.rawData[11] = 0;
            target.rawData[12] = 0;
            target.rawData[13] = 0;
            target.rawData[14] = 0;
            target.rawData[15] = 1;

            return target;
        }


        /**
         * @param axis   must be a normalized vector
         * @param angleInRadians
         */
        public fromAxisAngle(axis:Vector3D, angleInRadians:number)
        {
            var angle:number = angleInRadians * 0.5;
            var sin_a:number = Math.sin(angle);
            var cos_a:number = Math.cos(angle);

            this.x = axis.x*sin_a;
            this.y = axis.y*sin_a;
            this.z = axis.z*sin_a;
            this.w = cos_a;
        }


        public conjugate():void
        {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;

        }

        public toString(): string
        {
            return "[Quaternion] (x:" + this.x + " ,y:" + this.y + ", z:" + this.z + ", w:" + this.w + ")";
        }

    }
}
