//@ts-nocheck

import { OBJMTLModel } from "@/js/dorosee/object";
import { run360 } from "@/js/dorosee/Panorama360manager.js";
import { ApiService } from "@/services/ApiService";
import { kdTree } from "kd-tree-javascript";
import { DBSCAN } from "density-clustering";

import { tifToIonAssetsNumber, DEMToIonAssetsNumber } from "@/consts/const.js";
import { ShapeManager } from "@/js/dorosee/ShapeManager.js";
import { ION_TOKEN_GENERATOR } from "@/js/dorosee/tokenConfig.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { pixPointCloudZinit } from "../Constant/pixPointCloudZinit";
import { instance } from "@/services/AxiosApiService";
import { CONFIG } from "@/config";

const SuperURL = "http://203.234.214.91:10840";

interface PotreeService {
  initMap: (potreeRenderID: string, cesiumRenderID: string) => Promise<any>;
  potreeRoop: ({ potreeViewer, cesiumViewer }: any) => Promise<any>;
  addPointCloud: (config: {
    viewer: any;
    path: string;
    coord: string;
    name?: string;
    shp?: boolean;
    visible: boolean;
    isDetectMode?: boolean;
  }) => Promise<any>;
  addPanorama: (config: {
    viewer: any;
    url: string;
    coord: string;
    pointcloud: any;
  }) => Promise<any>;
  addOBJMTL: (config: {
    viewer: any;
    MTLPath?: string;
    OBJPath: string;
    size?: any;
    onlyOBJ: boolean;
    center?: any;
  }) => Promise<any>;
  loadVolumToArea: (potreeViewer: any, volumesData: any) => Promise<any>;
  loadTotifArea: (area: string, shp: boolean) => void;
  getShapeForContest: (id: string) => Promise<{
    code: number;
    isSuccess: boolean;
    message: string;
    resultObject: any;
  }>;
}

