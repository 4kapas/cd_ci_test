// import * as THREE from "../three.js/build/three.module.js";
import { Line2 } from "/public/Potree/libs/three.js/lines/Line2.js";
import { LineGeometry } from "/public/Potree/libs/three.js/lines/LineGeometry.js";
import { LineMaterial } from "/public/Potree/libs/three.js/lines/LineMaterial.js";

import { COORDS, HOST } from "./config.js";
import { SHP_JIMOKLIST } from "@/pages/service/const";
import { CONFIG } from "@/config/index.js";

const matLine = new LineMaterial({
  color: 0xff0000,
  linewidth: 3, // in pixels
  resolution: new THREE.Vector2(1000, 1000),
  dashed: false,
  depthTest: false, // 깊이 테스트 비활성화
  depthWrite: false, // 깊이 쓰기 비활성화
});

function calculatePolygonCentroid(coords) {
  if (!coords || coords.length < 6) {
    return { x: 0, y: 0, z: 0 }; // 꼭짓점이 2개 미만이면 중심 못 구함
  }

  let centroid = { x: 0, y: 0, z: 0 };
  let signedArea = 0;

  const len = coords.length;

  for (let i = 0; i < len; i += 3) {
    const x0 = coords[i];
    const y0 = coords[i + 1];
    const x1 = coords[(i + 3) % len]; // 마지막 -> 첫번째로 순환
    const y1 = coords[(i + 4) % len];

    const a = x0 * y1 - x1 * y0;
    signedArea += a;
    centroid.x += (x0 + x1) * a;
    centroid.y += (y0 + y1) * a;
  }

  if (signedArea === 0) {
    // 거의 일직선이거나, 넓이=0인 경우
    return { x: coords[0] || 0, y: coords[1] || 0, z: coords[2] || 0 };
  }

  signedArea *= 0.5;
  centroid.x /= 6 * signedArea;
  centroid.y /= 6 * signedArea;

  return centroid;
}

function createTextSprite(text, properties, geometry) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas 2D context is not supported");
  }

  // 기본 설정
  const fontSize = 20;
  const padding = 10;
  context.font = `${fontSize}px Arial`;

  // 텍스트 크기에 맞춰 캔버스 크기 설정
  const textWidth = context.measureText(text).width;
  canvas.width = textWidth + padding * 2;
  canvas.height = fontSize + padding * 2;

  // 다시 폰트 설정 (canvas 크기 변경 시 초기화됨)
  context.font = `${fontSize}px Arial`;
  context.textAlign = "center";
  context.textBaseline = "middle";

  // 배경 투명 (clearRect로 충분)
  context.clearRect(0, 0, canvas.width, canvas.height);

  // 텍스트 스타일
  context.fillStyle = "rgba(255, 255, 0, 1)"; // 노란색 글자
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  // 텍스처 생성
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  // 스프라이트 생성
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    alphaTest: 0.1,
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(4, 1.5, 1); // 더 명확하고 깔끔하게
  sprite.renderOrder = 999; // 다른 오브젝트 위에 항상 뜨도록
  sprite.userData = {
    text,
    properties,
    geometry,
    type: "areaPolygonSpriteText",
  };

  return sprite;
}
export class ShapeManager {
  constructor() {
    this.shapePath = `/shapes`;
    this.shapeNode = null;
    this.transform = null;
    this.customZ = 0;
    this.coords = COORDS;
    this.viewer = null;
  }

  init = async (viewer) => {
    try {
      if (this.shapeNode === null) {
        this.shapeNode = new THREE.Object3D();
        this.shapeNode.name = "Shapes";
        this.shapeNode.position.z += this.customZ;
        viewer.scene.scene.add(this.shapeNode);
      }
    } catch (e) {}
  };

