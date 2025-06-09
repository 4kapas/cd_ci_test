// import { TextSprite } from "../../build/potree/potree.js";
import * as THREE from "/public/Potree/libs/three.js/build/three.module.js";
import { TGALoader } from "/public/Potree/libs/three.js/loaders/TGALoader.js";
import { FBXLoader } from "/public/Potree/libs/three.js/loaders/FBXLoader.js";
import { OBJLoader } from "/public/Potree/libs/three.js/loaders/OBJLoader.js";
import { OBJLoader2 } from "/public/Potree/libs/three.js/loaders/OBJLoader2.js";
import { MTLLoader } from "/public/Potree/libs/three.js/loaders/MTLLoader.js";
import { moveTo } from "./Util.js";

let boxArray = [];
let listArray = [];
class testBox {
  constructor(result) {
    this.center = new THREE.Vector3(
      result["center"]["x"],
      result["center"]["y"],
      result["center"]["z"]
    );
    this.address = result["address"];
    this.object_code = result["object_code"];
    this.class = result["class"];
    this.imgPath = result["imgPath"];

    // switch(this.object_code) {
    // 	case "CH3-4":
    // 		this.class = "표지판"
    // 	break;

    // 	case "002":
    // 		this.class = "가로등"
    // 	break;

    // 	case "003":
    // 		this.class = "신호등"
    // 	break;

    // 	case "004":
    // 		this.class = "기타"
    // 	break;
    // }

    this.status = result["status"];
    this.statusColor = "";
    this.width = result["dimension"]["width"];
    this.length = result["dimension"]["length"];
    this.height = result["dimension"]["height"];
    let geometry = new THREE.BoxGeometry(this.width, this.length, this.height);
    let wireframe = new THREE.EdgesGeometry(geometry);
    let mat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });

    {
      this.line = new THREE.LineSegments(wireframe, mat);
      this.line.material.depthTest = false;
      // line.material.opacity = 0.25;
      this.line.material.transparent = true;
      this.line.name = `${boxArray.length + 1}`;
      this.line.position.set(this.center.x, this.center.y, this.center.z);
    }

    {
      this.Text = new Potree.TextSprite(
        `${this.address} / ${this.class} / ${this.status}`
      );
      this.Text.position.set(this.center.x, this.center.y, this.center.z + 10);
      this.Text.scale.set(4, 4, 4);
    }
    switch (this.status) {
      case "정상": // 초록
        this.statusColor = "rgba(0, 245, 29, 1)";
        this.Text.setBackgroundColor({ r: 0, g: 245, b: 29, a: 1.0 });
        break;

      case "주의": // 노랑
        this.statusColor = "rgba(245, 245, 0, 1)";
        this.Text.setBackgroundColor({ r: 245, g: 245, b: 0, a: 1.0 });
        break;

      case "경계": // 주황
        this.statusColor = "rgba(245, 131, 0, 1)";
        this.Text.setBackgroundColor({ r: 245, g: 131, b: 0, a: 1.0 });
        break;

      case "심각": // 빨강
        this.statusColor = "rgba(245, 0, 0, 1)";
        this.Text.setBackgroundColor({ r: 245, g: 0, b: 1, a: 1.0 });
        break;
    }

    {
      var map = new THREE.TextureLoader().load(this.imgPath);
      var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });
      this.sprite = new THREE.Sprite(material);
      this.sprite.position.set(
        this.center.x,
        this.center.y,
        this.center.z + 17
      );
      this.sprite.scale.set(10, 10, 1);
    }
    // this.line.rotateZ(result["rotation"]);

    this.line.visible = false;
    this.Text.visible = false;
    this.sprite.visible = false;
    potreeViewer.volumeTool.scene.add(this.sprite);
    potreeViewer.volumeTool.scene.add(this.line);
    potreeViewer.volumeTool.scene.add(this.Text);

    // potreeViewer.scene.scene.add(this.sprite);
    // potreeViewer.scene.scene.add(this.line);
    // potreeViewer.scene.scene.add(this.Text);

    this.clicked = false;
    this.addList(this);
    boxArray.push(this);
  }

  addList(testBox) {
    console.log("this.line", this.line);
    this.boxlist = document.createElement("div");

    this.boxlist.innerHTML = `
		<div class="flex-mid" style="width:40%;">
			${this.address}
		</div>
		<div class="flex-mid" style="width:30%;">
			${this.object_code}
		</div>
		<div class="flex-mid" style="width:20%;">
			${this.class}
		</div>
		<div class="flex-mid" style="width:10%; color: ${this.statusColor}">
			${this.status}
		</div>
		`;
    this.boxlist.setAttribute("class", "Box");
    this.boxlist.onclick = function () {
      testBox.select();
    };

    listArray.push(this.boxlist);

    //document.getElementById("testList").appendChild(this.boxlist);
  }

  async select() {
    try {
      console.log("박스 클릭", this);

      for (let i = 0; i < boxArray.length; i++) {
        let box = boxArray[i];
        console.log("box", box.line, boxArray, i);
        box.boxlist.style.background = "none";
        box.boxlist.style.color = "white";
        // if(!box.clicked){
        box.line.material.color.setHex(0xff0000);
        box.line.material.colorsNeedUpdate = true;
        // }
      }

      // potreeViewer.scene.view.setView(
      // 	[this.line.position.x + 40, this.line.position.y + 40,this.line.position.z + 40],
      // 	[this.line.position.x,this.line.position.y,this.line.position.z],
      // );

      this.boxlist.style.background = "#333";
      this.boxlist.style.color = "#fff";
      this.clicked = true;
      this.line.material.color.setHex(0x00ff00);
      this.line.material.colorsNeedUpdate = true;
      let endposition = new THREE.Vector3(
        this.line.position.x + 40,
        this.line.position.y + 40,
        this.line.position.z + 40
      );
      moveTo(potreeViewer.scene, endposition, this.line.position);
      return;
    } catch (e) {
      console.error(e);
    }
  }
}

