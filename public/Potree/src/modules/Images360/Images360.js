import * as THREE from "../../../libs/three.js/build/three.module.js";
import { EventDispatcher } from "../../EventDispatcher.js";
import { TextSprite } from "../../TextSprite.js";

let sg = new THREE.SphereGeometry(1, 8, 8);
let sgHigh = new THREE.SphereGeometry(1, 128, 128);

let sm = new THREE.MeshBasicMaterial({ side: THREE.BackSide });
let smHovered = new THREE.MeshBasicMaterial({
  side: THREE.BackSide,
  color: 0xff0000,
});

let raycaster = new THREE.Raycaster();
let currentlyHovered = null;

class Image360 {
  constructor(file, time, longitude, latitude, altitude, course, pitch, roll) {
    this.file = file;
    this.time = time;
    this.longitude = longitude;
    this.latitude = latitude;
    this.altitude = altitude;
    this.course = course;
    this.pitch = pitch;
    this.roll = roll;
    this.mesh = null;
  }
}

export class Images360 extends EventDispatcher {
  constructor(viewer) {
    super();

    this.viewer = viewer;

    this.selectingEnabled = true;

    this.images = [];
    this.node = new THREE.Object3D();

    this.sphere = new THREE.Mesh(sgHigh, sm);
    this.sphere.visible = false;
    this.sphere.scale.set(1000, 1000, 1000);
    this.node.add(this.sphere);
    this._visible = true;
    // this.node.add(label);

    this.focusedImage = null;

    this.previousView = {
      controls: this.viewer.controls,
      position: this.viewer.scene.view.position.clone(),
      target: this.viewer.scene.view.getPivot(),
    };

    let elUnfocus = document.createElement("input");
    elUnfocus.type = "button";
    // elUnfocus.value = "unfocus";
    elUnfocus.style.position = "fixed";
    elUnfocus.style.display = "none";
    elUnfocus.style.right = "20px";
    elUnfocus.style.top = "103px";
    elUnfocus.style.zIndex = "10000";
    elUnfocus.style.width = "48px";
    elUnfocus.style.height = "48px";
    elUnfocus.style.borderRadius = "4px";
    elUnfocus.style.border = "1px solid #DFE2E7";
    elUnfocus.style.background = "#2F323799";
    elUnfocus.className = "unfocus-button";
    // C:\Users\kofho\OneDrive\바탕 화면\everyspaces\POTREE_REACT_VITE\src\assets\icon\icon_panorama.svg
    // elUnfocus.style.fontSize = "2em";
    elUnfocus.addEventListener("click", () => this.exits());
    this.elUnfocus = elUnfocus;

    this.domRoot = viewer.renderer.domElement.parentElement;
    this.domRoot.appendChild(elUnfocus);
    this.elUnfocus.style.display = "none";

    // 이전 이미지 버튼 생성
    let prevButton = document.createElement("button");
    // prevButton.innerText = "<";
    prevButton.style.position = "fixed";
    prevButton.style.display = "none";
    prevButton.style.right = "20px";
    prevButton.style.zIndex = "10000";
    prevButton.style.fontSize = "4em";
    prevButton.className = "go-button";
    prevButton.addEventListener("click", () => this.moveFocus(-1));
    this.domRoot.appendChild(prevButton);
    this.prevButton = prevButton;

    // 다음 이미지 버튼 생성
    let nextButton = document.createElement("button");
    // nextButton.innerText = ">";
    nextButton.style.position = "fixed";
    nextButton.style.display = "none";
    nextButton.style.right = "20px";
    nextButton.style.zIndex = "10000";
    nextButton.style.fontSize = "4em";
    nextButton.className = "back-button";
    nextButton.addEventListener("click", () => this.moveFocus(1));
    this.domRoot.appendChild(nextButton);
    this.nextButton = nextButton;

    viewer.addEventListener("update", () => {
      this.update(viewer);
    });
    viewer.inputHandler.addInputListener(this);

    this.addEventListener("mousedown", () => {
      if (currentlyHovered && currentlyHovered.image360) {
        this.focus(currentlyHovered.image360);
      }
    });
  }

  set visible(visible) {
    if (this._visible === visible) {
      return;
    }

    for (const image of this.images) {
      image.mesh.visible = visible && this.focusedImage == null;
    }

    this.sphere.visible = visible && this.focusedImage != null;
    this._visible = visible;
    this.dispatchEvent({
      type: "visibility_changed",
      images: this,
    });
  }

