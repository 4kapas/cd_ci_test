//@ts-nocheck

import * as THREE from "/public/Potree/libs/three.js/build/three.module.js";
import { GeoJSONExporter } from "/public/Potree/src/exporter/GeoJSONExporter.js";
import { DXFExporter } from "/public/Potree/src/exporter/DXFExporter.js";
import { Volume, SphereVolume } from "/public/Potree/src/utils/Volume.js";
import { PolygonClipVolume } from "/public/Potree/src/utils/PolygonClipVolume.js";
import { PropertiesPanel } from "/public/Potree/src/viewer/PropertyPanels/PropertiesPanel.js";
import { PointCloudTree } from "/public/Potree/src/PointCloudTree.js";
import { Profile } from "/public/Potree/src/utils/Profile.js";
import { Measure } from "/public/Potree/src/utils/Measure.js";
import { Annotation } from "/public/Potree/src/Annotation.js";
import {
  CameraMode,
  ClipTask,
  ClipMethod,
} from "/public/Potree/src/defines.js";
import { ScreenBoxSelectTool } from "/public/Potree/src/utils/ScreenBoxSelectTool.js";
import { Utils } from "/public/Potree/src/utils.js";
import { CameraAnimation } from "/public/Potree/src/modules/CameraAnimation/CameraAnimation.js";
import { HierarchicalSlider } from "/public/Potree/src/viewer/HierarchicalSlider.js";
import { OrientedImage } from "/public/Potree/src/modules/OrientedImages/OrientedImages.js";
import { Images360 } from "/public/Potree/src/modules/Images360/Images360.js";

import JSON5 from "/public/Potree/libs/json5-2.1.3/json5.mjs";

//icon image
import { menuImage } from "@/consts/image.ts";
import { usePotreeStore } from "@/store/usePotreeStore";

const measureTools = [
  { name: "각도 측정" },
  { name: "포인트 측정" },
  { name: "거리 측정" },
  { name: "높이 측정" },
  { name: "circle" },
  { name: "azimuth" },
  { name: "area" },
  { name: "volume" },
  { name: "sphere_volume" },
  { name: "profile" },
  { name: "annotation" },
  { name: "removeAll" },
];

export class SideBarService {
  viewer;
  measuringTool;
  profileTool;
  volumeTool;
  constructor(viewer: any) {
    this.viewer = viewer;
    this.measuringTool = viewer.measuringTool;
    this.profileTool = viewer.profileTool;
    this.volumeTool = viewer.volumeTool;
  }

  init = () => {
    console.group("== SideBarService ==");
    console.log("measuringTool", this.measuringTool);
    console.log("volumeTool", this.volumeTool);
    console.groupEnd();
  };

