//@ts-nocheck
import { NotificationServiceImpl, PotreeServiceImpl } from "@/application";
import { kdTree } from "kd-tree-javascript";
import { ShapeManager } from "@/js/dorosee/ShapeManager";
import { COORDS } from "@/js/dorosee/config";
import { usePotreeStore } from "@/store/usePotreeStore";
import useSuperStore from "@/store/useSuperStore";

import { NotiState } from "@/types";

import { hexToRgb } from "@/utils";
import { ServiceAPI } from "@/apis/Service/service.api";
import { CONFIG } from "@/config";
import { SHAPE_PALETTE } from "@/consts/const";

const notificationService = NotificationServiceImpl;
const potreeService = PotreeServiceImpl;
const shapeManager = new ShapeManager();
class PotreeServiceUseCase {
  constructor() {}

  //포트리를 실행하는 로직
  initPotree = async (
    potreeRenderID: string,
    cesiumRenderID: string,
    config: any
  ): Promise<any> => {
    try {
      const { potreeViewer, cesiumViewer } = await potreeService.initMap(
        potreeRenderID,
        cesiumRenderID,
        config
      );

      await potreeService.potreeRoop({ potreeViewer, cesiumViewer });

      return { potreeViewer, cesiumViewer };
    } catch (e) {
      throw e;
    }
  };

  init = async (
    potreeViewer,
    cesiumViewer,
    config: { area: string; shp: boolean },
    isDetectMode?: boolean
  ) => {
    try {
      const { pending, fulfill, reject } = useSuperStore.getState();
      const { area: serviceId, shp } = config;

      const info = await ServiceAPI._getServiceInfo(serviceId);
      const {
        coord,
        panoramaURL,
        pointCloudURL,
        shapesURL,
        objectURL,
        threedObjectURL,
        tifurl,
        geoJsonUrl,
      } = await info;

      const COOcoord = COORDS[coord];
      const pointclouds: any[] = [];
      if (pointCloudURL) {
        const layers = [];
        // 변화탐지 결과인 경우
        if (info.changeDetect) {
          const { base, target } = info.changeDetect;
          layers.push({
            // 변화탐지 결과 URL 정보
            path: `/services/${info.id}/pointcloud/metadata.json`,
            // name: `(${info.acqDate.split("-")[0]}) ${info.name}`,
            name: "변화 포인트",
            detect: true,
            visible: true,
          });
          layers.push({
            // 변화탐지 기준 URL 정보
            path: `/services/${base.id}/pointcloud/metadata.json`,
            name: `(${base.acqDate.split("-")[0]}) 기준 포인트`,
            // name: `(Before) ${base.name}`,
            visible: true,
          });
          layers.push({
            // 변화탐지 비교대상 URL 정보
            path: `/services/${target.id}/pointcloud/metadata.json`,
            name: `(${target.acqDate.split("-")[0]}) 비교 포인트`,
            // name: `(After) ${target.name}`,
            visible: false,
          });
        } else {
          layers.push({
            path: `/services/${info.id}/pointcloud/metadata.json`,
            name: info.name,
            visible: true,
          });
        }
        const pcs = await this.loadPointClouds(
          serviceId,
          layers,
          potreeViewer,
          COOcoord,
          shp
        );
        pcs.forEach((pc) => pointclouds.push(pc));
      }

      let transform;
      await new Promise((resolve) => {
        potreeViewer.loadGUI(() => {
          resolve(true);
        }, shp);
      });
      if (shp && shapesURL) {
        await shapeManager.init(potreeViewer);
        const shapeCoord = shapesURL.coord;
        transform = await shapeManager.setProj(COORDS[shapeCoord], COOcoord);
        usePotreeStore.getState().setTransform(transform);

        for await (const [index, shpObject] of shapesURL.shpArray.entries()) {
          const shps = await shapeManager.loadShapeFile({
            path: shpObject.shpURL,
            objPath: shpObject.dbfURL,
            color: SHAPE_PALETTE[index],
            transform,
            shpName: shpObject.name,
            shp,
            potreeViewer,
            visible: false,
          });
          usePotreeStore.getState().setSaveFeatures(shps);
        }
        fulfill();
      }

      await potreeService.loadTotifArea(serviceId, shp, cesiumViewer,potreeViewer);

      if (panoramaURL) {
        await potreeService.addPanorama({
          viewer: potreeViewer,
          url: panoramaURL,
          coord: COOcoord,
        });
      }

      const objects: any[] = [];
      if (threedObjectURL && pointclouds.length > 0) {
        const center = pointclouds[0].position;
        const { MTLPath, OBJPath } = threedObjectURL;
        const position = {
          x: center.x + 305,
          y: center.y + 250,
          z: center.z,
        };
        const object = await potreeService.addOBJMTL({
          viewer: potreeViewer,
          MTLPath,
          OBJPath,
          onlyOBJ: true,
          center: position,
        });
        objects.push(object);
      }

      return { pointclouds, transform };
    } catch (e) {
      useSuperStore.getState().reject(e);
      console.error("init error", e);
      throw e;
    }
  };

