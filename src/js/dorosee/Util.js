import * as THREE from "/public/Potree/libs/three.js/build/three.module.js";
import { isDev } from "./config.js";

export function moveTo(scene, endPosition, endTarget) {


    let view = scene.view;
    let testVector = new THREE.Vector3(1, 1, 1);
    let camera = scene.getActiveCamera();
    let animationDuration = 500;
    let easing = TWEEN.Easing.Quartic.Out;

    console.log("실행", TWEEN, camera)

    { // animate camera position
        let tween = new TWEEN.Tween(view.position).to(endPosition, animationDuration);
        // let tween = new TWEEN.Tween(camera.position).to(endPosition, animationDuration);
        tween.easing(easing);
        tween.start();
    }

    { // animate camera target
        let camTargetDistance = camera.position.distanceTo(endTarget);
        let target = new THREE.Vector3().addVectors(
            camera.position,
            camera.getWorldDirection(new THREE.Vector3()).clone().multiplyScalar(camTargetDistance)
        );
        let tween = new TWEEN.Tween(target).to(endTarget, animationDuration);
        tween.easing(easing);
        tween.onUpdate(() => {
            // camera.lookAt(cube.poistion)
            view.lookAt(target);
        });
        tween.onComplete(() => {
            // camera.lookAt(cube.poistion)
            view.lookAt(target);
        });
        tween.start();
    }

}

export class PotreeUtilDorosee {
    static getCoordTxt = async (url) => {
        let res = await fetch(url);
        let data = await res.text();
        const csvLines = data.split('\n');

        const epsg4326 = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";
        //동부 원점 좌표계
        const target = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"
        // proj4.defs(epsg32632, '+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
        console.groupCollapsed("csvLines");
        let txtData = [];
        console.groupCollapsed("데이터들");
        for await (const [index, line] of csvLines.entries()) {
            let arrayData;
            if (index === 0) {
                arrayData = `File\tTime\tLong\tLat\tAlt\tcourse\tpitch\troll\t`;
                txtData.push(arrayData);
                continue
            };
            if (index === csvLines.length - 1) continue;
            console.groupCollapsed(`${index}번째`);
            const rowData = line.split(',');
            let timestamp = rowData[0];
            let fileName = rowData[1];
            let Easting = parseFloat(rowData[2]);
            let Northing = parseFloat(rowData[3]);
            let height = parseFloat(rowData[4]);

            const [lng, lat] = proj4(target, epsg4326, [Easting, Northing]);
            let yaw = parseFloat(rowData[13] + 90);
            let pitch = parseFloat(rowData[12]);
            let roll = parseFloat(rowData[11]);

            arrayData = `${fileName}\t${timestamp}\t${lng}\t${lat}\t${height}\t${yaw}\t${pitch}\t${roll}\t`
            txtData.push(arrayData);

            console.log("E,N", Easting, Northing);
            console.log("lng,lat", lng, lat);
            console.log("yaw,pitch,roll", yaw, pitch, roll);
            console.log(rowData);
            console.groupEnd();

        }
        let body = {
            'data': txtData
        }
        console.groupEnd();
        console.log("txtData?", txtData.join('\n'));
        // let config = { method: 'POST', headers: { 'Content-Type': 'applicatoin/json' }, body: JSON.stringify(body) }
        // let request = await fetch(`${HOST}/test/coord`, config);
        console.groupEnd();
    }

    /**
     * flag가 true면 bundle false면 개발용
     * @param {*} flag 
     */
    static importScript = async () => {
        let flag = isDev;
        const buildURL = '/dist';
        const scriptURL = "/libs/dorosee/UOK";
        const script = document.createElement("script");
        const fileName = `${window.location.href.split('/')[window.location.href.split('/').length - 1]}`;
        if (flag) {
            script.src = `${scriptURL}/${fileName}.js`
            script.type = "module";
        } else {
            script.src = `${buildURL}/${fileName}.bundle.js`
        }

        // defer 속성을 추가합니다.
        script.defer = true;
        document.head.appendChild(script);
    }
}
