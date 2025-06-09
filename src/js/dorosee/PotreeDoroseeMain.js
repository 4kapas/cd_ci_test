import * as THREE from "/public/Potree/libs/three.js/build/three.module.js";
// import { mixer } from "./object.js";
let mixer = false;
import { PointCloudManager } from "./pointcloudManager.js";
import { EventManager } from "./EventManager.js";
import { VWorldKey } from "./config.js";
// import { ScreenShotPopupManager } from "./ScreenShotPopupManager.js";
import { GeoCoderManager } from "./GeoCoderManager.js";
// import { HeaderManager } from "./layout/HeaderManager.js";
// import { SidebarManager } from "./layout/SidebarManager.js";
export class PotreeDoroseeMain {
  constructor(isVWorld = true) {
    this.isVWorld = isVWorld;
    this.isExpress = false;
    this.EventManager = new EventManager(this);
    this.PointCloudManager = new PointCloudManager(this);
    this.GeoCoderManager = new GeoCoderManager(this);

    // this.ScreenShotPopupManager = new ScreenShotPopupManager({ PotreeDoroseeMain: this, isExpress: this.isExpress });
    this.map = null;
    this.isReport = false;
    this.viewer = null;
    this.init();
    // this.addEvents();
  }

  init() {
    const vworld_key = VWorldKey;

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

    console.log(
      "this.isVWorld === true?",
      this.isVWorld,
      this.isVWorld === true
    );
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
      // imageryProvider: Cesium.createOpenStreetMapImageryProvider({
      //   url: "https://a.tile.openstreetmap.org/",
      // }),
      imageryProvider:
        this.isVWorld === true
          ? wms
          : Cesium.createOpenStreetMapImageryProvider({
              url: "https://a.tile.openstreetmap.org/",
            }),
      terrainShadows: Cesium.ShadowMode.DISABLED,
    });

    //// 3D Map을 지금 지원하는건아니라서 주석처리
    // this.vwmap();

    window.potreeViewer = new Potree.Viewer(
      document.getElementById("potree_render_area"),
      {
        useDefaultRenderLoop: false,
      }
    );
    potreeViewer.setEDLEnabled(true);
    potreeViewer.setFOV(60);
    // potreeViewer.setPointBudget(1_000_000);
    potreeViewer.setPointBudget(5000000);
    potreeViewer.setMinNodeSize(0);
    potreeViewer.loadSettingsFromURL();
    potreeViewer.setBackground("none");
    // potreeViewer.setBackground("None");

    potreeViewer.loadGUI(() => {
      potreeViewer.setLanguage("en");
      // $("#menu_appearance").next().show();
      // $("#menu_tools").next().show();
      // $("#menu_scene").next().show();
      // potreeViewer.toggleSidebar();
    });

    window.viewer = window.potreeViewer;
    // this.camera2 = this.newCamera();
    // this.EventManager.addEvents();
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
        let file = document.getElementById("fileUploadSelect").files[0];
        // FileReader 객체를 생성합니다.
        var reader = new FileReader();

        // 파일 로드가 완료되면 실행될 함수를 정의합니다.
        reader.onload = function (event) {
          // 파일 데이터를 읽어옵니다.
          var jsonData = event.target.result;

          // JSON 데이터를 파싱합니다.
          // var data = JSON.parse(jsonData);
          potreeViewer.loadProjectByText(jsonData);
          // 여기에서 파일 데이터를 처리합니다.
          // console.log("Data:", data);
        };

        // 파일 데이터를 읽어옵니다.
        reader.readAsText(file);
      },
      false
    );

    /**
     * 캡처 기능
     */
    if (document.querySelector("#captureCanvas")) {
      document.querySelector("#captureCanvas").addEventListener("click", () => {
        // this.saveImage();
        this.CaptureEcran();
      });
    }

    if (document.querySelector(".screenShot_popup")) {
      document
        .querySelector(".screenShot_popup .close_frame")
        .addEventListener("click", () => {
          document.querySelector(".screenShot_popup").style.display = "none";
        });
    }

    // this.splitOnOff();
    this.reportOnOff();
  }

  getPotreeViewer = () => {
    return window.potreeViewer;
  };

  /**
   * potree canvas 다 가져옴
   */
  CaptureEcran() {
    html2canvas(document.querySelector("#potree_render_area")).then(
      async (canvas) => {
        //  var a = document.createElement('a');
        let canvasDataURL = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        //  a.href = canvasDataURL;
        //  a.download = 'CaptureEcran.png';
        //  a.click();
        document.querySelector(".screenShot_popup").style.display = "block";
        this.ScreenShotPopupManager.setImg(canvasDataURL);
        this.ScreenShotPopupManager.setArea();
        await this.ScreenShotPopupManager.setAddress();
      }
    );
  }

  /**
   * canvas에 그려진 blur와 이미지를 합치는 함수
   * @returns url을 반환함
   */
  saveImage() {
    let cesiumCanvas = document.querySelector(".cesium-widget canvas");
    let potreeCanvas = document.querySelector("#potree_render_area canvas");
    var canvasImg = document.getElementById("save_canvas");
    console.log(
      "Canvases",
      cesiumCanvas,
      potreeCanvas,
      canvasImg.width,
      canvasImg.height
    );
    var ctx = canvasImg.getContext("2d");
    ctx.strokeStyle = "#ff0000";
    ctx.clearRect(0, 0, canvasImg.width, canvasImg.height);
    ctx.beginPath();
    ctx.drawImage(cesiumCanvas, 0, 0, canvasImg.width, canvasImg.height);
    ctx.drawImage(potreeCanvas, 0, 0, canvasImg.width, canvasImg.height);
    ctx.closePath();
    var imgDataUrl = canvasImg.toDataURL();

    var potreeimgDataUrl = cesiumCanvas.toDataURL("image/jpg");

    let DU =
      potreeViewer.profileWindow.renderer.domElement.toDataURL("image/jpg");
    // document.querySelector(".potree_container").style.display = "none";
    // document.querySelector("#saveImg").src = imgDataUrl;

    let link = document.createElement("a");
    link.href = DU;
    link.download = "test.jpg";
    link.click();
    // link.remove();
    return imgDataUrl;
  }

  /**
   * 포트리 오른쪽 3D Map보여주는 함수
   */
  vwmap() {
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

    let map = new vw.Map("cesiumContainerRight", mapOptions);
    this.map = map;
    // console.log("map", map, mapOptions, new vw.Map());
  }

  vwmoveTo(x, y, z) {
    var movePo = new vw.CoordZ(x, y, z);
    var mPosi = new vw.CameraPosition(movePo, new vw.Direction(0, -90, 0));
    this.map.moveTo(mPosi);
  }

  reportOnOff() {
    const btnReportSwitch = document.getElementById("toggleReport");
    // const canvasOnBtn = document.querySelector(".canvas2");
    const btnMenu = document.getElementById("toggleSidebar");
    const potreeContainer = document.querySelector("#potree_ctn");
    const reportContainer = document.getElementById("wrap");
    btnReportSwitch.addEventListener("click", () => {
      if (this.isReport) {
        this.isReport = false;
        btnMenu.classList.remove("disable");
        // canvasOnBtn.classList.remove("disable");
        reportContainer.classList.add("disable");
        potreeContainer.style.zIndex = "1";
      } else {
        this.isReport = true;
        btnMenu.classList.add("disable");
        // canvasOnBtn.classList.add("disable");
        reportContainer.classList.remove("disable");
        potreeContainer.style.zIndex = "-1";
      }
    });
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

  newCamera = () => {
    let scene = potreeViewer.scene;
    let camera = scene.getActiveCamera();
    let newCamera = camera.clone();
    scene.scene.add(newCamera);
    return newCamera;
  };

  loop(timestamp) {
    requestAnimationFrame(this.loop.bind(this));
    potreeViewer.update(potreeViewer.clock.getDelta(), timestamp);

    potreeViewer.render();
    // if (this.newCamera) {
    //   // 첫 번째 카메라로 렌더링합니다.
    //   let scene = potreeViewer.scene;
    //   let mainCamera = scene.getActiveCamera();
    //   // mainCamera.viewport = new THREE.Vector4(0, 0, 0.5, 1); // 왼쪽 절
    //   potreeViewer.renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
    //   potreeViewer.renderer.setScissor(0, 0, window.innerWidth / 2, window.innerHeight);
    //   potreeViewer.renderer.setScissorTest(true);
    //   // potreeViewer.renderer.render(potreeViewer.overlay, mainCamera);

    //   // 두 번째 카메라로 렌더링합니다.
    //   let subCamera = this.camera2;
    //   // subCamera.viewport = new THREE.Vector4(0.5, 0, 0.5, 1);
    //   potreeViewer.renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
    //   potreeViewer.renderer.setScissor(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
    //   potreeViewer.renderer.setScissorTest(true);
    //   potreeViewer.renderer.render(potreeViewer.overlay, this.camera2);
    // }
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
      // this.PointCloudManager.update();
    }
  }
}