  /**
   * shape 좌표계를 받아서 pointcloud좌표계로 변환하는 코드
   * shapeProjection => pointProjection
   * @param {*} shapeProjection
   */
  async setProj(shapeProjection, pointProjection) {
    // 고흥 TM shape 좌표계(중부원점) -> "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"
    // 영도 TM shape 좌표계(동부원점) -> "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"
    try {
      let shapeProj = shapeProjection ? shapeProjection : COORDS["EPSG:5186"];
      proj4.defs("shapes", shapeProj);

      proj4.defs("pointcloudShape", pointProjection);
      let transform = proj4("shapes", "pointcloudShape");
      this.transform = transform;
      return transform;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 정적으로 shape 로드할때 사용
   * @param {*} path
   * @param {*} color
   */
  async loadShapeFile({
    path,
    objPath,
    color,
    transform,
    shpName,
    shp,
    potreeViewer,
    visible = true,
  }) {
    try {
      const tree = $("#jstree_scene");
      const nodeName = shpName;
      const matLine = new LineMaterial({
        color,
        linewidth: 1,
        resolution: new THREE.Vector2(1000, 1000),
        dashed: false,
      });

      const features = await new Promise((resolve, reject) => {
        Potree.Utils.loadShapefileFeatures(
          CONFIG.HOST + path,
          CONFIG.HOST + objPath,
          resolve,
          (error) => reject(error)
        );
      });

      const nodeParent = new THREE.Object3D();
      nodeParent.name = nodeName;
      nodeParent.isShp = true;
      nodeParent.visible = visible;

      const shpId = `${nodeName}${shp}`;

      // jstree 작업 최소화 (1회 create_node만)
      tree?.jstree(true)?.create_node(
        "Shapes",
        {
          id: shpId,
          text: nodeName,
          object: nodeParent,
          data: nodeParent,
        },
        "last"
      );

      this.shapeNode.add(nodeParent);

      // feature들을 병렬로 처리
      const nodePromises = features.map((feature) =>
        this.featureToSceneNode(
          feature,
          color,
          transform,
          matLine,
          potreeViewer
        )
      );

      const nodes = await Promise.all(nodePromises);

      // 노드 한번에 추가
      for (const node of nodes) {
        if (node) nodeParent.add(node);
      }

      // 체크/언체크 대신, 최종 visible 상태에 맞춰 상태만 맞추고
      if (visible) {
        tree?.jstree(true)?.check_node(shpId);
      } else {
        tree?.jstree(true)?.uncheck_node(shpId);
      }

      // 필요하면 전체 리프레시 (너무 많으면 주의)
      // tree?.jstree(true)?.redraw(true);

      return features;
    } catch (error) {
      console.error("loadShapeFile error:", error);
      throw error;
    }
  }

  async featureToSceneNode(feature, color, transform, matLine, potreeViewer) {
    try {
      const geometry = feature.geometry;
      const props = feature.properties;
      const geoType = geometry.type;
      const coords = geometry.coordinates;
      const col = color || new THREE.Color(0, 0, 0);
      if (!transform) transform = { forward: (v) => v };

      // 유틸
      const getMinVector = () =>
        new THREE.Vector3(Infinity, Infinity, Infinity);
      const updateMin = (min, pos, alt = 0) => {
        min.x = Math.min(min.x, pos[0]);
        min.y = Math.min(min.y, pos[1]);
        min.z = Math.min(min.z, alt);
      };
      const adjustPosition = (coordArray, min, offsetZ = 0) => {
        for (let i = 0; i < coordArray.length; i += 3) {
          coordArray[i] -= min.x;
          coordArray[i + 1] -= min.y;
          coordArray[i + 2] -= min.z + offsetZ;
        }
      };

      if (geoType === "Point") {
        const [lon, lat] = coords;
        const pos = transform.forward([lon, lat]);
        const alt = coords[2] || 20;
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(4.5, 12, 12),
          new THREE.MeshNormalMaterial()
        );
        sphere.position.set(...pos, alt);
        sphere.scale.setScalar(0.5);
        return sphere;
      }

      if (geoType === "LineString") {
        const coordinates = [];
        const min = getMinVector();
        for (const [lon, lat] of coords) {
          const pos = transform.forward([lon, lat]);
          updateMin(min, pos, 20);
          coordinates.push(...pos, 20);
        }
        adjustPosition(coordinates, min, 6.82);

        const geom = new LineGeometry();
        geom.setPositions(coordinates);
        const line = new Line2(geom, matLine);
        line.computeLineDistances();
        line.position.copy(min);
        return line;
      }

      if (geoType === "LineStringZ") {
        const coordinates = [];
        const min = getMinVector();

        for (const [lon, lat, alt = 20] of coords) {
          const pos = transform.forward([lon, lat]);
          updateMin(min, pos, alt);
          coordinates.push(...pos, alt);
        }
        adjustPosition(coordinates, min);

        const geom = new LineGeometry();
        geom.setPositions(coordinates);
        const line = new Line2(geom, matLine);
        line.computeLineDistances();
        line.position.copy(min);
        return line;
      }

      if (geoType === "Polygon" || geoType === "MultiPolygonZ") {
        const coordinates = [];
        const vertices = [];
        const min = getMinVector();

        for (const poly of coords) {
          for (const [lon, lat, alt = 0] of poly) {
            const pos = transform.forward([lon, lat]);
            updateMin(min, pos, alt);
            vertices.push(new THREE.Vector3(...pos, alt));
            coordinates.push(...pos, alt);
          }
        }

        adjustPosition(coordinates, min);

        const shape = new THREE.Shape(
          vertices.slice(0, -1).map((v) => new THREE.Vector2(v.x, v.y))
        );
        const shapeGeom = new THREE.ShapeGeometry(shape);
        const meshMat = new THREE.MeshBasicMaterial({
          color: 0xffff00,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
          alphaTest: 1,
        });
        const mesh = new THREE.Mesh(shapeGeom, meshMat);
        mesh.position.z = min.z;
        mesh.userData = {
          geometry,
          properties: props,
          type: "areaPolygonMesh",
        };

        const lineGeom = new LineGeometry();
        lineGeom.setPositions(coordinates);
        const line = new Line2(lineGeom, matLine);
        line.computeLineDistances();
        line.position.copy(min);

        const centroid = calculatePolygonCentroid(coordinates);
        const sprite = createTextSprite(
          `${props.JIBUN ?? "미분류"} ${
            SHP_JIMOKLIST.find((d) => d.no === props.JIMOK)?.buho || ""
          }`,
          props,
          geometry
        );
        sprite.position.set(centroid.x, centroid.y, centroid.z);
        line.add(sprite);
        mesh.add(line);
        return mesh;
      }

      return false;
    } catch (e) {
      console.error("featureToSceneNode error:", e);
      throw e;
    }
  }

  async featureToSceneGeoJsonNode(
    feature,
    color = new THREE.Color(0, 0, 0),
    transform,
    matLine,
    potreeViewer
  ) {
    try {
      if (!feature?.geometry) return false;

      const geometry = feature.geometry;
      if (!transform) {
        transform = { forward: (v) => v };
      }

      if (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon") {
        return false;
      }

      const coordinates = [];
      const vertices = [];
      const min = new THREE.Vector3(Infinity, Infinity, Infinity);

      const polygons =
        geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.coordinates;

      for (const polygon of polygons) {
        for (const ring of polygon) {
          for (const [long, lat, altRaw = 20] of ring) {
            const [x, y] = transform.forward([long, lat]);
            const z = altRaw || 20;

            min.x = Math.min(min.x, x);
            min.y = Math.min(min.y, y);
            min.z = Math.min(min.z, z);

            vertices.push(new THREE.Vector3(x, y, z));
            coordinates.push(x, y, z);
          }
        }
      }

      // 중심점 기준으로 좌표 이동
      for (let i = 0; i < coordinates.length; i += 3) {
        coordinates[i] -= min.x;
        coordinates[i + 1] -= min.y;
        coordinates[i + 2] -= min.z + 6;
      }

      // shape geometry 생성
      const shape = new THREE.Shape(
        vertices.map((v) => new THREE.Vector2(v.x, v.y))
      );

      const shapeGeometry = new THREE.ShapeGeometry(shape);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0, // 투명 처리
        alphaTest: 1,
      });

      const polygonMesh = new THREE.Mesh(shapeGeometry, material);
      polygonMesh.position.z = min.z;
      polygonMesh.userData = {
        geometry: feature.geometry,
        properties: feature.properties,
      };

      // 라인 생성
      const lineGeometry = new LineGeometry();
      lineGeometry.setPositions(coordinates);
      const line = new Line2(lineGeometry, matLine);
      line.computeLineDistances();
      line.scale.set(1, 1, 1);
      line.position.copy(min);

      // 중심 좌표 계산 후 스프라이트 추가
      const centroid = calculatePolygonCentroid(coordinates);
      const sprite = createTextSprite(
        `${feature.properties.JIBUN ?? ""} ${
          SHP_JIMOKLIST.find((d) => d.no == feature.properties.JIMOK)?.buho ||
          "미분류"
        }`,
        feature.properties,
        feature.geometry
      );
      sprite.position.set(centroid.x, centroid.y, centroid.z - 5);

      line.add(sprite);
      polygonMesh.add(line);

      return polygonMesh;
    } catch (e) {
      console.error("Error in featureToSceneGeoJsonNode:", e);
      throw e;
    }
  }

  async featureEditToSceneNode(
    features,
    color = new THREE.Color(0, 0, 0),
    transform,
    matLine,
    potreeViewer,
    shpProperties,
    changeShapeZ
  ) {
    if (!transform) {
      transform = { forward: (v) => v };
    }

    const coords = shpProperties?.geometry?.coordinates?.[0];
    if (!coords || coords.length < 3) return;

    // 마지막 점과 첫 번째 점이 같으면 중복 제거
    const [firstX, firstY] = coords[0];
    const [lastX, lastY] = coords[coords.length - 1];
    const cleanCoords =
      firstX === lastX && firstY === lastY ? coords.slice(0, -1) : coords;

    const measure = new Potree.Measure("editMeasure", shpProperties);
    Object.assign(measure, {
      showDistances: false,
      showArea: true,
      closed: true,
      visible: true,
      name: `${shpProperties.properties.JIBUN} 좌표 정보`,
      isEditArea: true,
    });

    const vertices = [];
    const initPositions = [];

    for (const [x, y] of cleanCoords) {
      const [tx, ty] = transform.forward([x, y]);
      vertices.push(tx, ty, 0); // z=0
      const pos = new THREE.Vector3(tx, ty, 0);
      initPositions.push(pos);
      measure.addMarker(pos);
    }

    const indices = [];
    for (let i = 1; i < initPositions.length - 1; i++) {
      indices.push(0, i, i + 1);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );
    geometry.setIndex(indices);

    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });

    // Label 세팅
    measure.areaLabel.fontsize = 28;
    measure.edgeLabels.forEach((label) => (label.fontsize = 15));
    measure.userData = {
      jibun: shpProperties.properties.JIBUN,
      properties: { REGIAREA: shpProperties.properties.REGIAREA },
    };
    measure.initialPoints = JSON.parse(JSON.stringify(initPositions));

    // Measure와 Mesh 추가
    potreeViewer.scene.addMeasurement(measure);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { parentId: measure.uuid };

    potreeViewer.scene.scene.add(mesh);

    return {
      measure,
      features,
      transform,
    };
  }

  async loadToshpfeatures({
    path,
    color,
    transform,
    shpName,
    shp,
    potreeViewer,
    shpProperties,
    objPath,
    changeShapeZ,
  }) {
    const features = await new Promise((resolve, reject) => {
      Potree.Utils.loadShapefileFeatures(
        CONFIG.HOST + path,
        CONFIG.HOST + objPath,
        resolve,
        (error) => {
          console.error("Error loading shapefile features:", error);
          reject(error);
        }
      );
    });
    let node = await this.featureEditToSceneNode(
      features,
      color,
      transform,
      matLine,
      potreeViewer,
      shpProperties,
      changeShapeZ
    );
    return node;
  }
}
