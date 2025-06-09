import * as THREE from "../three.js/build/three.module.js";

class TerrainManager {
  constructor() {}

  async createGround() {
    const groundGeo = new THREE.PlangeGeometry(1000, 1000);

    let disMap = new THREE.TextureLoader().load(
      `../../resources/dorosee/pngbin/goheung.png`
    );

    disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
    disMap.repeat.set(100, 100);

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      wireframe: true,
      displacementMap: disMap,
      displacementScale: 100,
    });
  }

  groundMEsh = new THREE.Mesh(groundGeo, groundMat);
  //   potreeViewer.volumeTool.scene.add(groundMesh);
}
