///<reference path="../_definitions.ts"/>
module stagl.geom
{
    export class Matrix3D
    {

        /**
         * [read-only] A Number that determines whether a matrix is invertible.
         */
        public get determinant(): number
        {
            return ((this.rawData[0] * this.rawData[5] - this.rawData[4] * this.rawData[1]) * (this.rawData[10] * this.rawData[15] - this.rawData[14] * this.rawData[11])
                - (this.rawData[0] * this.rawData[9] - this.rawData[8] * this.rawData[1]) * (this.rawData[6] * this.rawData[15] - this.rawData[14] * this.rawData[7])
                + (this.rawData[0] * this.rawData[13] - this.rawData[12] * this.rawData[1]) * (this.rawData[6] * this.rawData[11] - this.rawData[10] * this.rawData[7])
                + (this.rawData[4] * this.rawData[9] - this.rawData[8] * this.rawData[5]) * (this.rawData[2] * this.rawData[15] - this.rawData[14] * this.rawData[3])
                - (this.rawData[4] * this.rawData[13] - this.rawData[12] * this.rawData[5]) * (this.rawData[2] * this.rawData[11] - this.rawData[10] * this.rawData[3])
                + (this.rawData[8] * this.rawData[13] - this.rawData[12] * this.rawData[9]) * (this.rawData[2] * this.rawData[7] - this.rawData[6] * this.rawData[3]));
   
        }



        public get position():Vector3D
        {
            return new Vector3D(this.rawData[12], this.rawData[13], this.rawData[14]);
        }
         
        /**
         * A Vector of 16 Numbers, where every four elements is a column of a 4x4 matrix.
         *
         * <p>An exception is thrown if the rawData property is set to a matrix that is not invertible. The Matrix3D
         * object must be invertible. If a non-invertible matrix is needed, create a subclass of the Matrix3D object.</p>
         */
        public rawData: Float32Array; //column major order


