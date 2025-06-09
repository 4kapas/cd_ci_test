import { useCallback } from "react";

const useHandleAllZoomChange = (viewer: any) => {
  const handleAllZoomChange = useCallback(
    (area: string): void => {
      //   console.log(area, "areasss");
      let newValue: number | undefined = 3000;
      // area === "busan" ? 5000 : area === "daeguSangyeok" ? 3000 : 3000;
      switch (area) {
        case "baegil":
        case "mokposiDaesan":
        case "youngdo":
        case "baegil":
          newValue = 5000;
          break;
        case "yesangunGyechon":
        case "gwangju":
        case "daegySangyeok":
          newValue = 3000;
          break;
        case "daeguDalseoGu":
        case "daeguDalseongGun":
          newValue = 500;
      }
      // 포인트 클라우드와 바운딩 박스 확인
      const pointcloud = viewer.scene.pointclouds[0];
      console.log(viewer.scene.pointclouds[0], " viewer.scene.pointclouds[0]");
      let pointCenter = new THREE.Vector3(
        pointcloud.position.x + pointcloud.boundingBox.max.x / 2,
        pointcloud.position.y + pointcloud.boundingBox.max.y / 2,
        pointcloud.position.z
      );

      viewer.scene.view.setView(
        [pointCenter.x, pointCenter.y, pointCenter.z + newValue],
        [pointCenter.x, pointCenter.y + 1, pointCenter.z]
      );
    },
    [viewer]
  );

  return handleAllZoomChange;
};

export default useHandleAllZoomChange;
