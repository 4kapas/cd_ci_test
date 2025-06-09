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
import { PointCloudManager } from "./pointcloudManager.js";
import { EventManager } from "./EventManager.js";
import { PolygonManager } from "./PolygonManager.js";
//3D
var map = null;

class PotreeDoroseeMain {
  constructor() {
    this.EventManager = new EventManager(this);
    this.PointCloudManager = new PointCloudManager(this);
    this.PolygonManager = new PolygonManager(this);
    this.init();
    this.addEvents();
  }

  init() {
    vwmap();
    // let cp = new Cesium.Cartesian3(204886.154026048, 545936.235598733, 11000.704035539);
    // let cp = new Cesium.Cartesian3(
    //   4303414.154026048,
    //   552161.235598733,
    //   4660771.704035539
    // );

    // vw.camera.setView({
    //   destination: cp,
    //   orientation: {
    //     heading: 10,
    //     pitch: -Cesium.Math.PI_OVER_TWO * 0.5,
    //     roll: 0.0,
    //   },
    // });

    // vw.mapOptions = {
    //   container: "cesiumContainer",
    //   mapMode: "ws3d-map",
    //   basemapType: vw.ol3.BasemapType.GRAPHIC,
    //   controlDensity: vw.ol3.DensityType.EMPTY,
    //   interactionDensity: vw.ol3.DensityType.BASIC,
    //   controlsAutoArrange: true,
    //   homePosition: vw.ol3.CameraPosition,
    //   initPosition: vw.ol3.CameraPosition,
    // };
    // Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZDk5MjQwMi04MjIzLTQ4NTYtYjMxNy1iNzBkMTY0ODQxMzIiLCJpZCI6OTQ1NDIsImlhdCI6MTY1MzAxNjY5NX0.wZWHs6r0jmYri9awE0JD6CTi3opnhiPP3_Rlzv8JGN4";

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
      //   $("#menu_appearance").next().show();
      //   $("#menu_tools").next().show();
      //   $("#menu_scene").next().show();
      //   potreeViewer.toggleSidebar();
    });

    //빛 추가
    const AL = new THREE.AmbientLight(0x404040, 1);
    potreeViewer.volumeTool.scene.add(AL);
    //
    // this.addEvents();
    // this.addKeyEvent();
    this.EventManager.addEvents();
    this.PointCloudManager.addPointCloud220905();

    requestAnimationFrame(this.loop.bind(this));
  }

  addEvents() {
    document.getElementById("fileUploadSelect").addEventListener(
      "change",
      async () => {
        console.log(
          "file",
          document.getElementById("fileUploadSelect").files[0]
        );
        async function parseJsonFile(file) {
          return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (event) =>
              resolve(JSON.parse(event.target.result));
            fileReader.onerror = (error) => reject(error);
            fileReader.readAsText(file);
          });
        }

        const object = await parseJsonFile(
          document.getElementById("fileUploadSelect").files[0]
        );
        console.log("object", object);
        this.PolygonManager.readObjectAndDrawLineObject(object);
      },
      false
    );

    splitOnOff();
    reportOnOff();
  }

  /**
   * 지금은 잘안씀
   */
  cameraTest() {
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

  loop(timestamp) {
    requestAnimationFrame(this.loop.bind(this));

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
      this.PointCloudManager.update();
    }
  }
}

const vworld_key = "43542827-D170-3C40-8483-2BD5651B2690";

var unique_layers = [
  { layer: "Base", tileType: "png" },
  { layer: "gray", tileType: "png" },
  { layer: "midnight", tileType: "png" },
  { layer: "Hybrid", tileType: "png" },
  { layer: "Satellite", tileType: "jpeg" },
];

var selLayer = unique_layers[4];

var wms = new Cesium.WebMapTileServiceImageryProvider({
  url: `http://api.vworld.kr/req/wmts/1.0.0/${vworld_key}/${selLayer.layer}/{TileMatrix}/{TileRow}/{TileCol}.${selLayer.tileType}`,
  layer: "Base",
  style: "default",
  maximumLevel: 19,
  credit: new Cesium.Credit("VWorld Korea"),
});

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
  //   imageryProvider: Cesium.createOpenStreetMapImageryProvider({
  //     url: "https://a.tile.openstreetmap.org/",
  //   }),
  imageryProvider: wms,
  terrainShadows: Cesium.ShadowMode.DISABLED,
});

function vwmap() {
  var mapOptions = new vw.MapOptions(
    vw.BasemapType.GRAPHIC_NIGHT,
    "",
    vw.BasemapType.GRAPHIC_NIGHT,
    vw.DensityType.BASIC,
    false,
    new vw.CameraPosition(
      new vw.CoordZ(126.9221, 37.5293, 482400),
      new vw.Direction(0, -90, 0)
    ),
    new vw.CameraPosition(
      new vw.CoordZ(126.9221, 37.5293, 1000),
      new vw.Direction(0, -90, 0)
    )
  );

  map = new vw.Map("cesiumContainerRight", mapOptions);
  console.log("map", map, mapOptions, new vw.Map());
}
function vwmoveTo(x, y, z) {
  var movePo = new vw.CoordZ(x, y, z);
  var mPosi = new vw.CameraPosition(movePo, new vw.Direction(0, -90, 0));
  map.moveTo(mPosi);
}

function splitOnOff() {
  const potreeRenderArea = document.getElementById("potree_render_area");
  const canvasRight = document.getElementById("cesiumContainerRight");
  const canvasOnBtn = document.querySelector(".canvas2");
  canvasOnBtn.addEventListener("click", () => {
    canvasRight.classList.toggle("active");
    potreeRenderArea.classList.toggle("active");
    if (map == null) {
      vwmap();
    } else {
      map = null;
      while (canvasRight.firstChild) {
        canvasRight.removeChild(canvasRight.firstChild);
      }
    }
  });
}
// splitOnOff();

let isReport = false;

function reportOnOff() {
  const btnReportSwitch = document.getElementById("toggleReport");
  const canvasOnBtn = document.querySelector(".canvas2");
  const btnMenu = document.getElementById("toggleSidebar");
  const potreeContainer = document.querySelector("#potree_ctn");
  const reportContainer = document.getElementById("wrap");
  btnReportSwitch.addEventListener("click", () => {
    if (isReport) {
      isReport = false;
      btnMenu.classList.remove("disable");
      canvasOnBtn.classList.remove("disable");
      reportContainer.classList.add("disable");
      potreeContainer.style.zIndex = "1";
    } else {
      isReport = true;
      btnMenu.classList.add("disable");
      canvasOnBtn.classList.add("disable");
      reportContainer.classList.remove("disable");
      potreeContainer.style.zIndex = "-1";
    }
  });
}

// reportOnOff();

//메인 실행 코드
new PotreeDoroseeMain();