        /**
         * Creates a Matrix3D object.
         */
        constructor(v:Array<number> = null)
        {
            if (v != null && v.length == 16)
                this.rawData = new Float32Array(v.slice(0));
            else
                this.rawData = new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1]);
        }



        /**
         * Appends the matrix by multiplying another Matrix3D object by the current Matrix3D object.
         * Apply a transform after this transform
         */
        public append(lhs: Matrix3D): void
        {
            //this * lhs
            var a11: number = this.rawData[0]; var a12: number = this.rawData[1]; var a13: number = this.rawData[2]; var a14: number = this.rawData[3];
            var a21: number = this.rawData[4]; var a22: number = this.rawData[5]; var a23: number = this.rawData[6]; var a24: number = this.rawData[7];
            var a31: number = this.rawData[8]; var a32: number = this.rawData[9]; var a33: number = this.rawData[10]; var a34: number = this.rawData[11];
            var a41: number = this.rawData[12]; var a42: number = this.rawData[13]; var a43: number = this.rawData[14]; var a44: number = this.rawData[15];

            var b11: number = lhs.rawData[0]; var b12: number = lhs.rawData[1]; var b13: number = lhs.rawData[2]; var b14: number = lhs.rawData[3];
            var b21: number = lhs.rawData[4]; var b22: number = lhs.rawData[5]; var b23: number = lhs.rawData[6]; var b24: number = lhs.rawData[7];
            var b31: number = lhs.rawData[8]; var b32: number = lhs.rawData[9]; var b33: number = lhs.rawData[10]; var b34: number = lhs.rawData[11];
            var b41: number = lhs.rawData[12]; var b42: number = lhs.rawData[13]; var b43: number = lhs.rawData[14]; var b44: number = lhs.rawData[15];

            this.rawData[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            this.rawData[1] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            this.rawData[2] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            this.rawData[3] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

            this.rawData[4] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            this.rawData[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            this.rawData[6] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            this.rawData[7] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

            this.rawData[8] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            this.rawData[9] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            this.rawData[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            this.rawData[11] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

            this.rawData[12] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            this.rawData[13] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            this.rawData[14] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            this.rawData[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        }

        /**
        * Prepends a matrix by multiplying the current Matrix3D object by another Matrix3D object.
        */
        public prepend(rhs: Matrix3D): void
        {
            // rhs * this
            var a11: number = this.rawData[0]; var a12: number = this.rawData[1]; var a13: number = this.rawData[2]; var a14: number = this.rawData[3];
            var a21: number = this.rawData[4]; var a22: number = this.rawData[5]; var a23: number = this.rawData[6]; var a24: number = this.rawData[7];
            var a31: number = this.rawData[8]; var a32: number = this.rawData[9]; var a33: number = this.rawData[10]; var a34: number = this.rawData[11];
            var a41: number = this.rawData[12]; var a42: number = this.rawData[13]; var a43: number = this.rawData[14]; var a44: number = this.rawData[15];

            var b11: number = rhs.rawData[0]; var b12: number = rhs.rawData[1]; var b13: number = rhs.rawData[2]; var b14: number = rhs.rawData[3];
            var b21: number = rhs.rawData[4]; var b22: number = rhs.rawData[5]; var b23: number = rhs.rawData[6]; var b24: number = rhs.rawData[7];
            var b31: number = rhs.rawData[8]; var b32: number = rhs.rawData[9]; var b33: number = rhs.rawData[10]; var b34: number = rhs.rawData[11];
            var b41: number = rhs.rawData[12]; var b42: number = rhs.rawData[13]; var b43: number = rhs.rawData[14]; var b44: number = rhs.rawData[15];

            this.rawData[0] = b11 * a11 + b12 * a21 + b13 * a31 + b14 * a41;
            this.rawData[1] = b11 * a12 + b12 * a22 + b13 * a32 + b14 * a42;
            this.rawData[2] = b11 * a13 + b12 * a23 + b13 * a33 + b14 * a43;
            this.rawData[3] = b11 * a14 + b12 * a24 + b13 * a34 + b14 * a44;

            this.rawData[4] = b21 * a11 + b22 * a21 + b23 * a31 + b24 * a41;
            this.rawData[5] = b21 * a12 + b22 * a22 + b23 * a32 + b24 * a42;
            this.rawData[6] = b21 * a13 + b22 * a23 + b23 * a33 + b24 * a43;
            this.rawData[7] = b21 * a14 + b22 * a24 + b23 * a34 + b24 * a44;
             
            this.rawData[8] = b31 * a11 + b32 * a21 + b33 * a31 + b34 * a41;
            this.rawData[9] = b31 * a12 + b32 * a22 + b33 * a32 + b34 * a42;
            this.rawData[10] = b31 * a13 + b32 * a23 + b33 * a33 + b34 * a43;
            this.rawData[11] = b31 * a14 + b32 * a24 + b33 * a34 + b34 * a44;

            this.rawData[12] = b41 * a11 + b42 * a21 + b43 * a31 + b44 * a41;
            this.rawData[13] = b41 * a12 + b42 * a22 + b43 * a32 + b44 * a42;
            this.rawData[14] = b41 * a13 + b42 * a23 + b43 * a33 + b44 * a43;
            this.rawData[15] = b41 * a14 + b42 * a24 + b43 * a34 + b44 * a44;
        }

        /**
         * Appends an incremental rotation to a Matrix3D object.
         */
        public appendRotation(degrees: number, axis: Vector3D, pivotPoint: Vector3D = null): void
        {
            
            var r: Matrix3D = this.getRotateMatrix(axis, degrees);
            if (pivotPoint)
            {  
                 //TODO:simplify
                this.appendTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
                this.append(r);
                this.appendTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);

            } else
            {
                this.append(r);
            }

        }



        /**
         * Appends an incremental scale change along the x, y, and z axes to a Matrix3D object.
         */
        public appendScale(xScale: number, yScale: number, zScale: number): void
        {
            /*
             *              x 0 0 0 
             *    this  *   0 y 0 0
             *              0 0 z 0
             *              0 0 0 1
             */

            this.rawData[0] *= xScale; this.rawData[1] *= yScale; this.rawData[2] *= zScale;
            this.rawData[4] *= xScale; this.rawData[5] *= yScale; this.rawData[6] *= zScale;
            this.rawData[8] *= xScale; this.rawData[9] *= yScale; this.rawData[10] *= zScale;
            this.rawData[12] *= xScale; this.rawData[13] *= yScale; this.rawData[14] *= zScale;
        }

        /**
         * Appends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
         */
        public appendTranslation(x: number, y: number, z: number): void
        {
            this.rawData[12] += x;
            this.rawData[13] += y;
            this.rawData[14] += z;
        }


        /**
         * Prepends an incremental rotation to a Matrix3D object.
         */
        public prependRotation(degrees: number, axis: Vector3D, pivotPoint: Vector3D = null): void
        {
            var r: Matrix3D = this.getRotateMatrix(axis, degrees);
            if (pivotPoint) {
                //TODO:simplify
                this.prependTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
                this.prepend(r);
                this.prependTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);

            } else {
                this.prepend(r);
            }
        }

        /**
         * Prepends an incremental scale change along the x, y, and z axes to a Matrix3D object.
         */
        public prependScale(xScale: number, yScale: number, zScale: number): void
        {
             /*
             *      x 0 0 0 
             *      0 y 0 0   * this
             *      0 0 z 0
             *      0 0 0 1
             */

            this.rawData[0] *= xScale; this.rawData[1] *= xScale; this.rawData[2] *= xScale; this.rawData[3] *= xScale;
            this.rawData[4] *= yScale; this.rawData[5] *= yScale; this.rawData[6] *= yScale; this.rawData[7] *= yScale;
            this.rawData[8] *= zScale; this.rawData[9] *= zScale; this.rawData[10] *= zScale; this.rawData[11] *= zScale;
     
        }

        /**
         * Prepends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
         */
        public prependTranslation(x: number, y: number, z: number): void
        {

            /*
             *             1 0 0 0
             *             0 1 0 0   *  this
             *             0 0 1 0
             *             x y z 1
             */

            this.rawData[12] += this.rawData[0] * x + this.rawData[4] * y + this.rawData[8] * z;
            this.rawData[13] += this.rawData[1] * x + this.rawData[5] * y + this.rawData[9] * z;
            this.rawData[14] += this.rawData[2] * x + this.rawData[6] * y + this.rawData[10] * z;
            this.rawData[15] += this.rawData[3] * x + this.rawData[7] * y + this.rawData[11] * z;
        }

        /**
         * Returns a new Matrix3D object that is an exact copy of the current Matrix3D object.
         */
        public clone(): Matrix3D
        {
            return new Matrix3D(Array.prototype.slice.call(this.rawData));
        }

        /**
         *  Copies a Vector3D object into specific column of the calling Matrix3D object.
         */
        public copyColumnFrom(column: number /*uint*/, vector3D: Vector3D): void
        {
            if (column < 0 || column > 3)
                throw new Error("column error");

            // column is row ...
            this.rawData[column] = vector3D.x;
            this.rawData[column * 4 + 1] = vector3D.y;
            this.rawData[column * 4 + 2] = vector3D.z;
            this.rawData[column * 4 + 3] = vector3D.w;
        }

        /**
         * Copies specific column of the calling Matrix3D object into the Vector3D object.
         */
        public copyColumnTo(column: number /*uint*/, vector3D: Vector3D): void
        {
            if (column < 0 || column > 3)
                throw new Error("column error");

            //column is row...
            vector3D.x = this.rawData[column * 4];
            vector3D.y = this.rawData[column * 4 + 1];
            vector3D.z = this.rawData[column * 4 + 2];
            vector3D.w = this.rawData[column * 4 + 3];
        }

        /**
         * Copies all of the matrix data from the source Matrix3D object into the calling Matrix3D object.
         */
        public copyFrom(sourceMatrix3D: Matrix3D): void
        {
            var len: number = sourceMatrix3D.rawData.length;
            for (var c: number = 0; c < len; c++)
                this.rawData[c] = sourceMatrix3D.rawData[c];
        }

        /**
         * Copies all of the vector data from the source vector object into the calling Matrix3D object.
         */
        public copyRawDataFrom(vector: number[], index: number /*uint*/  = 0, transpose: boolean = false): void
        {
            if (transpose)
                this.transpose();

            var len: number = vector.length - index;
            for (var c: number = 0; c < len; c++)
                this.rawData[c] = vector[c + index];

            if (transpose)
                this.transpose();
        }

        /**
         * Copies all of the matrix data from the calling Matrix3D object into the provided vector.
         */
        public copyRawDataTo(vector: number[], index: number /*uint*/  = 0, transpose: boolean = false): void
        {
            if (transpose)
                this.transpose();

            var len: number = this.rawData.length
			for (var c: number = 0; c < len; c++)
                vector[c + index] = this.rawData[c];

            if (transpose)
                this.transpose();
        }

        /**
         * Copies a Vector3D object into specific row of the calling Matrix3D object.
         */
        public copyRowFrom(row: number /*uint*/ , vector3D: Vector3D): void
        {
            if (row < 0 || row > 3)
                throw new Error("row error");
            this.rawData[row] = vector3D.x;
            this.rawData[row + 4] = vector3D.y;
            this.rawData[row + 8] = vector3D.z;
            this.rawData[row + 12] = vector3D.w;
        }

        /**
         * Copies specific row of the calling Matrix3D object into the Vector3D object.
         */
        public copyRowTo(row: number /*uint*/, vector3D: Vector3D): void
        {
            if (row < 0 || row > 3)
                throw new Error("row error");
            vector3D.x = this.rawData[row];
            vector3D.y = this.rawData[row + 4];
            vector3D.z = this.rawData[row + 8];
            vector3D.w = this.rawData[row + 12];
        }
    
        public copyToMatrix3D(dest: Matrix3D): void
        {
            dest.rawData.set(this.rawData);
        }

        /**
         * Returns the transformation matrix's translation, rotation, and scale settings as a Vector of three Vector3D objects.
         */
        //public decompose(orientationStyle: String = "eulerAngles"):Vector3D[]
        //{

        //}
        


        /**
         * Converts the current matrix to an identity or unit matrix.
         */
        public identity(): void
        {
            this.rawData = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1]);
        }

        /**
         * [static] Interpolates the translation, rotation, and scale transformation of one matrix toward those of the target matrix.
         */
        public static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number): Matrix3D
        {
            return new Matrix3D();
        }

        /**
         * Interpolates this matrix towards the translation, rotation, and scale transformations of the target matrix.
         */
        public interpolateTo(toMat: Matrix3D, percent: number): void
        {
        }

        /**
         * Inverts the current matrix.
         */
        public invert(): boolean
        {
            return true;
        }

        /**
         * Rotates the display object so that it faces a specified position.
         */
        public pointAt(pos: Vector3D, at: Vector3D = null, up: Vector3D = null): void
        {
            if (at == null)
                at = new Vector3D(0, -1, 0);
            if (up == null)
                up = new Vector3D(0, 0, -1);

            var zAxis: Vector3D = at.subtract(pos);
            zAxis.normalize();

            var xAxis: Vector3D = zAxis.crossProduct(up);
            var yAxis: Vector3D = zAxis.crossProduct(xAxis);

            this.rawData = new Float32Array([
                xAxis.x, xAxis.y, xAxis.z, 0,
                yAxis.x, yAxis.y, yAxis.z, 0,
                zAxis.x, zAxis.y, zAxis.z, 0,
                pos.x, pos.y, pos.z, 1
            ]);

        }

       

        

        /**
         * Sets the transformation matrix's translation, rotation, and scale settings.
         */
        public recompose(components:Vector3D[], orientationStyle: String = "eulerAngles"): boolean
        {
            return true;
        }

        /**
         * Uses the transformation matrix to transform a Vector3D object from one space coordinate to another.
         */
        public transformVector(v: Vector3D): Vector3D
        {
            // [x,y,z,1] * this
            return new Vector3D(
                v.x * this.rawData[0] + v.y * this.rawData[4] + v.z * this.rawData[8] + this.rawData[12],
                v.x * this.rawData[1] + v.y * this.rawData[5] + v.z * this.rawData[9] + this.rawData[13],
                v.x * this.rawData[2] + v.y * this.rawData[6] + v.z * this.rawData[10] + this.rawData[14],
                v.x * this.rawData[3] + v.y * this.rawData[7] + v.z * this.rawData[11] + this.rawData[15]
                );
        }

        /**
         * Uses the transformation matrix without its translation elements to transform a Vector3D object from one space coordinate to another.
         */
        public deltaTransformVector(v: Vector3D): Vector3D
        {
            //[x,y,z,0] * this
            return new Vector3D(
                v.x * this.rawData[0] + v.y * this.rawData[4] + v.z * this.rawData[8],
                v.x * this.rawData[1] + v.y * this.rawData[5] + v.z * this.rawData[9],
                v.x * this.rawData[2] + v.y * this.rawData[6] + v.z * this.rawData[10],
                v.x * this.rawData[3] + v.y * this.rawData[7] + v.z * this.rawData[11]
                );
        }

        /**
         * Uses the transformation matrix to transform a Vector of Numbers from one coordinate space to another.
         */
        public transformVectors(vin:number[], vout:number[]): void
        {
            var i: number = 0;
            var x: number = 0, y: number = 0, z: number = 0;

            while (i + 3 <= vin.length) {
                x = vin[i];
                y = vin[i + 1];
                z = vin[i + 2];
                vout[i] = x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12];
                vout[i + 1] = x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13];
                vout[i + 2] = x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14];
                i += 3;
            }
        }


        /**
         * Converts the current Matrix3D object to a matrix where the rows and columns are swapped.
         */
        public transpose(): void
        {
                                                var a12: number = this.rawData[1];  var a13: number = this.rawData[2]; var a14: number = this.rawData[3];
            var a21: number = this.rawData[4];                                      var a23: number = this.rawData[6]; var a24: number = this.rawData[7];
            var a31: number = this.rawData[8];  var a32: number = this.rawData[9];                                     var a34: number = this.rawData[11];
            var a41: number = this.rawData[12]; var a42: number = this.rawData[13]; var a43: number = this.rawData[14];  

            this.rawData[1] = a21;
            this.rawData[2] = a31;
            this.rawData[3] = a41;
            this.rawData[4] = a12;
            this.rawData[6] = a32;
            this.rawData[7] = a42;
            this.rawData[8] = a13;
            this.rawData[9] = a23;
            this.rawData[11] = a43;
            this.rawData[12] = a14;
            this.rawData[13] = a24;
            this.rawData[13] = a34;

        }
    
        private getRotateMatrix(axis: Vector3D, degrees: number): Matrix3D
        {
            var ax: number = axis.x;
            var ay: number = axis.y;
            var az: number = axis.z;

            var radians: number = Math.PI / 180 * degrees;
            var c: number = Math.cos(radians);
            var s: number = Math.sin(radians);

            //get rotation matrix
            var rMatrix: Matrix3D;

            if (ax != 0 && ay == 0 && az == 0) //rotate about x axis
            {
                rMatrix = new Matrix3D([
                    1, 0, 0, 0,
                    0, c, s, 0,
                    0, -s, c, 0,
                    0, 0, 0, 1
                ]);

            } else if (ay != 0 && ax == 0 && az == 0) // rotate about y axis
            {
                rMatrix = new Matrix3D([
                    c, 0, -s, 0,
                    0, 1, 0, 0,
                    s, 0, c, 0,
                    0, 0, 0, 1
                ]);

            } else if (az != 0 && ax == 0 && ay == 0) // rotate about z axis
            {
                rMatrix = new Matrix3D([
                    c, s, 0, 0,
                    -s, c, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1,

                ]);

            } else {

                //make sure axis is a unit vector
                var lsq: number = axis.lengthSquared;
                if (Math.abs(lsq - 1) > 0.0001) {
                    var f: number = 1 / Math.sqrt(lsq);
                    ax = axis.x * f;
                    ay = axis.y * f;
                    az = axis.z * f;
                }

                var t: number = 1 - c;

                rMatrix = new Matrix3D([
                    ax * ax * t + c, ax * ay * t + az * s, ax * az * t - ay * s, 0,
                    ax * ay * t - az * s, ay * ay * t + c, ay * az * t + ax * s, 0,
                    ax * az * t + ay * s, ay * az * t - ax * s, az * az * t + c, 0,
                    0, 0, 0, 1
                ]);

            }
            return rMatrix;
        }


    }

}

//clipspace coordinates always go from -1 to +1