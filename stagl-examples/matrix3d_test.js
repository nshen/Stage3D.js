///<reference path="stagl.d.ts"/>
var test;
(function (test) {
    (function (matrix3d_test) {
        /**
        *  window.onload entry point
        */
        function main() {
            console.log("## append() ------------------");
            var m = new stagl.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            var m2 = new stagl.geom.Matrix3D([16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
            m.append(m2);
            testRawData(m, [80, 70, 60, 50, 240, 214, 188, 162, 400, 358, 316, 274, 560, 502, 444, 386]);
            testRawData(m2, [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

            console.log("## appendRotation() ----------- x , y , z axis");
            m = new stagl.geom.Matrix3D();
            m.appendRotation(30, stagl.geom.Vector3D.X_AXIS);
            testRawData(m, [1, 0, 0, 0, 0, 0.8660253882408142, 0.5, 0, 0, -0.5, 0.8660253882408142, 0, 0, 0, 0, 1]);
            m.appendRotation(45, stagl.geom.Vector3D.Y_AXIS);
            testRawData(m, [0.7071067690849304, 0, -0.7071067690849304, 0, 0.3535533845424652, 0.8660253882408142, 0.3535533845424652, 0, 0.6123723983764648, -0.5, 0.6123723983764648, 0, 0, 0, 0, 1]);
            m.appendRotation(60, stagl.geom.Vector3D.Z_AXIS);
            testRawData(m, [0.3535533845424652, 0.6123723983764648, -0.7071067690849304, 0, -0.5732232928276062, 0.7391989231109619, 0.3535533845424652, 0, 0.7391989231109619, 0.2803300619125366, 0.6123723983764648, 0, 0, 0, 0, 1]);

            console.log("## appendRotation() ---- any axis");
            m = new stagl.geom.Matrix3D();
            var axis = new stagl.geom.Vector3D(1, 2, 3);
            axis.normalize();
            m.appendRotation(23, axis);
            testRawData(m, [0.9261831045150757, 0.324638307094574, -0.19181989133358002, 0, -0.3019254207611084, 0.9432177543640137, 0.13849663734436035, 0, 0.22588925063610077, -0.07035793364048004, 0.9716088771820068, 0, 0, 0, 0, 1]);

            console.log("## appendRotation() ---- pivotPoint");
            m = new stagl.geom.Matrix3D();
            m.appendRotation(60, stagl.geom.Vector3D.X_AXIS, new stagl.geom.Vector3D(1, 2, 3));
            testRawData(m, [1, 0, 0, 0, 0, 0.5, 0.8660253882408142, 0, 0, -0.8660253882408142, 0.5, 0, 0, 3.598076105117798, -0.23205089569091797, 1]);

            m = new stagl.geom.Matrix3D();
            var axis = new stagl.geom.Vector3D(4, 5, 6);
            axis.normalize();
            m.appendRotation(45, axis, new stagl.geom.Vector3D(7, 8, 9));
            testRawData(m, [0.767967700958252, 0.5595699548721313, -0.3116200864315033, 0, -0.4074175953865051, 0.8022019863128662, 0.43644341826438904, 0, 0.4942028820514679, -0.20821495354175568, 0.8440438508987427, 0, 0.43574094772338867, -0.46067142486572266, 0.0933990478515625, 1]);

            console.log("## appendScale() ------------------");
            m = new stagl.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            m.appendScale(7, 8, 9);
            testRawData(m, [7, 16, 27, 4, 35, 48, 63, 8, 63, 80, 99, 12, 91, 112, 135, 16]);

            console.log("## appendTranslation() ------------------");
            m = new stagl.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            m.appendTranslation(7, 8, 9);
            testRawData(m, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 20, 22, 24, 16]);

            console.log('## copyColumnFrom() ------------------');
            m = new stagl.geom.Matrix3D();
            m.copyColumnFrom(0, new stagl.geom.Vector3D(16, 15, 14, 13));
            testRawData(m, [16, 15, 14, 13, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            m.copyColumnFrom(1, new stagl.geom.Vector3D(12, 11, 10, 9));
            testRawData(m, [16, 15, 14, 13, 12, 11, 10, 9, 0, 0, 1, 0, 0, 0, 0, 1]);
            m.copyColumnFrom(2, new stagl.geom.Vector3D(8, 7, 6, 5));
            testRawData(m, [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 0, 0, 0, 1]);
            m.copyColumnFrom(3, new stagl.geom.Vector3D(4, 3, 2, 1));
            testRawData(m, [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

            console.log("## copyColumnTo() ------------------");
            m = new stagl.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            var v = new stagl.geom.Vector3D();
            m.copyColumnTo(0, v);
            v.equals(new stagl.geom.Vector3D(1, 2, 3, 4), true) ? console.warn("pass! " + v.toString()) : console.error("fail! " + v.toString());
            m.copyColumnTo(1, v);
            v.equals(new stagl.geom.Vector3D(5, 6, 7, 8), true) ? console.warn("pass! " + v.toString()) : console.error("fail! " + v.toString());
            m.copyColumnTo(2, v);
            v.equals(new stagl.geom.Vector3D(9, 10, 11, 12), true) ? console.warn("pass! " + v.toString()) : console.error("fail! " + v.toString());
            m.copyColumnTo(3, v);
            v.equals(new stagl.geom.Vector3D(13, 14, 15, 16), true) ? console.warn("pass! " + v.toString()) : console.error("fail " + v.toString());

            console.log("## copyFrom() ------------------");
            m = new stagl.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            var cm = new stagl.geom.Matrix3D();
            cm.copyFrom(m);
            testRawData(cm, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

            console.log("## copyRawDataFrom() ------------------");
            m = new stagl.geom.Matrix3D();
            m.copyRawDataFrom([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            testRawData(m, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

            m.copyRawDataFrom([5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6], 3, true); //
            testRawData(m, [2, 0, 0, 2, 1, 0, 0, 3, 0, 0, 0, 4, 0, 0, 1, 5]);

            console.log("## copyRawDataTo() ------------------");
            m = new stagl.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            var copyData = [];
            m.copyRawDataTo(copyData);
            testRawData(new stagl.geom.Matrix3D(copyData), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

            copyData = [5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6];
            m.copyRawDataTo(copyData, 3, true); //element before index 3 will be set to 0
            console.log(copyData.length, copyData); //0,0,0,1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,16

            console.log('## copyRowFrom() ------------------');
            m = new stagl.geom.Matrix3D([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            m.copyRowFrom(0, new stagl.geom.Vector3D(16, 15, 14, 13));
            testRawData(m, [16, 0, 0, 0, 15, 0, 0, 0, 14, 0, 0, 0, 13, 0, 0, 0]);
            m.copyRowFrom(1, new stagl.geom.Vector3D(12, 11, 10, 9));
            testRawData(m, [16, 12, 0, 0, 15, 11, 0, 0, 14, 10, 0, 0, 13, 9, 0, 0]);
            m.copyRowFrom(2, new stagl.geom.Vector3D(8, 7, 6, 5));
            testRawData(m, [16, 12, 8, 0, 15, 11, 7, 0, 14, 10, 6, 0, 13, 9, 5, 0]);
            m.copyRowFrom(3, new stagl.geom.Vector3D(4, 3, 2, 1));
            testRawData(m, [16, 12, 8, 4, 15, 11, 7, 3, 14, 10, 6, 2, 13, 9, 5, 1]);

            console.log('## copyRowTo() ------------------');
            m = new stagl.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            var v = new stagl.geom.Vector3D();
            m.copyRowTo(0, v);
            console.log(v.equals(new stagl.geom.Vector3D(1, 5, 9, 13), true) ? "pass! " + v.toString() : "failed! " + v.toString());
            m.copyRowTo(1, v);
            console.log(v.equals(new stagl.geom.Vector3D(2, 6, 10, 14), true) ? "pass! " + v.toString() : "failed! " + v.toString());
            m.copyRowTo(2, v);
            console.log(v.equals(new stagl.geom.Vector3D(3, 7, 11, 15), true) ? "pass! " + v.toString() : "failed! " + v.toString());
            m.copyRowTo(3, v);
            console.log(v.equals(new stagl.geom.Vector3D(4, 8, 12, 16), true) ? "pass! " + v.toString() : "failed! " + v.toString());

            console.log('## copyToMatrix3D() ------------------');
            m = new stagl.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            var n = new stagl.geom.Matrix3D();
            m.copyToMatrix3D(n);
            testRawData(m, n.rawData);

            console.log('## decompose()  ------------------');
            m = new stagl.geom.Matrix3D();
            m.appendScale(1, 2, 3);
            m.appendRotation(30, stagl.geom.Vector3D.X_AXIS);
            m.appendRotation(45, stagl.geom.Vector3D.Y_AXIS);
            m.appendRotation(60, stagl.geom.Vector3D.Z_AXIS);
            m.appendTranslation(6, 7, 8);
            var vv = m.decompose();

            //        console.log("pos:" + vv[0].toString());
            //        console.log("scale: " + vv[2].toString());
            //        console.log("rotate: " + vv + vv[1].x * 180 / Math.PI+ " , " + vv[1].y * 180/Math.PI + " , "+ vv[1].z* 180 /Math.PI);
            testVector(vv[0], new stagl.geom.Vector3D(6, 7, 8));
            testVector(vv[2], new stagl.geom.Vector3D(1, 2, 3));
            testVector(vv[1], new stagl.geom.Vector3D(30 * Math.PI / 180, 45 * Math.PI / 180, 60 * Math.PI / 180));

            console.log('## recompose()   ---------------------');
            m2 = new stagl.geom.Matrix3D();
            var vv2 = [
                new stagl.geom.Vector3D(6, 7, 8),
                new stagl.geom.Vector3D(30 * Math.PI / 180, 45 * Math.PI / 180, 60 * Math.PI / 180),
                new stagl.geom.Vector3D(1, 2, 3)];
            m2.recompose(vv2);
            testRawData(m, m2.rawData);

            console.log('## deltaTransformVector() ------------------');
            m = new stagl.geom.Matrix3D();
            m.appendRotation(30, stagl.geom.Vector3D.Z_AXIS);
            var v_toRotate = new stagl.geom.Vector3D(1, 2, 3, 4);
            var v_rotated = m.deltaTransformVector(v_toRotate);

            // flash player: -0.1339746117591858 2.232050895690918 3 0
            testVector(v_rotated, new stagl.geom.Vector3D(-0.1339746117591858, 2.232050895690918, 3, 0));

            console.log('## identity() ------------------');
            m = new stagl.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            m.identity();
            testRawData(m, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

            console.log('## static interpolate() --------------');

            m = new stagl.geom.Matrix3D();
            m2 = new stagl.geom.Matrix3D();
            m2.appendRotation(30, stagl.geom.Vector3D.X_AXIS);
            var m3 = stagl.geom.Matrix3D.interpolate(m, m2, 0.5);
            console.log(m3.toString());

            //TODO:貌似与flash有0.1级别的误差，有待观察
            testRawData(m3, [1, 0, 0, 0, 0, 0.9659258127212524, 0.25881901383399963, 0, 0, -0.25881901383399963, 0.9659258127212524, 0, 0, 0, 0, 1]);
            console.error("interpolate() 计算结果貌似与flash有0.1级别的误差，有待观察");

            console.log('## interpolateTo()	------------------');
            m = new stagl.geom.Matrix3D();
            m2 = new stagl.geom.Matrix3D();
            m2.appendRotation(30, stagl.geom.Vector3D.X_AXIS);
            m.interpolateTo(m2, 0.5);
            console.log(m.toString());
            testRawData(m, [1, 0, 0, 0, 0, 0.9659258127212524, 0.25881901383399963, 0, 0, -0.25881901383399963, 0.9659258127212524, 0, 0, 0, 0, 1]);
            console.error("interpolateTo() 计算结果貌似与flash有0.1级别的误差，有待观察");

            console.log('# invert() ------------------');
            m = new stagl.geom.Matrix3D();
            m.prependTranslation(1, 2, 3);
            m.prependScale(4, 5, 6);
            m.prependRotation(80, stagl.geom.Vector3D.Y_AXIS);
            var b = m.invert();
            if (!b)
                console.error('fail');
            else
                testRawData(m, [0.04341204836964607, 0, 0.24620193243026733, 0, 0, 0.20000000298023224, 0, 0, -0.16413463652133942, 0, 0.028941363096237183, 0, 0.4489918351173401, -0.4000000059604645, -0.3330260217189789, 1]);

            console.log('# pointAt() ------------');

            //        m = new stagl.geom.Matrix3D();
            //        m.pointAt(new stagl.geom.Vector3D(1,2,3) );
            //        for (var i:number = 0; i < m.rawData.length; i++) {
            //          console.log(m.rawData[i]);
            //
            //        }
            console.error('implement yet');

            console.log("## prepend() ------------------");
            var m = new stagl.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            var m2 = new stagl.geom.Matrix3D([16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
            m.prepend(m2);
            testRawData(m, [386, 444, 502, 560, 274, 316, 358, 400, 162, 188, 214, 240, 50, 60, 70, 80]);
            testRawData(m2, [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

            console.log("## prependRotation() ----------- x , y , z axis");
            m = new stagl.geom.Matrix3D();
            m.prependRotation(30, stagl.geom.Vector3D.X_AXIS);
            testRawData(m, [1, 0, 0, 0, 0, 0.8660253882408142, 0.5, 0, 0, -0.5, 0.8660253882408142, 0, 0, 0, 0, 1]);
            m.prependRotation(45, stagl.geom.Vector3D.Y_AXIS);
            testRawData(m, [0.7071067690849304, 0.3535533845424652, -0.6123723983764648, 0, 0, 0.8660253882408142, 0.5, 0, 0.7071067690849304, -0.3535533845424652, 0.6123723983764648, 0, 0, 0, 0, 1]);
            m.prependRotation(60, stagl.geom.Vector3D.Z_AXIS);
            testRawData(m, [0.3535533845424652, 0.9267767071723938, 0.12682649493217468, 0, -0.6123723983764648, 0.12682649493217468, 0.7803300619125366, 0, 0.7071067690849304, -0.3535533845424652, 0.6123723983764648, 0, 0, 0, 0, 1]);

            console.log("## prependRotation() ---- any axis");
            m = new stagl.geom.Matrix3D();
            var axis = new stagl.geom.Vector3D(1, 2, 3);
            axis.normalize();
            m.prependRotation(23, axis);
            testRawData(m, [0.9261831045150757, 0.324638307094574, -0.19181989133358002, 0, -0.3019254207611084, 0.9432177543640137, 0.13849663734436035, 0, 0.22588925063610077, -0.07035793364048004, 0.9716088771820068, 0, 0, 0, 0, 1]);

            console.log("## prependRotation() ---- pivotPoint");
            m = new stagl.geom.Matrix3D();
            m.prependRotation(60, stagl.geom.Vector3D.X_AXIS, new stagl.geom.Vector3D(1, 2, 3));
            testRawData(m, [1, 0, 0, 0, 0, 0.5, 0.8660253882408142, 0, 0, -0.8660253882408142, 0.5, 0, 0, 3.598076105117798, -0.23205089569091797, 1]);

            m = new stagl.geom.Matrix3D();
            var axis = new stagl.geom.Vector3D(4, 5, 6);
            axis.normalize();
            m.prependRotation(45, axis, new stagl.geom.Vector3D(7, 8, 9));
            testRawData(m, [0.767967700958252, 0.5595699548721313, -0.3116200864315033, 0, -0.4074175953865051, 0.8022019863128662, 0.43644341826438904, 0, 0.4942028820514679, -0.20821495354175568, 0.8440438508987427, 0, 0.43574094772338867, -0.46067142486572266, 0.0933990478515625, 1]);

            console.log("## prependScale() ------------------");
            m = new stagl.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            m.prependScale(7, 8, 9);
            testRawData(m, [7, 14, 21, 28, 40, 48, 56, 64, 81, 90, 99, 108, 13, 14, 15, 16]);

            console.log("## prependTranslation() ------------------");
            m = new stagl.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            m.prependTranslation(7, 8, 9);
            testRawData(m, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 141, 166, 191, 216]);

            console.log('## transformVector()   ---------------');
            m = new stagl.geom.Matrix3D();
            m.appendRotation(30, stagl.geom.Vector3D.Y_AXIS);
            m.appendTranslation(1, 2, 3);
            m.appendScale(5, 6, 7);
            v = new stagl.geom.Vector3D(7, 8, 9);
            var v2 = m.transformVector(v);
            testVector(v2, new stagl.geom.Vector3D(57.81088638305664, 60, 51.059600830078125, 1));
            testVector(v, new stagl.geom.Vector3D(7, 8, 9));

            console.log('## transformVectors() -----------');
            m = new stagl.geom.Matrix3D();
            m.prependRotation(45, stagl.geom.Vector3D.Z_AXIS);
            m.prependScale(1, 2, 3);
            m.prependTranslation(4, 5, 6);
            var vin = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13];
            var vout = [];
            m.transformVectors(vin, vout);
            console.log('is this right? ' + vout);

            console.log("## transpose() ----");
            m = new stagl.geom.Matrix3D([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            m.transpose();
            testRawData(m, [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]);

            console.log("## Quaternion Test!");
            m = new stagl.geom.Matrix3D();
            m.appendRotation(45, stagl.geom.Vector3D.Z_AXIS);
            m.appendRotation(30, stagl.geom.Vector3D.Y_AXIS);
            m.appendRotation(60, stagl.geom.Vector3D.X_AXIS);

            //console.log(m.toString());
            var q = new stagl.geom.Quaternion();
            q.fromMatrix3D(m);

            //console.log(q.toString());
            //console.log(q.toMatrix3D().toString());
            testRawData(m, q.toMatrix3D().rawData);
        }
        matrix3d_test.main = main;

        function testRawData(m1, arr) {
            if (m1.rawData.length != arr.length) {
                console.error("fail!");
                return false;
            }
            for (var i = 0; i < m1.rawData.length; i++) {
                if (Math.abs(m1.rawData[i] - arr[i]) > 0.000001) {
                    console.error("fail!   " + "rawData[" + i + "] " + m1.rawData[i] + " : " + arr[i]);
                    return false;
                }
            }
            console.warn("pass  " + arr);
            return true;
        }

        function testVector(v1, v2) {
            var p = 0.00001;
            if ((Math.abs(v1.x - v2.x) < p) && (Math.abs(v1.y - v2.y) < p) && (Math.abs(v1.z - v2.z) < p) && (Math.abs(v1.w - v2.w) < p)) {
                console.warn("pass " + v1.toString());

                return;
            }
            console.error("fail!! " + v1.toString() + v2.toString());
        }
    })(test.matrix3d_test || (test.matrix3d_test = {}));
    var matrix3d_test = test.matrix3d_test;
})(test || (test = {}));
window.onload = test.matrix3d_test.main;