  getTools = async (setMeasurements, setAnnotationTool) => {
    try {
      let measureTools = [
        {
          name: "각도 측정",
          callBack: () => {
            $("#menu_measurements").next().slideDown();
            let measurement = this.measuringTool.startInsertion({
              showDistances: false,
              showAngles: true,
              showArea: false,
              closed: true,
              maxMarkers: 3,
              name: "Angle",
            });

            let measurementsRoot = $("#jstree_scene")
              .jstree()
              .get_json("measurements");
            let jsonNode = measurementsRoot.children.find(
              (child) => child.data.uuid === measurement.uuid
            );
            $.jstree.reference(jsonNode.id).deselect_all();
            $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
          },
          icon: menuImage.iconAngle,
        },
        {
          name: "포인트 측정",
          callBack: () => {
            $("#menu_measurements").next().slideDown();
            let measurement = this.measuringTool.startInsertion({
              showDistances: true,
              showAngles: true,
              showCoordinates: true,
              showArea: true,
              closed: true,
              maxMarkers: 1,
              name: "Point",
            });

            let measurementsRoot = $("#jstree_scene")
              .jstree()
              .get_json("measurements");
            let jsonNode = measurementsRoot.children.find(
              (child) => child.data.uuid === measurement.uuid
            );
            $.jstree.reference(jsonNode.id).deselect_all();
            $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
          },
          icon: menuImage.iconPoint,
        },
        {
          name: "거리 측정",
          callBack: () => {
            $("#menu_measurements").next().slideDown();
            let measurement = this.measuringTool.startInsertion({
              showDistances: true,
              showArea: false,
              closed: false,
              name: "Distance",
            });

            let measurementsRoot = $("#jstree_scene")
              .jstree()
              .get_json("measurements");
            let jsonNode = measurementsRoot.children.find(
              (child) => child.data.uuid === measurement.uuid
            );
            $.jstree.reference(jsonNode.id).deselect_all();
            $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
          },
          icon: menuImage.iconDistance,
        },
        {
          name: "높이 측정",
          callBack: () => {
            $("#menu_measurements").next().slideDown();
            let measurement = this.measuringTool.startInsertion({
              showDistances: false,
              showHeight: true,
              showArea: false,
              closed: false,
              maxMarkers: 2,
              name: "Height",
            });

            let measurementsRoot = $("#jstree_scene")
              .jstree()
              .get_json("measurements");
            let jsonNode = measurementsRoot.children.find(
              (child) => child.data.uuid === measurement.uuid
            );
            $.jstree.reference(jsonNode.id).deselect_all();
            $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
          },
          icon: menuImage.iconHeight,
        },
        {
          name: "영역 측정",
          callBack: () => {
            $("#menu_measurements").next().slideDown();
            let measurement = this.measuringTool.startInsertion({
              showDistances: true,
              showArea: true,
              closed: true,
              name: "Area",
            });

            let measurementsRoot = $("#jstree_scene")
              .jstree()
              .get_json("measurements");
            let jsonNode = measurementsRoot.children.find(
              (child) => child.data.uuid === measurement.uuid
            );
            $.jstree.reference(jsonNode.id).deselect_all();
            $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
          },
          icon: menuImage.iconArea,
        },
        {
          name: "평면 측정",
          callBack: () => {
            let volume = this.volumeTool.startInsertion({
              type: "SphereVolume",
              name: "volume",
            });
            let measurementsRoot = $("#jstree_scene")
              .jstree()
              .get_json("measurements");
            let jsonNode = measurementsRoot.children.find(
              (child) => child.data.uuid === volume.uuid
            );

            $.jstree.reference(jsonNode.id).deselect_all();
            $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
          },
          icon: menuImage.iconPlan,
        },
        {
          name: "어노테이션",
          callBack: () => {
            $("#menu_measurements").next().slideDown();
            let annotation = this.viewer.annotationTool.startInsertion({
              showDistances: true,
              showArea: true,
              closed: true,
              name: "Annotations",
            });

            let annotationsRoot = $("#jstree_scene")
              .jstree()
              .get_json("annotations");
            let jsonNode = annotationsRoot.children.find(
              (child) => child.data.uuid === annotation.uuid
            );
            $.jstree.reference(jsonNode.id).deselect_all();
            $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
          },
          icon: menuImage.iconAnnotation,
        },
        {
          name: "전체 삭제",
          callBack: () => {
            // this.viewer.annotationTool.viewer.visibleAnnotations = [];
            let tree = $("#jstree_scene");
            let annotationsRoot = $("#jstree_scene")
              .jstree()
              .get_json("annotations");
            tree.jstree("delete_node", annotationsRoot.children);

            for (let annotations of annotationsRoot.children) {
              this.viewer.annotationTool.viewer.visibleAnnotations = [];

              annotations.data.domElement.remove();
            }

            this.viewer.scene.removeAllMeasurements();

            let areaMeah = this.viewer.scene.scene.children
              .filter((child) => child.userData.prentId)
              .map((el) => el);

            areaMeah.forEach((el) => {
              this.viewer.scene.scene.remove(el);
            });

            setMeasurements([]);
            setAnnotationTool([]);
            usePotreeStore.getState().shpProperTires(undefined);
            usePotreeStore.getState().setSaveMode(false);
          },
          icon: menuImage.iconMenuDelete,
        },
      ];
      return measureTools;
    } catch (e) {
      throw e;
    }
  };

