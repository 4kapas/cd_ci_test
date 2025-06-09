export const pixPointCloudZinit = (url: string, pointcloud: any) => {
  let material = pointcloud.material;
  if (url.includes("Daegu-Dalseo-gu-Janggi-1-area")) {
    pointcloud.position.z = -5;
  } else if (url.includes("kwanggu")) {
    pointcloud.position.z = -37.9;
  } else if (url.includes("inchon01")) {
    pointcloud.position.z = -27.9;
  } else if (url.includes("dalseo")) {
    pointcloud.position.z = 0;
  } else if (url.includes("jeju")) {
    pointcloud.position.z = -90;
    material.activeAttributeName = "intensity gradient";
  }
};
