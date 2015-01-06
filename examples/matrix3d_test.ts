///<reference path="stage3d.d.ts"/>

module test.matrix3d_test {

    declare var mat4:any;
    declare var vec3:any;




    /**
     *  window.onload entry point
     */
    export function main()
    {

        var m1:stageJS.geom.Matrix3D;
        var m2:stageJS.geom.Matrix3D;
        var m3:stageJS.geom.Matrix3D;
        var m4:stageJS.geom.Matrix3D;
        var v1:stageJS.geom.Vector3D;

        var glM1:any; //glmatrix
        var glM2:any;
        var glM3:any;
        var glM4:any;

        var glV1:any;//glmatrix vec3
        var glV2:any;


        //----------------------------
        // test
        //----------------------------


        //-----------------------------------------------------------------------------------------
        console.log("# appendTranslation() && position#");

        m1 = new stageJS.geom.Matrix3D();
        m1.appendTranslation(1,2,3);


        glM1 = mat4.create();
        mat4.translate(glM1,glM1,vec3.fromValues(1,2,3));

        testMatrix(m1,glM1);

        if((m1.position.x != 1) || (m1.position.y != 2) || (m1.position.z != 3))
            console.error("position error");


        //-----------------------------------------------------------------------------------------
        console.log("# prependTranslation() #");

        //m1 = new stageJS.geom.Matrix3D();
        m1.prependTranslation(1,2,3);

        //glM1 = mat4.create();
        glM2 = mat4.create();
        mat4.translate(glM2,glM2,vec3.fromValues(1,2,3));
        mat4.mul(glM1,glM1,glM2);

        testMatrix(m1,glM1);
        //-----------------------------------------------------------------------------------------
        console.log("# appendScale() #");

        m1.appendScale(3,4,5);

        glM2 = mat4.create();
        mat4.scale(glM2, glM2, vec3.fromValues(3,4,5));
        mat4.mul(glM1,glM2,glM1); // glM1 * glM2

        testMatrix(m1,glM1);
        //-----------------------------------------------------------------------------------------
        console.log("# prependScale() #");

        m1.prependScale(9,-8,7);
        mat4.scale(glM1, glM1, vec3.fromValues(9,-8,7));

        testMatrix(m1,glM1);
        //-----------------------------------------------------------------------------------------
        console.log("# appendRotation() #");

        //x axis
        m1.appendRotation(15,stageJS.geom.Vector3D.X_AXIS);

        glM2 = mat4.create(); //rotation matrix
        mat4.rotateX(glM2, glM2, 15 * Math.PI/180);
        mat4.mul(glM1,glM2,glM1);  // glM1= glM1* glM2
        testMatrix(m1,glM1);


        //y axis
        m1.appendRotation(25,stageJS.geom.Vector3D.Y_AXIS);

        glM2 = mat4.create(); //rotation matrix
        mat4.rotateY(glM2, glM2, 25 * Math.PI/180);
        mat4.mul(glM1,glM2,glM1);  // glM1= glM1* glM2
        testMatrix(m1,glM1);


        //z axis
        m1.appendRotation(35,stageJS.geom.Vector3D.Z_AXIS);

        glM2 = mat4.create(); //rotation matrix
        mat4.rotateZ(glM2, glM2, 35 * Math.PI/180);
        mat4.mul(glM1,glM2,glM1);  // glM1= glM1* glM2
        testMatrix(m1,glM1);


        //custom axis
        m1.appendRotation(40,new stageJS.geom.Vector3D(4,5,6));

        glM2 = mat4.create(); //rotation matrix
        mat4.rotate(glM2, glM2, 40 * Math.PI/180 , vec3.fromValues(4,5,6));
        mat4.mul(glM1,glM2,glM1);  // glM1= glM1* glM2
        testMatrix(m1,glM1);


        //rotate about a point
        m1.appendRotation(30,new stageJS.geom.Vector3D(4,5,6),new stageJS.geom.Vector3D(1,2,3));

        glM2 = mat4.create(); //rotation matrix
        mat4.rotate(glM2, glM2, 30 * Math.PI/180 , vec3.fromValues(4,5,6));
        glM3 = mat4.create(); //negative translate matrix
        mat4.translate(glM3,glM3,vec3.fromValues(-1,-2,-3));
        glM4 = mat4.create(); //positive translate matrix
        mat4.translate(glM4,glM4,vec3.fromValues(1,2,3));

        // glM1 * negativeM(glM3) * rotationM(glM2) * positive(glM4)
        mat4.mul(glM1,glM3,glM1);  // glM1 = glM1* glM3
        mat4.mul(glM1,glM2,glM1);
        mat4.mul(glM1,glM4,glM1);

        testMatrix(m1,glM1);
        //-----------------------------------------------------------------------------------------
        console.log("# prependRotation() #");

        m1.prependRotation(15,stageJS.geom.Vector3D.X_AXIS);
        mat4.rotate(glM1,glM1,15 * Math.PI / 180 , vec3.fromValues(1,0,0));
        testMatrix(m1,glM1);

        m1.prependRotation(30,stageJS.geom.Vector3D.Y_AXIS);
        mat4.rotate(glM1,glM1,30 * Math.PI / 180 , vec3.fromValues(0,1,0));
        testMatrix(m1,glM1);

        m1.prependRotation(40,stageJS.geom.Vector3D.Z_AXIS);
        mat4.rotate(glM1,glM1,40 * Math.PI / 180 , vec3.fromValues(0,0,1));
        testMatrix(m1,glM1);

        m1.prependRotation(325,new stageJS.geom.Vector3D(1,3,8));
        mat4.rotate(glM1, glM1, 325 * Math.PI / 180 , vec3.fromValues(1,3,8));
        testMatrix(m1,glM1);

        //about a point(7,8,9)
        m1.prependRotation(30,new stageJS.geom.Vector3D(1,2,3),new stageJS.geom.Vector3D(7,8,9));

        glM4 = mat4.create(); //positive translate matrix
        mat4.translate(glM4,glM4,vec3.fromValues(7,8,9));

        glM2 = mat4.create(); //rotation matrix
        mat4.rotate(glM2, glM2, 30 * Math.PI/180 , vec3.fromValues(1,2,3));

        glM3 = mat4.create(); //negative translate matrix
        mat4.translate(glM3,glM3,vec3.fromValues(-7,-8,-9));

        //m3 * m2 * m4 * m1
        mat4.mul(glM2,glM2,glM3);
        mat4.mul(glM4,glM4,glM2);
        mat4.mul(glM1,glM1,glM4);

        testMatrix(m1,glM1);
        //-----------------------------------------------------------------------------------------
        console.log("# append() and prepend() #");

        m2 = new stageJS.geom.Matrix3D();
        m2.appendRotation(18,stageJS.geom.Vector3D.Z_AXIS);

        glM2 = mat4.create();
        mat4.rotateZ(glM2, glM2, 18 * Math.PI/180);

        testMatrix(m2,glM2);

        m3 = new stageJS.geom.Matrix3D();
        m3.prependScale(1,3,4);

        glM3 = mat4.create();
        mat4.scale(glM3, glM3, vec3.fromValues(1,3,4));

        testMatrix(m3,glM3);

        m4 = new stageJS.geom.Matrix3D();
        m4.prependTranslation(8,7,6);

        glM4 = mat4.create();
        mat4.translate(glM4,glM4,vec3.fromValues(8,7,6));

        testMatrix(m4,glM4);

        m1.append(m2);
        mat4.mul(glM1,glM2,glM1);
        m1.prepend(m3);
        mat4.mul(glM1,glM1,glM3);
        m1.append(m4);
        mat4.mul(glM1,glM4,glM1);
        m1.prepend(m2);
        mat4.mul(glM1,glM1,glM2);
        m1.prepend(m4);
        mat4.mul(glM1,glM1,glM4);

        testMatrix(m1,glM1);
        //-----------------------------------------------------------------------------------------
        console.log("# determinant #");

        console.log(m1.determinant);
        console.log(mat4.determinant(glM1));
        console.error("有0.01级别误差");

        //-----------------------------------------------------------------------------------------
        console.log("# invert() #");

        m1.invert();
        mat4.invert(glM1,glM1);
        testMatrix(m1,glM1);
        return;
        //-----------------------------------------------------------------------------------------
        console.log("# transpose() && clone() #");

        m2 = m1.clone();
        m1.transpose();
        m1.transpose();
        testRawData(m1.rawData,m2.rawData);

        m3 = new stageJS.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        m3.transpose();
        testRawData(m3.rawData, [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]);
        //-----------------------------------------------------------------------------------------

        console.log("# identity() #");

        m1.identity();
        mat4.identity(glM1,glM1);

        testRawData(m1.rawData,glM1);

        //-----------------------------------------------------------------------------------------
        console.log("# copyColumnFrom() && copyColumnTo ");

        m1 = new stageJS.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

        var copyV:stageJS.geom.Vector3D = new stageJS.geom.Vector3D(999,999,999,999);
        var resultV:stageJS.geom.Vector3D = new stageJS.geom.Vector3D();

        m1.copyColumnFrom(0, copyV);
        m1.copyColumnTo(0,resultV);
        //logMatrix(m1.rawData);
        testVector(resultV,copyV);

        m1.copyColumnFrom(1, copyV);
        m1.copyColumnTo(1,resultV);
        //logMatrix(m1.rawData);
        testVector(resultV,copyV);

        m1.copyColumnFrom(2, copyV);
        m1.copyColumnTo(2,resultV);
        //logMatrix(m1.rawData);
        testVector(resultV,copyV);


        m1.copyColumnFrom(3, copyV);
        m1.copyColumnTo(3,resultV);
        //logMatrix(m1.rawData);
        testVector(resultV,copyV);
        //-----------------------------------------------------------------------------------------
        console.log("# copyRowFrom() && copyRowTo() ");

        m1 = new stageJS.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

        var copyV:stageJS.geom.Vector3D = new stageJS.geom.Vector3D(999,999,999,999);
        var resultV:stageJS.geom.Vector3D = new stageJS.geom.Vector3D();

        m1.copyRowFrom(0, copyV);
        m1.copyRowTo(0,resultV);
        //logMatrix(m1.rawData);
        testVector(resultV,copyV);

        m1.copyRowFrom(1, copyV);
        m1.copyRowTo(1,resultV);
        //logMatrix(m1.rawData);
        testVector(resultV,copyV);

        m1.copyRowFrom(2, copyV);
        m1.copyRowTo(2,resultV);
        //logMatrix(m1.rawData);
        testVector(resultV,copyV);


        m1.copyRowFrom(3, copyV);
        m1.copyRowTo(3,resultV);
        //logMatrix(m1.rawData);
        testVector(resultV,copyV);
        //-----------------------------------------------------------------------------------------
        console.log("# copyFrom() #");
        m1 = new stageJS.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        m2 = new stageJS.geom.Matrix3D();

        m2.copyFrom(m1);

        //logMatrix(m1.rawData);
        //logMatrix(m2.rawData);
        testRawData(m1.rawData,m2.rawData);
        //-----------------------------------------------------------------------------------------
        console.log("# copyToMatrix3D() #");

        m1 = new stageJS.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        m2 = new stageJS.geom.Matrix3D();

        m1.copyToMatrix3D(m2);
        //logMatrix(m1.rawData);
        //logMatrix(m2.rawData);
        testRawData(m1.rawData,m2.rawData);
        //-----------------------------------------------------------------------------------------
        console.log("# copyRawDataFrom() && copyRawDataTo() #");

        var raw:number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

        m1 = new stageJS.geom.Matrix3D();
        m2 = new stageJS.geom.Matrix3D();
        m3 = new stageJS.geom.Matrix3D();

        m1.copyRawDataFrom(raw);
        testRawData(m1.rawData,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);

        m2.copyRawDataFrom(raw,5);
        testRawData(m2.rawData,[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);

        try {
            m3.copyRawDataFrom(raw, 10);
        }catch(e)
        {
            if(e.message == "arguments error")
            console.warn("pass");
        }

        raw = [];

        m1.copyRawDataTo(raw,0);
        testRawData(raw,[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        m1.copyRawDataTo(raw,5);
        testRawData(raw,[0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        m1.copyRawDataTo(raw,10);
        testRawData(raw,[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        //console.log(raw);
        //console.log(raw2);
        //console.log(raw3);
        //-----------------------------------------------------------------------------------------
        console.log("# transformVector() && deltaTransformVector #");

        m1.identity();
        m1.appendRotation(30,stageJS.geom.Vector3D.X_AXIS);
        m1.appendScale(3,5,6);
        m1.appendTranslation(2,3,4);
        m1.prependRotation(40,stageJS.geom.Vector3D.Y_AXIS);

        /*******************************************
         //as3 result

         var m:Matrix3D = new Matrix3D();
         m.appendRotation(30, Vector3D.X_AXIS);
         m.appendScale(3, 5, 6);
         m.appendTranslation(2, 3, 4);
         m.prependRotation(40, Vector3D.Y_AXIS);

         var v:Vector3D = m.transformVector(new Vector3D(1, 2, 3));
         trace(v.x, v.y, v.z,v.w);

         var v2:Vector3D = m.deltaTransformVector(new Vector3D(1, 2, 3));
         trace(v2.x, v2.y, v2.z, v2.w);

         //10.083221435546875 7.521889686584473 18.601428985595703 1
         //8.083221435546875 4.521889686584473 14.601428985595703 0

         *******************************************/

        var tv:stageJS.geom.Vector3D = m1.transformVector(new stageJS.geom.Vector3D(1,2,3));
        console.log(tv.toString());

        testVector(tv,new stageJS.geom.Vector3D(10.083221435546875, 7.521889686584473, 18.601428985595703 ,1));
        var dtv:stageJS.geom.Vector3D = m1.deltaTransformVector(new stageJS.geom.Vector3D(1,2,3));
        console.log(dtv.toString());
        testVector(dtv,new stageJS.geom.Vector3D(8.083221435546875, 4.521889686584473, 14.601428985595703, 0));
        //-----------------------------------------------------------------------------------------
        console.log("# invert() #");


        //-----------------------------------------------------------------------------------------
        //transformVectors todo:test
        //pointAt
        //decompose
        //recompose
        //
        //interpolate
        //interpolateTo
        //invert
        //-----------------------------------------------------------------------------------------



        m1.identity();
        m1.appendRotation(30,stageJS.geom.Vector3D.X_AXIS);
        m1.appendTranslation(1,3,3);

        m2 = m1.clone();
        m2.transpose();

        console.log(m1.determinant , m2.determinant);

        logMatrix(m1.rawData);
        logMatrix(glM1);

        isTranspose(m1,glM1);

        console.log(m1.determinant,m2.determinant,mat4.determinant(glM1));
        if(m2.determinant != mat4.determinant(glM1))
            console.error("determinant error");

return;



        console.log("测试右手投影矩阵");

        var Sm:stageJS.geom.PerspectiveMatrix3D = new stageJS.geom.PerspectiveMatrix3D();
        Sm.perspectiveFieldOfViewRH(44,500/400,0.1,2000);
        var Gm:any = mat4.create();
        mat4.perspective(Gm, 44, 500/400, 0.1, 2000);

        isTranspose(Sm,Gm);



        Sm.identity();
        Sm.perspectiveOffCenterRH(111,800,100,200,2,3333);

        Gm = mat4.create();
        mat4.frustum(Gm, 111, 800, 100, 200, 2, 3333);

        isTranspose(Sm,Gm);

        Sm.identity();
        Sm.perspectiveRH(400,300,2,3333);

        Gm = mat4.create();
        mat4.frustum(Gm, -200, 200, -150, 150, 2, 3333);

        isTranspose(Sm,Gm);


        logMatrix(Sm.rawData);
        logMatrix(Gm);



















        return ;










        console.log('## decompose()  ------------------');
        var m:stageJS.geom.Matrix3D = new stageJS.geom.Matrix3D();
        m.appendScale(1, 2, 3);
        m.appendRotation(30, stageJS.geom.Vector3D.X_AXIS);
        m.appendRotation(45, stageJS.geom.Vector3D.Y_AXIS);
        m.appendRotation(60, stageJS.geom.Vector3D.Z_AXIS);
        m.appendTranslation(6, 7, 8);
        var vv:Array<stageJS.geom.Vector3D> = m.decompose();

        testVector(vv[0] , new stageJS.geom.Vector3D(6,7,8));
        testVector(vv[2] , new stageJS.geom.Vector3D(1,2,3));
        testVector(vv[1] , new stageJS.geom.Vector3D(30 * Math.PI / 180 , 45 * Math.PI/180, 60 * Math.PI/180));

        console.log('## recompose()   ---------------------');
        m2 = new stageJS.geom.Matrix3D();
        var vv2:Array<stageJS.geom.Vector3D> = [new stageJS.geom.Vector3D(6, 7, 8) , //pos
                                   new stageJS.geom.Vector3D(30 * Math.PI/180, 45 * Math.PI/180, 60* Math.PI/180), //euler
                                   new stageJS.geom.Vector3D(1, 2, 3)]; //scale
        m2.recompose(vv2);
        testRawData(m.rawData,m2.rawData);


        console.log('## static interpolate() --------------');

        m = new stageJS.geom.Matrix3D();
        m2 = new stageJS.geom.Matrix3D();
        m2.appendRotation(30,stageJS.geom.Vector3D.X_AXIS);
        var m3:stageJS.geom.Matrix3D = stageJS.geom.Matrix3D.interpolate(m,m2,0.5);
        console.log(m3.toString());

        //TODO:貌似与flash有0.1级别的误差，有待观察
        testRawData(m3.rawData,[1,0,0,0,0,0.9659258127212524,0.25881901383399963,0,0,-0.25881901383399963,0.9659258127212524,0,0,0,0,1]);
        console.error("interpolate() 计算结果貌似与flash有0.1级别的误差，有待观察");

        console.log('## interpolateTo()	------------------');
        m = new stageJS.geom.Matrix3D();
        m2 = new stageJS.geom.Matrix3D();
        m2.appendRotation(30,stageJS.geom.Vector3D.X_AXIS);
        m.interpolateTo(m2,0.5);
        console.log(m.toString());
        testRawData(m.rawData,[1,0,0,0,0,0.9659258127212524,0.25881901383399963,0,0,-0.25881901383399963,0.9659258127212524,0,0,0,0,1]);
        console.error("interpolateTo() 计算结果貌似与flash有0.1级别的误差，有待观察");


        console.log('# invert() ------------------');
        m = new stageJS.geom.Matrix3D();
        m.prependTranslation(1, 2, 3);
        m.prependScale(4, 5, 6);
        m.prependRotation(80, stageJS.geom.Vector3D.Y_AXIS);
        var b:boolean = m.invert();
        if(!b)
            console.error('fail');
        else
            testRawData(m.rawData,[0.04341204836964607,0,0.24620193243026733,0,0,0.20000000298023224,0,0,-0.16413463652133942,0,0.028941363096237183,0,0.4489918351173401,-0.4000000059604645,-0.3330260217189789,1]);


        console.log('# pointAt() ------------');
//        m = new stageJS.geom.Matrix3D();
//        m.pointAt(new stageJS.geom.Vector3D(1,2,3) );
//        for (var i:number = 0; i < m.rawData.length; i++) {
//          console.log(m.rawData[i]);
//
//        }
        console.error('implement yet');



        console.log("## Quaternion Test!");
        m = new stageJS.geom.Matrix3D();
        m.appendRotation(45 , stageJS.geom.Vector3D.Z_AXIS);
        m.appendRotation(30 , stageJS.geom.Vector3D.Y_AXIS);
        m.appendRotation(60 , stageJS.geom.Vector3D.X_AXIS);

        //console.log(m.toString());
        var q:stageJS.geom.Quaternion = new stageJS.geom.Quaternion();
        q.fromMatrix3D(m);
        //console.log(q.toString());
        //console.log(q.toMatrix3D().toString());
        testRawData(m.rawData , q.toMatrix3D().rawData);
    }


    /*
        transform vector(1,2,3) to see if the the result is equal
     */
    function testMatrix(stageMatrix:stageJS.geom.Matrix3D , glmatrix:any)
    {
        var v1 = stageMatrix.transformVector(new stageJS.geom.Vector3D(1,2,3));

        var glV1 = vec3.fromValues(1,2,3);
        vec3.transformMat4(glV1, glV1, glmatrix);
        testVector(v1,new stageJS.geom.Vector3D(glV1[0],glV1[1],glV1[2],1));
    }

    function testRawData(rawData:any, arr:any):boolean
    {
        if (rawData.length != arr.length) {
            console.error("fail!");
            return false;
        }
        for (var i:number = 0; i < rawData.length; i++) {
            if (Math.abs(rawData[i] - arr[i]) > 0.0001) {
                console.error("fail!   " + "rawData[" + i + "] " + rawData[i] + " : " + arr[i]);
                logMatrix(rawData);
                logMatrix(arr);
                return false;
            }

        }
        console.warn("pass  ");
        return true;
    }

    function testVector(v1:stageJS.geom.Vector3D, v2:stageJS.geom.Vector3D):void
    {
        var p:number = 0.001;
        if ((Math.abs(v1.x - v2.x) < p) && (Math.abs(v1.y - v2.y) < p) && (Math.abs(v1.z - v2.z) < p) && (Math.abs(v1.w - v2.w) < p)) {
            console.warn("pass " + v1.toString());

            return;
        }
        console.error("fail!! "+ v1.toString() + v2.toString());

    }

    function isTranspose(a:stageJS.geom.Matrix3D , b:any , str:string ="")
    {
        //if(str!="")
        //    console.log("# "+str+ " #");
        var arr:stageJS.geom.Matrix3D = a.clone();
        arr.transpose();
        testRawData(arr.rawData,b);
    }

    function logMatrix(matrix:any ,str:string = "----------")
    {
        var arr:any[] = [];
        for(var i =0 ; i < matrix.length ; i++)
        {
            //console.log(arr[i] ,arr[i] * 100 , Math.round(arr[i]*100),Math.round(arr[i]*100)/100);
            arr[i] = String(Math.round(matrix[i]*1000) / 1000);
            while(arr[i].length < 7)
            {
                arr[i] =" " + arr[i];
            }

        }
        console.log(str);
        console.log(arr[0],",               ",arr[1],",               ",arr[2],",               ",arr[3]);
        console.log(arr[4],",               ",arr[5],",               ",arr[6],",               ",arr[7]);
        console.log(arr[8],",               ",arr[9],",               ",arr[10],",               ",arr[11]);
        console.log(arr[12],",               ",arr[13],",               ",arr[14],",               ",arr[15]);
    }



}
window.onload = test.matrix3d_test.main;

