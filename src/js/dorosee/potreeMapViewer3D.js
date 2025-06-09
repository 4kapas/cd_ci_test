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

var map;

/* begin -------- 맵 초기화 코드 --------- */
// function vwmap() {
//   var mapOptions = new vw.MapOptions(
//     vw.BasemapType.GRAPHIC_NIGHT,
//     "",
//     vw.DensityType.FULL,
//     vw.DensityType.BASIC,
//     false,
//     new vw.CameraPosition(
//       new vw.CoordZ(126.921883, 37.52437, 482400),
//       new vw.Direction(0, -90, 0)
//     ),
//     new vw.CameraPosition(
//       new vw.CoordZ(126.921883, 37.52437, 1000),
//       new vw.Direction(0, -90, 0)
//     )
//   );

//   map = new vw.Map("cesiumContainer", mapOptions);
//   console.log("map", map, mapOptions, new vw.Map());
// }

function vwmap() {
  var mapOptions = new vw.MapOptions(
    vw.BasemapType.GRAPHIC_NIGHT,
    "",
    vw.BasemapType.GRAPHIC_NIGHT,
    vw.DensityType.BASIC,
    false,
    new vw.CameraPosition(
      new vw.CoordZ(126.921883, 37.52437, 482400),
      new vw.Direction(0, -90, 0)
    ),
    new vw.CameraPosition(
      new vw.CoordZ(126.921883, 37.52437, 1000),
      new vw.Direction(0, -90, 0)
    )
  );

  map = new vw.Map("cesiumContainer", mapOptions);
  console.log("map", map, mapOptions, new vw.Map());
}

// 웹지엘 지도 호출.
vwmap();

/* end -------- 맵 초기화 코드 --------- */

function flyHome() {
  if (map != null) {
    vw.NavigationZoom.initHome();
    console.log("이동 :");
  }
}

flyHome();

export { testBox, boxArray, listArray, showList };