function showList() {
  $("#testList .Box").remove();
  var ac_list = document.querySelectorAll("input[name=address_check]:checked");
  let ac_list_array = [];
  var oc_list = document.querySelectorAll("input[name=object_check]:checked");
  let oc_list_array = [];
  var sc_list = document.querySelectorAll("input[name=status_check]:checked");
  let sc_list_array = [];
  //var checkboxes = document.querySelectorAll("input[name=address_check]");
  //console.log("execute showList",checkboxes,chkList);
  //var enabledSettings = [];

  // checkboxes.forEach(function(checkbox){
  // 	checkbox.addEventListener('change', function() {
  // 		enabledSettings =
  // 		Array.from(checkboxes)
  // 		.filter(i => i.checked)
  // 		.map(i => i.value)

  // 		console.log(enabledSettings);

  // 	})
  // })

  for (let i = 0; i < ac_list.length; i++) {
    ac_list_array.push(ac_list[i].defaultValue);
  }

  for (let i = 0; i < oc_list.length; i++) {
    oc_list_array.push(oc_list[i].defaultValue);
  }

  for (let i = 0; i < sc_list.length; i++) {
    sc_list_array.push(sc_list[i].defaultValue);
  }

  for (let i = 0; i < boxArray.length; i++) {
    let box = boxArray[i];
    box.line.visible = false;
    box.Text.visible = false;
    box.sprite.visible = false;
    for (let j = 0; j < ac_list_array.length; j++) {
      if (box.address === ac_list_array[j]) {
        for (let k = 0; k < oc_list_array.length; k++) {
          if (box.class === oc_list_array[k]) {
            for (let l = 0; l < sc_list_array.length; l++) {
              if (box.status === sc_list_array[l]) {
                document.getElementById("testList").appendChild(box.boxlist);
                box.line.visible = true;
                box.Text.visible = true;
                box.sprite.visible = true;
              }
            }
          }
        }
      }
    }
    // filter_Array = boxArray.filter((number,index) => function() {
    // 	for(let j=0; j<ac_list_array.length; i++){
    // 		if(number.address === ac_list_array[j]){
    // 			return number;
    // 		}
    // 	}

    // });
  }
  // console.log("filter_Array",filter_Array);
}