  get visible() {
    return this._visible;
  }
  moveFocus(direction) {
    // 현재 포커스된 이미지의 인덱스를 찾습니다.
    const currentIndex = this.images.findIndex(
      (img) => img === this.focusedImage
    );
    if (currentIndex === -1) return; // 포커스된 이미지가 없는 경우 아무것도 하지 않음

    // 새 인덱스 계산: 방향에 따라 이전 또는 다음 인덱스
    let newIndex = currentIndex + direction;

    // 인덱스가 배열 범위를 벗어나지 않도록 조정
    if (newIndex >= this.images.length) {
      newIndex = 0; // 마지막 이미지에서 다음을 누르면 첫 이미지로
    } else if (newIndex < 0) {
      newIndex = this.images.length - 1; // 첫 이미지에서 이전을 누르면 마지막 이미지로
    }
    this.previousView = {
      controls: this.viewer.controls,
      position: this.viewer.scene.view.position.clone(),
      target: this.viewer.scene.view.getPivot(),
    };
    // 새 인덱스의 이미지로 포커스를 이동

    this.focus(this.images[newIndex]);
  }

  focus(image360) {
    console.log("focused");
    if (this.focusedImage !== null) {
      this.unfocus();
    }
    this.previousView = {
      controls: this.viewer.controls,
      position: this.viewer.scene.view.position.clone(),
      target: this.viewer.scene.view.getPivot(),
    };
    this.viewer.setControls(this.viewer.orbitControls);
    this.viewer.orbitControls.doubleClockZoomEnabled = false;

    this.elUnfocus.style.display = "block";
    this.prevButton.style.display = "block";
    this.nextButton.style.display = "block";

    for (let image of this.images) {
      image.mesh.visible = false;
    }

    this.selectingEnabled = false;

    this.sphere.visible = false;

    this.load(image360).then(() => {
      this.sphere.visible = true;
      this.sphere.material.map = image360.texture;
      this.sphere.material.needsUpdate = true;
    });

    {
      // orientation
      let { course, pitch, roll } = image360;

      this.sphere.rotation.set(
        THREE.Math.degToRad(+roll + 90),
        THREE.Math.degToRad(-pitch),
        THREE.Math.degToRad(-course + 42),
        "ZYX"
      );
    }

    this.sphere.position.set(...image360.position);

    let target = new THREE.Vector3(...image360.position);
    let dir = target.clone().sub(this.viewer.scene.view.position).normalize();
    let move = dir.multiplyScalar(0.000001);
    let newCamPos = target.clone().sub(move);

    this.viewer.scene.view.setView(newCamPos, target, 500);

    this.focusedImage = image360;

    this.elUnfocus.style.display = "";

    let tree = $("#jstree_scene");
    let measurementsRoot = $("#jstree_scene").jstree().get_json("pointclouds");

    tree.jstree("uncheck_node", measurementsRoot);
    document.querySelector(".serchTextField").classList.add("active");
    document.querySelector(".serchTextField input").disabled = true;
    document.querySelector(".serchTextField input").placeholder =
      "파노라마에서는 검색이 제한됩니다.";
  }

  unfocus() {
    let viewer = this.viewer;

    this.selectingEnabled = true;
    this.elUnfocus.style.display = "none";
    this.prevButton.style.display = "none";
    this.nextButton.style.display = "none";

    for (let image of this.images) {
      image.mesh.visible = true;
    }

    let image = this.focusedImage;

    if (image === null) {
      return;
    }

    this.sphere.material.map = null;
    this.sphere.material.needsUpdate = true;
    this.sphere.visible = false;

    let pos = viewer.scene.view.position;
    let target = viewer.scene.view.getPivot();
    let dir = target.clone().sub(pos).normalize();
    let move = dir.multiplyScalar(10);
    let newCamPos = target.clone().sub(move);

    viewer.orbitControls.doubleClockZoomEnabled = true;
    viewer.scene.view.setView(
      this.previousView.position,
      this.previousView.target,
      500
    );

    this.viewer.setControls(this.viewer.orbitControls);
    this.focusedImage = null;

    this.elUnfocus.style.display = "none";

    let tree = $("#jstree_scene");
    let measurementsRoot = $("#jstree_scene").jstree().get_json("pointclouds");

    tree.jstree("check_node", measurementsRoot);
    document.querySelector(".serchTextField").classList.remove("active");
    document.querySelector(".serchTextField input").disabled = false;
    document.querySelector(".serchTextField input").placeholder =
      "주소를 입력해주세요";
  }
  exits() {
    let viewer = this.viewer;

    this.selectingEnabled = true;
    this.elUnfocus.style.display = "none";
    this.prevButton.style.display = "none";
    this.nextButton.style.display = "none";

    for (let image of this.images) {
      image.mesh.visible = true;
    }

    let image = this.focusedImage;

    if (image === null) {
      return;
    }

    this.sphere.material.map = null;
    this.sphere.material.needsUpdate = true;
    this.sphere.visible = false;

    let newPosition = this.previousView.position.clone();
    newPosition.z = 100;
    // 이전 뷰의 포지션으로부터 z값을 100으로 설정

    let target = viewer.scene.view.getPivot();
    viewer.orbitControls.doubleClockZoomEnabled = true;
    viewer.scene.view.setView(newPosition, target, 500);
    // Yaw와 Pitch 설정
    viewer.scene.view.yaw = 0;
    viewer.scene.view.pitch = -Math.PI / 2;

    this.focusedImage = null;

    this.elUnfocus.style.display = "none";

    let tree = $("#jstree_scene");
    let measurementsRoot = $("#jstree_scene").jstree().get_json("pointclouds");

    tree.jstree("check_node", measurementsRoot);
    document.querySelector(".serchTextField").classList.remove("active");
    document.querySelector(".serchTextField input").disabled = false;
    document.querySelector(".serchTextField input").placeholder =
      "주소를 입력해주세요";
  }
  load(image360) {
    return new Promise((resolve) => {
      let texture = new THREE.TextureLoader().load(image360.file, resolve);
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.x = -1;

      image360.texture = texture;
    });
  }

