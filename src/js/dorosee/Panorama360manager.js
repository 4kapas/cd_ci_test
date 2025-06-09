import { NotificationServiceImpl } from "@/application";
const notificationService = NotificationServiceImpl;
const alignImageWithPointCloud = (image360, pointCloud, potreeViewer) => {
  // 이미지의 중심을 계산합니다.
  const imageCenter = new THREE.Vector3(...image360.position);
  // 포인트 클라우드의 중심을 계산합니다.

  // let pointCenter = new THREE.Vector3(
  //   pointCloud[0].position.x + pointCloud[0].boundingBox.max.x / 2,
  //   pointCloud[0].position.y + pointCloud[0].boundingBox.max.y / 2,
  //   pointCloud[0].position.z  );

  // 중심을 일치시키기 위해 이동 벡터를 계산합니다.
  // const offset = imageCenter.sub(pointCenter);
  // // 포인트 클라우드를 이미지의 위치로 이동시킵니다.
  // pointCloud[0].position.add(offset);
  // pointCloud[0].updateMatrixWorld();
};

export async function run360({ viewer, url, coord, pointcloud }) {
  const startTime = new Date().getTime();
  try {
    let potreeViewer = viewer;
    proj4.defs("WGS84", "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");

    proj4.defs("pointcloud", viewer.getProjection());
    let transform = proj4("WGS84", "pointcloud");

    let params = {
      transform,
    };
    // this file contains coordinates, orientation and filenames of the images:
    // http://5.9.65.151/mschuetz/potree/resources/pointclouds/helimap/360/Drive2_selection/coordinates.txt
    //Potree.Images360Loader.load("http://5.9.65.151/mschuetz/potree/resources/pointclouds/helimap/360/Drive2_selection/", viewer, params).then( images => {
    await new Promise((resolve, reject) => {
      Potree.Images360Loader.load(url, potreeViewer, params).then(
        async (images) => {
          images.sphere.userData = "panorama";
          potreeViewer.scene.add360Images(images);

          images.images.forEach((image360) => {
            alignImageWithPointCloud(image360, pointcloud, potreeViewer);
          });

          // console.log(images,pointcloud,)
          // let img = images.images[0];
          //   potreeViewer.scene.view.setView(
          //     [
          //       img.position[0],
          //       img.position[1],
          //       img.position[2] + 5000,
          //    ],
          //    [img.position[0], img.position[1], img.position[2]]
          //  );
          resolve(images);
        }
      );
    });
    // let second = await getDiffTime(startTime, new Date().getTime());
    // notificationService.notify(
    //   `파노라마데이터 호출 성공 및
    // 걸린시간 ${second}초`,
    //   NotiState.success
    // );

    // potreeViewer.mapView.showSources(false);
  } catch (e) {
    // let second = await getDiffTime(startTime, new Date().getTime());
    // notificationService.notify(
    //   `파노라마데이터 호출 실패 및
    // 걸린시간 ${second}초`,
    //   NotiState.error
    // );
    console.error(e);
  }
}
