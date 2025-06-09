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
// import {PM} from "../dorosee/panoramaTest.js";
import { FBXLoader } from "../three.js/loaders/FBXLoader.js";
import { OBJLoader } from "../three.js/loaders/OBJLoader.js";
import { OBJLoader2 } from "../three.js/loaders/OBJLoader2.js";
import { MTLLoader } from "../three.js/loaders/MTLLoader.js";
import { PCM, PointCloudManager } from "./pointcloudManager.js";
import { SM } from "./ShapeManager.js";
import { EventManager } from "./EventManager.js";

const vworld_key = "43542827-D170-3C40-8483-2BD5651B2690";
// Cesium.Ion.defaultAccessToken =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZDk5MjQwMi04MjIzLTQ4NTYtYjMxNy1iNzBkMTY0ODQxMzIiLCJpZCI6OTQ1NDIsImlhdCI6MTY1MzAxNjY5NX0.wZWHs6r0jmYri9awE0JD6CTi3opnhiPP3_Rlzv8JGN4";

//Ion에 등록한 사용자 정의 지형 가져올때의 예시 코드 (20201202 정상작동 확인됨)
// var terrainProvider = new Cesium.CesiumTerrainProvider({
//   url: Cesium.IonResource.fromAssetId(
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZDk5MjQwMi04MjIzLTQ4NTYtYjMxNy1iNzBkMTY0ODQxMzIiLCJpZCI6OTQ1NDIsImlhdCI6MTY1MzAxNjY5NX0.wZWHs6r0jmYri9awE0JD6CTi3opnhiPP3_Rlzv8JGN4"
//   ), //Ion에 지형 업로드시 자동 생성
//   requestWaterMask: false, //수면에 파도효과
//   requestVertexNormals: true, //경사 명암효과
// });

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

// var wmts = new Cesium.WebMapTileServiceImageryProvider({
//   //   url: `https://its.go.kr:9443/geoserver/gwc/service/wmts/rest/ntic:N_LEVEL_11/ntic:REALTIME/EPSG:3857/EPSG:3857:{z}/{y}/{x}?format=image/png`,
//   url: `https://its.go.kr:9443/geoserver/gwc/service/wmts/rest/ntic:N_LEVEL_11/ntic:REALTIME/EPSG:3857/EPSG:3857:{z}/{y}/{x}`,
//   //   layer: "Base",
//   //   style: "default",

//   name: "wmts01", // WMTS 이름명. 추후 삭제시 사용.
//   numberOfLevelZeroTilesX: 1, // 가로타일레벨
//   numberOfLevelZeroTilesY: 1, // 세로타일레벨
//   hasAlphaChannel: true, //true => (png포맷 영상타일인 경우-투명부위 처리원할때만 true, 그외 false)
//   minimumLevel: 6, // 최소 지도레벨
//   maximumLevel: 19, // 최대 지도레벨
//   format: "image/png",
//   credit: new Cesium.Credit("VWorld Korea"),
//   tilingScheme: new Cesium.GeographicTilingScheme(),
// });

// tw;
var mapOptions = new vw.MapOptions(
  "ws3d-map",
  vw.BasemapType.GRAPHIC,
  "",
  vw.DensityType.FULL,
  vw.DensityType.BASIC,
  false,
  new vw.CameraPosition(
    new vw.CoordZ(127.425, 38.196, 13487000),
    new vw.Direction(-90, 0, 0)
  ),
  new vw.CameraPosition(
    new vw.CoordZ(126.965007, 37.6, 19300),
    new vw.Direction(0, -90, 0)
  )
);

// var vmap = new vw.Map("cesiumContainerTest", mapOptions);
// var options = {
//   name: "wmts01",
//   numberOfLevelZeroTilesX: 1,
//   numberOfLevelZeroTilesY: 1,
//   url: "https://its.go.kr:9443/geoserver/gwc/service/wmts/rest/ntic:N_LEVEL_11/ntic:REALTIME/EPSG:3857/EPSG:3857:{z}/{y}/{x}?format=image/png",
//   hasAlphaChannel: true, //true => (png포맷 영상타일인 경우-투명부위 처리원할때만 true)
//   //   minimumLevel: 6,
//   maximumLevel: 19,
// };
// console.log("vamp", vmap);

// // 생성하기 전에 같은 이름이 존재하는지 확인
// if (vmap.getLayerElement("wmts01") != null) {
//   vmap.removeLayerElement("wmts01");
// }

// // vmap.show();
// // 파라미터 options : wmts api 항목.
// var wmts = new vw.source.WMTS(options);

//tw
// vw.MapControllerOption = {
//   container: "cesiumContainer",
//   mapMode: "ws3d-map",
//   basemapType: vw.ol3.BasemapType.GRAPHIC,
//   controlDensity: vw.ol3.DensityType.EMPTY,
//   interactionDensity: vw.ol3.DensityType.BASIC,
//   controlsAutoArrange: true,
//   homePosition: vw.ol3.CameraPosition,
//   initPosition: vw.ol3.CameraPosition,
// };

// mapController = new vw.MapController(vw.MapControllerOption);

let TP = new Cesium.WebMapTileServiceImageryProvider({
  url: `http://xdwrold.vworld.kr:8080/XDServer/3DData?Version=2.0.0.0&Request=GetLayer&Layer=tile&Level={z}&IDX={x}&IDY={y}&Key=43542827-D170-3C40-8483-2BD5651B2690`,
  requestVertexNormals: true,
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
  //   imageryProvider: smart,
  imageryProvider: TP,
  //   imageryProvider: wms,
  //   terrainShadows: Cesium.ShadowMode.DISABLED,
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

class PotreeDoroseeMain {
  constructor() {
    this.EventManager = new EventManager(this);
    this.PointCloudManager = new PointCloudManager(this);
    this.init();
  }

  init() {
    //빛 추가
    const AL = new THREE.AmbientLight(0x404040, 1);
    potreeViewer.volumeTool.scene.add(AL);
    //
    // this.addEvents();
    // this.addKeyEvent();
    PCM.init();
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
    PCM.update();
  }
}

requestAnimationFrame(loop);

export { testBox, boxArray, listArray, showList };
