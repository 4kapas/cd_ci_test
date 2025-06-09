import * as THREE from "../three.js/build/three.module.js";
import {
  testBox,
  boxArray,
  listArray,
  showList,
  FBXModel,
  mixer,
  OBJMTLModel,
} from "./object.js";
import { PCM, PointCloudManager } from "./pointcloudManager.js";
import { EventManager } from "./EventManager.js";
import { DoroseeUtil } from "./dorosee/js/doroseeUtil.js";

class PotreeDoroseeMain {
  constructor() {
    this.EventManager = new EventManager(this);
    this.PointCloudManager = new PointCloudManager(this);
    this.DoroseeUtil = new DoroseeUtil();
    this.init();
  }

  init() {
    this.cesiumInit();
    window.potreeViewer = new Potree.Viewer(
      document.getElementById("potree_render_area"),
      {
        useDefaultRenderLoop: false,
      }
    );
    potreeViewer.setEDLEnabled(true);
    potreeViewer.setFOV(60);
    // potreeViewer.setPointBudget(1_000_000);
    potreeViewer.setPointBudget(10 * 1000 * 1000);
    potreeViewer.setMinNodeSize(0);
    potreeViewer.loadSettingsFromURL();
    potreeViewer.setBackground(null);

    potreeViewer.loadGUI(() => {
      potreeViewer.setLanguage("en");
      // $("#menu_appearance").next().show();
      // $("#menu_tools").next().show();
      // $("#menu_scene").next().show();
      // potreeViewer.toggleSidebar();
    });

    //빛 추가
    const AL = new THREE.AmbientLight(0x404040, 1);
    potreeViewer.volumeTool.scene.add(AL);
    //

    // this.PointCloudManager.addPointCloudMMS();
    this.PointCloudManager.addPointCloud220905();
  }

  cesiumInit() {
    window.cesiumViewer = new Cesium.Viewer("cesiumContainer", {
      useDefaultRenderLoop: false,
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      imageryProvider: Cesium.createOpenStreetMapImageryProvider({
        url: "https://a.tile.openstreetmap.org/",
      }),
      terrainShadows: Cesium.ShadowMode.DISABLED,
    });

    // let cp = new Cesium.Cartesian3(204886.154026048, 545936.235598733, 11000.704035539);
    let cp = new Cesium.Cartesian3(
      4303414.154026048,
      552161.235598733,
      4660771.704035539
    );
    cesiumViewer.camera.setView({
      destination: cp,
      orientation: {
        heading: 10,
        pitch: -Cesium.Math.PI_OVER_TWO * 0.5,
        roll: 0.0,
      },
    });

    // Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZDk5MjQwMi04MjIzLTQ4NTYtYjMxNy1iNzBkMTY0ODQxMzIiLCJpZCI6OTQ1NDIsImlhdCI6MTY1MzAxNjY5NX0.wZWHs6r0jmYri9awE0JD6CTi3opnhiPP3_Rlzv8JGN4";
  }
}

new PotreeDoroseeMain();

function cameraTest() {
  try {
    // console.log("camera",document.getElementById("cameraTest"));

    // document.getElementById("cameraTest").addEventListener("click",function() {
    potreeViewer.scene.view.setView(
      [296507.02399999998, 3888075.1017, Math.random() * 10000],
      [296507.02399999998, 3888075.1017, -18.833800000000011]
    );
    // });
  } catch (e) {
    console.error(e);
  }
}

function loop(timestamp) {
  requestAnimationFrame(loop);

  potreeViewer.update(potreeViewer.clock.getDelta(), timestamp);
  // renderer2.render(potreeViewer.scene.sceneBG,camera2);
  // renderer3.render(potreeViewer.scene.scenePointCloud,camera3);
  // renderer4.render(potreeViewer.scene.scenePointCloud,camera4);
  // camera2.updateProjectionMatrix();
  // camera3.updateProjectionMatrix();
  // camera4.updateProjectionMatrix();
  potreeViewer.render();
  if (mixer) mixer.update(potreeViewer.clock.getDelta());
  if (window.toMap !== undefined) {
    {
      let camera = potreeViewer.scene.getActiveCamera();

      let pPos = new THREE.Vector3(0, 0, 0).applyMatrix4(camera.matrixWorld);
      let pRight = new THREE.Vector3(600, 0, 0).applyMatrix4(
        camera.matrixWorld
      );
      let pUp = new THREE.Vector3(0, 600, 0).applyMatrix4(camera.matrixWorld);
      let pTarget = potreeViewer.scene.view.getPivot();

      let toCes = (pos) => {
        let xy = [pos.x, pos.y];
        let height = pos.z;
        let deg = toMap.forward(xy);
        let cPos = Cesium.Cartesian3.fromDegrees(...deg, height);

        return cPos;
      };

      let cPos = toCes(pPos);
      let cUpTarget = toCes(pUp);
      let cTarget = toCes(pTarget);

      let cDir = Cesium.Cartesian3.subtract(
        cTarget,
        cPos,
        new Cesium.Cartesian3()
      );
      let cUp = Cesium.Cartesian3.subtract(
        cUpTarget,
        cPos,
        new Cesium.Cartesian3()
      );

      cDir = Cesium.Cartesian3.normalize(cDir, new Cesium.Cartesian3());
      cUp = Cesium.Cartesian3.normalize(cUp, new Cesium.Cartesian3());

      cesiumViewer.camera.setView({
        destination: cPos,
        orientation: {
          direction: cDir,
          up: cUp,
        },
      });

      let aspect = potreeViewer.scene.getActiveCamera().aspect;
      if (aspect < 1) {
        let fovy = Math.PI * (potreeViewer.scene.getActiveCamera().fov / 180);
        cesiumViewer.camera.frustum.fov = fovy;
      } else {
        let fovy = Math.PI * (potreeViewer.scene.getActiveCamera().fov / 180);
        let fovx = Math.atan(Math.tan(0.5 * fovy) * aspect) * 2;
        cesiumViewer.camera.frustum.fov = fovx;
      }
    }

    cesiumViewer.render();
    // PCM.update();
  }
}

requestAnimationFrame(loop);

export { testBox, boxArray, listArray, showList };