  handleHovering() {
    let mouse = this.viewer.inputHandler.mouse;
    let camera = this.viewer.scene.getActiveCamera();
    let domElement = this.viewer.renderer.domElement;

    let ray = Potree.Utils.mouseToRay(
      mouse,
      camera,
      domElement.clientWidth,
      domElement.clientHeight
    );

    // let tStart = performance.now();
    raycaster.ray.copy(ray);
    let intersections = raycaster.intersectObjects(this.node.children);

    if (intersections.length === 0) {
      // label.visible = false;

      return;
    }

    let intersection = intersections[0];
    currentlyHovered = intersection.object;
    currentlyHovered.material = smHovered;

    //label.visible = true;
    //label.setText(currentlyHovered.image360.file);
    //currentlyHovered.getWorldPosition(label.position);
  }

  update() {
    let { viewer } = this;

    if (currentlyHovered) {
      currentlyHovered.material = sm;
      currentlyHovered = null;
    }

    if (this.selectingEnabled) {
      this.handleHovering();
    }
  }
}

export class Images360Loader {
  static async load(url, viewer, params = {}) {
    if (!params.transform) {
      params.transform = {
        forward: (a) => a,
      };
    }

    let response = await fetch(`${url}/coordinates.txt`);
    let text = await response.text();

    let lines = text.split(/\r?\n/);
    let coordinateLines = lines.slice(1);

    let images360 = new Images360(viewer);

    for (let line of coordinateLines) {
      if (line.trim().length === 0) {
        continue;
      }

      let tokens = line.split(/\t/);

      let [filename, time, long, lat, alt, course, pitch, roll] = tokens;
      time = parseFloat(time);
      long = parseFloat(long);
      lat = parseFloat(lat);
      alt = parseFloat(alt);
      course = parseFloat(course);
      pitch = parseFloat(pitch);
      roll = parseFloat(roll);

      filename = filename.replace(/"/g, "");
      let file = `${url}/${filename}`;

      let image360 = new Image360(
        file,
        time,
        long,
        lat,
        alt,
        course,
        pitch,
        roll
      );

      let xy = params.transform.forward([long, lat]);
      let position = [...xy, alt];
      image360.position = position;

      images360.images.push(image360);
    }

    Images360Loader.createSceneNodes(images360, params.transform);

    return images360;
  }

  static createSceneNodes(images360, transform) {
    for (let image360 of images360.images) {
      let { longitude, latitude, altitude } = image360;
      let xy = transform.forward([longitude, latitude]);

      let mesh = new THREE.Mesh(sg, sm);
      mesh.position.set(...xy, altitude);
      mesh.scale.set(1, 1, 1);
      mesh.material.transparent = true;
      mesh.material.opacity = 1;
      mesh.image360 = image360;
      mesh.userData = "panorama";
      {
        // orientation
        var { course, pitch, roll } = image360;
        mesh.rotation.set(
          THREE.Math.degToRad(+roll + 90),
          THREE.Math.degToRad(-pitch),
          THREE.Math.degToRad(-course + 90),
          "ZYX"
        );
      }

      images360.node.add(mesh);

      image360.mesh = mesh;
    }
  }
}