  getClippingTools = async (setVolumeTool, potreeViewer) => {
    try {
      let clippingTools = [
        {
          name: "볼륨 클리핑",
          callBack: () => {
            let item = this.volumeTool.startInsertion({
              showDistances: true,
              showArea: true,
              closed: true,
              name: "volume",
            });
            let measurementsRoot = $("#jstree_scene")
              .jstree()
              .get_json("measurements");
            let jsonNode = measurementsRoot.children.find(
              (child) => child.data.uuid === item.uuid
            );

            $.jstree.reference(jsonNode.id).deselect_all();
            $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
          },
          icon: menuImage.iconVolumeClipping,
        },
        {
          name: "영역 클리핑",
          callBack: () => {
            let item = this.viewer.clippingTool.startInsertion({
              type: "polygon",
            });

            let measurementsRoot = $("#jstree_scene")
              .jstree()
              .get_json("measurements");
            let jsonNode = measurementsRoot.children.find(
              (child) => child.data.uuid === item.uuid
            );
            $.jstree.reference(jsonNode.id).deselect_all();
            $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
          },
          icon: menuImage.iconAngle,
        },
        {
          name: "전체 클리핑",
          callBack: () => {
            potreeViewer.scene.cameraMode = 1;

            for (let pointcloud of potreeViewer.scene.pointclouds) {
              pointcloud.material.useOrthographicCamera = true;
              console.log(pointcloud.material.useOrthographicCamera);
            }

            let boxSelectTool = new ScreenBoxSelectTool(potreeViewer);
            // if (
            //   !(
            //     this.viewer.scene.getActiveCamera() instanceof
            //     THREE.OrthographicCamera
            //   )
            // ) {
            //   this.viewer.postMessage(
            //     `Switch to Orthographic Camera Mode before using the Screen-Box-Select tool.`,
            //     { duration: 2000 }
            //   );
            //   return;
            // }
            let item = boxSelectTool.startInsertion(potreeViewer);
            let measurementsRoot = $("#jstree_scene")
              .jstree()
              .get_json("measurements");
            let jsonNode = measurementsRoot.children.find(
              (child) => child.data.uuid === item.uuid
            );
            $.jstree.reference(jsonNode.id).deselect_all();
            $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
          },
          icon: menuImage.iconFullClipping,
        },
        {
          name: "전체 삭제",
          callBack: () => {
            this.viewer.scene.removeAllVolumes();
            this.viewer.scene.removeAllClipVolumes();
            setVolumeTool([]);
          },
          icon: menuImage.iconMenuDelete,
        },
      ];
      return clippingTools;
    } catch (e) {
      throw e;
    }
  };

