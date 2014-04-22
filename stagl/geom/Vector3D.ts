///<reference path="../_definitions.ts"/>
module stagl.geom
{
    export class Vector3D
    {

        /**
         * The x axis defined as a Vector3D object with coordinates (1,0,0).
         */
        public static X_AXIS: Vector3D = new Vector3D(1, 0, 0);

        /**
         * The y axis defined as a Vector3D object with coordinates (0,1,0).
         */
        public static Y_AXIS: Vector3D = new Vector3D(0, 1, 0);

        /**
         * The z axis defined as a Vector3D object with coordinates (0,0,1).
         */
        public static Z_AXIS: Vector3D = new Vector3D(0, 0, 1);


        /** 
         * The fourth element of a Vector3D object (in addition to the x, y, and z properties) can hold data such as the angle of rotation.
         */
        public w: number;

        /**
         * The first element of a Vector3D object, such as the x coordinate of a point in the three-dimensional space.
         */
        public x: number;

        /**
         * The second element of a Vector3D object, such as the y coordinate of a point in the three-dimensional space.
         */
        public y: number;

        /**
         * The third element of a Vector3D object, such as the z coordinate of a point in three - dimensional space.
         */
        public z: number;


        /**
		 * Creates an instance of a Vector3D object. If you do not specify a parameter for the constructor, 
		 * a Vector3D object is created with the elements (0,0,0,0).
		 * @param	x	The first element, such as the x coordinate.
		 * @param	y	The second element, such as the y coordinate.
		 * @param	z	The third element, such as the z coordinate.
		 * @param	w	An optional element for additional data such as the angle of rotation.
		 * @langversion	3.0
		 * @playerversion	Flash 10
		 * @playerversion	AIR 1.5
		 */
        constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }


        /**
         * [read-only] The length, magnitude, of the current Vector3D object from the origin(0, 0, 0) to the object's x, y, and z coordinates.
         */
        public get length(): number
        {
            return Math.sqrt(this.lengthSquared);
        }

        /**
         * [read-only] The square of the length of the current Vector3D object, calculated using the x, y, and z properties.
         */
        public get lengthSquared(): number
        {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }

        /**
         * [static] Returns the angle in radians between two vectors.
         */
        public static angleBetween(a: Vector3D, b: Vector3D): number
        {
            return Math.acos(a.dotProduct(b) / (a.length * b.length));
        }

        /**
         * [static] Returns the distance between two Vector3D objects.
         */
        public static distance(pt1: Vector3D, pt2: Vector3D): number
        {
            var x: number = (pt1.x - pt2.x);
            var y: number = (pt1.y - pt2.y);
            var z: number = (pt1.z - pt2.z);
            return Math.sqrt(x * x + y * y + z * z);
        }