let FBXModelArray = [];
class FBXModel {
  constructor(path, size, isdance) {
    this.manager = new THREE.LoadingManager();
    // add handler for TGA textures
    manager.addHandler(/\.tga$/i, new TGALoader());
    this.path = path;
    this.object = null;
    this.size = 0.05;
    if (size) {
      this.size = size;
    }
    this.addText();
    if (!isdance) {
      this.addFbxModel(this.path, this);
    } else {
      this.addFbxModel_dance(this.path, this);
    }
  }

  setPath(path) {
    this.path = path;
  }

  setObject(object) {
    this.object = object;
  }

  setPosition(x, y, z) {
    this.object.position.set(x, y, z);
  }

  addFbxModel(objPath, FBXModel) {
    try {
      const loader = new FBXLoader(this.manager);
      this.setPath(objPath);
      loader.load(
        objPath,
        function (object) {
          // object.traverse( function ( child ) {
          // 	if ( child.isMesh ) {
          // 		console.log( child.geometry.attributes.uv );
          // 		child.material.map = texture; // assign your diffuse texture here
          // 	}
          // } );

          // object.position.set(296507.02399999998, 3888075.1017, 0.833800000000011)
          object.position.set(
            296507 + Math.random() * 500,
            3888075 + Math.random() * 500,
            0.833
          );

          console.log("성공", object);

          object.scale.set(FBXModel.size, FBXModel.size, FBXModel.size);
          // object.scale.set(0.05,0.05,0.05);
          object.rotation.x = Math.PI / 2;
          object.rotation.y = Math.PI / 2;

          potreeViewer.volumeTool.scene.add(object);
          FBXModelArray.push(FBXModel);
          FBXModel.object = object;
          FBXModel.Text.position.set(
            object.position.x,
            object.position.y,
            object.position.z + 100
          );
          console.log("FBXModel", FBXModel);
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );
    } catch (e) {
      console.error(e);
    }
  }

  addFbxModel_dance(objPath, FBXModel) {
    try {
      const loader = new FBXLoader(this.manager);
      this.setPath(objPath);
      loader.load(
        objPath,
        function (object) {
          object.position.set(
            296507.02399999998,
            3888275.1017,
            0.833800000000011
          );

          mixer = new THREE.AnimationMixer(object);
          const action = mixer.clipAction(object.animations[0]);
          action.play();

          object.traverse(function (child) {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          console.log("성공", object);
          object.scale.set(0.1, 0.1, 0.1);
          object.rotation.x = Math.PI / 2;
          object.rotation.y = Math.PI / 2;

          potreeViewer.volumeTool.scene.add(object);
          FBXModelArray.push(FBXModel);
          FBXModel.object = object;
          console.log("FBXModel", FBXModel);
          // testObjectArray.push(object);
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );
    } catch (e) {
      console.error(e);
    }
  }

  addText() {
    let text = this.path
      .split("/")
      [this.path.split("/").length - 1].split(".")[0];
    this.Text = new Potree.TextSprite(`FBX / ${text}`);
    this.Text.position.set(0, 0, 0);
    this.Text.scale.set(80, 80, 80);
    potreeViewer.volumeTool.scene.add(this.Text);
  }
}

let mixer;

class OBJMTLModel {
  constructor({ viewer, MTLPath, OBJPath, size, onlyOBJ, center }) {
    this.potreeViewer = viewer;
    this.MTLPath = MTLPath;
    this.OBJPath = OBJPath;
    this.object = null;
    this.size = size;
    this.center = center;
    // this.addText();
    if (!size) this.size = 1;
  }
  init = async (isOnlyOBJ) => {
    try {
      if (isOnlyOBJ) {
        return await this.addOBJTest(this.OBJPath, this);
      } else {
        return await this.addOBJMTL(this.MTLPath, this.OBJPath);
      }
    } catch (e) {
      throw e;
    }
  };

  addOBJTest = async (objpath, OBJMTLModel) => {
    let potreeViewer = this.potreeViewer;

    const material = new THREE.MeshBasicMaterial({
      color: 0xffb6c1,
      wireframe: false,
      transparent: true,
      opacity: 0.9,
      // depthTest: false,
      // vertextColors: true,
    });
    let loader = new OBJLoader();

    loader.load(objpath, function (object) {
      object.traverse(function (child) {
        if (child.isMesh) {
          // child.material.color.set(0xffb6c1);
          // child.forEach((material) => {
          //   material.color.set(0x00ff00);
          // });
          child.material = material;
          // child.geometry.computeVertexNormals();
        }

        // object.position.y = 0;
      });

      // let { x, y, z } = this.center;

      object.position.z = 16;
      potreeViewer.scene.scene.add(object);

      // object.position.set(
      //   296507 + Math.random() * 500,
      //   3888455 + Math.random() * 500,
      //   0.833800000000011
      // );

      // object.scale.set(OBJMTLModel.size, OBJMTLModel.size, OBJMTLModel.size);

      // object.rotation.x = Math.PI / 2;
      // // object.rotation.y = -Math.PI;
      // object.rotation.z = Math.PI / 2;
      // object.receiveShadow = false;
      // object.name = "OBJGroup";
      // // potreeViewer.volumeTool.scene.add(object);
      // console.log(
      //   "성공 OBJMTL",
      //   object,
      //   potreeViewer.scene.scene,
      //   potreeViewer.volumeTool.scene
      // );

      // potreeViewer.scene.view.setView(
      //   [x, y, z + 200],
      //   [object.position.x, object.position.y, object.position.z]
      // );

      // OBJMTLModel.setObject(object);
      // const directional = new THREE.DirectionalLight(0xffffff, 1.0);
      // directional.position.set(x, y, z);
      // directional.lookAt(x, y, z);

      // const ambient = new THREE.AmbientLight(0x555555);

      // potreeViewer.scene.scene.add(directional);
      // potreeViewer.scene.scene.add(ambient);
      // OBJMTLModel.Text.position.set(
      //   object.position.x,
      //   object.position.y,
      //   object.position.z + 100
      // );
      // this.setSize(100,100,100);

      // console.log("OBJMTLModel", OBJMTLModel);
      // this.object = object;

      // resolve(object);
    });
    // const potreeQuickButtons = document.querySelector(
    //   "#potree_quick_buttons"
    // );

    // potreeQuickButtons.style.display = "none";

    // { // LIGHTS
    //   const directional = new THREE.DirectionalLight( 0xffffff, 1.0);
    //   directional.position.set( 10, 10, 10 );
    //   directional.lookAt(0, 0, 0);

    //   const ambient = new THREE.AmbientLight(0x555555);

    //   viewer.scene.scene.add(directional);
    //   viewer.scene.scene.add(ambient);
    // }

    // const test = [
    //   "??_2__74710_",
    //   "??_1__74711_",
    //   "??_3__74712_",
    //   "??_4__74713_",
    //   "??_5__74714_",
    //   "??_6__74715_",
    //   "??_7__74716_",
    //   "??_8__74717_",
    //   "??_9__74718_",
    //   "Group1",
    //   "Group2",
    //   "Group3",
    //   "Group4",
    // ];
    // const objLoader = new OBJLoader();
    // const textureLoader = new THREE.TextureLoader();
    // // objLoader.setMaterials(mtl);
    // // objLoader.setPath('dorosee/mtlobj/393203/');
    // let texture1 = await new Promise((resolve) => {
    //   textureLoader.load(
    //     "/models/test/GJ_Final/전남MAPPING/전남도청 MAPPING_1.jpg",
    //     (texture) => {
    //       resolve(texture);
    //     }
    //   );
    // });
    // let texture2 = await new Promise((resolve) => {
    //   textureLoader.load(
    //     "/models/test/GJ_Final/전남MAPPING/전남도청 MAPPING_2.jpg",
    //     (texture) => {
    //       resolve(texture);
    //     }
    //   );
    // });
    // let texture3 = await new Promise((resolve) => {
    //   textureLoader.load(
    //     "/models/test/GJ_Final/전남MAPPING/전남도청 MAPPING_3.jpg",
    //     (texture) => {
    //       resolve(texture);
    //     }
    //   );
    // });
    // let texture = texture3;
    // console.log(texture);
    // return new Promise((resolve, reject) => {
    //   objLoader.load(objpath, (object) => {
    //     const material1 = new THREE.MeshBasicMaterial({ map: texture1 });
    //     const material2 = new THREE.MeshBasicMaterial({ map: texture2 });
    //     const material3 = new THREE.MeshBasicMaterial({ map: texture3 });
    //     // compute the box that contains all the stuff
    //     object.traverse(function (child) {
    //       // console.log({ child });
    //       if (child.isMesh) {
    //         // console.log("child mesh!", child);
    //         // child.geometry.computeVertexNormals();
    //         let count = 1;
    //         // child.material = material1
    //         if (child.name === test[count]) {
    //           child.material = material1;
    //         } else if (child.name === test[7]) {
    //           child.material = material2;
    //         } else if (child.name === test[count + 2]) {
    //           child.material = material3;
    //         } else {
    //           // child.material.color.set(0x00ff00); // change color without dat.GUI
    //           child.material = material1;
    //         }
    //       }
    //     });

    //     // object.position.set(296507.02399999998, 3888455.1017, 0.833800000000011)
    //     let { x, y, z } = this.center;
    //     object.position.set(x, y, z);
    //     // object.position.set(
    //     //   296507 + Math.random() * 500,
    //     //   3888455 + Math.random() * 500,
    //     //   0.833800000000011
    //     // );

    //     object.scale.set(OBJMTLModel.size, OBJMTLModel.size, OBJMTLModel.size);

    //     object.rotation.x = Math.PI / 2;
    //     object.rotation.y = -Math.PI;
    //     // object.rotation.z = Math.PI / 2;
    //     // object.receiveShadow = false;
    //     object.name = "OBJGroup";
    //     // potreeViewer.volumeTool.scene.add(object);
    //     potreeViewer.scene.scene.add(object);
    //     // console.log(
    //     //   "성공 OBJMTL",
    //     //   object,
    //     //   potreeViewer.scene.scene,
    //     //   potreeViewer.volumeTool.scene
    //     // );

    //     potreeViewer.scene.view.setView(
    //       [x, y, z + 200],
    //       [object.position.x, object.position.y, object.position.z]
    //     );

    //     OBJMTLModel.setObject(object);

    //     // OBJMTLModel.Text.position.set(
    //     //   object.position.x,
    //     //   object.position.y,
    //     //   object.position.z + 100
    //     // );
    //     // this.setSize(100,100,100);

    //     // console.log("OBJMTLModel", OBJMTLModel);
    //     this.object = object;
    //     resolve(object);
    //   });
    // });
  };

  addOBJ = async (objpath, OBJMTLModel) => {
    const test = [
      "??_2__74710_",
      "??_1__74711_",
      "??_3__74712_",
      "??_4__74713_",
      "??_5__74714_",
      "??_6__74715_",
      "??_7__74716_",
      "??_8__74717_",
      "??_9__74718_",
      "Group1",
      "Group2",
      "Group3",
      "Group4",
    ];
    const objLoader = new OBJLoader();
    const textureLoader = new THREE.TextureLoader();
    // objLoader.setMaterials(mtl);
    // objLoader.setPath('dorosee/mtlobj/393203/');
    let texture1 = await new Promise((resolve) => {
      textureLoader.load(
        "/models/test/GJ_Final/전남MAPPING/전남도청 MAPPING_1.jpg",
        (texture) => {
          resolve(texture);
        }
      );
    });
    let texture2 = await new Promise((resolve) => {
      textureLoader.load(
        "/models/test/GJ_Final/전남MAPPING/전남도청 MAPPING_2.jpg",
        (texture) => {
          resolve(texture);
        }
      );
    });
    let texture3 = await new Promise((resolve) => {
      textureLoader.load(
        "/models/test/GJ_Final/전남MAPPING/전남도청 MAPPING_3.jpg",
        (texture) => {
          resolve(texture);
        }
      );
    });
    let texture = texture3;
    console.log(texture);
    objLoader.load(objpath, (object) => {
      const material1 = new THREE.MeshBasicMaterial({ map: texture1 });
      const material2 = new THREE.MeshBasicMaterial({ map: texture2 });
      const material3 = new THREE.MeshBasicMaterial({ map: texture3 });
      // compute the box that contains all the stuff
      object.traverse(function (child) {
        console.log({ child });
        if (child.isMesh) {
          console.log("child mesh!", child);
          // child.geometry.computeVertexNormals();
          let count = 1;
          // child.material = material1
          if (child.name === test[count]) {
            child.material = material1;
          } else if (child.name === test[7]) {
            child.material = material2;
          } else if (child.name === test[count + 2]) {
            child.material = material3;
          } else {
            // child.material.color.set(0x00ff00); // change color without dat.GUI
            child.material = material1;
          }
        }
      });

      // object.position.set(296507.02399999998, 3888455.1017, 0.833800000000011)
      let { x, y, z } = this.center;
      object.position.set(x, y, z);
      // object.position.set(
      //   296507 + Math.random() * 500,
      //   3888455 + Math.random() * 500,
      //   0.833800000000011
      // );

      // object.scale.set(OBJMTLModel.size, OBJMTLModel.size, OBJMTLModel.size);

      object.rotation.x = Math.PI / 2;
      object.rotation.y = -Math.PI;
      // object.rotation.z = Math.PI / 2;
      // object.receiveShadow = false;
      object.name = "OBJGroup";
      // potreeViewer.volumeTool.scene.add(object);
      potreeViewer.scene.scene.add(object);
      console.log(
        "성공 OBJMTL",
        object,
        potreeViewer.scene.scene,
        potreeViewer.volumeTool.scene
      );

      potreeViewer.scene.view.setView(
        [x + 75, y - 150, z + 200],
        [object.position.x, object.position.y, object.position.z]
      );

      OBJMTLModel.setObject(object);
      // OBJMTLModel.Text.position.set(
      //   object.position.x,
      //   object.position.y,
      //   object.position.z + 100
      // );
      // this.setSize(100,100,100);
      console.log("OBJMTLModel", OBJMTLModel);
      this.object = object;
    });
  };

  addOBJMTL = async (mtlpath, objpath) => {
    console.log(mtlpath, objpath, "mtlpath, objpath");
    try {
      let potreeViewer = this.potreeViewer;
      let manager = new THREE.LoadingManager();
      manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
      };
      const mtlLoader = new MTLLoader();
      mtlLoader.setPath(mtlpath);
      let object = await new Promise((resolve, reject) => {
        mtlLoader.load(
          "",
          (mtl) => {
            console.log({ mtl });
            mtl.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            // objLoader.setPath('dorosee/mtlobj/393203/');
            objLoader.load(objpath, (object) => {
              // compute the box that contains all the stuff
              object.traverse(function (child) {
                if (child.isMesh) {
                  console.log(child);
                  child.geometry.computeVertexNormals();
                  // child?.material?.color?.set("0x00ff0");
                }
              });

              // object.position.set(296507.02399999998, 3888455.1017, 0.833800000000011)
              let { x, y, z } = this.center;
              object.position.set(x, y, z);
              // object.position.set(
              //   296507 + Math.random() * 500,
              //   3888455 + Math.random() * 500,
              //   0.833800000000011
              // );

              object.scale.set(this.size, this.size, this.size);

              object.rotation.x = Math.PI / 2;
              object.rotation.y = -Math.PI;

              object.receiveShadow = false;
              object.name = "mtlOBJGroup";
              potreeViewer.scene.scene.add(object);

              console.log(
                "성공 OBJMTL",
                object,
                potreeViewer.volumeTool.scene,
                potreeViewer.scene.scene
              );

              potreeViewer.scene.view.setView(
                [x, y, z + 200],
                [object.position.x, object.position.y, object.position.z]
              );
              this.setObject(object);
              resolve(object);
              // this.Text.position.set(
              //   object.position.x,
              //   object.position.y,
              //   object.position.z + 100
              // );
              // this.setSize(100,100,100);
              // console.log("OBJMTLModel", OBJMTLModel);
            });
          },
          function (xhr) {
            console.log(
              "MTLLoader: ",
              (xhr.loaded / xhr.total) * 100,
              "% loaded"
            );
          },
          function (error) {
            // 로드가 실패했을때 호출하는 함수
            console.error("MTLLoader 로드 중 오류가 발생하였습니다.", error);
            // alert('MTLLoader 로드 중 오류가 발생하였습니다.');
          }
        );
      });
      return object;
    } catch (e) {
      throw e;
    }
  };

  setPath(path) {
    this.path = path;
  }

  setObject = async (object) => {
    this.object = object;
  };

  async setPosition(x, y, z) {
    this.object.position.set(x, y, z);
  }

  setSize(x, y, z) {
    this.object.scale.set(x, y, z);
  }

  addText() {
    let text =
      this.MTLPath.split("/")[this.MTLPath.split("/").length - 1].split(".")[0];
    this.Text = new Potree.TextSprite(`MTLOBJ / ${text}`);
    this.Text.position.set(0, 0, 0);
    this.Text.scale.set(80, 80, 80);
    potreeViewer.volumeTool.scene.add(this.Text);
  }
}

class TextObjectManager {
  constructor(name, position) {
    this.Text = null;
    this.name = name;
    this.position = position;
    // this.init();
  }

  init() {
    let Text = new Potree.TextSprite(this.name);
    Text.position.set(this.position.x, this.position.y, this.position.z + 10);
    // Text.position.set(0, 0, 10);
    Text.scale.set(50, 50, 50);
    Text.name = `${this.name}_Text`;
    // pointcloud.add(Text);
    potreeViewer.volumeTool.scene.add(Text);
    Text.visible = false;
    // this.TextS.push(Text);

    // console.log("tTS",this.TextS);
    return Text;
  }
}

class TerrainManager {
  constructor() {}

  static createGround(pointCenter) {
    console.log("createGround");
    const groundGeo = new THREE.PlaneGeometry(1000, 1000, 100, 100);

    let disMap = new THREE.TextureLoader().load(
      `../resources/dorosee/goheung2.png`
    );

    disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
    // disMap.repeat.set(100, 100);

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      wireframe: true,
      displacementMap: disMap,
      displacementScale: 100,
    });
    let groundMesh = new THREE.Mesh(groundGeo, groundMat);
    potreeViewer.volumeTool.scene.add(groundMesh);
    groundMesh.position.set(pointCenter.x, pointCenter.y, pointCenter.z);
    console.log("createGround after", groundMesh, disMap);
  }
}

export {
  testBox,
  boxArray,
  listArray,
  showList,
  FBXModel,
  mixer,
  OBJMTLModel,
  TextObjectManager,
  TerrainManager,
};