  initScene() {
    console.group("initScene");
    let elScene = $("#menu_scene");
    console.log("elScene?", elScene);
    // let elObjects = elScene.next().find("#scene_objects");
    let elObjects = $("#scene_objects");
    console.log("elObjects", elObjects);
    let elProperties = elScene.next().find("#scene_object_properties");

    {
      let elExport = elScene.next().find("#scene_export");

      let geoJSONIcon = `${Potree.resourcePath}/icons/file_geojson.svg`;
      let dxfIcon = `${Potree.resourcePath}/icons/file_dxf.svg`;
      let potreeIcon = `${Potree.resourcePath}/icons/file_potree.svg`;

      elExport.append(`
				Export: <br>
				<a href="#" download="measure.json"><img name="geojson_export_button" src="${geoJSONIcon}" class="button-icon" style="height: 24px" /></a>
				<a href="#" download="measure.dxf"><img name="dxf_export_button" src="${dxfIcon}" class="button-icon" style="height: 24px" /></a>
				<a href="#" download="potree.json5"><img name="potree_export_button" src="${potreeIcon}" class="button-icon" style="height: 24px" /></a>
			`);

      let elDownloadJSON = elExport
        .find("img[name=geojson_export_button]")
        .parent();
      elDownloadJSON.click((event) => {
        let scene = this.viewer.scene;
        let measurements = [
          ...scene.measurements,
          ...scene.profiles,
          ...scene.volumes,
        ];

        if (measurements.length > 0) {
          let geoJson = GeoJSONExporter.toString(measurements);

          let url = window.URL.createObjectURL(
            new Blob([geoJson], { type: "data:application/octet-stream" })
          );
          elDownloadJSON.attr("href", url);
        } else {
          this.viewer.postError("no measurements to export");
          event.preventDefault();
        }
      });

      let elDownloadDXF = elExport.find("img[name=dxf_export_button]").parent();
      elDownloadDXF.click((event) => {
        let scene = this.viewer.scene;
        let measurements = [
          ...scene.measurements,
          ...scene.profiles,
          ...scene.volumes,
        ];

        if (measurements.length > 0) {
          let dxf = DXFExporter.toString(measurements);

          let url = window.URL.createObjectURL(
            new Blob([dxf], { type: "data:application/octet-stream" })
          );
          elDownloadDXF.attr("href", url);
        } else {
          this.viewer.postError("no measurements to export");
          event.preventDefault();
        }
      });

      let elDownloadPotree = elExport
        .find("img[name=potree_export_button]")
        .parent();
      elDownloadPotree.click((event) => {
        let data = Potree.saveProject(this.viewer);
        let dataString = JSON5.stringify(data, null, "\t");

        let url = window.URL.createObjectURL(
          new Blob([dataString], { type: "data:application/octet-stream" })
        );
        elDownloadPotree.attr("href", url);
      });
    }

    let propertiesPanel = new PropertiesPanel(elProperties, this.viewer);
    propertiesPanel.setScene(this.viewer.scene);

    localStorage.removeItem("jstree");

    let tree = $(`<div id="jstree_scene"></div>`);
    elObjects.append(tree);

    tree.jstree({
      plugins: ["checkbox", "state"],
      core: {
        dblclick_toggle: false,
        state: {
          checked: true,
        },
        check_callBack: true,
        expand_selected_onload: true,
      },
      checkbox: {
        keep_selected_style: true,
        three_state: false,
        whole_node: false,
        tie_selection: false,
      },
    });

    let createNode = (parent, text, icon, object) => {
      let nodeID = tree.jstree(
        "create_node",
        parent,
        {
          text: text,
          icon: icon,
          data: object,
        },
        "last",
        false,
        false
      );

      if (object.visible) {
        tree.jstree("check_node", nodeID);
      } else {
        tree.jstree("uncheck_node", nodeID);
      }

      return nodeID;
    };

    let pcID = tree.jstree(
      "create_node",
      "#",
      { text: "<b>포인트 클라우드</b>", id: "pointclouds" },
      "last",
      false,
      false
    );
    let measurementID = tree.jstree(
      "create_node",
      "#",
      { text: "<b>측정</b>", id: "measurements" },
      "last",
      false,
      false
    );
    let annotationsID = tree.jstree(
      "create_node",
      "#",
      { text: "<b>어노테이션</b>", id: "annotations" },
      "last",
      false,
      false
    );
    let shapeID = tree.jstree(
      "create_node",
      "#",
      { text: "<b>지적도</b>", id: "Shapes" },
      "last",
      false,
      false
    );
    let otherID = tree.jstree(
      "create_node",
      "#",
      { text: "<b>Other</b>", id: "other" },
      "last",
      false,
      false
    );
    let vectorsID = tree.jstree(
      "create_node",
      "#",
      { text: "<b>Vectors</b>", id: "vectors" },
      "last",
      false,
      false
    );
    let imagesID = tree.jstree(
      "create_node",
      "#",
      { text: "<b>파노라마</b>", id: "images" },
      "last",
      false,
      false
    );

    tree.jstree("check_node", pcID);
    tree.jstree("check_node", measurementID);
    tree.jstree("check_node", annotationsID);
    tree.jstree("check_node", otherID);
    tree.jstree("check_node", vectorsID);
    tree.jstree("check_node", imagesID);

    //Dorosee Custom
    tree.jstree("check_node", shapeID);

    tree.on("create_node.jstree", (e, data) => {
      tree.jstree("open_all");
    });

    tree.on("select_node.jstree", (e, data) => {
      console.log(data, "select_node");
      let object = data.node.data;
      propertiesPanel.set(object);
      console.log(data, "select_node");
      this.viewer.inputHandler.deselectAll();

      if (object instanceof Volume) {
        this.viewer.inputHandler.toggleSelection(object);
      }

      $(this.viewer.renderer.domElement).focus();
    });

    tree.on("deselect_node.jstree", (e, data) => {
      propertiesPanel.set(null);
    });

    tree.on("delete_node.jstree", (e, data) => {
      propertiesPanel.set(null);
    });

    tree.on("dblclick", ".jstree-anchor", (e) => {
      let instance = $.jstree.reference(e.target);
      let node = instance.get_node(e.target);
      let object = node.data;

      // ignore double click on checkbox
      if (e.target.classList.contains("jstree-checkbox")) {
        return;
      }
      console.log("object뭐야", object);
      if (object instanceof PointCloudTree) {
        console.log("PC로옴?");
        let box = this.viewer.getBoundingBox([object]);
        let node = new THREE.Object3D();
        node.boundingBox = box;
        this.viewer.zoomTo(node, 1, 500);
      } else if (object instanceof Measure) {
        let points = object.points.map((p) => p.position);
        console.log(points, "pointers");
        let box = new THREE.Box3().setFromPoints(points);
        if (box.getSize(new THREE.Vector3()).length() > 0) {
          let node = new THREE.Object3D();
          node.boundingBox = box;
          this.viewer.zoomTo(node, 2, 500);
        }
      } else if (object instanceof Profile) {
        let points = object.points;
        let box = new THREE.Box3().setFromPoints(points);
        if (box.getSize(new THREE.Vector3()).length() > 0) {
          let node = new THREE.Object3D();
          node.boundingBox = box;
          this.viewer.zoomTo(node, 1, 500);
        }
      } else if (object instanceof Volume) {
        let box = object.boundingBox.clone().applyMatrix4(object.matrixWorld);

        if (box.getSize(new THREE.Vector3()).length() > 0) {
          let node = new THREE.Object3D();
          node.boundingBox = box;
          this.viewer.zoomTo(node, 1, 500);
        }
      } else if (object instanceof Annotation) {
        object.moveHere(this.viewer.scene.getActiveCamera());
      } else if (object instanceof PolygonClipVolume) {
        let dir = object.camera.getWorldDirection(new THREE.Vector3());
        let target;

        if (object.camera instanceof THREE.OrthographicCamera) {
          dir.multiplyScalar(object.camera.right);
          target = new THREE.Vector3().addVectors(object.camera.position, dir);
          this.viewer.setCameraMode(CameraMode.ORTHOGRAPHIC);
        } else if (object.camera instanceof THREE.PerspectiveCamera) {
          dir.multiplyScalar(this.viewer.scene.view.radius);
          target = new THREE.Vector3().addVectors(object.camera.position, dir);
          this.viewer.setCameraMode(CameraMode.PERSPECTIVE);
        }

        this.viewer.scene.view.position.copy(object.camera.position);
        this.viewer.scene.view.lookAt(target);
      } else if (object.type === "SpotLight") {
        let distance = object.distance > 0 ? object.distance / 4 : 5 * 1000;
        let position = object.position;
        let target = new THREE.Vector3().addVectors(
          position,
          object.getWorldDirection(new THREE.Vector3()).multiplyScalar(distance)
        );

        this.viewer.scene.view.position.copy(object.position);
        this.viewer.scene.view.lookAt(target);
      } else if (object instanceof THREE.Object3D) {
        let box = new THREE.Box3().setFromObject(object);

        if (box.getSize(new THREE.Vector3()).length() > 0) {
          let node = new THREE.Object3D();
          node.boundingBox = box;
          this.viewer.zoomTo(node, 1, 500);
        }
      } else if (object instanceof OrientedImage) {
        // TODO zoom to images
        // let box = new THREE.Box3().setFromObject(object);
        // if(box.getSize(new THREE.Vector3()).length() > 0){
        // 	let node = new THREE.Object3D();
        // 	node.boundingBox = box;
        // 	this.viewer.zoomTo(node, 1, 500);
        // }
      }
      // else if (object instanceof Images360) {
      // 	// TODO
      // } else if (object instanceof Geopackage) {
      // 	// TODO
      // }
    });

    tree.on("uncheck_node.jstree", (e, data) => {
      let object = data.node.data;

      if (object) {
        object.visible = false;
      }
    });

    tree.on("check_node.jstree", (e, data) => {
      let object = data.node.data;

      if (object) {
        object.visible = true;
      }
    });

    let onPointCloudAdded = (e) => {
      let pointcloud = e.pointcloud;
      let cloudIcon = `${Potree.resourcePath}/icons/cloud.svg`;
      let node = createNode(pcID, pointcloud.name, cloudIcon, pointcloud);

      pointcloud.addEventListener("visibility_changed", () => {
        if (pointcloud.visible) {
          tree.jstree("check_node", node);
        } else {
          tree.jstree("uncheck_node", node);
        }
      });
    };

    let onMeasurementAdded = (e) => {
      let measurement = e.measurement;
      console.log(measurement, "onmaddmeasurement");
      let icon = Utils.getMeasurementIcon(measurement);
      let cloudIcon = `${Potree.resourcePath}/icons/cloud.svg`;
      createNode(measurementID, measurement.name, cloudIcon, measurement);
    };

    let onVolumeAdded = (e) => {
      let volume = e.volume;
      let icon = Utils.getMeasurementIcon(volume);
      let node = createNode(measurementID, volume.name, icon, volume);

      volume.addEventListener("visibility_changed", () => {
        if (volume.visible) {
          tree.jstree("check_node", node);
        } else {
          tree.jstree("uncheck_node", node);
        }
      });
    };

    let onProfileAdded = (e) => {
      let profile = e.profile;
      let icon = Utils.getMeasurementIcon(profile);
      createNode(measurementID, profile.name, icon, profile);
    };

    let onAnnotationAdded = (e) => {
      let annotation = e.annotation;

      let annotationIcon = `${Potree.resourcePath}/icons/annotation.svg`;
      let parentID = this.annotationMapping.get(annotation.parent);
      let annotationID = createNode(
        parentID,
        annotation.title,
        annotationIcon,
        annotation
      );
      this.annotationMapping.set(annotation, annotationID);

      annotation.addEventListener("annotation_changed", (e) => {
        let annotationsRoot = $("#jstree_scene")
          .jstree()
          .get_json("annotations");
        let jsonNode = annotationsRoot.children.find(
          (child) => child.data.uuid === annotation.uuid
        );

        $.jstree
          .reference(jsonNode.id)
          .rename_node(jsonNode.id, annotation.title);
      });
    };

    let onCameraAnimationAdded = (e) => {
      const animation = e.animation;

      const animationIcon = `${Potree.resourcePath}/icons/camera_animation.svg`;
      createNode(otherID, "animation", animationIcon, animation);
    };

    let onOrientedImagesAdded = (e) => {
      const images = e.images;

      const imagesIcon = `${Potree.resourcePath}/icons/picture.svg`;
      const node = createNode(imagesID, "images", imagesIcon, images);

      images.addEventListener("visibility_changed", () => {
        if (images.visible) {
          tree.jstree("check_node", node);
        } else {
          tree.jstree("uncheck_node", node);
        }
      });
    };

    let onImages360Added = (e) => {
      const images = e.images;

      const imagesIcon = `${Potree.resourcePath}/icons/picture.svg`;
      const node = createNode(imagesID, "360° images", imagesIcon, images);

      images.addEventListener("visibility_changed", () => {
        if (images.visible) {
          tree.jstree("check_node", node);
        } else {
          tree.jstree("uncheck_node", node);
        }
      });
    };

    const onGeopackageAdded = (e) => {
      const geopackage = e.geopackage;

      const geopackageIcon = `${Potree.resourcePath}/icons/triangle.svg`;
      const tree = $(`#jstree_scene`);
      const parentNode = "vectors";

      for (const layer of geopackage.node.children) {
        const name = layer.name;

        let shpPointsID = tree.jstree(
          "create_node",
          parentNode,
          {
            text: name,
            icon: geopackageIcon,
            object: layer,
            data: layer,
          },
          "last",
          false,
          false
        );
        tree.jstree(layer.visible ? "check_node" : "uncheck_node", shpPointsID);
      }
    };

    this.viewer.scene.addEventListener("pointcloud_added", onPointCloudAdded);
    this.viewer.scene.addEventListener("measurement_added", onMeasurementAdded);
    this.viewer.scene.addEventListener("profile_added", onProfileAdded);
    this.viewer.scene.addEventListener("volume_added", onVolumeAdded);
    this.viewer.scene.addEventListener(
      "camera_animation_added",
      onCameraAnimationAdded
    );
    this.viewer.scene.addEventListener(
      "oriented_images_added",
      onOrientedImagesAdded
    );
    this.viewer.scene.addEventListener("360_images_added", onImages360Added);
    this.viewer.scene.addEventListener("geopackage_added", onGeopackageAdded);
    this.viewer.scene.addEventListener(
      "polygon_clip_volume_added",
      onVolumeAdded
    );
    this.viewer.scene.annotations.addEventListener(
      "annotation_added",
      onAnnotationAdded
    );

    let onMeasurementRemoved = (e) => {
      let measurementsRoot = $("#jstree_scene")
        .jstree()
        .get_json("measurements");

      let jsonNode = measurementsRoot.children.find(
        (child) => child.data.uuid === e.measurement.uuid
      );

      tree.jstree("delete_node", jsonNode.id);
    };

    let onVolumeRemoved = (e) => {
      let measurementsRoot = $("#jstree_scene")
        .jstree()
        .get_json("measurements");
      let jsonNode = measurementsRoot.children.find(
        (child) => child.data.uuid === e.volume.uuid
      );

      tree.jstree("delete_node", jsonNode.id);
    };

    let onPolygonClipVolumeRemoved = (e) => {
      let measurementsRoot = $("#jstree_scene")
        .jstree()
        .get_json("measurements");
      let jsonNode = measurementsRoot.children.find(
        (child) => child.data.uuid === e.volume.uuid
      );

      tree.jstree("delete_node", jsonNode.id);
    };

    let onProfileRemoved = (e) => {
      let measurementsRoot = $("#jstree_scene")
        .jstree()
        .get_json("measurements");
      let jsonNode = measurementsRoot.children.find(
        (child) => child.data.uuid === e.profile.uuid
      );

      tree.jstree("delete_node", jsonNode.id);
    };

    this.viewer.scene.addEventListener(
      "measurement_removed",
      onMeasurementRemoved
    );
    this.viewer.scene.addEventListener("volume_removed", onVolumeRemoved);
    this.viewer.scene.addEventListener(
      "polygon_clip_volume_removed",
      onPolygonClipVolumeRemoved
    );
    this.viewer.scene.addEventListener("profile_removed", onProfileRemoved);

    {
      let annotationIcon = `${Potree.resourcePath}/icons/annotation.svg`;
      this.annotationMapping = new Map();
      this.annotationMapping.set(this.viewer.scene.annotations, annotationsID);
      this.viewer.scene.annotations.traverseDescendants((annotation) => {
        let parentID = this.annotationMapping.get(annotation.parent);
        let annotationID = createNode(
          parentID,
          annotation.title,
          annotationIcon,
          annotation
        );
        this.annotationMapping.set(annotation, annotationID);
      });
    }

    const scene = this.viewer.scene;
    for (let pointcloud of scene.pointclouds) {
      onPointCloudAdded({ pointcloud: pointcloud });
    }

    for (let measurement of scene.measurements) {
      onMeasurementAdded({ measurement: measurement });
    }

    for (let volume of [...scene.volumes, ...scene.polygonClipVolumes]) {
      onVolumeAdded({ volume: volume });
    }

    for (let animation of scene.cameraAnimations) {
      onCameraAnimationAdded({ animation: animation });
    }

    for (let images of scene.orientedImages) {
      onOrientedImagesAdded({ images: images });
    }

    for (let images of scene.images360) {
      onImages360Added({ images: images });
    }

    for (const geopackage of scene.geopackages) {
      onGeopackageAdded({ geopackage: geopackage });
    }

    for (let profile of scene.profiles) {
      onProfileAdded({ profile: profile });
    }

    {
      createNode(otherID, "Camera", null, new THREE.Camera());
    }

    this.viewer.addEventListener("scene_changed", (e) => {
      propertiesPanel.setScene(e.scene);

      e.oldScene.removeEventListener("pointcloud_added", onPointCloudAdded);
      e.oldScene.removeEventListener("measurement_added", onMeasurementAdded);
      e.oldScene.removeEventListener("profile_added", onProfileAdded);
      e.oldScene.removeEventListener("volume_added", onVolumeAdded);
      e.oldScene.removeEventListener(
        "polygon_clip_volume_added",
        onVolumeAdded
      );
      e.oldScene.removeEventListener(
        "measurement_removed",
        onMeasurementRemoved
      );

      e.scene.addEventListener("pointcloud_added", onPointCloudAdded);
      e.scene.addEventListener("measurement_added", onMeasurementAdded);
      e.scene.addEventListener("profile_added", onProfileAdded);
      e.scene.addEventListener("volume_added", onVolumeAdded);
      e.scene.addEventListener("polygon_clip_volume_added", onVolumeAdded);
      e.scene.addEventListener("measurement_removed", onMeasurementRemoved);
    });
    console.groupEnd();
  }
  getSence = async (viewer, number) => {
    let data = Potree.saveProject(viewer, number);
    let dataString = JSON5.stringify(data, null, "\t");
    if (dataString) {
      return dataString;
    }
  };
}
