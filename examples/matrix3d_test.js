///<reference path="stage3d.d.ts"/>
var test;
(function (test) {
    var matrix3d_test;
    (function (matrix3d_test) {
        /**
         *  window.onload entry point
         */
        function main() {
            var m1;
            var m2;
            var m3;
            var m4;
            var v1;
            var glM1; //glmatrix
            var glM2;
            var glM3;
            var glM4;
            var glV1; //glmatrix vec3
            var glV2;
            //----------------------------
            // test
            //----------------------------
            //-----------------------------------------------------------------------------------------
            console.log("# appendTranslation() #");
            m1 = new stageJS.geom.Matrix3D();
            m1.appendTranslation(1, 2, 3);
            glM1 = mat4.create();
            mat4.translate(glM1, glM1, vec3.fromValues(1, 2, 3));
            testMatrix(m1, glM1);
            //-----------------------------------------------------------------------------------------
            console.log("# prependTranslation() #");
            //m1 = new stageJS.geom.Matrix3D();
            m1.prependTranslation(1, 2, 3);
            //glM1 = mat4.create();
            glM2 = mat4.create();
            mat4.translate(glM2, glM2, vec3.fromValues(1, 2, 3));
            mat4.mul(glM1, glM1, glM2);
            testMatrix(m1, glM1);
            //-----------------------------------------------------------------------------------------
            console.log("# appendScale() #");
            m1.appendScale(3, 4, 5);
            glM2 = mat4.create();
            mat4.scale(glM2, glM2, vec3.fromValues(3, 4, 5));
            mat4.mul(glM1, glM2, glM1); // glM1 * glM2
            testMatrix(m1, glM1);
            //-----------------------------------------------------------------------------------------
            console.log("# prependScale() #");
            m1.prependScale(9, -8, 7);
            mat4.scale(glM1, glM1, vec3.fromValues(9, -8, 7));
            testMatrix(m1, glM1);
            //-----------------------------------------------------------------------------------------
            console.log("# appendRotation() #");
            //x axis
            m1.appendRotation(15, stageJS.geom.Vector3D.X_AXIS);
            glM2 = mat4.create(); //rotation matrix
            mat4.rotateX(glM2, glM2, 15 * Math.PI / 180);
            mat4.mul(glM1, glM2, glM1); // glM1= glM1* glM2
            testMatrix(m1, glM1);
            //y axis
            m1.appendRotation(25, stageJS.geom.Vector3D.Y_AXIS);
            glM2 = mat4.create(); //rotation matrix
            mat4.rotateY(glM2, glM2, 25 * Math.PI / 180);
            mat4.mul(glM1, glM2, glM1); // glM1= glM1* glM2
            testMatrix(m1, glM1);
            //z axis
            m1.appendRotation(35, stageJS.geom.Vector3D.Z_AXIS);
            glM2 = mat4.create(); //rotation matrix
            mat4.rotateZ(glM2, glM2, 35 * Math.PI / 180);
            mat4.mul(glM1, glM2, glM1); // glM1= glM1* glM2
            testMatrix(m1, glM1);
            //custom axis
            m1.appendRotation(40, new stageJS.geom.Vector3D(4, 5, 6));
            glM2 = mat4.create(); //rotation matrix
            mat4.rotate(glM2, glM2, 40 * Math.PI / 180, vec3.fromValues(4, 5, 6));
            mat4.mul(glM1, glM2, glM1); // glM1= glM1* glM2
            testMatrix(m1, glM1);
            //rotate about a point
            m1.appendRotation(30, new stageJS.geom.Vector3D(4, 5, 6), new stageJS.geom.Vector3D(1, 2, 3));
            glM2 = mat4.create(); //rotation matrix
            mat4.rotate(glM2, glM2, 30 * Math.PI / 180, vec3.fromValues(4, 5, 6));
            glM3 = mat4.create(); //negative translate matrix
            mat4.translate(glM3, glM3, vec3.fromValues(-1, -2, -3));
            glM4 = mat4.create(); //positive translate matrix
            mat4.translate(glM4, glM4, vec3.fromValues(1, 2, 3));
            // glM1 * negativeM(glM3) * rotationM(glM2) * positive(glM4)
            mat4.mul(glM1, glM3, glM1); // glM1 = glM1* glM3
            mat4.mul(glM1, glM2, glM1);
            mat4.mul(glM1, glM4, glM1);
            testMatrix(m1, glM1);
            //-----------------------------------------------------------------------------------------
            console.log("# prependRotation() #");
            m1.prependRotation(15, stageJS.geom.Vector3D.X_AXIS);
            mat4.rotate(glM1, glM1, 15 * Math.PI / 180, vec3.fromValues(1, 0, 0));
            testMatrix(m1, glM1);
            m1.prependRotation(30, stageJS.geom.Vector3D.Y_AXIS);
            mat4.rotate(glM1, glM1, 30 * Math.PI / 180, vec3.fromValues(0, 1, 0));
            testMatrix(m1, glM1);
            m1.prependRotation(40, stageJS.geom.Vector3D.Z_AXIS);
            mat4.rotate(glM1, glM1, 40 * Math.PI / 180, vec3.fromValues(0, 0, 1));
            testMatrix(m1, glM1);
            m1.prependRotation(325, new stageJS.geom.Vector3D(1, 3, 8));
            mat4.rotate(glM1, glM1, 325 * Math.PI / 180, vec3.fromValues(1, 3, 8));
            testMatrix(m1, glM1);
            //about a point(7,8,9)
            m1.prependRotation(30, new stageJS.geom.Vector3D(1, 2, 3), new stageJS.geom.Vector3D(7, 8, 9));
            glM4 = mat4.create(); //positive translate matrix
            mat4.translate(glM4, glM4, vec3.fromValues(7, 8, 9));
            glM2 = mat4.create(); //rotation matrix
            mat4.rotate(glM2, glM2, 30 * Math.PI / 180, vec3.fromValues(1, 2, 3));
            glM3 = mat4.create(); //negative translate matrix
            mat4.translate(glM3, glM3, vec3.fromValues(-7, -8, -9));
            //m3 * m2 * m4 * m1
            mat4.mul(glM2, glM2, glM3);
            mat4.mul(glM4, glM4, glM2);
            mat4.mul(glM1, glM1, glM4);
            testMatrix(m1, glM1);
            //-----------------------------------------------------------------------------------------
            console.log("# append() and prepend() #");
            m2 = new stageJS.geom.Matrix3D();
            m2.appendRotation(18, stageJS.geom.Vector3D.Z_AXIS);
            glM2 = mat4.create();
            mat4.rotateZ(glM2, glM2, 18 * Math.PI / 180);
            testMatrix(m2, glM2);
            m3 = new stageJS.geom.Matrix3D();
            m3.prependScale(1, 3, 4);
            glM3 = mat4.create();
            mat4.scale(glM3, glM3, vec3.fromValues(1, 3, 4));
            testMatrix(m3, glM3);
            m4 = new stageJS.geom.Matrix3D();
            m4.prependTranslation(8, 7, 6);
            glM4 = mat4.create();
            mat4.translate(glM4, glM4, vec3.fromValues(8, 7, 6));
            testMatrix(m4, glM4);
            m1.append(m2);
            mat4.mul(glM1, glM2, glM1);
            testMatrix(m1, glM1);
            m1.prepend(m3);
            mat4.mul(glM1);
            m1.append(m4);
            m1.prepend(m2);
            m1.prepend(m4);
            //mat4.mul(glM1,glM2,glM1);  // glM1= glM1* glM2
            return;
            //-----------------------------------------------------------------------------------------
            //-----------------------------------------------------------------------------------------
            console.log("# prependRotation() with pivotPoint #");
            //m3 = new stageJS.geom.Matrix3D();
            //m3.prependRotation(60, stageJS.geom.Vector3D.Z_AXIS, new stageJS.geom.Vector3D(1, 2, 3));
            //m3.appendRotation(-60, stageJS.geom.Vector3D.Z_AXIS, new stageJS.geom.Vector3D(1, 2, 3));
            //logMatrix(m3.rawData);
            //glM3 = mat4.create();
            //mat4.rotate()
            //m2 = new stageJS.geom.Matrix3D();
            m1.prependRotation(60, stageJS.geom.Vector3D.Y_AXIS, new stageJS.geom.Vector3D(1, 2, 3));
            glM2 = mat4.create();
            //mat4.translate(glM2,glM2,vec3.fromValues(1,2,3)); //  glM2 =  transMatrix(-1,-2,-3) * rotateMatrix * transMatrix(1,2,3)
            //mat4.rotate(glM2, glM2, 300 * Math.PI/180 , vec3.fromValues(0,0,1)); // 360 - 60 = 300
            //mat4.translate(glM2,glM2,vec3.fromValues(-1,-2,-3));
            //
            ////mat4.translate(glM1,glM1,vec3.fromValues(1,2,3));
            //mat4.mul(glM1,glM2,glM1);  // glM1= glM1* glM2
            mat4.translate(glM1, glM1, vec3.fromValues(1, 2, 3));
            mat4.rotate(glM1, glM1, 60 * Math.PI / 180, vec3.fromValues(0, 1, 0));
            mat4.translate(glM1, glM1, vec3.fromValues(-1, -2, -3));
            isTranspose(m1, glM1);
            logMatrix(m1.rawData);
            logMatrix(glM1);
            //mat4.rotate(glM1, glM1, 35 * Math.PI / 180 , vec3.fromValues(1,3,8));
            //isTranspose(m1,glM1);
            //append
            //prepend
            //
            //transpose
            //
            //transformVector
            //deltaTransformVector
            //transformVectors
            //determinant
            //position
            //
            //
            //identity
            //
            //copyColumnFrom
            //copyColumnTo
            //copyFrom
            //copyRawDataFrom
            //copyRawDataTo
            //copyRowFrom
            //copyRowTo
            //copyToMatrix3D
            //
            //decompose
            //recompose
            //
            //interpolate
            //interpolateTo
            //invert
            //
            //pointAt
            //m.appendScale(1,2,3);
            //mat4.scale(gm2, gm2, gv2);
            //
            //isTranspose(m,gm2,"scals");
            //
            //
            //console.log("# determinant #");
            //if(m.determinant != mat4.determinant(gm2))
            //    console.error( "fail! " + "determinant");
            //
            //
            //
            //
            //m.appendRotation(60,stageJS.geom.Vector3D.X_AXIS); //度
            //mat4.rotate(gm2, gm2, Math.PI/3, [1,0,0]);
            //
            //isTranspose(m,gm2,"rotation");
            //logMatrix(m.rawData);
            //logMatrix(gm2);
            console.log("测试右手投影矩阵");
            var Sm = new stageJS.geom.PerspectiveMatrix3D();
            Sm.perspectiveFieldOfViewRH(44, 500 / 400, 0.1, 2000);
            var Gm = mat4.create();
            mat4.perspective(Gm, 44, 500 / 400, 0.1, 2000);
            isTranspose(Sm, Gm);
            Sm.identity();
            Sm.perspectiveOffCenterRH(111, 800, 100, 200, 2, 3333);
            Gm = mat4.create();
            mat4.frustum(Gm, 111, 800, 100, 200, 2, 3333);
            isTranspose(Sm, Gm);
            Sm.identity();
            Sm.perspectiveRH(400, 300, 2, 3333);
            Gm = mat4.create();
            mat4.frustum(Gm, -200, 200, -150, 150, 2, 3333);
            isTranspose(Sm, Gm);
            logMatrix(Sm.rawData);
            logMatrix(Gm);
            return;
            console.log('## copyColumnFrom() ------------------');
            m = new stageJS.geom.Matrix3D();
            m.copyColumnFrom(0, new stageJS.geom.Vector3D(16, 15, 14, 13));
            testRawData(m.rawData, [16, 15, 14, 13, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            m.copyColumnFrom(1, new stageJS.geom.Vector3D(12, 11, 10, 9));
            testRawData(m.rawData, [16, 15, 14, 13, 12, 11, 10, 9, 0, 0, 1, 0, 0, 0, 0, 1]);
            m.copyColumnFrom(2, new stageJS.geom.Vector3D(8, 7, 6, 5));
            testRawData(m.rawData, [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 0, 0, 0, 1]);
            m.copyColumnFrom(3, new stageJS.geom.Vector3D(4, 3, 2, 1));
            testRawData(m.rawData, [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
            console.log("## copyColumnTo() ------------------");
            m = new stageJS.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            var v = new stageJS.geom.Vector3D();
            m.copyColumnTo(0, v);
            v.equals(new stageJS.geom.Vector3D(1, 2, 3, 4), true) ? console.warn("pass! " + v.toString()) : console.error("fail! " + v.toString());
            m.copyColumnTo(1, v);
            v.equals(new stageJS.geom.Vector3D(5, 6, 7, 8), true) ? console.warn("pass! " + v.toString()) : console.error("fail! " + v.toString());
            m.copyColumnTo(2, v);
            v.equals(new stageJS.geom.Vector3D(9, 10, 11, 12), true) ? console.warn("pass! " + v.toString()) : console.error("fail! " + v.toString());
            m.copyColumnTo(3, v);
            v.equals(new stageJS.geom.Vector3D(13, 14, 15, 16), true) ? console.warn("pass! " + v.toString()) : console.error("fail " + v.toString());
            console.log("## copyFrom() ------------------");
            m = new stageJS.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            var cm = new stageJS.geom.Matrix3D();
            cm.copyFrom(m);
            testRawData(cm.rawData, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            console.log("## copyRawDataFrom() ------------------");
            m = new stageJS.geom.Matrix3D();
            m.copyRawDataFrom([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            testRawData(m.rawData, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            m.copyRawDataFrom([5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6], 3, true); //
            testRawData(m.rawData, [2, 0, 0, 2, 1, 0, 0, 3, 0, 0, 0, 4, 0, 0, 1, 5]);
            console.log("## copyRawDataTo() ------------------");
            m = new stageJS.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            var copyData = [];
            m.copyRawDataTo(copyData);
            testRawData(new stageJS.geom.Matrix3D(copyData).rawData, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            copyData = [5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6];
            m.copyRawDataTo(copyData, 3, true); //element before index 3 will be set to 0
            console.log(copyData.length, copyData); //0,0,0,1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,16
            console.log('## copyRowFrom() ------------------');
            m = new stageJS.geom.Matrix3D([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            m.copyRowFrom(0, new stageJS.geom.Vector3D(16, 15, 14, 13));
            testRawData(m.rawData, [16, 0, 0, 0, 15, 0, 0, 0, 14, 0, 0, 0, 13, 0, 0, 0]);
            m.copyRowFrom(1, new stageJS.geom.Vector3D(12, 11, 10, 9));
            testRawData(m.rawData, [16, 12, 0, 0, 15, 11, 0, 0, 14, 10, 0, 0, 13, 9, 0, 0]);
            m.copyRowFrom(2, new stageJS.geom.Vector3D(8, 7, 6, 5));
            testRawData(m.rawData, [16, 12, 8, 0, 15, 11, 7, 0, 14, 10, 6, 0, 13, 9, 5, 0]);
            m.copyRowFrom(3, new stageJS.geom.Vector3D(4, 3, 2, 1));
            testRawData(m.rawData, [16, 12, 8, 4, 15, 11, 7, 3, 14, 10, 6, 2, 13, 9, 5, 1]);
            console.log('## copyRowTo() ------------------');
            m = new stageJS.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            var v = new stageJS.geom.Vector3D();
            m.copyRowTo(0, v);
            console.log(v.equals(new stageJS.geom.Vector3D(1, 5, 9, 13), true) ? "pass! " + v.toString() : "failed! " + v.toString());
            m.copyRowTo(1, v);
            console.log(v.equals(new stageJS.geom.Vector3D(2, 6, 10, 14), true) ? "pass! " + v.toString() : "failed! " + v.toString());
            m.copyRowTo(2, v);
            console.log(v.equals(new stageJS.geom.Vector3D(3, 7, 11, 15), true) ? "pass! " + v.toString() : "failed! " + v.toString());
            m.copyRowTo(3, v);
            console.log(v.equals(new stageJS.geom.Vector3D(4, 8, 12, 16), true) ? "pass! " + v.toString() : "failed! " + v.toString());
            console.log('## copyToMatrix3D() ------------------');
            m = new stageJS.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            var n = new stageJS.geom.Matrix3D();
            m.copyToMatrix3D(n);
            testRawData(m.rawData, n.rawData);
            console.log('## decompose()  ------------------');
            m = new stageJS.geom.Matrix3D();
            m.appendScale(1, 2, 3);
            m.appendRotation(30, stageJS.geom.Vector3D.X_AXIS);
            m.appendRotation(45, stageJS.geom.Vector3D.Y_AXIS);
            m.appendRotation(60, stageJS.geom.Vector3D.Z_AXIS);
            m.appendTranslation(6, 7, 8);
            var vv = m.decompose();
            //        console.log("pos:" + vv[0].toString());
            //        console.log("scale: " + vv[2].toString());
            //        console.log("rotate: " + vv + vv[1].x * 180 / Math.PI+ " , " + vv[1].y * 180/Math.PI + " , "+ vv[1].z* 180 /Math.PI);
            testVector(vv[0], new stageJS.geom.Vector3D(6, 7, 8));
            testVector(vv[2], new stageJS.geom.Vector3D(1, 2, 3));
            testVector(vv[1], new stageJS.geom.Vector3D(30 * Math.PI / 180, 45 * Math.PI / 180, 60 * Math.PI / 180));
            console.log('## recompose()   ---------------------');
            m2 = new stageJS.geom.Matrix3D();
            var vv2 = [new stageJS.geom.Vector3D(6, 7, 8), new stageJS.geom.Vector3D(30 * Math.PI / 180, 45 * Math.PI / 180, 60 * Math.PI / 180), new stageJS.geom.Vector3D(1, 2, 3)]; //scale
            m2.recompose(vv2);
            testRawData(m.rawData, m2.rawData);
            console.log('## deltaTransformVector() ------------------');
            m = new stageJS.geom.Matrix3D();
            m.appendRotation(30, stageJS.geom.Vector3D.Z_AXIS);
            var v_toRotate = new stageJS.geom.Vector3D(1, 2, 3, 4);
            var v_rotated = m.deltaTransformVector(v_toRotate);
            // flash player: -0.1339746117591858 2.232050895690918 3 0
            testVector(v_rotated, new stageJS.geom.Vector3D(-0.1339746117591858, 2.232050895690918, 3, 0));
            console.log('## identity() ------------------');
            m = new stageJS.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            m.identity();
            testRawData(m.rawData, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            console.log('## static interpolate() --------------');
            m = new stageJS.geom.Matrix3D();
            m2 = new stageJS.geom.Matrix3D();
            m2.appendRotation(30, stageJS.geom.Vector3D.X_AXIS);
            var m3 = stageJS.geom.Matrix3D.interpolate(m, m2, 0.5);
            console.log(m3.toString());
            //TODO:貌似与flash有0.1级别的误差，有待观察
            testRawData(m3.rawData, [1, 0, 0, 0, 0, 0.9659258127212524, 0.25881901383399963, 0, 0, -0.25881901383399963, 0.9659258127212524, 0, 0, 0, 0, 1]);
            console.error("interpolate() 计算结果貌似与flash有0.1级别的误差，有待观察");
            console.log('## interpolateTo()	------------------');
            m = new stageJS.geom.Matrix3D();
            m2 = new stageJS.geom.Matrix3D();
            m2.appendRotation(30, stageJS.geom.Vector3D.X_AXIS);
            m.interpolateTo(m2, 0.5);
            console.log(m.toString());
            testRawData(m.rawData, [1, 0, 0, 0, 0, 0.9659258127212524, 0.25881901383399963, 0, 0, -0.25881901383399963, 0.9659258127212524, 0, 0, 0, 0, 1]);
            console.error("interpolateTo() 计算结果貌似与flash有0.1级别的误差，有待观察");
            console.log('# invert() ------------------');
            m = new stageJS.geom.Matrix3D();
            m.prependTranslation(1, 2, 3);
            m.prependScale(4, 5, 6);
            m.prependRotation(80, stageJS.geom.Vector3D.Y_AXIS);
            var b = m.invert();
            if (!b)
                console.error('fail');
            else
                testRawData(m.rawData, [0.04341204836964607, 0, 0.24620193243026733, 0, 0, 0.20000000298023224, 0, 0, -0.16413463652133942, 0, 0.028941363096237183, 0, 0.4489918351173401, -0.4000000059604645, -0.3330260217189789, 1]);
            console.log('# pointAt() ------------');
            //        m = new stageJS.geom.Matrix3D();
            //        m.pointAt(new stageJS.geom.Vector3D(1,2,3) );
            //        for (var i:number = 0; i < m.rawData.length; i++) {
            //          console.log(m.rawData[i]);
            //
            //        }
            console.error('implement yet');
            console.log("## prepend() ------------------");
            var m = new stageJS.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            var m2 = new stageJS.geom.Matrix3D([16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
            m.prepend(m2);
            testRawData(m.rawData, [386, 444, 502, 560, 274, 316, 358, 400, 162, 188, 214, 240, 50, 60, 70, 80]);
            testRawData(m2.rawData, [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
            console.log('## transformVector()   ---------------');
            m = new stageJS.geom.Matrix3D();
            m.appendRotation(30, stageJS.geom.Vector3D.Y_AXIS);
            m.appendTranslation(1, 2, 3);
            m.appendScale(5, 6, 7);
            v = new stageJS.geom.Vector3D(7, 8, 9);
            var v2 = m.transformVector(v);
            testVector(v2, new stageJS.geom.Vector3D(57.81088638305664, 60, 51.059600830078125, 1));
            testVector(v, new stageJS.geom.Vector3D(7, 8, 9));
            console.log('## transformVectors() -----------');
            m = new stageJS.geom.Matrix3D();
            m.prependRotation(45, stageJS.geom.Vector3D.Z_AXIS);
            m.prependScale(1, 2, 3);
            m.prependTranslation(4, 5, 6);
            var vin = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13];
            var vout = [];
            m.transformVectors(vin, vout);
            console.log('is this right? ' + vout);
            console.log("## transpose() ----");
            m = new stageJS.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            m.transpose();
            testRawData(m.rawData, [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]);
            console.log("## Quaternion Test!");
            m = new stageJS.geom.Matrix3D();
            m.appendRotation(45, stageJS.geom.Vector3D.Z_AXIS);
            m.appendRotation(30, stageJS.geom.Vector3D.Y_AXIS);
            m.appendRotation(60, stageJS.geom.Vector3D.X_AXIS);
            //console.log(m.toString());
            var q = new stageJS.geom.Quaternion();
            q.fromMatrix3D(m);
            //console.log(q.toString());
            //console.log(q.toMatrix3D().toString());
            testRawData(m.rawData, q.toMatrix3D().rawData);
        }
        matrix3d_test.main = main;
        /*
            transform vector(1,2,3) to see if the the result is equal
         */
        function testMatrix(stageMatrix, glmatrix) {
            var v1 = stageMatrix.transformVector(new stageJS.geom.Vector3D(1, 2, 3));
            var glV1 = vec3.fromValues(1, 2, 3);
            vec3.transformMat4(glV1, glV1, glmatrix);
            testVector(v1, new stageJS.geom.Vector3D(glV1[0], glV1[1], glV1[2], 1));
        }
        function testRawData(rawData, arr) {
            if (rawData.length != arr.length) {
                console.error("fail!");
                return false;
            }
            for (var i = 0; i < rawData.length; i++) {
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
        function testVector(v1, v2) {
            var p = 0.0001;
            if ((Math.abs(v1.x - v2.x) < p) && (Math.abs(v1.y - v2.y) < p) && (Math.abs(v1.z - v2.z) < p) && (Math.abs(v1.w - v2.w) < p)) {
                console.warn("pass " + v1.toString());
                return;
            }
            console.error("fail!! " + v1.toString() + v2.toString());
        }
        function isTranspose(a, b, str) {
            if (str === void 0) { str = ""; }
            //if(str!="")
            //    console.log("# "+str+ " #");
            var arr = a.clone();
            arr.transpose();
            testRawData(arr.rawData, b);
        }
        function logMatrix(matrix, str) {
            if (str === void 0) { str = "----------"; }
            var arr = [];
            for (var i = 0; i < matrix.length; i++) {
                //console.log(arr[i] ,arr[i] * 100 , Math.round(arr[i]*100),Math.round(arr[i]*100)/100);
                arr[i] = String(Math.round(matrix[i] * 1000) / 1000);
                while (arr[i].length < 7) {
                    arr[i] = " " + arr[i];
                }
            }
            console.log(str);
            console.log(arr[0], ",               ", arr[1], ",               ", arr[2], ",               ", arr[3]);
            console.log(arr[4], ",               ", arr[5], ",               ", arr[6], ",               ", arr[7]);
            console.log(arr[8], ",               ", arr[9], ",               ", arr[10], ",               ", arr[11]);
            console.log(arr[12], ",               ", arr[13], ",               ", arr[14], ",               ", arr[15]);
        }
    })(matrix3d_test = test.matrix3d_test || (test.matrix3d_test = {}));
})(test || (test = {}));
window.onload = test.matrix3d_test.main;