        /**
		 * Adds the value of the x, y, and z elements of the current Vector3D object 
		 * to the values of the x, y, and z elements of another Vector3D object. 
		 * The add() method does not change the current Vector3D object. Instead, it returns
		 * a new Vector3D object with the new values.
		 * 
		 *   The result of adding two vectors together is a resultant vector. One way to visualize
		 * the result is by drawing a vector from the origin or tail of the first vector
		 * to the end or head of the second vector. The resultant vector is the distance 
		 * between the origin point of the first vector and the end point of the second vector.
		 * @param	a	A Vector3D object to be added to the current Vector3D object.
		 * @return	A Vector3D object that is the result of adding the current Vector3D object 
		 *   to another Vector3D object.
		 * @langversion	3.0
		 * @playerversion	Flash 10
		 * @playerversion	AIR 1.5
		 */
        public add(a: Vector3D): Vector3D
        {
            return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z);
        }

        /**
		 * Subtracts the value of the x, y, and z elements of the current Vector3D object 
		 * from the values of the x, y, and z elements of another Vector3D object. 
		 * The subtract() method does not change the current Vector3D object. Instead, 
		 * this method returns a new Vector3D object with the new values.
		 * @param	a	The Vector3D object to be subtracted from the current Vector3D object.
		 * @return	A new Vector3D object that is the difference between the current Vector3D 
		 *   and the specified Vector3D object.
		 * @langversion	3.0
		 * @playerversion	Flash 10
		 * @playerversion	AIR 1.5
		 */
        public subtract(a: Vector3D): Vector3D
        {
            return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z);
        }

        /**
         * Increments the value of the x, y, and z elements of the current Vector3D object 
         * by the values of the x, y, and z elements of a specified Vector3D object. Unlike the
         * Vector3D.add() method, the incrementBy() method changes the current 
         * Vector3D object and does not return a new Vector3D object.
         * @param	a	The Vector3D object to be added to the current Vector3D object.
         * @langversion	3.0
         * @playerversion	Flash 10
         * @playerversion	AIR 1.5
         */
        public incrementBy(a: Vector3D): void
        {
            this.x += a.x;
            this.y += a.y;
            this.z += a.z;
        }

        /**
         * Decrements the value of the x, y, and z elements of the current Vector3D object 
         * by the values of the x, y, and z elements of specified Vector3D object. Unlike the
         * Vector3D.subtract() method, the decrementBy() method changes the current 
         * Vector3D object and does not return a new Vector3D object.
         * @param	a	The Vector3D object containing the values to subtract from the current Vector3D object.
         * @langversion	3.0
         * @playerversion	Flash 10
         * @playerversion	AIR 1.5
         */
        public decrementBy(a: Vector3D): void
        {
            this.x -= a.x;
            this.y -= a.y;
            this.z -= a.z;
        }


		/**
		 * Determines whether two Vector3D objects are equal by comparing the x, y, and z 
		 * elements of the current Vector3D object with a specified Vector3D object. If the values of
		 * these elements are the same, the two Vector3D objects are equal. If the second
		 * optional parameter is set to true, all four elements of the Vector3D objects, 
		 * including the w property, are compared.
		 * @param	toCompare	The Vector3D object to be compared with the current Vector3D object.
		 * @param	allFour	An optional parameter that specifies whether the w property of
		 *   the Vector3D objects is used in the comparison.
		 * @return	A value of true if the specified Vector3D object is equal to the current 
		 *   Vector3D object; false if it is not equal.
		 * @langversion	3.0
		 * @playerversion	Flash 10
		 * @playerversion	AIR 1.5
		 */
        public equals(toCompare: Vector3D, allFour: boolean = false): boolean
        {
            return (this.x == toCompare.x && this.y == toCompare.y && this.z == toCompare.z && (allFour ? this.w == toCompare.w : true));
        }

        /**
         * Compares the elements of the current Vector3D object with the elements of a specified
         * Vector3D object to determine whether they are nearly equal. The two Vector3D objects are nearly equal 
         * if the value of all the elements of the two vertices are equal, or the result of the comparison
         * is within the tolerance range. The difference between two elements must be less than the number 
         * specified as the tolerance parameter. If the third optional parameter is set to 
         * true, all four elements of the Vector3D objects, including the w property, 
         * are compared. Otherwise, only the x, y, and z elements are included in the comparison.
         * @param	toCompare	The Vector3D object to be compared with the current Vector3D object.
         * @param	tolerance	A number determining the tolerance factor. If the difference between the values
         *   of the Vector3D element specified in the toCompare parameter and the current Vector3D element
         *   is less than the tolerance number, the two values are considered nearly equal.
         * @param	allFour	An optional parameter that specifies whether the w property of
         *   the Vector3D objects is used in the comparison.
         * @return	A value of true if the specified Vector3D object is nearly equal to the current
         *   Vector3D object; false if it is not equal.
         * @langversion	3.0
         * @playerversion	Flash 10
         * @playerversion	AIR 1.5
         */
        public nearEquals(toCompare: Vector3D, tolerance: number, allFour: boolean = false): boolean
        {
            var abs: Function = Math.abs;
            return ((abs(this.x - toCompare.x) < tolerance) && (abs(this.y - toCompare.y) < tolerance) && (abs(this.z - toCompare.z) < tolerance) && (allFour? (abs(this.w - toCompare.w) < tolerance):true));
        }


		/**
		 * Returns a new Vector3D object that is an exact copy of the current Vector3D object.
		 * @return	A new Vector3D object that is a copy of the current Vector3D object.
		 * @langversion	3.0
		 * @playerversion	Flash 10
		 * @playerversion	AIR 1.5
		 */
        public clone(): Vector3D
        {
            return new Vector3D(this.x, this.y, this.z, this.w);
        }

        /**
         * Copies all of vector data from the source Vector3D object into the calling Vector3D object.
         */
        public copyFrom(sourceVector3D: Vector3D): void
        {
            this.x = sourceVector3D.x;
            this.y = sourceVector3D.y;
            this.z = sourceVector3D.z;
            this.w = sourceVector3D.w;
        }

		/**
		 * Sets the current Vector3D object to its inverse. The inverse object is also considered the
		 * opposite of the original object. The value of 
		 * the x, y, and z properties of the current Vector3D object 
		 * is changed to -x, -y, and -z.
		 * @langversion	3.0
		 * @playerversion	Flash 10
		 * @playerversion	AIR 1.5
		 */
        public negate(): void
        {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
        }


        /**
         * Scales the current Vector3D object by a scalar, a magnitude. The Vector3D object's
         * x, y, and z elements are multiplied by the scalar number  
         * specified in the parameter. For example, if the vector is scaled by ten, 
         * the result is a vector that is ten times longer. The scalar can also
         * change the direction of the vector. Multiplying the vector by a negative
         * number reverses its direction.
         * @param	s	A multiplier (scalar) used to scale a Vector3D object.
         * @langversion	3.0
         * @playerversion	Flash 10
         * @playerversion	AIR 1.5
         */
        public scaleBy(s: number): void
        {
            this.x *= s;
            this.y *= s;
            this.z *= s;
        }

        /**
         * Sets the members of Vector3D to the specified values
         */
        public setTo(xa: number, ya: number, za: number): void
        {
            this.x = xa;
            this.y = ya;
            this.z = za;
        }

		/**
		 * Converts a Vector3D object to a unit vector by dividing the first three elements 
		 * (x, y, z) by the length of the vector. Unit vertices are 
		 * vertices that have a direction but their length is one. They simplify
		 * vector calculations by removing length as a factor.
		 * @return	The length of the current Vector3D object.
		 * @langversion	3.0
		 * @playerversion	Flash 10
		 * @playerversion	AIR 1.5
		 */
        public normalize(): number
        {
            var leng: number = this.length;
            if (leng != 0)
                this.scaleBy(1 / leng);
            return leng;
        }


        /**
		 * Returns a new Vector3D object that is perpendicular (at a right angle) to the current 
		 * Vector3D and another Vector3D object. If the returned Vector3D object's coordinates are 
		 * (0,0,0), then the two Vector3D objects are perpendicular to each other.
		 * 
		 *   You can use the normalized cross product of two vertices of a polygon surface with the 
		 * normalized vector of the camera or eye viewpoint to get a dot product. The value of
		 * the dot product can identify whether a surface of a three-dimensional object is hidden 
		 * from the viewpoint.
		 * @param	a	A second Vector3D object.
		 * @return	A new Vector3D object that is perpendicular to the current Vector3D object and the Vector3D 
		 *   object specified as the parameter.
		 * @langversion	3.0
		 * @playerversion	Flash 10
		 * @playerversion	AIR 1.5
		 */
        public crossProduct(a: Vector3D): Vector3D
        {
            return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x);
        }

		/**
		 * If the current Vector3D object and the one specified as the parameter are unit vertices, this
		 * method returns the cosine of the angle between the two vertices. Unit vertices are vertices that 
		 * point to the same direction but their length is one. They remove the length of the vector 
		 * as a factor in the result. You can use the normalize() method to convert a vector to a unit vector.
		 * 
		 *   The dotProduct() method finds the angle between two vertices. It is also 
		 * used in backface culling or lighting calculations. Backface culling is a procedure for determining 
		 * which surfaces are hidden from the viewpoint. You can use the normalized vertices from the camera, 
		 * or eye, viewpoint and the cross product of the vertices of a polygon surface to get the dot product. 
		 * If the dot product is less than zero, then the surface is facing the camera or the viewer. If the 
		 * two unit vertices are perpendicular to each other, they are orthogonal and the dot product is zero.
		 * If the two vertices are parallel to each other, the dot product is one.
		 * @param	a	The second Vector3D object.
		 * @return	A scalar which is the dot product of the current Vector3D object and the specified Vector3D object.
		 * @langversion	3.0
		 * @playerversion	Flash 10
		 * @playerversion	AIR 1.5
		 */
        public dotProduct(a: Vector3D): number
        {
            return (this.x * a.x + this.y * a.y + this.z * a.z);
        }

        /**
		 * Divides the value of the x, y, and z properties of the 
		 * current Vector3D object by the value of its w property.
		 * 
		 *   If the current Vector3D object is the result of multiplying a Vector3D object by a projection Matrix3D object,
		 * the w property can hold the transform value. The project() method then can 
		 * complete the projection by dividing the elements by the w property. Use the
		 * Matrix3D.rawData property to create a projection Matrix3D object.
		 * @langversion	3.0
		 * @playerversion	Flash 10
		 * @playerversion	AIR 1.5
		 */
        public project(): void
        {
            if (this.w == 0) return;
            this.x /= this.w;
            this.y /= this.w;
            this.z /= this.w;
        }

        /**
         * Returns a string representation of the current Vector3D object.
         */
        public toString(): string
        {
            return "[Vector3D] (x:" + this.x + " ,y:" + this.y + ", z:" + this.z + ", w:" + this.w + ")";
        }


    }
}