export const PotreeServiceImpl: PotreeService = {
  initMap: async (
    potreeRenderID: string,
    cesiumRenderID: string,
    config: { area: string; shp: boolean }
  ): any => {
    try {
      Cesium.Ion.defaultAccessToken = ION_TOKEN_GENERATOR("doroseeToken");

      let cesiumViewer = new Cesium.Viewer(cesiumRenderID, {
        useBrowserRecommendedResolution: true, // 브라우저가 권장하는 해상도를 사용하여 최적의 화면 품질 제공
        animation: false, // 화면 좌측 하단의 애니메이션 컨트롤러 표시 여부 설정
        // imageryProvider: false, // 기본 지도 레이어 제공자를 설정
        baseLayerPicker: false, // 사용자가 베이스맵을 선택할 수 있는 UI 요소를 제공
        // imageryProvider: new Cesium.SingleTileImageryProvider({
        //   url: "path/to/your/image.png", // 지정된 단일 타일 이미지를 맵에 표시
        //   rectangle: Cesium.Rectangle.fromDegrees(west, south, east, north), // 이미지가 표시될 영역을 지정
        // }),
        fullscreenButton: false, // 전체 화면 전환 버튼을 추가
        geocoder: false, // 주소나 장소를 검색할 수 있는 입력창을 추가
        homeButton: false, // 초기 위치로 이동할 수 있는 버튼을 추가
        infoBox: false, // 선택한 객체의 정보를 표시하는 창을 제공
        selectionIndicator: false, // 선택한 객체의 위치를 강조하여 표시
        timeline: false, // 시간 슬라이더를 표시하여 시뮬레이션 시간을 조작할 수 있도록 설정
        scene3DOnly: false, // 2D, Columbus View, 3D 모드 중에서 선택할 수 있도록 설정
        navigationHelpButton: false, // 카메라 조작 방법을 안내하는 도움말 버튼을 추가
        sceneModePicker: false, // 2D, Columbus View, 3D 모드를 전환할 수 있는 버튼을 추가
        targetFrameRate: 60, // 목표 프레임 레이트를 설정
        requestRenderMode: true, // 변경 사항이 있을 때만 씬을 렌더링하여 성능을 최적화
        skyBox: false, // 씬의 배경으로 사용할 스카이박스를 추가
        skyAtmosphere: false, // 지구 대기 효과를 시뮬레이션하여 렌더링
        shadows: false, // 객체와 지형에 대한 그림자 효과를 적용
        // globe: false, // 지구 본체(Globe) 렌더링 여부를 설정
        // imageryProvider: asdasd, // 지도 데이터를 제공하는 사용자 지정 타일 소스를 설정
        // imageryProvider: wmts, // WMTS(Tile Map Service) 기반 지도 데이터를 사용하도록 설정
        terrainShadows: Cesium.ShadowMode.DISABLED, // 지형에 대한 그림자 효과를 제어
        maximumRenderTimeChange: Infinity, // 마지막 렌더링 이후 일정 시간 동안 화면을 다시 렌더링할 지연 시간 설정
        lastRenderTime: "", // 마지막으로 렌더링된 시간을 저장
        showTimeOptions: false, // 시간과 관련된 추가 옵션을 제공
        showRenderLoopErrors: false, // 렌더링 루프에서 발생하는 오류 메시지를 표시
        debugShowFramesPerSecond: false, // 초당 프레임 수(FPS)를 화면에 표시
        shouldAnimate: false, // 씬 내 애니메이션 효과를 활성화
        trackedEntity: false, // 특정 엔티티를 추적하여 카메라가 자동으로 따라가도록 설정
      });

      cesiumViewer.useDefaultRenderLoop = true;

      let potreeViewer = await new Potree.Viewer(
        document.getElementById(potreeRenderID)
      );
      potreeViewer.useDefaultRenderLoop = false; // 기본 렌더링 루프를 사용하지 않음.
      potreeViewer.useHQ = false; // 고화질 모드를 사용 (false로 설정하면 저화질 모드)
      potreeViewer.setPointBudget(3_000_000); // 최대 포인트 수 설정
      potreeViewer.setFOV(60); // 시야각 (Field of View)를 60도로 설정
      potreeViewer.setEDLEnabled(true); // EDL (Eye-Dome Lighting)을 활성화, 시각적으로 깊이를 강조하여 더 좋은 3D 효과 제공
      potreeViewer.setMinNodeSize(0); // 최소 노드 크기 설정, 0으로 설정 시 노드 크기 제한 없음
      potreeViewer.setEDLRadius(1); // EDL 효과의 반경을 0으로 설정
      potreeViewer.loadSettingsFromURL(); // URL에서 설정을 로드
      potreeViewer.setBackground("none"); // 배경을 투명으로 설정

      if (!potreeViewer) {
        console.error(`potree 렌더 영역을 찾을 수 없습니다.`);
        return;
      }
      return { potreeViewer, cesiumViewer };
    } catch (e) {
      throw e;
    }
  },
  potreeRoop: async ({ potreeViewer, cesiumViewer }) => {
    let loop = (timestamp) => {
      requestAnimationFrame(loop);
      potreeViewer.update(potreeViewer.clock.getDelta(), timestamp);

      potreeViewer.render();
      if (window.toMap !== undefined) {
        {
          let camera = potreeViewer.scene.getActiveCamera();

          let pPos = new THREE.Vector3(0, 0, 0).applyMatrix4(
            camera.matrixWorld
          );
          let pRight = new THREE.Vector3(600, 0, 0).applyMatrix4(
            camera.matrixWorld
          );
          let pUp = new THREE.Vector3(0, 600, 0).applyMatrix4(
            camera.matrixWorld
          );
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
            let fovy =
              Math.PI * (potreeViewer.scene.getActiveCamera().fov / 180);
            cesiumViewer.camera.frustum.fov = fovy;
          } else {
            let fovy =
              Math.PI * (potreeViewer.scene.getActiveCamera().fov / 180);
            let fovx = Math.atan(Math.tan(0.5 * fovy) * aspect) * 2;
            cesiumViewer.camera.frustum.fov = fovx;
          }
        }

        cesiumViewer.render();
      }
    };
    requestAnimationFrame(loop);
  },
  addPointCloud: async (config) => {
    try {
      let { viewer, path, coord, name, shp, visible, isDetectMode } = config;
      let potreeViewer = viewer;

      return new Promise((resolve, reject) => {
        let pointCloudName = name
          ? name
          : path.split("/").reverse()[0].split(".")[0];
        console.log("pointCloudName", pointCloudName, path);
        Potree.loadPointCloud(CONFIG.HOST + path, pointCloudName, async (e) => {
          try {
            let pointcloud = e.pointcloud;

            let scene = potreeViewer.scene;
            let material = pointcloud.material;
            pointcloud.visible = visible;
            pointcloud.projection = coord;
            material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
            pointcloud.minimumNodePixelSize = 20;
            if (isDetectMode) {
              potreeViewer.setClassifications({
                10: {
                  visible: false,
                  name: "unchanged",
                  color: [1.0, 1.0, 1.0, 1.0],
                },
                20: {
                  visible: true,
                  name: "changed",
                  color: [1.0, 0.0, 0.0, 1.0],
                },
              });
              material.activeAttributeName = "classification";
              material.recomputeClassification();
            }

            scene.addPointCloud(pointcloud, shp);
            pixPointCloudZinit(path, pointcloud);

            //z는 높이
            let pointcloudProjection = coord;
            let mapProjection = proj4.defs("WGS84"); //WGS84 위경도표시

            window.toMap = proj4(pointcloudProjection, mapProjection);
            window.toScene = proj4(mapProjection, pointcloudProjection);

            let pointCenter = new THREE.Vector3(
              pointcloud.position.x + pointcloud.boundingBox.max.x / 2,
              pointcloud.position.y + pointcloud.boundingBox.max.y / 2,
              pointcloud.position.z
            );
            let camera = potreeViewer.scene.getActiveCamera();

            potreeViewer.scene.view.setView(
              [pointCenter.x, pointCenter.y, pointCenter.z + 5000],
              [pointCenter.x, pointCenter.y + 1, pointCenter.z]
            );

            console.groupEnd();
            resolve(pointcloud);

            return;
          } catch (e) {
            reject(e);
          }
        });
      });
    } catch (e) {
      throw e;
    }
  },

  addPanorama: async (config) => {
    try {
      let { viewer, url, coord, pointcloud } = config;
      await run360({ viewer, url, coord, pointcloud });
    } catch (e) {
      throw e;
    }
  },
  addOBJMTL: async (config) => {
    try {
      let { viewer, MTLPath, OBJPath, onlyOBJ, size, center } = config;
      console.log(config, "obj config");
      let camera = viewer.scene.getActiveCamera();
      let domEle = viewer.renderer.domElement;
      let controls = new TransformControls(camera, domEle);
      let objmtl = new OBJMTLModel({
        viewer,
        MTLPath,
        OBJPath,
        onlyOBJ,
        size,
        center,
      });
      let object = await objmtl.init(true);
      console.log("object잘나와?", object);
      controls.attach(object);
      viewer.orbitControls.enabled = false;
      viewer.scene.scene.add(controls);

      return object;
    } catch (e) {
      throw e;
    }
  },
  loadVolumToArea: async (potreeViewer, { ...areaslist }) => {
    try {
      console.log(areaslist, "areaslist");

      let volume = new Potree.BoxVolume();

      volume.uuid = areaslist.uuid;
      volume.name = areaslist.name;
      volume.type = "Object3D";

      volume.position.set(
        areaslist.position.x,
        areaslist.position.y,
        areaslist.position.z
      );
      volume.rotation.set(0, 0, 0);

      volume.scale.set(areaslist.scale.x, areaslist.scale.y, areaslist.scale.z);
      volume.showAngles = false;
      volume.showVolumeLabel = false;
      volume.showDistances = false;
      volume.showArea = false;
      volume.visible = false;
      volume.clip = true;

      potreeViewer.scene.addVolume(volume);
      potreeViewer.setClipTask(2);

      potreeViewer.zoomTo(volume, 1, 500);
    } catch (e) {
      console.log(e, "error");
      throw e;
    }
  },
  getShapeForContest: async (params) => {
    try {
      return await instance.get(`/land/${params}`).then((res) => res.data);
    } catch (e) {
      throw e;
    }
  },
  getLandDataList: async (id) => {
    try {
      let data = await ApiService.get<{
        code: number;
        isSuccess: boolean;
        message: string;
        resultObject: any;
      }>(`${SuperURL}/lx/v1/api/land/filter/${id}`, {}, "").then((res) => {
        console.log(res.data, "getlandDatalist");
      });
      return data;
    } catch (e) {
      throw e;
    }
  },
    loadTotifArea: async (area, shp, cesiumViewer,potreeViewer) => {
    const tifArea: number = await tifToIonAssetsNumber("dorosee");

    if (tifArea) {
      let shapeManager = new ShapeManager();

      try {
        const imageryLayer = cesiumViewer.imageryLayers.addImageryProvider(
          await Cesium.IonImageryProvider.fromAssetId(tifArea, {
            hasAlphaChannel: false,
          })
        );

        setTimeout(async () => {
          let tree = $(`#jstree_scene`);
          let name = "정사영상";

          let tifId = tree.jstree(
            "create_node",
            "#",
            { text: "<b>정사영상</b>", id: "tif", icon: "" },
            "last",
            false,
            false
          );

          tree.jstree("check_node", tifId);

          let nodeID = tree.jstree(
            "create_node",
            tifId,
            {
              text: "정사영상",
              icon: "",
              data: imageryLayer,
            },
            "last",
            false,
            false
          );

          tree.jstree("check_node", nodeID);

          if (imageryLayer.visible) {
            tree.jstree("check_node", nodeID);
          } else {
            tree.jstree("uncheck_node", nodeID);
          }
        // potreeViewer.scene.scene.setTerrain(
        //   new Cesium.Terrain(
        //     Cesium.CesiumTerrainProvider.fromIonAssetId(3400319),
        //   ),
        // );
      // const demArea = DEMToIonAssetsNumber("dorosee");

      // if (demArea) {
      //   potreeViewer.scene.setTerrain(
      //     new cesiumViewer.Terrain(
      //       cesiumViewer.CesiumTerrainProvider.fromIonAssetId(3400319),
      //     ),
      //   );
      //   let demId = tree.jstree(
      //     "create_node",
      //     "#",
      //     { text: "<b>지형 (DEM)</b>", id: "dem", icon: "" },
      //     "last",
      //     false,
      //     false
      //   );
      //   tree.jstree("check_node", demId);

      //   let demNodeID = tree.jstree(
      //     "create_node",
      //     demId,
      //     {
      //       text: "DEM 지형",
      //       icon: "",
      //       data: demArea,
      //     },
      //     "last",
      //     false,
      //     false
      //   );
      //   tree.jstree("check_node", demNodeID);
      // }

      const demArea = await DEMToIonAssetsNumber("dorosee");

      if (demArea) {
        // Cesium 지형 설정
        const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(demArea, {
          requestVertexNormals: true,
        });
        cesiumViewer.terrainProvider = terrainProvider;
cesiumViewer.scene.globe.show = true;
// cesiumViewer.imageryLayers.removeAll();
cesiumViewer.scene.globe.customShader = new Cesium.CustomShader({
  lightingModel: Cesium.LightingModel.UNLIT,
  uniforms: {
    u_minHeight: { type: Cesium.UniformType.FLOAT, value: 0.0 },
    u_maxHeight: { type: Cesium.UniformType.FLOAT, value: 10000.0 },
  },
  fragmentShaderText: `
    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
      float height = fsInput.attributes.positionMC.z;
      float t = clamp((height - u_minHeight) / (u_maxHeight - u_minHeight), 0.0, 1.0);
      material.diffuse = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), t);
      material.alpha = 1.0;
    }
  `,
});
        console.log("    cesiumViewer.scene.globe.customShader",    cesiumViewer.scene.globe.customShader)

        // DEM 트리 노드 구성
        let demParentId = tree.jstree(
          "create_node",
          "#",
          { text: "<b>지형 (DEM)</b>", id: "dem", icon: "" },
          "last",
          false,
          false
        );

        tree.jstree("check_node", demParentId);

        let demChildId = tree.jstree(
          "create_node",
          demParentId,
          {
            text: "DEM 지형",
            icon: "",
            data: {
            provider: terrainProvider, // 객체 자체 전달
            type: "terrain"
          }
          },
          "last",
          false,
          false
        );

        tree.jstree("check_node", demChildId);
        tree.on("check_node.jstree", (e, data) => {
          const node = data.node;
          if (node.data?.type === "terrain") {
            cesiumViewer.terrainProvider = node.data.provider;
          }
        });

        tree.on("uncheck_node.jstree", (e, data) => {
          const node = data.node;
          if (node.data?.type === "terrain") {
            // 지형 비활성화 (빈 provider 설정)
            cesiumViewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
          }
        });

      }
        }, 1000);
      } catch (error) {
        console.log(error, "tif error");
      }
    } else {
      return null;
    }
  },
};