  error = async () => {
    try {
      notificationService.notify("에러가 발생하였습니다.", NotiState.error);
    } catch (e) {
      throw e;
    }
  };

  loadPointClouds = async (
    serviceId,
    layers: {
      path: string;
      name: string;
      visible: boolean;
      detect?: boolean;
    }[],
    viewer,
    coord,
    shp
  ) => {
    const results = [];
    for await (const layer of layers) {
      const pc = await potreeService.addPointCloud({
        serviceId,
        viewer,
        coord,
        shp,
        path: layer.path,
        name: layer.name,
        visible: layer.visible,
        isDetectMode: layer.detect,
      });
      results.push(pc);
    }
    return results;
  };
  getShapeForContest = async (potreeViewer, boardId) => {
    try {
      let data = await potreeService.getShapeForContest(boardId);

      await potreeViewer.loadProjectByText(
        data.resultObject.meta,
        potreeViewer
      );
    } catch (e) {
      throw e;
    }
  };
  LoadTogetShapeForContest = async (potreeViewer, metaJson) => {
    try {
      const result = await potreeViewer.loadProjectByText(
        metaJson,
        potreeViewer
      );
      return result;
    } catch (e) {
      console.log("로딩실패");
      throw e;
    }
  };
  loadUrlVolum = async (potreeViewer, location) => {
    const searchParams = new URLSearchParams(location.search);
    const volumesData = {};
    try {
      for (const [key, value] of searchParams) {
        // 위치, 회전, 크기와 같은 배열 형태의 속성은 적절히 변환
        volumesData[key] =
          key.includes("position") ||
          key.includes("rotation") ||
          key.includes("scale")
            ? JSON.parse(value)
            : value;
      }
      await potreeService.loadVolumToArea(potreeViewer, volumesData);
    } catch (error) {
      console.log(error, "error");
    }
  };

  editShpLines = async (config: {
    potreeViewer: any;
    area: any;
    shpProperties: any;
    shp: boolean;
    changeShapeZ;
  }) => {
    const { pending, fulfill, reject } = useSuperStore.getState();
    let { potreeViewer, area, shpProperties, shp, changeShapeZ } = config;
    let info = await ServiceAPI._getServiceInfo(area);
    let { coord, panoramaURL, pointCloudURL, shapesURL } = await info;
    let COOcoord = COORDS[coord];
    try {
      if (shp && shapesURL) {
        await shapeManager.init(potreeViewer);
        let coord = shapesURL.coord;
        // let transform = await shapeManager.setProj(COORDS[coord], COOcoord);

        pending();
        let shps = [];
        for await (const [index, shpObject] of shapesURL.shpArray.entries()) {
          let transform = await shapeManager.setProj(shpObject.coord, COOcoord);
          const shp = await shapeManager.loadToshpfeatures({
            path: shpObject.shpURL,
            objPath: shpObject.dbfURL,
            color: SHAPE_PALETTE[index],
            transform,
            shpName: shpObject.name,
            shp: true,
            potreeViewer,
            shpProperties,
            changeShapeZ,
          });
          shps.push(shp);
        }
        return shps[0];
      }

      fulfill();
    } catch (e) {
      console.log(e, "error editshp");
    }
  };
}

export default new PotreeServiceUseCase();
