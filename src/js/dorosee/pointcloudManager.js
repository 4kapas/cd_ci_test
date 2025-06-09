// import * as THREE from "../three.js/build/three.module.js";
import { NotificationServiceImpl } from "../../application";
import { ShapeManager } from "./ShapeManager.js";
import { COORDS } from "./config.js";
import { NotiState } from "../../types";
import { getDiffTime } from "@/utils";
import * as THREE from '/public/Potree/libs/three.js/build/three.module.js';
export class PointCloudManager {
  constructor() {
    this.ShapeManager = new ShapeManager();
    this.addOrder = 0;
    this.TextS = [];
    this.pointcloudProjection = null;
    this.coords = COORDS;
  }

  init() {
  }

  /**
   * 
   * @param {*} param0 url, coord를받고 coord는 config.js를 따라감
   */
  async testAddPointCloudUsingURL(data) {
    const startTime = new Date().getTime();
    let endTime
    const notificationService = NotificationServiceImpl;
    return new Promise((resolve, reject) => {
      let { url, coord, callback, name } = data
      let pointCloudName = name ? name : url.split("/").reverse()[0].split(".")[0];
      Potree.loadPointCloud(url, pointCloudName, async (e) => {
        try {
          console.groupCollapsed("pointcloud");
          console.log("pointCloudName", pointCloudName);
          // Potree.loadPointCloud("http://5.9.65.151/mschuetz/potree/resources/pointclouds/opentopography/CA13_1.4/cloud.js", "CA13", function(e){
          let pointcloud = e.pointcloud;
          let scene = potreeViewer.scene;
          let material = pointcloud.material;
          //   pointcloud.visible = false;
          pointcloud.projection = COORDS[coord];
          material.pointSizeType = Potree.PointSizeType.ADAPTIVE;

          scene.addPointCloud(pointcloud);

          // let TOM = new TextObjectManager(
          //   pointcloud.name,
          //   pointcloud.position
          // ).init();

          // this.TextS.push(TOM);

          // e.pointcloud.position.set(
          //   pointcloud.position.x,
          //   pointcloud.position.y,
          //   pointcloud.position.z + 200
          // );

          // e.pointcloud.position.set(296507.02399999998, 3888075.1017, -18.833800000000011);

          console.log("pc", pointcloud, pointcloud.position, scene);

          //z는 높이

          let pointcloudProjection = COORDS[coord];
          this.pointcloudProjection = pointcloudProjection;
          // let pointcloudProjection = grs80busan;

          let mapProjection = proj4.defs("WGS84"); //WGS84 ㅇㅜㅣㄱㅕㅇㄷㅗㅍㅛㅅㅣ

          window.toMap = proj4(pointcloudProjection, mapProjection);
          window.toScene = proj4(mapProjection, pointcloudProjection);

          // console.log("potreeViewer.scene.pointclouds",potreeViewer.scene.pointclouds);

          let pointCenter = new THREE.Vector3(
            pointcloud.position.x + pointcloud.boundingBox.max.x / 2,
            pointcloud.position.y + pointcloud.boundingBox.max.y / 2,
            pointcloud.position.z
          );

          potreeViewer.scene.view.setView(
            [
              pointCenter.x,
              pointCenter.y,
              pointCenter.z + 5000,
            ],
            [pointCenter.x, pointCenter.y, pointCenter.z]
          );

          // potreeViewer.scene.view.setView(
          //   [
          //     pointcloud.position.x,
          //     pointcloud.position.y,
          //     pointcloud.position.z + 5000,
          //   ],
          //   [pointcloud.position.x, pointcloud.position.y, pointcloud.position.z]
          // );


          // reject(new Error('실패'));
          // if (callback) {
          //   callback();
          // }

          console.groupEnd();
          let second = await getDiffTime(startTime, new Date().getTime());
          notificationService.notify(`포인트클라우드 호출 성공 및 
          걸린시간 ${second}초`, NotiState.success)
          resolve(pointcloud);
          return;
        }
        catch (e) {
          let second = await getDiffTime(startTime, new Date().getTime());
          notificationService.notify(`포인트클라우드 호출 실패 및 
          걸린시간 ${second}초`, NotiState.error)
          reject(e);
        }
      });
    })
  }

  deletePointCloud(order) {
    let pointcloud = potreeViewer.scene.pointclouds[0];
    potreeViewer.scene.scenePointCloud.remove(pointcloud);
    let arr = potreeViewer.scene.pointclouds.filter(function (item) {
      return item.name !== pointcloud.name;
    });

    let arr2 = this.TextS.filter(function (item) {
      if (item.name.indexOf(pointcloud.name) > -1) {
        potreeViewer.volumeTool.scene.remove(item);
        return false;
      }
      return true;
      // return if(item.name !== pointcloud.name);
    });
    potreeViewer.scene.pointclouds = arr;
    this.TextS = arr2;
    // console.log("arr!",arr,potreeViewer.scene.pointclouds);
    this.addOrder = 0;
  }

  deletePointCloudAll(order) {
    for (let i = 0; i < potreeViewer.scene.pointclouds.length; i++) {
      let pointcloud = potreeViewer.scene.pointclouds[i];
      potreeViewer.scene.scenePointCloud.remove(pointcloud);
      let Text = this.TextS[i];
      potreeViewer.volumeTool.scene.remove(Text);
    }

    potreeViewer.scene.pointclouds = [];
    this.TextS = [];
    // console.log("arr!",potreeViewer.scene.pointclouds);
    this.addOrder = 0;
    return false;
  }

  update() {
    return;
    // console.log("PM.panormas",PM.panormas);
    try {
      let view = potreeViewer.scene.view;
      for (let i = 0; i < potreeViewer.scene.pointclouds.length; i++) {
        let pointcloud = potreeViewer.scene.pointclouds[i];
        if (
          view.position.x > pointcloud.position.x - 200 &&
          view.position.x <
          pointcloud.position.x + pointcloud.boundingBox.max.x + 200 &&
          view.position.y > pointcloud.position.y - 200 &&
          view.position.y <
          pointcloud.position.y + pointcloud.boundingBox.max.y + 200
        ) {
          // console.log("point!",potreeViewer.scene.pointclouds[i]);
          potreeViewer.scene.pointclouds[i].visible = true;
          this.TextS[i].visible = true;
          //   PM.panoramas[i].visible = true;
        } else {
          //   potreeViewer.scene.pointclouds[i].visible = false;
          //     PCM.TextS[i].visible = false;
          //     PM.panoramas[i].visible = false;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}