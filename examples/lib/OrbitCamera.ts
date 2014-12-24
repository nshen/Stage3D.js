
///<reference path="../stage3d.d.ts"/>
module lib
{

    /**
     * 环视相机
     */

    export class OrbitCamera
    {
        private _matrix:stageJS.geom.Matrix3D;
        private _pos:stageJS.geom.Vector3D;
        private _rotate:stageJS.geom.Vector3D;

        public constructor()
        {
            this._rotate = new stageJS.geom.Vector3D();
            this._pos = new stageJS.geom.Vector3D();
            this._matrix = new stageJS.geom.Matrix3D();
        }

        public set pos(p:stageJS.geom.Vector3D)
        {
            this._pos = p;
            this.update();
        }

        public set posX(num:number)
        {
            if(num != this._pos.x)
            {
                this._pos.x = num;
                this.update();
            }
        }
        public set posZ(num:number)
        {
            if(num != this._pos.z)
            {
                this._pos.z = num;
                this.update();
            }
        }
        public set rotateY(num:number)
        {
            if(num != this._rotate.y)
            {
                this._rotate.y = num;
                this.update();
            }
        }

        public set rotateX(num:number)
        {
            if(num != this._rotate.x)
            {
                this._rotate.x = num;
                this.update();
            }
        }

        private _invertMatrix:stageJS.geom.Matrix3D;
        public getViewMatrix():stageJS.geom.Matrix3D
        {
            this._invertMatrix = this._matrix.clone();
            this._invertMatrix.invert();
            return this._invertMatrix;
        }


        private update():void
        {
            this._matrix.identity();
            this._matrix.appendTranslation(this._pos.x, this._pos.y,this._pos.z);
            this._matrix.appendRotation(this._rotate.x,stageJS.geom.Vector3D.X_AXIS);
            this._matrix.appendRotation(this._rotate.y,stageJS.geom.Vector3D.Y_AXIS);
        }



    }

} // end package



